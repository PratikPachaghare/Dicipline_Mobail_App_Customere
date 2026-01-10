// src/logic/DashbordLogic.js

import { 
  setAllActions, 
  setWeeklyStreak, 
  setStreaks 
} from '../../../Store/steackSlice';
import apiCall from '../../../utils/apiCalls'; 
import apiEndpoint from '../../../utils/endpoint'; 

export const loadQuickActions = async (dispatch) => {
  try {
    const res = await apiCall('GET', apiEndpoint?.task?.getList);
    
    // ✅ FIX: Check if 'res' is the array, OR 'res.tasks'
    const data = Array.isArray(res) ? res : res?.tasks;

    console.log("Quick Actions Data to Save:", data); // Check this log

    if (data && data.length) {
      dispatch(setAllActions(data));
    }
  } catch (e) {
    console.log('Quick Actions load failed', e);
  }
};

export const loadWeeklyStreak = async (dispatch) => {
  try {
    const res = await apiCall('GET', apiEndpoint?.weekly?.weekly_data);

    // ✅ FIX: Check if 'res' is the array, OR 'res.week'
    const data = Array.isArray(res) ? res : res?.week;

    console.log("Weekly Data to Save:", data); // Check this log

    if (data && data.length) {
      dispatch(setWeeklyStreak(data));
    }
  } catch (e) {
    console.log('Weekly Streak load failed', e);
  }
};

export const loadStreaks = async (dispatch) => {
  try {
    const res = await apiCall('GET', apiEndpoint?.sreack?.sreack_data);
    console.log("Streak Data to Save:", res);
    
    if (res) {
      // Ensure specific keys exist or handle defaults in Slice (done above)
      dispatch(setStreaks(res));
    }
  } catch (e) {
    console.log('Streak load failed', e);
  }
};
