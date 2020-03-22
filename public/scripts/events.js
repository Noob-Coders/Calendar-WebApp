import { selectedDate } from "./custom_date.js";
import { showCalendar } from "./show_calendar.js";
import { days, months } from "./calendar-dictionary.js";
import { todo } from "./todos.js";


function addCalendarControllerEvents(){
    //Adds event listner to next and previous buttons to change month

    var nextButton = document.querySelector("#next"), previousButton = document.querySelector("#previous");

    nextButton.addEventListener("click", () => {
        //update month and year
        selectedDate.nextMonth();
        //update calendar
        showCalendar(true);
    });

    previousButton.addEventListener("click", () => {
        //update month and year
        selectedDate.previousMonth();
        //update calendar
        showCalendar(true);
    });
}


function updateSelectedDateDisplay(){
    //Update selected date displayed on the screen
    var selectedDateDisplay = document.querySelector("#selectedDateDisplay");
    selectedDateDisplay.innerHTML = `<i class="fas fa-table"></i> ${selectedDate.date} ${months[selectedDate.month]} ${days[new Date(selectedDate.year, selectedDate.month, selectedDate.date).getDay()]}`;
}

function selectDate(date, month, year){
    selectedDate.updateDate(date, month, year);
    var selected = document.querySelector(".selected");
    var dateid = `date${selectedDate.date}${selectedDate.month}${selectedDate.year}`;
    var toSelect = document.querySelector("." + dateid);
    if(selected)
        selected.classList.toggle("selected");
    toSelect.classList.toggle("selected");
    todo.updateTodoDisplay();
}

function addDateSelectionEvents(){
    //Jquery used below
    $("tbody").on("click", "td", function() {
        if(this.textContent !== ""){
            selectedDate.updateDate(Number(this.textContent));
            var selected = document.querySelector(".selected");
            if(selected)
                selected.classList.toggle("selected");
            this.classList.toggle("selected");
        }
        updateSelectedDateDisplay();
        todo.updateTodoDisplay();
    });
    //Jquery used above
}

function addTodosEvents(){
    var addTodo = document.querySelector("#addTodo");
    var todoItem = document.querySelector("#todoItem");
    var todoTime = document.querySelector("#todoTime");
    var todoList = document.querySelector("#todoListDisplay");

    function newTodo(){
        if(todoItem.value !== ""){
            var id = `date${selectedDate.date}${selectedDate.month}${selectedDate.year}`;
            var dot = "<span class='dot'></span>";
            var dateCell = document.querySelector("." + id);
            todo.addTodo(id, todoItem.value, todoTime.value);
            if(dateCell.innerHTML.indexOf(dot) === -1){
                dateCell.innerHTML += dot;
            }
            todoItem.value = "";
            todoTime.value = "00:00";
            todo.updateTodoDisplay();
        }
    }

    todoItem.addEventListener("keypress", (event) => {
        if(event.keyCode === 13){
            newTodo();
        }
    })

    addTodo.addEventListener("click", () => {
        newTodo();
    });


    $("#todoListDisplay").on("click", "li .deleteTodo", function() {
        todo.deleteTodo(Number(this.childNodes[1].textContent));
        todo.updateTodoDisplay();
        showCalendar(false);
        selectDate(selectedDate.date, selectedDate.month, selectedDate.year);
    });


}



export { addCalendarControllerEvents, addDateSelectionEvents, addTodosEvents, updateSelectedDateDisplay, selectDate};