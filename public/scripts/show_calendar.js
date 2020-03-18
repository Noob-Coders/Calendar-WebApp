import { selectedDate, currentDate as todaysDate } from "./custom_date.js";
import { todo } from "./todos.js";
import { months } from "./calendar-dictionary.js";
import { selectDate, updateSelectedDateDisplay } from "./events.js";

//new Date(year, month, 32).getDate() returns the 32nd day after the 1st of month, year which takes date to the next month's date
//subtracting that from 32 gives us number of days in the given month
var daysInMonth = (month, year) => (32 - new Date(year, month, 32).getDate());

function todoOn(todoInMonth, id){
    if(todoInMonth){
        for(var i = 0;i < todoInMonth.length; i++){
            if(todoInMonth[i] === id)
                return true;
        }
    }
    return false;
}

console.log(todo.todoList);

function showCalendar(changeSelectedDate){
    //determine the first day on the given month
    var firstDay = (new Date(selectedDate.year, selectedDate.month)).getDay();

    //update calendar
    var calendarPlaceholder = document.querySelector("tbody");
    var calendarDates = "";
    var days = daysInMonth(selectedDate.month, selectedDate.year), currentDate = 1;

    var todoInMonth = [];
    if(todo.todoList){
        todo.todoList.forEach((todo) => {
            if(todo.month === selectedDate.month && todo.year === selectedDate.year)
                todoInMonth.push(todo.id);
        });
    }

    while(currentDate <= days){
        calendarDates += "<tr>";
        for(var i=0;i<7;i++){
            //insert blank cells in table where date is not to be filled
            if(( currentDate === 1 && i < firstDay ) || ( currentDate > days )){
                calendarDates += `<td class="empty"></td>`;
            }
            //mark current date cell
            else if(currentDate === todaysDate.date && selectedDate.year === todaysDate.year && selectedDate.month === todaysDate.month){
                if(todoOn(todoInMonth, `date${currentDate}${selectedDate.month}${selectedDate.year}`))
                    calendarDates += `<td class="active date${currentDate}${selectedDate.month}${selectedDate.year}">${currentDate++}<span class="dot"></span></td>`;
                else
                    calendarDates += `<td class="active date${currentDate}${selectedDate.month}${selectedDate.year}">${currentDate++}</td>`;
            }
            else if(todoOn(todoInMonth, `date${currentDate}${selectedDate.month}${selectedDate.year}`)){
                calendarDates += `<td class="date${currentDate}${selectedDate.month}${selectedDate.year}">${currentDate++}<span class="dot"></span></td>`;
            }
            //insert cells with dates
            else {
                calendarDates += `<td class="date${currentDate}${selectedDate.month}${selectedDate.year}">${currentDate++}</td>`;
            }
        }
        calendarDates += "</tr>";
    }
    calendarPlaceholder.innerHTML = calendarDates;

    //update text containing month and year
    var current = document.querySelector(".current");
    current.textContent = `${months[selectedDate.month]}, ${selectedDate.year}`;

    //change selected date
    if(changeSelectedDate){
        if(selectedDate.month === todaysDate.month && selectedDate.year === todaysDate.year)
            selectDate(todaysDate.date, todaysDate.month, todaysDate.year);
        else
            selectDate(1); //selects 1st date of the month
        updateSelectedDateDisplay();
    }
}

export { showCalendar };