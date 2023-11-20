const electron = require('electron');

const path=require('path');
const url=require('url');
const mysql = require('mysql2');
const db=require('./database.js');
const ipcRenderer = electron.ipcRenderer;

const notifBar = document.getElementById("notification-bar");


const form = document.getElementById("form");
const btnBack = document.getElementById("btn-back");



form.addEventListener('submit',(e)=>{

	e.preventDefault();

	const formData = new FormData(form);

	ipcRenderer.send('settings',{
    host:formData.get("db-hostname"),
    user:formData.get("db-username"),
    password:formData.get("db-password"),
    port:formData.get("db-port"),
    database:formData.get("db-name"),
  })



});



btnSettings.addEventListener('click',()=>{

ipcRenderer.send('settings')

})






ipcRenderer.on('wrong-password',(event,arg)=>{


	showNotification2("Error","Wrong Password");

	//alert("Wrong Password");

})






function showNotification2(type,text){

const container = document.createElement("div");
container.setAttribute("class","center-cont-box-3 c-flex");
document.body.appendChild(container);

document.body.appendChild(container);

const notifCont = document.getElementById("notification-bar");
container.appendChild(notifCont);


const notifHead = document.getElementById("notification-heading");
const notifBtn =document.getElementById("notification-btn");
const notifBtnClose =document.getElementById("notification-btn-close");
const notifImg= document.getElementById("notification-img");
const notifText = document.getElementById("notification-text");

const notificationTypes = ["Connection Issue", "Success", "Error", "Conflict", "Warning","Confirmation"];
const notifContColors = ["rgb(40,83,107)","rgb(127,183,72)","rgb(216,40,40)","rgb(210,80,80)","rgb(153, 31, 0)","rgb(40,83,107)"];
const notifHeadColors = ["rgb(151,181,190)","rgb(187,219,155)","rgb(219,155,155)","rgb(219,155,155)","rgba(255,255,255,0.3)","rgb(151,181,190)"];
const notifHeadFontColors = ["rgb(151,181,190)","rgb(30,30,30)","rgba(255,255,255)","rgb(219,155,155)","rgba(255,255,255)","rgb(151,181,190)"];
const notifBtnTexts = ["RELOAD","","OK","OK","CLOSE","CLOSE"];
const notifImgs=["conn-issue","update","error","conflict","warning","conflict"];


  const i = notificationTypes.indexOf(type);

  notifBar.style.display="grid";

  notifBar.style.backgroundColor=notifContColors[i];
  notifHead.style.backgroundColor=notifHeadColors[i];
  notifHead.style.color=notifHeadFontColors[i];
  notifBtnClose.style.visibility=(notificationTypes[i]=="Success")?"hidden":"visible";


  notifHead.innerText=notificationTypes[i].toUpperCase();
  notifBtnClose.innerText=notifBtnTexts[i];
  //notifBtnClose.setAttribute("onclick",`closeNotification(this)`);
  notifBtnClose.addEventListener('click', closeNotification2);
  //notifBtnClose.removeEventListener('click', closeNotification2(e));


  notifBtn.innerText="PROCEED";


  	notifBtn.style.display=(notificationTypes[i]!="Warning" && notificationTypes[i]!="Confirmation")?"none":"flex";

  

  notifBtn.style.backgroundColor="rgb(216, 216, 216)";
  notifBtnClose.style.backgroundColor="rgb(216, 216, 216)";

  notifImg.src=`../source/logo--${notifImgs[i]}.svg`;
  notifText.innerText=text;

    if(notificationTypes[i]=="Success"){
      setTimeout(()=>{
        closeNotification2(notifBtnClose);
      },2000);
  }



}


function closeNotification2(ev,type){

  //const parentView = elem.parentElement.parentElement.parentElement;

  const parentView = ev.target.parentElement.parentElement.parentElement;

  const parentClass = parentView.className.split(" ")[0];

  console.log(parentClass);

  console.log(document.getElementsByClassName(parentClass));

  const parentConts = document.getElementsByClassName(parentClass);

  for(x=0;x<parentConts.length;x++){

    parentConts[x].style.display="none";
  }


  //if(type=="Conflict" || type=="Error" || type=="Warning"){

    //parentView.innerHTML="";
    
 // }


}

