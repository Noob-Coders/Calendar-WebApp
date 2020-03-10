import { showCalendar } from "./show_calendar.js";
import { addCalendarControllerEvents, addDateSelectionEvents, updateSelectedDateDisplay, addTodosEvents, selectDate } from "./events.js";


addCalendarControllerEvents();
addDateSelectionEvents();
addTodosEvents();

//On visiting the Calendar-App show calendar corresponding to the current date
showCalendar(true);
selectDate();
updateSelectedDateDisplay();

