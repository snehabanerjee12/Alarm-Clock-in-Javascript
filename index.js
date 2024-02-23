let alarmList = [];
let alarmId=0;

let selectMenu = document.querySelectorAll('select');
let setAlarmBtn = document.getElementById("SetAlarmBtn");

window.addEventListener('DOMContentLoaded',(Event)=>{
    setDropDownMenu( 1, 12, selectMenu[0]);  // function call to set the option of Hour box
    setDropDownMenu( 0, 59, selectMenu[1]); // function call to set the option of Minute box
    setDropDownMenu( 0, 59, selectMenu[2]); //function call to set the option of second box
});

//function to add the option element 
function setDropDownMenu( start, end, element){
    for(let i =start ;i<=end; i++){
        let listOption = document.createElement('option');
        listOption.value = i < 10 ? "0"+i : i;
        listOption.innerHTML = i < 10 ? "0"+i : i;
        element.appendChild(listOption);
    }
}

// set the AM/PM option element

for(let i=1;i<3;i++){
    let amPm = i==1? "AM" : "PM";
    let op = document.createElement('option');
    op.value = amPm;
    op.innerHTML = amPm;
    selectMenu[3].appendChild(op);
}

//function to fetch current time

function fetchTime(){
    let now = new Date();
    let dayName = now.getDay();
    let month = now.getMonth();
    let dayNum = now.getDate();
    let year = now.getFullYear();
    let nowHour = now.getHours();
    let nowMinute = now.getMinutes();
    let nowSecond = now.getSeconds();

    let nowtime = nowHour>=12 ? "PM" :"AM";

    if(nowHour>12){
        nowHour-=12;
    }

    nowHour = (nowHour<10) ? "0"+nowHour : nowHour;
    nowMinute = (nowMinute<10)? "0"+nowMinute : nowMinute;
    nowSecond = (nowSecond<10)? "0"+nowSecond : nowSecond;

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var week = ["Sunday", "Monday", "Tusday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // store the date

    document.getElementById("dayName").textContent = week[dayName];
    document.getElementById("month").textContent = months[month];
    document.getElementById("dayNum").textContent = dayNum;
    document.getElementById("year").textContent = year;

    //check if the alarm time match with the current time
    for(let i =0; i<alarmList.length; i++){
        console.log("alarm");
        let [tm,almId] = alarmList[i].split(",")
        console.log(tm);
        console.log(nowHour+":"+nowMinute+":"+nowSecond+" "+nowtime);
        if(tm == `${nowHour}:${nowMinute}:${nowSecond} ${nowtime}`){
            console.log("alarms");
            alert(`Alarm Ringing`);
            alarmList.splice(i,1);  // delete the specific alarm from alarm list
            document.getElementById("alarm"+almId).remove(); //delete the list item from alarmList
        }
    }
}

function loadingClock(){
    fetchTime();
    window.setInterval("fetchTime()",1000);
}



// Analog clock and Digital clock set up

let hr = document.querySelector('#hour');
let mn = document.querySelector('#minute');
let sc = document.querySelector('#second');

setInterval(()=>{
    let currentDay = new Date();
    let hh = currentDay.getHours()*30;
    let mm = currentDay.getMinutes()*6;
    let ss= currentDay.getSeconds()*6;

    hr.style.transform = `rotateZ(${hh+(mm/12)}deg)`;
    mn.style.transform = `rotateZ(${mm}deg)`;
    sc.style.transform = `rotateZ(${ss}deg)`;

    let h = new Date().getHours();
    let m = new Date().getMinutes();
    let s = new Date().getSeconds();

    let time = h>=12 ? "PM" :"AM";

    if(h>12){
        h-=12;
    }

    h = (h<10) ? "0"+h : h;
    m = (m<10)? "0"+m : m;
    s = (s<10)? "0"+s : s;

    document.getElementById("digiHours").innerHTML = h;
    document.getElementById("digiHours").value = h;
    document.getElementById("digiMinutes").innerHTML = m;
    document.getElementById("digiMinutes").value = m;
    document.getElementById("digiSeconds").innerHTML = s;
    document.getElementById("digiSeconds").value = s;
    document.getElementById("digiampm").innerHTML = time;
    document.getElementById("digiampm").value = time;
});

// event call for set alarm button
setAlarmBtn.addEventListener("click",setAlarm);


function setAlarm(){
    let selectedTime = `${selectMenu[0].value}:${selectMenu[1].value}:${selectMenu[2].value} ${selectMenu[3].value}`;

    //checking if user forgot to enter some value
    if(selectedTime.includes("setHour")||selectedTime.includes("setMinute")||selectedTime.includes("setSecond")||selectedTime.includes("setamPm")){
        alert(`Select select valid input`);
        return;
    }
    
    let currentTime = `${document.getElementById("digiHours").value}:${document.getElementById("digiMinutes").value}:${document.getElementById("digiSeconds").value} ${document.getElementById("digiampm").value}`;

    let selecteddateTime = new Date(`2000-01-01 ${selectedTime}`);
    let currentdateTime = new Date(`2000-01-01 ${currentTime}`);

    // checking if user selects past time
    if(currentdateTime >= selecteddateTime){
        alert(`Please choose approprite future inputs`);
        return;
    }
    
    //checkingif the alarm already set
    if(alarmList.includes(selectedTime)){
        alert(`The alarm is already Set`);
    }

    else{
        // alarm set and added to the list and the alarm div
        document.getElementById("alarmtitle").style.display ="block";
        alarmId++;
        document.querySelector(".alarmList").innerHTML+= 
        `<div class="alarmItem" id="alarm${alarmId}">
        <span id = "span${alarmId}">${selectedTime}</span>
        <button class="deleteBtn" id="${alarmId}" onclick ="deleteAlarm(this.id)">Delete</button>
        </div>`;
        alarmList.push(selectedTime+","+alarmId);
        alert(`Your alarm is set at ${selectedTime}`);
    }

}

function deleteAlarm(alarm_id){
 var element =  document.getElementById("alarm"+alarm_id);
 var dltIndex = alarmList.indexOf(document.getElementById("span"+alarm_id).innerText);
 let a = document.getElementById("span"+alarm_id).innerText;
 alarmList.splice(dltIndex,1);
 element.remove();
 alert(`Alarm ${a} is deleted`);
}
