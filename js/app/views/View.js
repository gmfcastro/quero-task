class View{

    constructor(element){
        this._element = element;
    }

    template(){

        throw new Error("This method should be implemented");

    }

    update(model){
        this._element.innerHTML = this.template(model);
    }
}