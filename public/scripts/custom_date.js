export default class CustomDate{
    constructor(date, month, year){
        this.date = date;
        this.month = month;
        this.year = year;
        
        this.nextMonth = () => {
            this.month++;
            if(this.month == 12){
                this.year++;
                this.month = 0;
            }
        }
        
        this.previousMonth = () => {
            this.month--;
            if(this.month == -1){
                this.year--;
                this.month = 11;
            }
        }

        this.updateDate = (date, month, year) => {
            if(date)
                this.date = date;
            
            if(month)
                this.month = month;
            
            if(year)
                this.year = year;
        }
    }
}


var month = new Date().getMonth(), year = new Date().getFullYear(), date = new Date().getDate();

var currentDate = new CustomDate(date, month, year);
var selectedDate = new CustomDate(date, month, year);

export { currentDate, selectedDate };