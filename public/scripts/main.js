import { showCalendar } from "./show_calendar.js";
import { addCalendarControllerEvents, addDateSelectionEvents, updateSelectedDateDisplay, addTodosEvents, selectDate } from "./events.js";
import { addMenuEvent } from "./menu.js";
import { currentDate } from "./custom_date.js";
import { months } from "./calendar-dictionary.js";


var monthAndYear = document.querySelector("#location"), date = document.querySelector("#temperature");
monthAndYear.textContent = `${months[currentDate.month]}, ${currentDate.year}`;
date.textContent = `${currentDate.date}`;

addCalendarControllerEvents();
addDateSelectionEvents();
addTodosEvents();

//On visiting the Calendar-App show calendar corresponding to the current date
showCalendar(true);
selectDate();
updateSelectedDateDisplay();

//User menu
addMenuEvent();

