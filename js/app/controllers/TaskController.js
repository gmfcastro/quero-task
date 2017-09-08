class TaskController{

    constructor(){
        let $ = document.querySelector.bind(document);
        this._taskList = new TasksList();

        this._taskDetail = $(".task-detail");

        this._inputId = $("input[name='task.id']");
        this._inputTitle = $("input[name='task.title']");
        this._inputDescription = $("textarea[name='task.description']");

        this._tasksView = new TasksView($(".task-list-body"));

        this._inputId.value = 0;
        this._inputTitle.value = "";
        this._inputDescription.value = "";
        this._selectedItem = null;

        this.listTasks();
    }

    listTasks(){
        ConnectionFactory.getConnection()
            .then(connection => {

                new TaskDAO(connection).list()
                    .then(tasks => {

                        tasks.forEach(task => {
                            this._taskList.push(task);
                        });
        
                        this._tasksView.update(this._taskList);

                    })
                    .catch(error => {
                        console.log(error);
                    }) 
            })
            .catch(error =>{
                throw new Error(error);
            });
    }

    submitTask(event){

        event.preventDefault();

        ConnectionFactory.getConnection()
            .then(connection => {

                let task = this._createTask();

                if(task.id == 0){
                    new TaskDAO(connection).save(task)
                        .then(id => {
                            this._inputId.value = id;
                            this._taskList.push(this._createTask());
                            this._tasksView.update(this._taskList);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }else{
                    
                    new TaskDAO(connection).update(task)
                        .then(task => {
                            this._inputId.value = task.id;
                            this._inputTitle.value = task.title;
                            this._inputDescription.value = task.description;
                            this._taskList.drop();
                            this.listTasks();
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    selectTask(event,id){

        this._toogleSelectedItem(event.target);

        ConnectionFactory.getConnection()
            .then(connection => {
                new TaskDAO(connection).find(id)
                    .then(task => {
                        this._inputId.value = task.id;
                        this._inputTitle.value = task.title;
                        this._inputDescription.value = task.description;
                        this.openTaskDetail(task.id);
                    })
                    .catch( error => {
                        console.log(error);
                    });
            })
            .catch(error => {
                console.log(error);
            });
    }

    openTaskDetail(id = 0){
        if(id == 0) this._resetForm();
        this._taskDetail.style.display = 'block';
    }

    closeTaskDetail(){
        this._taskDetail.style.display = 'none';
        this._resetForm();
    }

    _createTask(){

        return new Task(
            this._inputTitle.value,
            this._inputDescription.value,
            this._inputId.value
        );
    }

    _resetForm(){

        if(this._selectedItem){
            this._selectedItem.style.backgroundColor = "#fff";
            this._selectedItem = null;
        }

        this._inputId.value = 0;
        this._inputTitle.value = "";
        this._inputDescription.value = "";
    }

    _toogleSelectedItem(element){
        if(this._selectedItem){
            this._selectedItem.style.backgroundColor = "#fff";
        }

        if(element.tagName != 'LI'){
            element = element.parentNode;
        }
        
        this._selectedItem = element;
        this._selectedItem.style.backgroundColor = "#edf8ff";
    }


}