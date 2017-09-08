class TasksList{

    constructor(){
        this._tasks = [];
    }

    push(task){
        this._tasks.push(task);
    }

    drop(){
        this._tasks = [];
    }

    get tasks(){
        return this._tasks;
    }

}