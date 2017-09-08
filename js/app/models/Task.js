class Task{

    constructor(title, description,id = 0){
        this._title = title;
        this._description = description;
        this._id = id;
    }

    get title(){
        return this._title;
    }

    get description(){
        return this._description;
    }

    get id(){
        return this._id;
    }

}