class TaskDAO {

    constructor(connection){
        this._connection = connection;
        this._store = 'tasks'; 
    }

    save(task){
        return new Promise((resolve, reject) => {

            let request = this._connection
                .transaction([this._store], 'readwrite')
                .objectStore(this._store)
                .add(task);

            request.onsuccess = e => {
                resolve(e.target.result);
            };

            request.onerror = e => {
                reject("Couldn't add new task to iDB object Store");
            }

        });
    }

    update(task){
        return new Promise((resolve, reject) => {

            let cursor = this._connection
                .transaction([this._store], 'readwrite')
                .objectStore(this._store)
                .openCursor();

            
            cursor.onsuccess = e => {
                let result = e.target.result;

                if(result){

                    let data    = result.value;
                    let key     = result.key;

                    if(key == task.id){
                        data = task;
                        
                        let request = result.update(data);

                        request.onsuccess = () =>{
                            resolve(data);
                        }

                        request.onerror = error => {
                            reject(error);
                        }

                    }
                
                    result.continue();
                }else{
                    reject("Couldn't find the task to update");
                }
            }

            cursor.onerror = e => {
                reject("Couldn't fecth data from iDB Object Store");
            }

        });
    }

    find(id){
        return new Promise((resolve, reject) => {

            let cursor = this._connection
                .transaction([this._store], 'readwrite')
                .objectStore(this._store)
                .openCursor();

            cursor.onsuccess = e => {
                let result = e.target.result;

                if(result){

                    let data = result.value;
                    let key = result.key;

                    if(key == id){
                        resolve(new Task(data._title, data._description, key));
                    }

                    result.continue();
                }else{
                    reject("Couldn't find the task");
                }
            }

            cursor.onerror = e => {
                reject("Couldn't fecth data from iDB Object Store");
            }
        })
    }

    list(){
       
        return new Promise((resolve, reject) => {
            
            let cursor = this._connection
                .transaction([this._store], 'readwrite')
                .objectStore(this._store)
                .openCursor();

            let tasks = [];

            cursor.onsuccess = e => {

                let result = e.target.result;

                if(result){

                    let data    = result.value;
                    let key     = result.key;

                    tasks.push(new Task(data._title, data._description, key));

                    result.continue();
                }else{
                    resolve(tasks);
                }
                
            };

            cursor.onerror = e => {
                reject("Couldn't fecth data from iDB Object Store");
            }

        });
        

    }

}