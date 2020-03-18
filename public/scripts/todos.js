import { selectedDate } from "./custom_date.js";
import { showCalendar } from "./show_calendar.js";
import { selectDate } from "./events.js";


//TODO move todo to the database during Backend phase
class Todo{
    constructor(){
        this.email;
        this.todoList = [];
        this.addTodo = (id, content, time) => {
            var todoItem = {
                date: selectedDate.date, 
                month: selectedDate.month, 
                year: selectedDate.year,
                content: content,
                time: time,
                id: id
            };
            //TODO make a post request and send todoItem to the server
            fetch("/todo", {
                method: "POST",
                body: JSON.stringify({
                    email: this.email, 
                    newTodo: todoItem
                }),
                headers: {'Content-Type': 'application/json'}
            })
            .then(res => {
                return res.json();
            })
            .then(data => {
                if(data.success){
                    this.updateTodo(data.todo);
                }
            });
            //TODO make a get request and receive updated todoList from the server
            //this.todoList.push(todoItem);
        };
        this.deleteTodo = (index) => {
            fetch("/todo?_method=DELETE", {
                method: "POST",
                body: JSON.stringify({
                    email: this.email, 
                    todoId: this.todoList[index]._id
                }),
                headers: {'Content-Type': 'application/json'}   
            }).then(res => {
                return res.json();
            }).then(data => {
                if(data.success)
                    this.updateTodo(data.todo);
            });
            //this.todoList.splice(index, 1);
        };
        this.updateTodo = (list) => {
            if(list){
                this.todoList = list;
                showCalendar();
                selectDate();
            }
        }
        this.updateTodoDisplay = () => {
            todoListDisplay.innerHTML = "";
            this.todoList.forEach((todo, index) => {
                if(todo.date === selectedDate.date && todo.month === selectedDate.month && todo.year === selectedDate.year){
                    todoListDisplay.innerHTML += `<li><span class="deleteTodo"><i class="fas fa-times"></i><span class="nodisplay">${index}</span></span><span class="time">${todo.time}</span> ${todo.content}</li>`;
                }
            });
        };

    }
}


var fetchTodo = (todo) => {
    var email;
    fetch("/email")
    .then( res => {
        return res.json();
    })
    .then( data => {
        if(data.success)
            email = data.email;
        todo.email = email;

        if(email)
            fetch("/todo/" + email)
            .then( res => {
                return res.json()
            })
            .then( data => {
                if(data.success){
                    todo.updateTodo(data.todo); 
                }
            });
    })
}


var todoListDisplay = document.querySelector("#todoListDisplay ul");
var todos = new Todo();

fetchTodo(todos);

export { todos as todo };