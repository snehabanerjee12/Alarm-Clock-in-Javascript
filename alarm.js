// selected HTML segments
let timeDiv = document.getElementById('time');
let setHour = document.getElementById("hours");
let setMinute = document.getElementById("minutes");
let setSecond = document.getElementById("seconds");
let setamPm = document.getElementById("amPm");

let alarmId=0; // id to identify each object uniquely
let hours, time, minutes, seconds, interval;
let alarms = []; // array to store alarm objects


// to fetch the current time 
function fetchTime(){
    const current = new Date();
    hours = current.getHours();
    time ="AM";
    if(hours>12){
        time ="PM";
        hours-=12;
    }
    hours = String(hours).padStart(2,'0');
    minutes = String(current.getMinutes()).padStart(2,'0');
    seconds = String(current.getSeconds()).padStart(2,'0');
}

function timeUpdate()  // to display the current time 
{
   fetchTime();
    timeDiv.innerText = `${hours}:${minutes}:${seconds} ${time}`;
    setInterval(timeUpdate,1000);  // every second the function is called
}

timeUpdate();  

window.addEventListener('DOMContentLoaded',(Event)=>{
        setDropDownMenu( 1, 12, setHour);  // function call to set the option of Hour box
        setDropDownMenu( 0, 59, setMinute); // function call to set the option of Minute box
        setDropDownMenu( 0, 59, setSecond); //function call to set the option of second box
});


//function to append the options into the inputs
function setDropDownMenu( start, end, element){
    for(let i =start ;i<=end; i++){
        let listOption = document.createElement('option');
        listOption.value = i < 10 ? "0"+i : i;
        listOption.innerHTML = i < 10 ? "0"+i : i;
        element.appendChild(listOption);
    }
}


// function to set the alarm
function setAlarmFunc() {

    //fetching the datas selected for Hour, Minute and Second
    const sethours = setHour.value;
    const setminutes = setMinute.value;
    const setseconds = setSecond.value;
    const setampm = setamPm.value;

    // parsing the hour for format handling
    let hourValue = parseInt(sethours);

    // explicitely making the hour variable into 24 hour format
    if (setampm === "PM" && hourValue !== 12) {
        hourValue += 12; 
    } else if (setampm === "AM" && hourValue === 12) {
        hourValue = 0;
    }

    //conversion of the given values into Date Object
    const selectedalarmTime = new Date();
    selectedalarmTime.setHours(hourValue);
    selectedalarmTime.setMinutes(parseInt(setminutes));
    selectedalarmTime.setSeconds(parseInt(setseconds));

    // checking if the alarm is already set or not
    const isDuplicate = alarms.some((alarm)=>{
              const alarmTime = alarm.time;
        return alarmTime.getHours() === selectedalarmTime.getHours() &&
               alarmTime.getMinutes() === selectedalarmTime.getMinutes() &&
               alarmTime.getSeconds() === selectedalarmTime.getSeconds();});

    if(isDuplicate){
        alert(`The alarm time is already set`);
        return;
    }

    const now = new Date(); // fetches the current time

    // calculates the difference of alarm time and current time  in miliseconds
    const timeDifference = selectedalarmTime.getTime() - now.getTime(); 

    // if user selects any time that is passed 
    if (timeDifference < 0) {
        alert("Please select a future time for the alarm.");
        return;
    }

    
    // Create alarm object with time and id
    const alarm = {
        time: selectedalarmTime,
        id: "alarm_" + alarmId //generated Unique Id 
    };

    alarmId++; // increment of unique id

    alarms.push(alarm); // the alarm object added to the alarms array

    // Display the alarm in the list with delete button
    const alarmListDiv = document.getElementById("alarmList");

    //creation of alarm div 
    const alarmItem = document.createElement("div");
    alarmItem.classList.add("alarms");
    alarmItem.textContent = ` ${sethours}:${setminutes}:${setseconds} ${setampm}`;

    // creation of delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteBtn");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
        // Remove the alarm from the list and the alarms array
        alarmItem.remove();
        const index = alarms.findIndex(a => a.id === alarm.id);
        if (index !== -1) {
            alarms.splice(index, 1);
        }
    });

    //delete button is added with the alarm item
    alarmItem.appendChild(deleteButton);

    //alarm is added to the alarm list
    alarmListDiv.appendChild(alarmItem);

    setTimeout(() => {
        // alarm triggered and the item removed from list and alarms array
        alert("Time's up! ");
        alarmItem.remove();
        const index = alarms.findIndex(a => a.id === alarm.id);
        if (index !== -1) {
            alarms.splice(index, 1);
        }
    }, timeDifference);
}


