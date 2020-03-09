import { currentDate } from "./custom_date.js";
import { todo } from "./todos.js";
import { showCalendar } from "./show_calendar.js";
import { addCalendarControllerEvents, addDateSelectionEvents, updateSelectedDateDisplay, addTodosEvents, selectDate } from "./events.js";


addCalendarControllerEvents();
addDateSelectionEvents();
addTodosEvents();

//On visiting the Calendar-App show calendar corresponding to the current date
showCalendar(currentDate.month, currentDate.year);
selectDate();
updateSelectedDateDisplay();

