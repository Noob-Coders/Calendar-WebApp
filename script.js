//currentMonth, currentYear and currentDate are maintaining todays's date 
var currentMonth = new Date().getMonth(), currentYear = new Date().getFullYear(), todaysDate = new Date().getDate();

//month and year are maintaining the month and year of the calendar being displayed on the screen
var month = currentMonth, year = currentYear;

//months array is to convert month which is in Integer format to corresponding month name
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//daysInMonth function determines the number of days in the month that corresponds to the month and year passed to the function as arguments
//new Date(year, month, 32).getDate() returns the 32nd day after the 1st of month, year which takes date to the next month's date
//subtracting that from 32 gives us number of days in the given month
var daysInMonth = (month, year) => (32 - new Date(year, month, 32).getDate());


function showCalendar(month, year){
    //determine the first day on the given month
    var firstDay = (new Date(year, month)).getDay();

    //update calendar
    var calendarPlaceholder = document.querySelector("tbody");
    var calendarDates = "";
    var days = daysInMonth(month, year), currentDate = 1;
    while(currentDate < days){
        calendarDates += "<tr>";
        for(i=0;i<7;i++){
            //insert blank cells in table where date is not to be filled
            if(( currentDate == 1 && i < firstDay ) || ( currentDate > days )){
                calendarDates += "<td></td>";
            }
            //mark current date cell
            else if(currentDate === todaysDate && year === currentYear && month === currentMonth){
                calendarDates += `<td class="active">${currentDate++}</td>`;
            }
            //insert cells with dates
            else {
                calendarDates += `<td>${currentDate++}</td>`;
            }
        }
        calendarDates += "</tr>";
    }
    calendarPlaceholder.innerHTML = calendarDates;

    //update text containing month and year
    var current = document.querySelector(".current");
    current.textContent = `${months[month]}, ${year}`;
}

var nextButton = document.querySelector("#next"), previousButton = document.querySelector("#previous");

nextButton.addEventListener("click", () => {
    //update month and year
    month++;
    if(month === 12){
        month = 0;
        year++;
    }

    //update calendar
    showCalendar(month, year);
});

previousButton.addEventListener("click", () => {
    //update month and year
    month--;
    if(month === -1){
        month = 11;
        year--;
    }

    //update calendar
    showCalendar(month, year);
});

//On visiting the webapp show calendar corresponding to the current date
showCalendar(month, year);