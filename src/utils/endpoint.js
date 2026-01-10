

export default apiEndpoint = {
    auth :{
        login:"/auth/login",
        register:"/auth/register"
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
        activity_heatmap:"activityHeatmap/activity-heatmap"
    }
}