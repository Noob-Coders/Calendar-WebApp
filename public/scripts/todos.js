import { selectedDate } from "./custom_date.js";

//TODO move todo to the database during Backend phase
class Todo{
    constructor(){
        this.todoList = [];
        this.addTodo = (id, content) => {
            var todoItem = {
                date: selectedDate.date, 
                month: selectedDate.month, 
                year: selectedDate.year,
                content: content,
                id: id
            };
            this.todoList.push(todoItem);
        };
        this.deleteTodo = (index) => {
            this.todoList.splice(index, 1);
        }
        this.updateTodoDisplay = () => {
            todoListDisplay.innerHTML = "";
            this.todoList.forEach((todo, index) => {
                if(todo.date === selectedDate.date && todo.month === selectedDate.month && todo.year === selectedDate.year){
                    todoListDisplay.innerHTML += `<li><span class="deleteTodo"><i class="fas fa-times"></i><span class="nodisplay">${index}</span></span> ${todo.content}</li>`;
                }
            });
        };

    }
}


var todoListDisplay = document.querySelector("#todoListDisplay ul");
var todos = new Todo();

export { todos as todo };