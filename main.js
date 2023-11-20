

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const fs = require('fs')
const path = require("path");
const url = require("url");
const {autoUpdater} = require('electron-updater')

const mysql = require('mysql2');
const excel=require('exceljs');

const productionMode = false;

//const excel = require('exceljs/dist/exceljs.js');

//console.log(process.versions.node.split('.')[0], 10);
//console.log(process.versions.node.split('.'));
console.log(process.version);

const ipcMain = electron.ipcMain;

let win;

let idMap={};


const devDbConfig = {
	host: '127.0.0.1',
	user: 'root',
	password:'password',
	port:3306,
	database: 'ems_app',
  };
  
  const prodDbConfig = {
		host:"172.30.10.200",
		user:"root",
		password:"@Ucsl@1234",
		port:3306,
		database:"ems_app"
  };
  
  
const dbConfig = productionMode ? prodDbConfig : devDbConfig;


function createWindow(pageName,data,contextIsolationCond){

	const webPreferences = contextIsolationCond ? {preload:path.join(__dirname,'preload.js')} : {
		contextIsolation:false,
		nodeIntegration:true,
	}

	win = new BrowserWindow({
		show:false, 
		webPreferences:webPreferences
		});

		win.maximize();

		idMap[pageName]=win.id;

	win.loadURL(url.format({
		pathname: path.join(__dirname,'page/',pageName+".html"),
		protocol:"file",
		slashes:true
	}));

	if(pageName=="login"){
		win.once('ready-to-show',()=>{
			console.log("IN Login Page Man")
			autoUpdater.checkForUpdatesAndNotify()
		});

		autoUpdater.on('update-available',()=>{
			win.webContents.send('update-available');
		})

		autoUpdater.on('update-downloaded',()=>{
			win.webContents.send('update-downloaded');
		})

		
	}

	

	win.webContents.on('did-finish-load',()=>{
		if(win){
		win.webContents.send('data-input',data)
		win.show();
		}
	})



	win.on('closed',()=>{
		win=null;
	})
}


app.whenReady().then(async ()=>{

/* Production Mode Start */

	const folderPath = `${__dirname}/data`

	if(!fs.existsSync(folderPath)){
		fs.mkdirSync(folderPath)
	}

	let dbData = dbConfig;

	// if(fs.existsSync(`${folderPath}/dbConfig.json`)){

	// 	dbData = await getJSONDataFromFile(folderPath,'dbConfig.json')
	// 	dbConfig=dbData;
		
	// }

	createWindow('login',dbData,true);   //Goes to Login Screen

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

	
	if(arg.name=="card"){

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


// let con= mysql.createConnection(db.dbConfig);





ipcMain.on('settings',(event,arg)=>{

	console.log(arg);

	const data={
			host:arg.host,
			user:arg.user,
			password:arg.password,
			port:parseInt(arg.port),
			database:arg.database
	}

	const folderPath = `${__dirname}/data`

	if(!fs.existsSync(folderPath)){
		fs.mkdirSync(folderPath)
	}

	fs.writeFile(`${folderPath}/dbConfig.json`,JSON.stringify(data),(err)=>{

		if(err){
			BrowserWindow.fromId(idMap[arg.windowName]).send('message',{
				message:`Error:${err}`
			});
		}

		BrowserWindow.fromId(idMap[arg.windowName]).send('message',{
			message:"Successfully Saved"
		});

	})


})


ipcMain.on('login',(event,arg)=>{

	console.log("login started")

	const curWindowId = idMap["login"]

	console.log(arg);

	const userId = arg.userId;
	const password = arg.password;


try{

	console.log(dbConfig)

	const con = mysql.createConnection(dbConfig);

	con.connect((err)=>{
		/*

						con.on('error',(err)=>{
							console.log("Error ="+err.message);
							handleError();
						});

	*/
	if(err != null){

		sendErrorMsg("Database Connection Issue",curWindowId)

		// const win = BrowserWindow.fromId(idMap["login"]);
		// win.webContents.send('send-error',"Database Connection Issue")

	}else{
		con.query(`SELECT * from user_data WHERE userId="${userId}"`,(err,res)=>{


		const userMap= res[0];

			if(userMap["password"]===password){
				console.log("correct password")

				const role = userMap["role"];
				const dept = userMap["department"];


				//const role = "Admin";
				//const dept = "Contract Cell";

				createWindow('index',{});

				//win is already initialized in createWindow();
				win.webContents.on('did-finish-load',()=>{
					win.webContents.send('user-input',{
						userId:userMap.userId,
						role:userMap.role,
						department:userMap.department,
						location:userMap.location,
						password:userMap.password,
						dbConfig:dbConfig
					})
					BrowserWindow.fromId(curWindowId).close();
				});

				


				win.on('closed',()=>{
					win=null;
				})



				const query2 = `UPDATE TABLE user_data SET logStatus='loggedIn WHERE userId='${userId}'`;

				con.query(query2,(err,res)=>{
					sendLogMsg(res,curWindowId)
				})



			}else{

				sendErrorMsg("You have entered the wrong password",curWindowId)

				// const win = BrowserWindow.fromId(idMap["login"]);
				// win.webContents.send('send-error',"You have entered the wrong password");
			
			}

		});

	}


	});



}catch(error){

	console.log("database error",error)
	const win = BrowserWindow.fromId(idMap["login"]);
	win.webContents.send('send-error',"DB Connect Error : Please check the database details");

	// BrowserWindow.fromId(idMap[arg.windowName]).send('message',{
	// 	message:"DB Connect Error : Please check the database details"
	// });
	

}


});



ipcMain.on('logout',(err,arg)=>{

	console.log('logout pressed')

	for(const window of BrowserWindow.getAllWindows()){

		window.close();
	}

// BrowserWindow.getAllWindows().forEach((window)=>{
// 	window.close();
// })

console.log(arg)

try{

createWindow('login',arg,true);

}catch(error){
	console.log(err)
}

})







//for mac
app.on('window-all-closed',()=>{
	if(process.platform=="darwin"){
		app.quit();
	}
});



app.on('activate',()=>{
	if(win === null){
		// createWindow();
	}
});


//]]

function sendErrorMsg(msg,windowId){

	const win = BrowserWindow.fromId(windowId);
	win.webContents.send('send-error',msg);
	}

	function sendLogMsg(msg,windowId){

		const win = BrowserWindow.fromId(windowId);
		win.webContents.send('send-log',msg);
		}


async function getJSONDataFromFile(folderPath,fileName){
	const filePath = folderPath + "/" + fileName;

	return new Promise((resolve,reject)=>{

			fs.readFile(filePath,(err,content)=>{

				if(err){
					console.log(err)
					return reject(err)
				}

				return resolve(JSON.parse(content))

			})

	})
}


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
