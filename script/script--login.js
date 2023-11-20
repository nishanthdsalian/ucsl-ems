// const electron = require('electron');

// const path=require('path');
// const url=require('url');
// const mysql = require('mysql2');
// const db=require('./database.js');
// const ipcRenderer = electron.ipcRenderer;

const notifBar = document.getElementById("notification-bar");
const loader = document.getElementById("loader");

//const excel = require('exceljs/dist/exceljs.js');

/*
const {contextBridge} = require('electron');

contextBridge.exposeInMainWorld('electron',{
	"ipcRenderer":electron.ipcRenderer,
	"path":path,
	"url":url,
	"mysql":mysql,
	"db":db
});

*/

const loginCont = document.getElementById("cont-login")
const settingsCont = document.getElementById("cont-settings")

const loginForm = document.getElementById("form-login");

const btnSettings = document.getElementById("btn-go-settings");


const settingsForm = document.getElementById("form-settings");
const btnLogin = document.getElementById("btn-go-login");

const messageElem = document.getElementById("message")

messageElem.innerText="No Updates Available"


settingsCont.style.display="none"


// ipcRenderer.on('message',(event,data)=>{

//   alert(data.message)

// });

window.electronAPI.onErrorMsgReceived((_event,message)=>{

showNotification2('Error',message)


})

window.electronAPI.onLogMsgReceived((_event,message)=>{

  console.log(message)
  
  
  });


window.electronAPI.onUpdateAvailable((_event,message)=>{

  messageElem.innerText="Update Available"

})





// ipcRenderer.on('data-input',(event,data)=>{

//   const inputNames = ["db-hostname","db-port","db-username","db-password","db-name"];
//   const keyNames = ["host","port","user","password","database"];

//   for(let i=0;i<inputNames.length;i++){

//     if(Object.keys(data).includes(keyNames[i])){
//     document.getElementById("form-settings").elements[inputNames[i]].value = data[keyNames[i]]
//     }
//   }

// });






//const ipcRenderer = electron.ipcRenderer;






loginForm.addEventListener('submit',(e)=>{

  loader.style.display = "flex"

	e.preventDefault();

	const formData = new FormData(loginForm);

	// ipcRenderer.send('login',{
  //   userId:formData.get("user-name"),
  //       password:formData.get("password"),
  //       windowName:'login'
  // })


  const loginMap = 
  {
      userId:formData.get("user-name"),
          password:formData.get("password"),
          windowName:'login'
    }

  window.electronAPI.sendMap(('login',loginMap))


});



settingsForm.addEventListener('submit',(e)=>{

	e.preventDefault();

	const formData = new FormData(settingsForm);

	// ipcRenderer.send('settings',{
  //   host:formData.get("db-hostname"),
  //   user:formData.get("db-username"),
  //   password:formData.get("db-password"),
  //   port:formData.get("db-port"),
  //   database:formData.get("db-name"),
  //   windowName:'login'
  // })



});



// btnSettings.addEventListener('click',()=>{

// loginCont.style.display="none";


// settingsCont.style.display="flex";

// })


btnLogin.addEventListener('click',()=>{


  loginCont.style.display="flex";


  settingsCont.style.display="none";

  
  })






// ipcRenderer.on('wrong-password',(event,arg)=>{
//   console.log("wrong password feedback true")
// 	showNotification2("Error","Wrong Password");

// 	//alert("Wrong Password");

// })






function showNotification2(type,text){

  loader.style.display = "none"

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

