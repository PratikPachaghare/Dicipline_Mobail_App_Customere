import CryptoJS from "crypto-js";


export const decryptPrivateKeyWithPassword = (encryptedKey, password) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedKey, password);
    const originalKey = bytes.toString(CryptoJS.enc.Utf8);
    return originalKey; 
  } catch (error) {
    console.error("Wrong password or corrupted key");
    return null;
  }
};

const handleChangePassword = async (oldPassword, newPassword) => {
    try {
        // 1. Pehle current Private Key nikalo (AsyncStorage se)
        const myPrivateKey = await AsyncStorage.getItem(`PRIVATE_KEY_${user.id}`);
        
        if (!myPrivateKey) return alert("Error: Private key not found");

        // 2. Is Private Key ko 'NEW PASSWORD' se encrypt karo
        const newEncryptedPrivateKey = encryptPrivateKeyWithPassword(myPrivateKey, newPassword);

        // 3. Server par password aur key dono update karo
        const response = await apiCallAuth("PUT", "/auth/change-password", {
            currentPassword: oldPassword,
            newPassword: newPassword,
            encryptedPrivateKey: newEncryptedPrivateKey // 👈 Ye most important hai
        });

        if (response.success) {
            alert("Password changed & Encryption updated! ✅");
        }

    } catch (error) {
        console.log("Password change failed", error);
    }
};

