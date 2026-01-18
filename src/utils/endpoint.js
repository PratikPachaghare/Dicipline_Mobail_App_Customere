

export default apiEndpoint = {
    auth :{
        login:"/auth/login",
        register:"/auth/register",
        updateKeys:"/auth/update-keys"
    },
    task :{
        createList:"/task/tasks/createList",
        addTaskInList: "/task/tasks/add",
        updateTaskInList: (taskId) => `task/tasks/${taskId}/update`,
        getList:"/task/tasks/getTaskList",
        getExistTask:"/task/tasks/getExistTask",
        completeTask: (taskId) => `/task/tasks/${taskId}/complete`,
        deleteTask: (taskId) => `/task/tasks/${taskId}/delete`,
        undoTask :"/task/tasks/undo",
    },
    weekly :{
        weekly_data:"/weekly/weekly-data"

    },
    sreack : {
        sreack_data:"/streak/streak-count"
    },
    heatmap : {
        activity_heatmap:"activityHeatmap/activity-heatmap",
        heatmap_userId: (userId)=> `/activityHeatmap/heatmap_userId/${userId}`
    },
    leaderboard : {
        weakly_my_rank: "/leaderboard/my-rank",
        weakly_Leaderboard : "/leaderboard/weeklyLeaderbord",
        leaderboard_profile:(userId) => `/leaderboard/leaderboard-profile/${userId}`
    },
    chat: {
        list: '/chat/list',              // GET
        pending: '/chat/pending',        // GET
        suggestions: '/chat/suggestions',// GET
        invite: '/chat/invite',          // POST
        accept: '/chat/accept',          // POST
        
        // We use functions here to handle the dynamic ID
        messages: (roomId) => `/chat/messages/${roomId}`,
        markRead: (roomId) => `/chat/message/read/${roomId}`,
        clear: (roomId) => `/chat/clear/${roomId}`,
    }
}