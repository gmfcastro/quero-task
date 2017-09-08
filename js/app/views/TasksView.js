class TasksView extends View{

    constructor(elem){
        super(elem);
    }

    template(model){
        return `
        
            ${model.tasks.map(n => `
            
            <ul>
                <li class="task-item-list" onclick="vm.selectTask(event,${n.id})">
                    <span>${n.title}</span>
                    <input name="task.name" class="task1" type="text" placeholder="Add task" hidden />
                </li>
            </ul>

            `).join('')}
        
        `;
    }

}