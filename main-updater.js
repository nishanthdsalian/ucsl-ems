

const electron = require("electron");
const Menu = electron.Menu;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");
const db = require('./script/database.js');
const mysql = require('mysql');
const excel=require('exceljs');

const log = require('electron-log');
const { autoUpdater } = require("electron-updater");




let template=[];

//const excel = require('exceljs/dist/exceljs.js');

//console.log(process.versions.node.split('.')[0], 10);
//console.log(process.versions.node.split('.'));
console.log(process.version);

const ipcMain = electron.ipcMain;

let win;

let idMap={};

autoUpdater.on('update-available', (info) => {
	console.log("availed")
  sendStatusToWindow('Update available.');
})

function createWindow(pageName){
	win = new BrowserWindow({
		show:false, 
		webPreferences:{
				contextIsolation:false,
				nodeIntegration:true
				//preload:path.join(__dirname,'script/',scriptName)
			}
		});

		win.maximize();

		idMap[pageName]=win.id;

	win.loadURL(url.format({
		pathname: path.join(__dirname,'page/',pageName+".html"),
		protocol:"file",
		slashes:true
	}));



	win.webContents.on('did-finish-load',()=>{

	win.show();

	})



	win.on('closed',()=>{
		win=null;
	})
}



app.whenReady().then(()=>{

/* Production Mode Start */

	
	createWindow('login');   //Goes to Login Screen

/*Auto Updater
	autoUpdater.checkForUpdatesAndNotify();


	log.info(`Version: ${app.getVersion()}`);

  autoUpdater.on("update-downloaded", () => {
    log.info("update downloaded");
    setImmediate(() => {
      try {
        log.info("installing update");
        // app.relaunch();
        autoUpdater.quitAndInstall();
      } catch (err) {
        log.error("Error installing update");
        log.error(err);
      }
    });
  });

  autoUpdater.on("error", err => {
    log.error("AutoUpdater error");
    log.error(err);
  });


Auto Updater Ends */

/* Production Mode End */	



/* Maintenance Mode	Start 
	createWindow('index'); //Goes to Dashboard

		//win is already initialized in createWindow();
		win.webContents.on('did-finish-load',()=>{
			win.webContents.send('user-input',{
				userId:"cc_admin", //userMap.userId,
				role:"Admin", //userMap.role,
				department:"Contract Cell",//userMap.department,
				location:"Malpe", //userMap.location,
				password:"password"//userMap.password
			})
			
		});
/*Maintenance Mode End*/



});






let viewWindow;
let addWindow;
let cardWindow;

ipcMain.on('open-window',(event,arg)=>{

	console.log(arg.name);
	console.log(arg);  

	if(arg.name=="view"){

			viewWindow = new BrowserWindow();

				viewWindow.loadURL(url.format({
					pathname:path.join(__dirname,'page/','view.html'),
					protocol:'file',
					slashes:true
				}));

				viewWindow.on('closed',()=>{
					viewWindow = null;
				}) 

	}else if(arg.name=="add"){

				addWindow = new BrowserWindow();

				addWindow.loadURL(url.format({
					pathname:path.join(__dirname,'page/','add.html'),
					protocol:'file',
					slashes:true
				}));

				addWindow.on('closed',()=>{
					addWindow = null;
				}) 




	}else if(arg.name=="card"){

		cardWindow = new BrowserWindow({width:805, height:505, frame:true,webPreferences:{
				contextIsolation:false,
				nodeIntegration:true
				//preload:path.join(__dirname,'script/',scriptName)
			}});

		cardWindow.loadURL(url.format({
			pathname:path.join(__dirname,'page/','card.html'),
			protocol:'file',
			slashes:true
		}));

		cardWindow.webContents.on('did-finish-load',()=>{
			cardWindow.webContents.send('data-input',arg.data);
		})
		

		cardWindow.on('closed',()=>{
			cardWindow = null;
		}) 

		console.log("data="+arg.data);

		

	}



});//ipcMain(open-window) end


ipcMain.on('close-window',(event,arg)=>{

	if(arg.name=="index"){

		BrowserWindow.fromId(idMap[arg.name]).close();

	}



});


let con= mysql.createConnection(db.dbConfig);


ipcMain.on('login',(event,arg)=>{

	console.log(arg);

const userId = arg.userId;
const password = arg.password;


con.connect((err)=>{
	/*

					con.on('error',(err)=>{
						console.log("Error ="+err.message);
						handleError();
					});

*/



con.query(`SELECT * from user_data WHERE userId="${userId}"`,(err,res)=>{
/*
	con.on('error',(err)=>{
		console.log("Error ="+err.message);
		handleError();
		//db.handleError(con);
	})

*/

		const userMap= res[0];

	if(userMap["password"]===password){
		console.log("correct password")



		const role = userMap["role"];
		const dept = userMap["department"];


		//const role = "Admin";
		//const dept = "Contract Cell";

		createWindow('index');

		//win is already initialized in createWindow();
		win.webContents.on('did-finish-load',()=>{
			win.webContents.send('user-input',{
				userId:userMap.userId,
				role:userMap.role,
				department:userMap.department,
				location:userMap.location,
				password:userMap.password
			})
			BrowserWindow.fromId(idMap["login"]).close();
		});

		


		win.on('closed',()=>{
			win=null;
		})




		const query2 = `UPDATE TABLE user_data SET logStatus='loggedIn WHERE userId='${userId}'`;

		con.query(query2,(err,res)=>{

			console.log(query2);

		})



	}else{
		console.log("wrong password")
		const win = BrowserWindow.fromId(idMap["login"]);

		win.webContents.send('wrong-password',"");

	
	}

});


});


});

ipcMain.on('logout',(err,arg)=>{


BrowserWindow.getAllWindows().forEach((window)=>{

	window.close();
})

createWindow('login');


})







//for mac
app.on('window-all-closed',()=>{
	if(process.platform=="darwin"){
		app.quit();
	}
});



app.on('activate',()=>{
	if(win === null){
		createWindow();
	}
});


//]]


function handleError(){

con=mysql.createConnection(db.dbConfig);

con.connect(function(err){
	if(err){
		console.log('error connecting to db');
		setTimeout(handleError,2000);
	}
});


con.on('error',function(err){

	console.log("db Error");

	if(err.code==='PROTOCOL_CONNECTION_LOST'){
		handleError();
	}else if(err.code==='ECONNRESET'){
		handleError();
	}else{
		throw(err);
	}
})



}


/* Auto Updater

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.autoDownload = true;
log.info('App starting...');





function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
	console.log("Entered");
  sendStatusToWindow('Checking for update...');
})

autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})




/*

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})

autoUpdater.on('update-not-available', (info) => {
	console.log("not avaiable");
  sendStatusToWindow('Update not available.');
})

autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})

*/



