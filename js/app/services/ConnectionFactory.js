var ConnectionFactory = (function(){

    const objectStores = ['tasks']
    const idbVersion = 6;
    const idbName = 'queroasanadb';
    var connection = null;
    var closeConnection = null;

    return class ConnectionFactory {

        constructor(){
            throw new Error("This is a abstrect class and can't be instantiated");
        }

        static getConnection(){

            return new Promise((resolve, reject) => {

                let openRequest = window.indexedDB.open(idbName, idbVersion);

                openRequest.onupgradeneeded = (e) => {

                    console.log("creating stores");

                    ConnectionFactory._createObjectStores(e.target.result);
                }

                openRequest.onsuccess = (e) => {
                    
                    if(!connection){
                        connection = e.target.result;
                        closeConnection = connection.close.bind(connection);
                        connection.close = function(){
                            throw new Error("Can't close the connection by external call");
                        }
                    }

                    resolve(connection);

                }

                openRequest.onerror = (e) => {

                    console.log(e.target.error);

                    reject(e.target.error);

                } 

            });

        }

        static _createObjectStores(connection){

            

            objectStores.forEach(store => {

                if(connection.objectStoreNames.contains(store)){
                    connection.deleteObjectStore(store)
                }

                connection.createObjectStore(store, {autoIncrement: true});

            });

        }

        static _closeConnection(){
            closeConnection();
            connection = null;
        }

    }

})();