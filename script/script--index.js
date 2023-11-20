
const electron=require('electron')
//const BrowserWindow=electron.remote.BrowserWindow;
const path=require('path');
const url=require('url');
const mysql = require('mysql2');
const excel = require('exceljs');
const fs = require('fs');

const productionMode = false;


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



const appVersion="0.1.0 - November 2023";

const remote = electron.remote;
//const db=require('./database.js');

const ipcRenderer = electron.ipcRenderer;


const personnelTypes = ["Sub Contract Personnel","Temporary Contract", "Service Engineer","Owner Rep","Security","Apprentice"];

  

	// const db={dbConfig:{
	// 			host:"127.0.0.1",
	// 			user:"root",
	// 			password:"",
	// 			port:3306,
	// 			database:"tebma_one_testing",
	// 			multipleStatements:true
	// 		}
	// };

	// 	const db={dbConfig:{
	// 			host:"172.30.10.200",
	// 			user:"root",
	// 			password:"@Ucsl@1234",
	// 			port:3306,
	// 			database:"ems_app",
	// 			multipleStatements:true
	// 		}
	// };


const progressLoader = document.getElementById("progress-loader");


let con = mysql.createConnection(dbConfig);

const notifBtn =document.getElementById("notification-btn");

//document.getElementById("body-app").style.display="none";


document.onreadystatechange = function(){

  if(document.readyState !== "complete"){

    document.getElementById("loader").style.display="flex";
    document.getElementById("body-app").style.display="none";

  }else if(document.readyState == "complete"){

    setTimeout(function(){

     document.getElementById("loader").style.display="none";
     document.getElementById("body-app").style.display="grid";

    },1000);
     
  }
}



const tickBlue = "rgb(16, 67, 89)";

const prColor1 = "rgb(31, 122, 162)";
const prColor2 = "rgb(45, 108, 135)";
const prColor3 = "rgb(16, 67, 89)";
const prColor4 = "rgb(65, 146, 190)";
const prColor5 = "rgb(5, 81, 114)";
const prColor6l6 = "rgba(47, 117, 148,0.6)";
const prColor7 = "rgb(48,89,107)";
const colorWarning = "rgb(153, 31, 0)";
const colorRenew = "rgb(31, 153, 0)";
const colorBlock = "rgb(240, 187, 42)";
const colorBlockBack = "rgb(255, 214, 204)";
const colorExpBack = "rgb(200, 200, 200)";
const colorExp = "rgb(150, 150, 150)";

const mainContainer = document.getElementById("display");
let bodyContainer = "";
let headContainer="";
let bottomContainer="";
let title="";


//const displayTitle = document.getElementById("title");

const functionMap={};
const appDataMap={};
let userMap={};

appDataMap.firstVisit = true;
appDataMap.contractorId="";
appDataMap.personId="";


// /appDataMap["camStream"]=[];

const btnInfo = document.getElementById("btn-info");
const btnUser = document.getElementById("btn-user");
const btnLogOut = document.getElementById("btn-logout");

const notifBar = document.getElementById("notification-bar");

//Action when info button is clicked on the dashboard
btnInfo.addEventListener('click',(e)=>{

	const container = document.createElement("div");
	container.setAttribute("class","center-cont-box-2");
	document.body.appendChild(container);

	const sChild = document.createElement("div");
	sChild.setAttribute("class","center-disp-cont-2");
	container.appendChild(sChild);

	const sBodyCont = document.createElement("div");
	sBodyCont.setAttribute("class","c-flex-col");
	sChild.appendChild(sBodyCont);

	const sImgCont = document.createElement("div");
	sImgCont.setAttribute("class","c-flex");
	sBodyCont.appendChild(sImgCont);

	const sImgLogo = document.createElement("img");
	sImgLogo.setAttribute("class","img-size-7 clr-inv");
	sImgLogo.src="../source/logo--app.png"
	sBodyCont.appendChild(sImgLogo);

	const info1 = document.createElement("div");
	info1.setAttribute("class","info-text-1");
	info1.innerText = `Version: ${appVersion}`
	sBodyCont.appendChild(info1);

	const info2 = document.createElement("div");
	info2.setAttribute("class","info-text-1");
	info2.innerText = `Developer: Ncode Media`
	sBodyCont.appendChild(info2);

	const info3 = document.createElement("div");
	info3.setAttribute("class","info-text-1");
	info3.innerText = `Website: www.ncodemedia.com`
	sBodyCont.appendChild(info3);

	const sImgCont2 = document.createElement("div");
	sImgCont2.setAttribute("class","c-flex");
	sChild.appendChild(sImgCont2);

	const sImgLogo2 = document.createElement("img");
	sImgLogo2.setAttribute("class","img-size-1-5");
	sImgLogo2.src="../source/logo--ddncode.png"
	sImgCont2.appendChild(sImgLogo2);

	const closeBtn = document.createElement("div-1");
	closeBtn.setAttribute("class","btn-close-round-1 c-flex");
	closeBtn.style.color=prColor3;
	closeBtn.innerText="X";
	sChild.appendChild(closeBtn);


	closeBtn.addEventListener('click',(e)=>{

		document.body.removeChild(e.target.parentElement.parentElement);
		//e.target.parentElement.parentElement.style.display="none";
	})



});

btnLogOut.addEventListener('click',(e)=>{
	ipcRenderer.send('logout',dbConfig);
});



btnUser.addEventListener('click',(e)=>{


	const container = document.createElement("div");
	container.setAttribute("class","center-cont-box-2");
	document.body.appendChild(container);

	const sChild = document.createElement("div");
	sChild.setAttribute("class","center-disp-cont");
	container.appendChild(sChild);


	const sHeadCont = document.createElement("div");
	sHeadCont.setAttribute("class","c-flex");
	sChild.appendChild(sHeadCont);

	const sTitle = document.createElement("div");
	sTitle.setAttribute("class","display-title");
	sTitle.innerText="User Info";

	sHeadCont.appendChild(sTitle);

	const sBodyCont = document.createElement("div");
	sBodyCont.setAttribute("class","center-body-cont-1");
	sChild.appendChild(sBodyCont);

	for(x=0;x<4;x++){
		const child = document.createElement("div");
		child.setAttribute("class","grid-tile-2d");
		child.style.height=`${35/16}rem`;
		
		const classType="input-us";
		const labels = ["User ID","Role","Department","Location"]
		const dbKeys=["userId","role","department","location"];
		const ids=keyToIdArray(classType,dbKeys);
		
		for(y=0;y<2;y++){
				const subChild = document.createElement("div");
				subChild.setAttribute("class",(y==0)?"input-tile-label-1 c-flex-l":"input-tile-desc-1 c-flex");
				subChild.setAttribute("id",(y==1)?ids[x]:"");
				subChild.innerText=(y==0)?labels[x]:userMap[dbKeys[x]];
				child.appendChild(subChild);
		}

		sBodyCont.appendChild(child);
	}




	for(x=0;x<1;x++){
		const child = document.createElement("div");
		child.setAttribute("class","grid-tile-3c");
		child.style.height=`${35/16}rem`;

		const classType="input-us";
		const labels = ["Password"]
		const dbKeys=["password"];
		const ids=keyToIdArray(classType,dbKeys);
	
		
		for(y=0;y<2;y++){
				const subChild = document.createElement((y==0)?"div":"input");
				subChild.setAttribute("class",(y==0)?"input-tile-label-1 c-flex-l":"input-tile-desc-1 c-flex");
				//subChild.style.color="white";
				subChild.style.backgroundColor=(y==1)?"rgb(0, 191, 255)":"";
				subChild.setAttribute("id",(y==1)?ids[x]:"");
				subChild.setAttribute("type",(y==1)?"password":"");
				subChild.innerText=(y==0)?labels[x]:"";
				subChild.setAttribute("value",(y==1)?userMap[dbKeys[x]]:"")
				//subChild.disabled=true;
				child.appendChild(subChild);
		}

		
		const button = document.createElement("button");
		button.setAttribute("class","btn-tile-1 c-flex");
		button.innerText="Change";
		button.setAttribute("id","btn-password-change");
		child.appendChild(button);

		sBodyCont.appendChild(child);

		//document.getElementById("input-us-password").style.backgroundColor = "blue";

		button.addEventListener("click",(e)=>{
			//document.getElementById("input-us-password").disabled = false;
			//document.getElementById("input-us-password").style.backgroundColor = "rgb(0, 191, 255)";

			const newPassword = document.getElementById("input-us-password").value;

			showNotification("Confirmation","Do you wish to change your password?");

			notifBtn.addEventListener("click",changeData);

			//Function to change Users Password									

			function changeData(e){

				const elem = e.target;

				const parent= elem.parentElement.parentElement.parentElement;

	
				const query = `UPDATE user_data SET password='${newPassword}' WHERE userId='${userMap["userId"]}';`

			
					con.query(query,(err,result)=>{

						console.log(result);
						console.log(query);

						showResult(result,err,"change");

						parent.style.display="none";
						notifBtn.removeEventListener("click",changeData);

			})

		}

	})

	const sBottomCont = document.createElement("div");
	sBottomCont.setAttribute("class","center-bottom-cont-1 c-flex");
	sChild.appendChild(sBottomCont);


	const btnClose = document.createElement("div");
	btnClose.setAttribute("class","btn-close-bottom c-flex");
	btnClose.innerText="CLOSE";

	sBottomCont.appendChild(btnClose);


	btnClose.addEventListener("click",(e)=>{

		document.body.removeChild(container);
	})

}

});

//Function which Executes to create the dashboard

ipcRenderer.on('user-input',(event,data)=>{

	const userRole = document.getElementById("user-role");
	const userDept = document.getElementById("user-dept");
	const userLocation = document.getElementById("user-location");

	userMap=data;

	console.log(userMap);

	userRole.innerText=userMap["role"];
	userDept.innerText=userMap["department"];
	userLocation.innerText=userMap["location"].toUpperCase();

	displayDashboard();


});



const dummyImgPath = "../source/img-dummy.jpg";


const dateView = document.getElementById("date");


dateView.innerText = getIndiaDate(new Date());




// const visitorLabels = ["Visitor ID","Name","Company","Designation","Date of Birth","Address","Blood Group","Gender","Contact No","Emg Contact No","Purpose of Visit","Person to Visit","Dept of Person","Contact Person Ph No","In Time","Valid Upto","Out Time","Issued At","Permitted Areas","Pass No","Gadget Type","Gadget Name","Gadget SL No","Vehicle Type","Vehicle Name","Vehicle Reg No"];
// const visitorDbKeys = ["visitorId","visitorName","companyName","designation","dateOfBirth","address","bloodGroup","gender","contactNo","emgContactNo","purposeOfVisit","tebmaContactPerson","tebmaContactDept","tebmaContactPhoneNo","inTime","validUpto","outTime","visitorPassIssuedAt","visitorPassPermittedAreas","visitorPassNo","gadgetType","gadgetDesc","gadgetSlNo","vehicleType","vehicleName","vehicleRegNo" ]
// const visitorInputTypeAdd =  ["text","text","text","text","date","textarea","select","select","number","number","text","select","text","number","dateTime","dateTime","dateTime","select","text","text","text","text","text","text","text","text" ];






function main(action,type){

	console.log(action);

//@1
	if(action=="add-contract-person-input"){
		
		bodyContainer.innerHTML = "";

		bodyContainer.style.height="80%";
		bottomContainer.style.height="10%";

		title.innerText="Add Contract Person"; // title got from displayDashboard Function

		const noOfRows = 15;

		const labels = ["Name","Contractor Name","Person Serial No","Date of Birth","Trade Name","Local Address","Permanent Address","Blood Group","Fathers Name", "Mothers Name","Nominee Name", "Gender","Marital Status", "Identification Marks", "Contact No", "Emg Contact No", "Wage Rate", "Type","Validity","ESI/EPF","ESI No","Insurance No","UAN","Passport Issue Date","Aadhar No"];
		const ids = ["input-cp-personName", "input-cp-contractorName", "input-cp-personSlNo","input-cp-dateOfBirth","input-cp-tradeName","input-cp-localAddress","input-cp-permanentAddress","input-cp-bloodGroup","input-cp-fathersName", "input-cp-mothersName","input-cp-nomineeName", "input-cp-gender","input-cp-maritalStatus", "input-cp-identificationMarks", "input-cp-personContactNo", "input-cp-personEmgContactNo", "input-cp-wageRate", "input-cp-personType","input-cp-dateOfCardExpiry","","input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate","input-cp-aadharNo"];
		const gridRows=["1/2","2/3","3/4","4/5","5/6","6/9","9/12","12/13","13/14","14/15","15/16","1/2","2/3","3/4","4/5","5/6","6/7","7/8","8/9","9/10","10/11","11/12","12/13","13/14","14/15"];
		const gridColumns=["1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3"];
		const inputType = ["text","select","text","date","select","textarea","textarea","select","text", "text","text","select","select", "text", "number", "number", "text","select","date","","text","text","text","date","number"];
		const dbKeys = ["name","person_id","contractor_name","" ];
		const xKeys = ["ESI No","Insurance No","UAN","Passport Issue Date","Aadhar No"];
		const xIds = ["tile-esi","tile-insurance","tile-uan","tile-passportDate","tile-aadharCard"];
		const hiddenKeys = ["Insurance No","Passport Issue Date","Aadhar No"];



		bodyContainer.setAttribute("class","input-list-cont");
		bodyContainer.style.gridTemplateRows=`repeat(${noOfRows},2rem)`;

//Hiding the tiles which have to be hidden
		for(x=0;x<labels.length;x++){

			const container = document.createElement("div");
			container.setAttribute("class","input-tile");
			

			container.style.gridColumn = gridColumns[x];
			container.style.gridRow = gridRows[x];

			if(xKeys.includes(labels[x])){

				const index = xKeys.indexOf(labels[x]);

				container.setAttribute("id",xIds[index]);
				container.style.gridRow = "";
				container.style.display=(hiddenKeys.includes(labels[x]))?"none":"";

			}

//]]



			//container.style.gridRow=(x>=noOfRows)?"1/2":"";

		if(labels[x]=="ESI/EPF"){



			for(y=0;y<2;y++){

				const child = document.createElement("div");
				child.setAttribute("class","input-tile");

				container.appendChild(child);

				for(z=0;z<2;z++){
					const subChild = document.createElement("div");
					subChild.setAttribute("class",(z==0)?"input-tile-label c-flex":"input-tile-desc c-flex input-cp");
					subChild.setAttribute("type",(z==1)?inputType[x]:"");
					subChild.setAttribute("id",(z==1)?ids[x]:"");
					subChild.innerText=(z==0)?(y==0)?"ESI":"EPF":"";



					if(z==1){

						for(q=0;q<2;q++){

							const sub2Child = document.createElement("div");
							sub2Child.setAttribute("class","btn-small");
							sub2Child.setAttribute("id",(y==0)?(q==0)?"esi-yes":"esi-no":(q==0)?"epf-yes":"epf-no");
							sub2Child.classList.add((y==0)?"esi":"epf");
							sub2Child.style.backgroundColor =(q==0)?tickBlue:"";
							sub2Child.innerText=(q==0)?"YES":"NO";

							subChild.appendChild(sub2Child);

							}

					}


					child.appendChild(subChild);
				}


			}



		}else{

			for(y=0;y<2;y++){

				const child = document.createElement((y==0)?"div":(inputType[x]=="select" || inputType[x]=="textarea")?inputType[x]:"input");
				child.setAttribute("class",(y==0)?"input-tile-label c-flex":"input-tile-desc input-cp");
				child.setAttribute("type",(y==1)?inputType[x]:"");
				child.setAttribute("id",(y==1)?ids[x]:"");
				child.innerText=(y==0)?labels[x]:"";

					if(y==1 && inputType[x]=="select"){

						let options=[];

						let dMapArray = [{contractorId:"DEF",
							contractorName:"DEFAULT"}]

						
//Populating the Contractor Name Dropdown
						if(labels[x]=="Contractor Name"){

							options = (appDataMap["contrIdNameData"]!=null)?appDataMap["contrIdNameData"]:dMapArray;

								for(t1=0;t1<options.length;t1++){

												const option = options[t1];

												const subChild = document.createElement("option");
												subChild.setAttribute("value",option["contractorId"]+" - "+option["contractorName"]);
												subChild.innerText = option["contractorId"]+" - "+option["contractorName"];
												subChild.disabled=(option["isHeld"]=="Yes")?true:false;

												child.appendChild(subChild);
							}




						
						}else if(labels[x]=="Blood Group"){

							console.log("blood group");

							options = ["A+","A-","A1+","A1-","B+","B-","AB+","AB-","O+","O-"];

										for(t1=0;t1<options.length;t1++){

											const option = options[t1];

											const subChild = document.createElement("option");
											subChild.setAttribute("value",option);
											subChild.innerText = option;

											child.appendChild(subChild);

										}


						}else if(labels[x]=="Gender"){

							options = ["Male","Female","Transgender"];

										for(t1=0;t1<options.length;t1++){

											const option = options[t1];

											const subChild = document.createElement("option");
											subChild.setAttribute("value",option);
											subChild.innerText = option;

											child.appendChild(subChild);

										}


						}else if(labels[x]=="Type"){

							options = ["Sub Contract Personnel","Temporary Contract","Service Engineer","Owner Rep","Security","Apprentice"];

										for(t1=0;t1<options.length;t1++){

											const option = options[t1];

											const subChild = document.createElement("option");
											subChild.setAttribute("value",option);
											subChild.innerText = option;

											child.appendChild(subChild);

										}


						}else if(labels[x]=="Marital Status"){

							options = ["Married","Single"];

										for(t1=0;t1<options.length;t1++){

											const option = options[t1];

											const subChild = document.createElement("option");
											subChild.setAttribute("value",option);
											subChild.innerText = option;

											child.appendChild(subChild);

										}


						}else if(labels[x]=="Trade Name"){



							options = sqlToSimpleArray(appDataMap["tradeNameData"],"tradeName");//["Site Incharge","Engineer","Supervisor","Marker","Welder","Tack Welder","Fitter","Grinder","Painter","Blaster","Power Tooler","Store Keeper","Rigger","Helper","Others"];

										for(t1=0;t1<options.length;t1++){

											const option = options[t1];

											const subChild = document.createElement("option");
											subChild.setAttribute("value",option);
											subChild.innerText = option;

											child.appendChild(subChild);

										}


						};




				
			}//if(select)

				container.appendChild(child);

			}

		}

			bodyContainer.appendChild(container);

		};

		const contrIdArray = sqlToSimpleArray(appDataMap["contrIdNameData"],"contractorId");

		console.log(appDataMap["contrIdNameData"]);

		assignSlNoByAnalyzingDb(contrIdArray[0],"contractorId","contractor_person_data","cp"); //For First Contractor in the List, hence contrIdArray[0]
		maintainContractorStatus(contrIdArray[0]); //Set the Person Type for First Contractor in the List, hence contrIdArray[0]



			document.getElementById("input-cp-contractorName").addEventListener('change',(e)=>{

				console.log(e.target.value)

				transmitSlNoAndStatus(e,"contractorId","contractor_person_data","cp"); //Automatically input the SlNo of the person based on the entries for that Contractor

		})





//@111
		for(x=0;x<3;x++){


			const containerA = document.createElement("div");
			containerA.setAttribute("class","submission-cont c-flex-col");
			containerA.style.gridColumn = "3/4";
			containerA.style.gridRow = (x==0)?"1/8":(x==1)?"8/13":"13/16";
			//containerA.style.height="400px";

				const head = document.createElement("div");
				head.setAttribute("class","subm-cont-head");
				head.innerText=(x==0)?"FORM SUBMISSIONS":(x==1)?"DOCUMENTS":"OTHER";
				containerA.appendChild(head);


			if(x==0){


				const labels = ["Gate Pass Application","Register of Workmen Employed by Contractor","ESIC Declaration","EPF Declaration","EPF Nomination","Contract Worker Interview","ESI and EPF Exemption Undertaking","Employee Compensation Package"];
				const ids=["sub-gatePassFormSubmitted","sub-workmenBioSubmitted","sub-esiDeclSubmitted","sub-epfDeclSubmitted","sub-epfNomSubmitted","sub-contractIntvwSubmitted","sub-esiEpfUndSubmitted","sub-empCompPackSubmitted"];




				for(y=0;y<labels.length;y++){

					const container = document.createElement("div");
					container.setAttribute("class","checkbox-cp c-flex");
					container.setAttribute("id",ids[y]);


					  for(z=0;z<2;z++){

						const child = document.createElement((z==0)?"input":"div");
						child.setAttribute("class",(z==0)?"":"");
						child.innerText=(z==1)?labels[y]:"";

						if(z==0){
							child.setAttribute("type","checkbox");
						}

						container.appendChild(child);

					 }

					 containerA.appendChild(container);

				}



			}else if(x==1){


				const labels = ["Aadhar Card","Police Verification","Passport (Within 6 Months Issue)", "Medical Certificate","Age Proof Certificate","Savings Bank A/C (First Page)"];
				const ids=["sub-aadharCardSubmitted","sub-polVerSubmitted","sub-passportSubmitted","sub-mediCertSubmitted","sub-ageProofCertSubmitted","sub-savBankSubmitted"];




				for(y=0;y<labels.length;y++){

					const container = document.createElement("div");
					container.setAttribute("class","checkbox-cp c-flex");
					container.setAttribute("id",ids[y]);


					  for(z=0;z<2;z++){

						const child = document.createElement((z==0)?"input":"div");
						child.setAttribute("class",(z==0)?"":"");
						child.innerText=(z==1)?labels[y]:"";

						if(z==0){
							child.setAttribute("type","checkbox");
						}

						container.appendChild(child);

					 }

					 containerA.appendChild(container);

				}




			}else if(x==2){

				const labels = ["HSE Training Attendance"];
				const ids=["att-hseTrainingAttended"];

				for(y=0;y<labels.length;y++){

					const container = document.createElement("div");
					container.setAttribute("class","checkbox-cp c-flex");
					container.setAttribute("id",ids[y]);


					  for(z=0;z<2;z++){

						const child = document.createElement((z==0)?"input":"div");
						child.setAttribute("class",(z==0)?"":"");
						child.innerText=(z==1)?labels[y]:"";

						if(z==0){
							child.setAttribute("type","checkbox");
						}

						container.appendChild(child);

					 }

					 containerA.appendChild(container);

				}





			}



		bodyContainer.appendChild(containerA);
		}


	const btnLabels = ["Save Draft","Add Personnel", "Back"];
	const btnIds2 = ["btn-add-contractor-draft","btn-add-contract-person","btn-back-dashboard"];


	for(w=1;w<btnLabels.length;w++){

		const button = document.createElement("button");
		button.setAttribute("class","btn-std-2");
		button.innerText=btnLabels[w];
		button.setAttribute("id",btnIds2[w]);

		bottomContainer.appendChild(button);

		button.addEventListener('click',(e)=>{

			const idName = e.target.id;

			if(idName=="btn-back-dashboard"){
				displayDashboard();
			}else{
				main(idName.slice(4));
			}

		})
	}

		//const btnApprove = document.getElementById("btn-add-contract-person");




		const epfDecl = document.getElementById("sub-epfDeclSubmitted").children[0];
		const esiDecl = document.getElementById("sub-esiDeclSubmitted").children[0];
		const epfNom = document.getElementById("sub-epfNomSubmitted").children[0];
		const passport = document.getElementById("sub-passportSubmitted").children[0];
		const aadharCard = document.getElementById("sub-aadharCardSubmitted").children[0];
	

		const empCompPack = document.getElementById("sub-empCompPackSubmitted").children[0];
		const esiEpfUnd = document.getElementById("sub-esiEpfUndSubmitted").children[0];


		empCompPack.disabled = true;
		esiEpfUnd.disabled=true;



//@112

		const btnIds = ["esi-yes","esi-no","epf-yes","epf-no"];

			for(a1=0;a1<btnIds.length;a1++){

				document.getElementById(btnIds[a1]).addEventListener('click',(e)=>{

					const btnClass = (e.target.id == "esi-yes" || e.target.id == "esi-no")?"esi":"epf";

					const esiEpfBtns= document.getElementsByClassName(btnClass);

					for(a2=0;a2<esiEpfBtns.length;a2++){

						const btn = esiEpfBtns[a2];

						btn.style.backgroundColor="";

					}


					const idName = e.target.id;

					if(idName=="esi-yes"){

						document.getElementById("tile-insurance").style.display="none";
						document.getElementById("tile-esi").style.display="grid";

						e.target.style.backgroundColor = tickBlue;

						empCompPack.disabled = true;
						esiEpfUnd.disabled = true;
						empCompPack.checked = false;
						esiEpfUnd.checked = false;
						esiDecl.disabled=false;

						document.getElementById("epf-yes").click();

						checkMandatoryInputs()


					}else if(idName=="esi-no"){

						document.getElementById("tile-insurance").style.display="grid";
						document.getElementById("tile-esi").style.display="none";

						e.target.style.backgroundColor = tickBlue

						esiDecl.disabled=true;
						esiDecl.checked=false;
						empCompPack.disabled = false;
						esiEpfUnd.disabled = false;

						document.getElementById("epf-no").click();

						checkMandatoryInputs()


					}else if(idName=="epf-yes"){

						document.getElementById("tile-uan").style.display="grid";
						//document.getElementById("input-esi").style.display="grid";

						e.target.style.backgroundColor = tickBlue

						epfDecl.disabled=false;
						epfNom.disabled=false;
						empCompPack.disabled = true;
						esiEpfUnd.disabled = true;
						empCompPack.checked = false;
						esiEpfUnd.checked = false;

						document.getElementById("esi-yes").click();

						checkMandatoryInputs()


					}else if(idName=="epf-no"){

						document.getElementById("tile-uan").style.display="none";
						//document.getElementById("input-esi").style.display="grid";

						e.target.style.backgroundColor = tickBlue

						epfDecl.disabled=true;
						epfNom.disabled=true;

						epfDecl.checked=false;
						epfNom.checked=false;

						empCompPack.disabled = false;
						esiEpfUnd.disabled = false;

						document.getElementById("esi-no").click();

						checkMandatoryInputs()

					}

				})


			}



//Change happening when passport option is ticked
		passport.addEventListener('change',(e)=>{

			if(e.target.checked){
				
				document.getElementById("tile-passportDate").style.display="grid";

			}else{
				document.getElementById("tile-passportDate").style.display="none";
			}

		});


		aadharCard.addEventListener('change',(e)=>{

			if(e.target.checked){
				
				document.getElementById("tile-aadharCard").style.display="grid";

			}else{
				document.getElementById("tile-aadharCard").style.display="none";
			}

		});




		


		//epfDecl.disabled=true;

		//document.getElementById("sub-polVer").children[0].disabled=true;
		// /document.getElementById("sub-polVer").children[0].checked=true;

		//Camera Interface

		const container = document.createElement("div");
		container.setAttribute("class","camera-cont c-flex-col");
		container.style.gridColumn="4/5";
		container.style.gridRow = "1/12";

		bodyContainer.appendChild(container);



		const labelsA = ["","","","Capture","Capture Again","","Upload"];
		const elements = ["canvas","video","img","div","div","input","div"];
		const photoIds = ["canvas","video","input-cp-photo","btn-capture","btn-capture-reset","img-input","btn-upload"];
		const classes = ["canvas-add","img-area","img-area","btn-std-3","btn-std-3","","btn-std-3"];
		const displays = ["none","block","none","flex","flex","none","flex"];


		for(x=0;x<labelsA.length;x++){

			const child = document.createElement(elements[x]);
			child.setAttribute("class",classes[x]);
			child.setAttribute("id",photoIds[x]);
			child.innerText=(x==3 || x==6)?labelsA[x]:"";
			child.style.display=displays[x];

			if(elements[x]=="canvas" || elements[x]=="video"){
				child.width=(elements[x]=="canvas")?195:600;
				child.height=(elements[x]=="canvas")?250:768;
			}else if(elements[x]=="input"){
				child.setAttribute("type","file");
			} 

			container.appendChild(child);
		}

//@113
		
		 let width=320;
		 let height=0;

		let streaming=false;

		const  video= document.getElementById("video");
		const  canvas = document.getElementById("canvas");
		const  photo = document.getElementById("input-cp-photo");
		//const btnCamRestart = document.getElementById("btn-restart")
		const  btnCapture = document.getElementById("btn-capture");
		const  btnCaptureReset = document.getElementById("btn-capture-reset");
		const btnUpload = document.getElementById("btn-upload");
		const btnAdd = document.getElementById("btn-add");
		let imgInput = document.getElementById("img-input");

	//	btnCapture.setAttribute("onclick","takePicture(this,canvas,photo,video,btnCapture)");

		btnCaptureReset.style.display="none";

		btnCapture.innerText = "CAPTURE";
		btnCaptureReset.innerText = "CAPTURE AGAIN";
		appDataMap["personPhoto"] = "" 

//Connecting the Camera
		navigator.mediaDevices.getUserMedia({video:{"width":400,"height":512},audio:false})
		.then(function(stream){

			video.srcObject = stream;
			video.play();

			appDataMap["camStream"] = stream.getTracks()[0];

		}).catch((error)=>{
			//showNotification("Error",error.message);
			console.log("Error = " + error.message);

		});

//Setting the height of the Canvas ast Start of Video Play, this function runs only at start

		video.addEventListener('canplay',function(e){
			if(!streaming){
				height=video.videoHeight/ (video.videoWidth/width);
				streaming=true;
			}
		},false);


		function cameraReset(){
			video.style.display="block";
			photo.style.display="none";
			photo.src=dummyImgPath;  
		}


		btnCapture.addEventListener('click',function(ev){
				takePicture();

				//checkMandatoryInputs();

				console.log(ev.target);
				ev.target.style.display = "none";
				btnCaptureReset.style.display = "block";
		
				ev.preventDefault();
			},false);


			function takePicture(){

				var context = canvas.getContext('2d');
		
				if(width && height){
					canvas.width=width;
					canvas.height=height;
					context.drawImage(video,0,0,width,height);
		
					
					
				var data = canvas.toDataURL('image/jpeg');
				photo.setAttribute('src',data); //setting the image placeholder in the input view to the image captured
				appDataMap["personPhoto"] = data

				//appDataMap["personPhoto"] = data.split(";base64,").pop(); //holding the image in the upload map. So that it can be inserted to db
			
				// const base64Img= data.split(";base64,").pop();

				// fs.writeFile("image.jpg",base64Img,{encoding:"base64"},function(err){
				// 	console.log(err)
				// });
		
				video.style.display="none";
				photo.style.display="block";

		
					checkMandatoryInputs();
		
				}else{
					clearPhoto();
				}
			}


	
		
			btnCaptureReset.addEventListener('click',function(ev){

				video.style.display="block";
				photo.style.display="none";
				photo.src=dummyImgPath;
				appDataMap["personPhoto"]=""

				//takePicture();
				ev.preventDefault();

				this.style.display = "none";
				btnCapture.style.display = "block";


					checkMandatoryInputs();
			},false);


			btnUpload.addEventListener('click',()=>{
				console.log("clicked button");
				photoUpload();

			});


			imgInput.addEventListener('change',(ev)=>{
				console.log(URL.createObjectURL(ev.target.files[0]));

				console.log(ev.target);



				//const imgUploaded = URL.createObjectURL(ev.target.files[0]);

				const imgUploaded = document.createElement('img');
				imgUploaded.src=URL.createObjectURL(ev.target.files[0]);
				//photo.src=URL.createObjectURL(ev.target.files[0]);


				imgUploaded.addEventListener('load',e=>{

				var context = canvas.getContext('2d');

				console.log(photo.style.height);
				console.log(photo.style.width);

				context.drawImage(imgUploaded,0,0,canvas.width,canvas.height);

				const data = canvas.toDataURL('image/jpeg',1)
				photo.setAttribute('src',data);

				//appDataMap["personPhoto"] = data.split(";base64,").pop();
				appDataMap["personPhoto"] = data
				
				btnCapture.style.display = "none";
				btnCaptureReset.style.display = "flex";

	
					video.style.display="none";
					photo.style.display="block";

					checkMandatoryInputs();

				});


			});


	function photoUpload(){
		imgInput.click();
	};





// 		const labelsA = ["","","","Capture","","Upload"];
// 		const elements = ["canvas","video","img","div","input","div"];
// 		const photoIds = ["canvas","video","input-cp-photo","btn-capture","img-input","btn-upload"];
// 		const classes = ["canvas-add","img-area","img-area","btn-std-3","","btn-std-3"];
// 		const displays = ["none","block","none","flex","none","flex"];


// 		for(x=0;x<labelsA.length;x++){

// 			const child = document.createElement(elements[x]);
// 			child.setAttribute("class",classes[x]);
// 			child.setAttribute("id",photoIds[x]);
// 			child.innerText=(x==3 || x==5)?labelsA[x]:"";
// 			child.style.display=displays[x];

// 			if(elements[x]=="canvas" || elements[x]=="video"){
// 				child.width=(elements[x]=="canvas")?195:600;
// 				child.height=(elements[x]=="canvas")?250:768;
// 			}else if(elements[x]=="input"){
// 				child.setAttribute("type","file");
// 			} 

// 			container.appendChild(child);
// 		}

// //@113
		
// 		 let width=320;
// 		 let height=0;

// 		let streaming=false;

// 		const  video= document.getElementById("video");
// 		const  canvas = document.getElementById("canvas");
// 		const  photo = document.getElementById("input-cp-photo");
// 		//const btnCamRestart = document.getElementById("btn-restart")
// 		const  btnCapture = document.getElementById("btn-capture");
// 		const btnCaptureReset = document.getElementById("btn-capture-reset");
// 		const btnUpload = document.getElementById("btn-upload");
// 		const btnAdd = document.getElementById("btn-add");
// 		let imgInput = document.getElementById("img-input");

// 		btnCapture.setAttribute("onclick","takePicture(this,canvas,photo,video,btnCapture)");

// //Connecting the Camera
// 		navigator.mediaDevices.getUserMedia({video:{"width":400,"height":512},audio:false})
// 		.then(function(stream){

// 			video.srcObject = stream;
// 			video.play();

// 			appDataMap["camStream"] = stream.getTracks()[0];

// 		}).catch((error)=>{
// 			//showNotification("Error",error.message);
// 			console.log("Error = " + error.message);

// 		});

// //Setting the height of the Canvas ast Start of Video Play, this function runs only at start

// 		video.addEventListener('canplay',function(e){
// 			if(!streaming){
// 				height=video.videoHeight/ (video.videoWidth/width);
// 				streaming=true;
// 			}
// 		},false);


// 		btnCapture.addEventListener('click',function(ev){
// 				takePicture();

// 				//checkMandatoryInputs();
		
// 				ev.preventDefault();
// 			},false);


// 			btnUpload.addEventListener('click',()=>{
// 				console.log("clicked button");
// 				photoUpload();
// 			});


// 			imgInput.addEventListener('change',(ev)=>{
// 				console.log(URL.createObjectURL(ev.target.files[0]));

// 				console.log(ev.target);

// 	//Resetting the camera

// 				btnCapture.innerText = "Camera Capture";	

// 				btnCapture.addEventListener('click',function(ev){

// 					video.style.display="block";
// 					photo.style.display="none";
// 					photo.src=dummyImgPath;   //Resetting the image area src

// 					//takePicture();
// 					ev.preventDefault();
// 					btnCapture.innerText = "CAPTURE IMAGE";

// 						btnCapture.addEventListener('click',function(ev){
// 							takePicture();
						
// 							ev.preventDefault();
// 						},false);

// 						checkMandatoryInputs();

// 				},false);

// //]]


// 				//const imgUploaded = URL.createObjectURL(ev.target.files[0]);

// 				const imgUploaded = document.createElement('img');
// 				imgUploaded.src=URL.createObjectURL(ev.target.files[0]);
// 				//photo.src=URL.createObjectURL(ev.target.files[0]);


// 				imgUploaded.addEventListener('load',e=>{

// 				var context = canvas.getContext('2d');

// 				console.log(photo.style.height);
// 				console.log(photo.style.width);

// 				context.drawImage(imgUploaded,0,0,canvas.width,canvas.height);

// 				appDataMap["personPhoto"] = canvas.toDataURL('image/jpeg',1);

// 				//const imgBlob = base64ToBlob(appDataMap["personPhoto"]);

// 				//appDataMap["photoBlob"] = imgBlob;

// 				//const imgUrl = URL.createObjectURL(imgBlob);
// 				//photo.setAttribute('src',imgUrl)

// 				photo.setAttribute('src',canvas.toDataURL('image/jpeg',1));

			
// 					video.style.display="none";
// 					photo.style.display="block";

// 					checkMandatoryInputs();

// 				});


// 			});


// 	function photoUpload(){
// 		imgInput.click();
// 	};




// /*
// 	function clearPhoto(){

// 		var context = canvas.getContext('2d');
// 		context.fillStyle="#AAA";
// 		context.fillRect(0, 0, canvas.width, canvas.height);

// 		var data = canvas.toDataURL('image/jpg',1);
// 		photo.setAttribute('src',data);
// 	}
// */

// 	function takePicture(){

// 		var context = canvas.getContext('2d');

// 		if(width && height){
// 			canvas.width=width;
// 			canvas.height=height;
// 			context.drawImage(video,0,0,width,height);

			
// 		var data = canvas.toDataURL('image/jpeg');
// 		photo.setAttribute('src',data);
// 		appDataMap["personPhoto"] = data;

// 		video.style.display="none";
// 		photo.style.display="block";

// 		btnCapture.innerText = "CAPTURE AGAIN";

// 			btnCapture.addEventListener('click',function(ev){

// 				video.style.display="block";
// 				photo.style.display="none";
// 				photo.src=dummyImgPath;

// 				//takePicture();
// 				ev.preventDefault();
// 				btnCapture.innerText = "CAPTURE IMAGE";

// 					btnCapture.addEventListener('click',function(ev){
// 						takePicture();
// 						//checkMandatoryInputs();
// 						ev.preventDefault();
// 					},false);

// 					checkMandatoryInputs();
// 			},false);


// 			checkMandatoryInputs();

// 		}else{
// 			clearPhoto();
// 		}
// 	}




	//btnApprove.style.display="none";

	//const mandItems = ["input-cp-personName", "input-cp-personId", "input-cp-contractorName", "input-cp-contractorCode", "input-cp-slNo","input-cp-dateOfBirth","input-cp-localAddress","input-cp-permanentAddress","input-cp-dateOfJoining","input-cp-fathersName", "input-cp-mothersName", "input-cp-bloodGroup","input-cp-gender","input-cp-maritalStatus", "input-cp-identificationMark", "input-cp-personContactNo", "input-cp-personEmgContactNo", "input-cp-wageRate", "input-cp-personType","","input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate","input-cp-aadharNo","sub-aadharCard","sub-polVer","sub-passport","sub-mediCert","sub-ageProofCert","sub-savBank","sub-gatePass","sub-workmenBio","sub-esiDecl","sub-epfDecl","sub-epfNom","sub-contractIntvw","sub-esiEpfUnd","sub-empCompPack"]

const mandItems = ["input-cp-personName", "input-cp-contractorName", "input-cp-personSlNo","input-cp-dateOfBirth","input-cp-localAddress","input-cp-permanentAddress","input-cp-fathersName", "input-cp-mothersName", "input-cp-bloodGroup","input-cp-gender","input-cp-maritalStatus", "input-cp-identificationMarks", "input-cp-personContactNo", "input-cp-personEmgContactNo", "input-cp-wageRate", "input-cp-personType","input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate","input-cp-aadharNo","sub-aadharCardSubmitted","sub-polVerSubmitted","sub-passportSubmitted","sub-mediCertSubmitted","sub-ageProofCertSubmitted","sub-savBankSubmitted","sub-gatePassFormSubmitted","sub-workmenBioSubmitted","sub-esiDeclSubmitted","sub-epfDeclSubmitted","sub-epfNomSubmitted","sub-contractIntvwSubmitted","sub-esiEpfUndSubmitted","sub-empCompPackSubmitted","att-hseTrainingAttended"]
	for(q=0;q<mandItems.length;q++){

		document.getElementById(mandItems[q]).addEventListener('change',(e)=>{

			checkMandatoryInputs();

		})
	};

//@114
//Function to check all important inputs are inputted
	function checkMandatoryInputs(){



		const mandInfos = ["input-cp-personName", "input-cp-contractorName","input-cp-personSlNo","input-cp-dateOfBirth","input-cp-localAddress","input-cp-permanentAddress","input-cp-bloodGroup","input-cp-gender","input-cp-maritalStatus", "input-cp-personContactNo", "input-cp-personEmgContactNo", "input-cp-personType","input-cp-aadharNo"];
		//const mandInfos2 = ["input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate"];
		const mandInfosEsiEpf = ["input-cp-esiNo","input-cp-uan"];
		const mandInfosEpf = ["input-cp-uan","input-cp-insuranceNo"];
		const mandInfosExem = ["input-cp-insuranceNo"];
		const mandOthers = ["att-hseTrainingAttended"];

		const mandDocs = ["sub-aadharCardSubmitted","sub-mediCertSubmitted","sub-ageProofCertSubmitted","sub-savBankSubmitted"];
		const mandDocs2 = ["sub-polVerSubmitted","sub-passportSubmitted"];

		const mandSubms = ["sub-gatePassFormSubmitted","sub-workmenBioSubmitted","sub-contractIntvwSubmitted"];
		const mandSubmsEsiEpf = ["sub-esiDeclSubmitted","sub-epfDeclSubmitted","sub-epfNomSubmitted"];
		//const mandEsiSubms = ["sub-gatePass","sub-workmenBio","sub-esiDecl","sub-epfDecl","sub-epfNom","sub-contractIntvw","sub-esiEpfUnd","sub-empCompPack"];
		const mandSubmsEpf = ["sub-epfDeclSubmitted","sub-epfNomSubmitted","sub-esiEpfUndSubmitted","sub-empCompPackSubmitted"];
		const mandSubmsExem = ["sub-esiEpfUndSubmitted","sub-empCompPackSubmitted"];


		const epfStatus = (document.getElementById("epf-no").style.backgroundColor=="")?true:false;
		const esiStatus = (document.getElementById("esi-no").style.backgroundColor=="")?true:false;

		console.log(epfStatus+esiStatus);

		//let mandInfos2 =(epfStatus && esiStatus)?mandInfosEsiEpf:(epfStatus)?mandInfosEpf:mandInfosExem;
		//let mandSubms2 = (epfStatus && esiStatus)?mandSubmsEsiEpf:(epfStatus)?mandSubmsEpf:mandSubmsExem;

		let mandInfos2 =(epfStatus && esiStatus)?mandInfosEsiEpf:mandInfosExem;
		let mandSubms2 = (epfStatus && esiStatus)?mandSubmsEsiEpf:mandSubmsExem;

		console.log(mandInfos2);
		console.log(mandSubms2);

		const nMap={};

		nMap["info"]=0;
		nMap["info2"]=0;

		nMap["subm"]=0;
		nMap["subm2"]=0;

		nMap["doc"]=0;
		nMap["doc2"]=0;

		nMap["other"]=0;

		let countId = 0;
		let countSubm = 0;

		const arrays = [mandInfos,mandInfos2,mandSubms,mandSubms2,mandDocs,mandDocs2,mandOthers];
		const key = ["info","info2","subm","subm2","doc","doc2","other"];

		for(x=0;x<arrays.length;x++){

			const array = arrays[x];

			console.log(nMap[key[x]]);

			//console.log(array);

			for(y=0;y<array.length;y++){
				
				if(x==0 || x==1){

					const info = document.getElementById(array[y]);

					if(info.value!=""){
						console.log(key[x]);
					 	nMap[key[x]]=nMap[key[x]]+1;
					 	console.log(nMap[key[x]]);
					}
				}else{
					console.log(x);

					console.log(array[y]);
					const info = document.getElementById(array[y]).children[0];

					console.log(info);


					if(info.checked==true){
					  nMap[key[x]]++;
					}

				}


				}



			}


	let nCount = 0;
	let sCount=0;



		for(x=0;x<arrays.length;x++){

			const array = arrays[x];

				if(array!=mandDocs2){

					if(nMap[key[x]]>=array.length){
						nCount++;

						console.log(array.length);
						console.log(x);

					}

				}else{

					if(nMap[key[x]]>=1){
						nCount++;
					}

				}

				


			}


		sCount=(photo.style.display=="none")?0:1;


			

		key.forEach((key)=>{

			console.log(key+"="+nMap[key]);

		});



		console.log(nCount+sCount);


		//btnApprove.style.display=(nCount+sCount==arrays.length+1)?"block":"none";

		
	}



//@12
	}else if(action=="add-contract-person"){

		showProgressLoader()

		const mMap={};

		let greenSignal = true;

		const labels = ["Name","Contractor Name","Person Serial No","Date of Birth","Trade Name","Local Address","Permanent Address", "Blood Group","Fathers Name", "Mothers Name","Nominee Name","Gender","Marital Status", "Identification Marks", "Contact No", "Emg Contact No", "Wage Rate", "Type","Validity","ESI/EPF","ESI No","Insurance No","UAN","Passport Issue Date","Aadhar No"];
		const ids = ["input-cp-personName", "input-cp-contractorName", "input-cp-personSlNo","input-cp-dateOfBirth","input-cp-tradeName","input-cp-localAddress","input-cp-permanentAddress", "input-cp-bloodGroup","input-cp-fathersName", "input-cp-mothersName","input-cp-nomineeName","input-cp-gender","input-cp-maritalStatus", "input-cp-identificationMarks", "input-cp-personContactNo", "input-cp-personEmgContactNo", "input-cp-wageRate", "input-cp-personType","input-cp-dateOfCardExpiry","input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate","input-cp-aadharNo"];
		const docIds=["sub-aadharCardSubmitted","sub-polVerSubmitted","sub-passportSubmitted","sub-mediCertSubmitted","sub-ageProofCertSubmitted","sub-savBankSubmitted"];
		const submIds=["sub-gatePassFormSubmitted","sub-workmenBioSubmitted","sub-esiDeclSubmitted","sub-epfDeclSubmitted","sub-epfNomSubmitted","sub-contractIntvwSubmitted","sub-esiEpfUndSubmitted","sub-empCompPackSubmitted"];
		const attIds=["att-hseTrainingAttended"];

		const otherDbKeys=["esiApplicability","epfApplicability"];
		const dateInputKeys = ["dateOfBirth","dateOfCardExpiry","passportDate"]

		//const actualIds = ["input-cp-personName", "input-cp-contractorName", "input-cp-slNo","input-cp-dateOfBirth","input-cp-tradeName","input-cp-localAddress","input-cp-permanentAddress","input-cp-dateOfJoining","input-cp-fathersName", "input-cp-mothersName","input-cp-nomineeName", "input-cp-bloodGroup","input-cp-gender","input-cp-maritalStatus", "input-cp-identificationMark", "input-cp-personContactNo", "input-cp-personEmgContactNo", "input-cp-wageRate", "input-cp-personType","","input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate","input-cp-aadharNo"];
		
		const inputType = ["text","select","text","date","select","textarea","textarea","date","text", "text","text","select","select","select", "text", "number", "number", "text","select","","text","text","text","date","number"];
		const xKeys = ["ESI No","Insurance No","UAN","Passport Issue Date","Aadhar No"];
		const xIds = ["tile-esi","tile-insurance","tile-uan","tile-passportDate","tile-aadharCard"];
		const hiddenKeys = ["Insurance No","Passport Issue Date","Aadhar No"];

		const dbKeys=idToKeyArray(ids);
		const submDbKeys = idToKeyArray2(submIds);
		const docDbKeys = idToKeyArray2(docIds);
		const attDbKeys = idToKeyArray2(attIds);
		//const otherDbKeys = idToKeyArray(otherIds);

		//const impIds=["input-cp-personName", "input-cp-contractorName", "input-cp-slNo","input-cp-dateOfBirth","input-cp-tradeName","input-cp-localAddress","input-cp-permanentAddress","input-cp-dateOfJoining","input-cp-bloodGroup","input-cp-gender","input-cp-maritalStatus","input-cp-personContactNo", "input-cp-personEmgContactNo", "input-cp-personType","","input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate","input-cp-aadharNo"];

		const inputs = bodyContainer.getElementsByClassName("input-cp");
		const checkboxs = bodyContainer.getElementsByClassName("checkbox-cp");
		const missedInputs = [];

//Input Validation
		for(x=0;x<inputs.length;x++){

			const input = inputs[x];	
				const key = input.id.split(/\-/)[2];
				mMap[key] = input.value;
		};

		for(x=0;x<checkboxs.length;x++){
			const checkbox = checkboxs[x];	
				//const key = (checkbox.id=="att-hseTraining")?checkbox.id.split(/\-/)[1]+"Attended":checkbox.id.split(/\-/)[1]+"Submitted";
				const key = checkbox.id.split(/\-/)[1];
				mMap[key] = (checkbox.children[0].checked)?"Yes":"No";
				console.log(key+"-"+mMap[key]);
		};





		mMap["esiApplicability"]=(document.getElementById("esi-no").style.backgroundColor=="")?"Yes":"No";
		mMap["epfApplicability"] = (document.getElementById("epf-no").style.backgroundColor=="")?"Yes":"No";




//]]
		console.log(mMap["contractorName"]);


		mMap["dateOfJoining"] = getFormattedDate(new Date());
		//mMap["dateOfCardExpiry"] = getFormattedDate(getfutureDate(90));  - v. 0.08
		mMap["isHeld"] = "No";
		mMap["personStatus"] = "Active";

		mMap["creationDate"] = getDate();
		mMap["contractorId"] = mMap["contractorName"].split(/\-/)[0].trim();
		mMap["contractorName"] = mMap["contractorName"].split(/\-/)[1].trim();
		mMap["personId"] = mMap["contractorId"]+mMap["personSlNo"];
		mMap["personPhoto"] = appDataMap["personPhoto"];

		const adlDbKeys = ["personId","contractorId","dateOfJoining","personPhoto","isHeld","personStatus"];

		//Setting the date inputs to 0000-00-00 in case they are not inputted, because inputting a ' ' will cause
		//db Error
		dateInputKeys.forEach((keyName)=>{
			
			if(keyName=="dateOfCardExpiry"){
				mMap[keyName] = getDate()
			}else{
				mMap[keyName] = mMap[keyName]==""?null:mMap[keyName];
			}
			
		})

		//const dbKeys1=['personName','contractorName','personSlNo','dateOfBirth','tradeName','localAddress','permanentAddress','dateOfJoining','personId','contractorId']
		
		// const folder1Name = "AppData";
		// const folder2Name = "images"
		// const folder3Name = "contractor-person";


		//const photoFolderName = `./${folder1Name}/${folder2Name}/${folder3Name}/${mMap["personId"]}`
		//mMap["personPhotoPath"] = `${photoFolderName}/photo.jpg`

		// if(!fs.existsSync(`./${folder1Name}`)){
		// 	fs.mkdirSync(`./${folder1Name}`)
		// 	fs.mkdirSync(`./${folder1Name}/${folder2Name}`)
		// 	fs.mkdirSync(`./${folder1Name}/${folder2Name}/${folder3Name}`)
		// }else{
		// 	if(!fs.existsSync(`./${folder1Name}/${folder2Name}`)){
		// 		fs.mkdirSync(`./${folder1Name}/${folder2Name}`)
		// 		fs.mkdirSync(`./${folder1Name}/${folder2Name}/${folder3Name}`)
		// 	}else{
		// 		if(!fs.existsSync(`./${folder1Name}/${folder2Name}/${folder3Name}`)){
		// 			fs.mkdirSync(`./${folder1Name}/${folder2Name}/${folder3Name}`)
		// 		}
		// 	}
		// }



		if(greenSignal){


			con.connect((err)=>{

					con.on('error',(err)=>{
						console.log("Error ="+err.message);
						handleError();
					});


				//const query= `INSERT INTO contractor_data (contractorName,contractorId,department,dateOfIncorporation,dateOfRegistry,registeredAddress,contractorContactNo,contractorEmail,localAddress,localRepName,localRepContactNo,bankAccountNo) VALUES('${mMap["contractorName"]}','${mMap["contractorId"]}','${mMap["department"]}','${mMap["dateOfIncorporation"]}','${mMap["dateOfRegistry"]}','${mMap["registeredAddress"]}','${mMap["contractorContactNo"]}','${mMap["contractorEmail"]}','${mMap["localAddress"]}','${mMap["localRepName"]}','${mMap["localRepContactNo"]}','${mMap["bankAccountNo"]}')`;
				//const query= `INSERT INTO contractor_person_data (${dbKeys},${adlDbKeys},creationDate) 


const query= `INSERT INTO contractor_person_data (${dbKeys},${adlDbKeys},${submDbKeys},${docDbKeys},${attDbKeys},${otherDbKeys},creationDate) 
				VALUES('${mMap["personName"]}',
				'${mMap["contractorName"]}',
				'${mMap["personSlNo"]}',
				'${mMap["dateOfBirth"]}',
				'${mMap["tradeName"]}',
				'${mMap["localAddress"]}',
				'${mMap["permanentAddress"]}',
				'${mMap["bloodGroup"]}',
				'${mMap["fathersName"]}',
				'${mMap["mothersName"]}',
				'${mMap["nomineeName"]}',
				'${mMap["gender"]}',
				'${mMap["maritalStatus"]}',
				'${mMap["identificationMarks"]}',
				'${mMap["personContactNo"]}',
				'${mMap["personEmgContactNo"]}',
				'${mMap["wageRate"]}',
				'${mMap["personType"]}',
				'${mMap["dateOfCardExpiry"]}',
				'${mMap["esiNo"]}',
				'${mMap["insuranceNo"]}',
				'${mMap["uan"]}',
				${mMap["passportDate"]},
				'${mMap["aadharNo"]}',
				'${mMap["personId"]}',
				'${mMap["contractorId"]}',
				'${mMap["dateOfJoining"]}',
				'${mMap["personPhoto"]}',
				'${mMap["isHeld"]}',
				'${mMap["personStatus"]}',
				'${mMap["gatePassFormSubmitted"]}',
				'${mMap["workmenBioSubmitted"]}',
				'${mMap["esiDeclSubmitted"]}',
				'${mMap["epfDeclSubmitted"]}',
				'${mMap["epfNomSubmitted"]}',
				'${mMap["contractIntvwSubmitted"]}',
				'${mMap["esiEpfUndSubmitted"]}',
				'${mMap["empCompPackSubmitted"]}',
				'${mMap["aadharCardSubmitted"]}',
				'${mMap["polVerSubmitted"]}',
				'${mMap["passportSubmitted"]}',
				'${mMap["mediCertSubmitted"]}',
				'${mMap["ageProofCertSubmitted"]}',
				'${mMap["savBankSubmitted"]}',
				'${mMap["hseTrainingAttended"]}',
				'${mMap["esiApplicability"]}',
				'${mMap["epfApplicability"]}',
				'${mMap["creationDate"]}')`;
				//const query= `INSERT INTO contractor_data (contractorName,contractorId,bankAccountNo) VALUES('${mMap["contractorName"]}','${mMap["contractorId"]}','${mMap["bankAccountNo"]}')`;


/*

				const myKeys=['contractorId','personId','gender','creationDate','photo','personName','contractorName','personSlNo','dateOfBirth','tradeName'];	
				const myKeys2=['bloodGroup','localAddress','permanentAddress','maritalStatus','wageRate','insuranceNo','uan','esiNo','fathersName','mothersName','nomineeName','personContactNo','personEmgContactNo']//,'gender','creationDate','photo','personName','contractorName','personSlNo','dateOfBirth','tradeName'];
				const myKeys3=['dateOfJoining','IdentificationMarks','personType','passportDate','aadharNo','dateOfCardExpiry'];

				const query= `INSERT INTO contractor_person_data (${myKeys},${myKeys2},${myKeys3})
				VALUES ('${mMap["contractorId"]}',
				'${mMap["personId"]}',
				'${mMap["gender"]}',
				'${mMap["creationDate"]}',
				'${mMap["personPhoto"]}',
				'${mMap["personName"]}',
				'${mMap["contractorName"]}',
				'${mMap["personSlNo"]}',
				'${mMap["dateOfBirth"]}',
				'${mMap["tradeName"]}',
				'${mMap["bloodGroup"]}',
				'${mMap["localAddress"]}',
				'${mMap["permanentAddress"]}',
				'${mMap["maritalStatus"]}',
				'${mMap["wageRate"]}',
				'${mMap["insuranceNo"]}',
				'${mMap["uan"]}',
				'${mMap["esiNo"]}',
				'${mMap["fathersName"]}',
				'${mMap["mothersName"]}',
				'${mMap["nomineeName"]}',
				'${mMap["personContactNo"]}',
				'${mMap["personEmgContactNo"]}',
				'${mMap["dateOfJoining"]}',
				'${mMap["identificationMarks"]}',
				'${mMap["personType"]}',
				'${mMap["passportDate"]}',
				'${mMap["aadharNo"]}',
				'${mMap["dateOfCardExpiry"]}')`; 
*/

				con.query(query,(err,result)=>{

					console.log(query)

					

					if(err != null){
						showNotification("Error","Contract Personnel Addition Error")
						console.log("errorCode=",err.code)
						console.log("errorMessage=",err.message)
						console.log("errorNo",err.errno)
						console.log("errObj",err)
						hideProgressLoader()
					}else{

							hideProgressLoader()

							showNotification("Success","Contract Personnel Succesfully Added")	
					


						// if(!fs.existsSync(`./${folder1Name}/${folder2Name}/${folder3Name}/${mMap["personId"]}`)){
						// 	fs.mkdirSync(`./${folder1Name}/${folder2Name}/${folder3Name}/${mMap["personId"]}`)
						// }
				
						// fs.writeFile(mMap["personPhotoPath"], appDataMap["personPhoto"],{encoding:"base64"},function(err){
								
						// 				if (err==null){
						// 					showNotification("Success","Contract Personnel Succesfully Added")	
						// 				}else{
						// 					showNotification("Success","Contract Personnel Succesfully Added without Photo")	
						// 				}
									
						// 		});
						console.log("result=",result)
					}

						



				})



			})

		
			


		}




//@13
	}else if(action=="manage-contract-person-a"){



		bodyContainer.innerHTML="";
		bodyContainer.setAttribute("class","select-cont");

		title.innerText="Manage Contractor";

//Initializing and Configuring refMap
		let refMap = {};

		refMap.personId = "";

		const attrTypes=["Contract Personnel"];
		const tableNames = ["contract_person_data"];

		const attrType = "Contractor Personnel";

		refMap[attrType] = {};


		refMap["Contract Personnel"]["labels"] = ["Contractor Code", "Name", "Department", "Date of Establishment","Registered Address","Local Address","Contact No","Email","Local Representative","Local Rep Contact","Bank Account No","Bank Name","IFSC Code","Date of Joining"];
		refMap["Contract Personnel"]["inputType"] = ["text","text","text","date","textarea","textarea","number","email","text","number","text","text","text","date"];
		refMap["Contract Personnel"]["gridRows"]=["1/2","2/3","3/4","4/5","5/8","8/11","1/2","2/3","3/4","4/5","5/6","6/7","7/8","8/9"];
		refMap["Contract Personnel"]["gridCols"]=["1/2","1/2","1/2","1/2","1/2","1/2","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3"];
		refMap["Contract Personnel"]["dbKeys"]=["contractorId","contractorName","department","dateOfIncorporation","registeredAddress","localAddress","contractorContactNo","contractorEmail","localRepName","localRepContactNo","bankAccountNo","bankName","bankIfscCode","dateOfRegistry"];
		refMap["Contract Personnel"]["disDbKeys"]=["contractorId"];
		refMap["Contract Personnel"]["hidDbKeys"]=[];
		refMap["Contract Personnel"]["classType"]="input-ct";

	   	refMap["Contract Personnel"]["labels"] =  ["Name","Contractor Name","Person Serial No","Date of Birth","Trade Name","Local Address","Permanent Address", "Blood Group","Fathers Name", "Mothers Name","Nominee Name","Gender","Marital Status", "Identification Marks", "Contact No", "Emg Contact No", "Wage Rate", "Type","ESI/EPF","ESI No","Insurance No","UAN","Passport Issue Date","Aadhar No"];
		const ids = ["input-cp-personName", "input-cp-contractorName", "input-cp-personSlNo","input-cp-dateOfBirth","input-cp-tradeName","input-cp-localAddress","input-cp-permanentAddress", "input-cp-bloodGroup","input-cp-fathersName", "input-cp-mothersName","input-cp-nomineeName","input-cp-gender","input-cp-maritalStatus", "input-cp-identificationMarks", "input-cp-personContactNo", "input-cp-personEmgContactNo", "input-cp-wageRate", "input-cp-personType","input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate","input-cp-aadharNo"];
		const docIds=["sub-aadharCardSubmitted","sub-polVerSubmitted","sub-passportSubmitted","sub-mediCertSubmitted","sub-ageProofCertSubmitted","sub-savBankSubmitted"];
		const submIds=["sub-gatePassFormSubmitted","sub-workmenBioSubmitted","sub-esiDeclSubmitted","sub-epfDeclSubmitted","sub-epfNomSubmitted","sub-contractIntvwSubmitted","sub-esiEpfUndSubmitted","sub-empCompPackSubmitted"];
		const attIds=["att-hseTrainingAttended"];

		refMap["Contract Personnel"]["inputType"] = ["text","select","text","date","select","textarea","textarea","date","text", "text","text","select","select","select", "text", "number", "number", "text","select","","text","text","text","date","number"];
		const xKeys = ["ESI No","Insurance No","UAN","Passport Issue Date","Aadhar No"];
		const xIds = ["tile-esi","tile-insurance","tile-uan","tile-passportDate","tile-aadharCard"];
		const hiddenKeys = ["Insurance No","Passport Issue Date","Aadhar No"];


        	
//]]

		const colors = [prColor1,prColor3,prColor4];

        		const filterContainer = document.createElement("div");
        		filterContainer.setAttribute("class","filter-cont-b c-block c-flex");

		        		const labels = ["SELECT CONTRACTOR"]

		        		for(w=0;w<labels.length;w++){

			        		const subCont = document.createElement("div");
			        		subCont.setAttribute("class","grid-tile-2c");
			        		//subCont.setAttribute("id",(w==1)?"");

			        		for(x=0;x<2;x++){

			        			const child = document.createElement((x==0)?"div":"select");
			        			child.setAttribute("class",(x==0)?"c-flex filter-tile filter-label":"");
			                    child.style.backgroundColor = colors[x];
			        			//child.setAttribute("id",(x!=0)?)
			        			child.innerText=(x==0)?labels[w]:"";

			        			if(x==1){

			        				child.setAttribute("class",(w==0)?"select-filter filter-tile":"select-filter-sub filter-tile");
			        				child.setAttribute("data-filter_type","main");

			        				const options = appDataMap["contrIdNameData"];

			        				console.log(options);

			        				for(y=0;y<options.length;y++){
			        					const subChild = document.createElement("option");
			        					subChild.setAttribute("value",options[y]["contractorId"]);
			        					subChild.innerText = options[y]["contractorId"]+" - "+options[y]["contractorName"]; 

			        					child.appendChild(subChild);
			        				}
			        			}


			        			subCont.append(child);

			        		}
			        		    filterContainer.appendChild(subCont);
		        	}

        	
        		bodyContainer.appendChild(filterContainer);


        		const rangeContainer = document.createElement("div");
        		rangeContainer.setAttribute("class","c-flex-col range-cont");
        		rangeContainer.style.height="100%";
        		rangeContainer.style.paddingTop="2rem";

        		bodyContainer.appendChild(rangeContainer);


				document.querySelector('.select-filter').addEventListener("change",(e)=>{

					const mainValue = e.target.value;

        			const query = `SELECT * FROM contractor_data WHERE contractorId='${mainValue}';`

        			con.connect((err)=>{

        				con.query(query,(err,result)=>{

        					console.log(result);
        					console.log(query);

        					const classType = refMap[attrType]["classType"];
							const labels = refMap[attrType]["labels"];
							const dbKeys = refMap[attrType]["dbKeys"];
							const disDbKeys = refMap[attrType]["disDbKeys"];
							const hidDbKeys = refMap[attrType]["hidDbKeys"];
							const inputType = refMap[attrType]["inputType"];
							const gridRows=refMap[attrType]["gridRows"];
							const gridColumns=refMap[attrType]["gridCols"];
						
							const ids = keyToIdArray(classType,dbKeys);

							const noOfRows = 10;
							const noOfCols = Math.ceil(labels.length/noOfRows);

							rangeContainer.innerHTML="";

							rangeContainer.setAttribute("class","input-list-cont-"+noOfCols);
							rangeContainer.style.gridTemplateRows=`repeat(${noOfRows},2rem)`;


									for(x=0;x<labels.length;x++){

									
										const container = document.createElement("div");
										container.setAttribute("class","input-tile "+classType);
										container.style.display=(hidDbKeys.includes(dbKeys[x]))?"none":"";

										container.style.gridColumn = gridColumns[x];
										container.style.gridRow = gridRows[x];

										for(y=0;y<2;y++){

											const child = document.createElement((y==0)?"div":(inputType[x]=="select" || inputType[x]=="textarea")?inputType[x]:"input");
											child.setAttribute("class",(y==0)?"input-tile-label c-flex":"input-tile-desc "+classType);
											child.setAttribute("type",(y==1)?inputType[x]:"");
											child.setAttribute("id",(y==1)?classType+"-"+dbKeys[x]:"");
											child.setAttribute("value",(y==1)?result[0][dbKeys[x]]:"");
											child.disabled=(y==1)?true:false;
											//child.setAttribute("id",(y==1)?ids[x]:"");
											child.innerText=(y==0)?labels[x]:(inputType[x]=="select")?result[0][dbKeys[x]]:"";

												if(y==1){

													if(inputType[x]=="select"){

															let options=[];

															options = refMap[attrType]["options"][dbKeys[x]];

																	for(t1=0;t1<options.length;t1++){

																					const option = options[t1];

																					const subChild = document.createElement("option");
																					subChild.setAttribute("value",option);
																					subChild.innerText = option;

																					child.appendChild(subChild);

																	}
															
													
														child.value=result[0][dbKeys[x]];
														

													}else if(inputType[x]=="date" && result[0][dbKeys[x]]!="0000-00-00"){

														child.value=getFormattedDate(result[0][dbKeys[x]]);

													}else if(inputType[x]=="textarea"){
														child.value=result[0][dbKeys[x]];

													}


											}//if(select)

											
												container.appendChild(child);
											

								
										}

										rangeContainer.appendChild(container);

									
						        			
									}//for(labels.length)


									bottomContainer.innerHTML="";

									const btnLabels = ["Edit","Back"];
									const btnIds2 = ["btn-edit","btn-back-dashboard"];


									for(w=0;w<btnLabels.length;w++){

										const button = document.createElement("button");
										button.setAttribute("class","btn-std-2");
										button.innerText=btnLabels[w];
										button.setAttribute("id",btnIds2[w]);

										bottomContainer.appendChild(button);

										button.addEventListener('click',(e)=>{

											const idName = e.target.id;

											if(idName=="btn-back-dashboard"){
												displayDashboard();
											}else{

												console.log("Edit entered")

												//const attrType = e.target.dataset.attribute_type;
												const values = [];

												console.log(classType);
												const items = document.querySelectorAll(`.${classType}`);

												for(z=0;z<items.length;z++){

													const itemKey = items[z].id.split(/\-/)[2];

													if(!disDbKeys.includes(itemKey)){
														items[z].disabled=false;
													}	

												}

												bottomContainer.innerHTML="";

												const btnSave = document.createElement("button");
												btnSave.setAttribute("class","btn-std-2");
												btnSave.setAttribute("data-attribute_type",attrType);
												btnSave.innerText="Save";

												const btnBack = document.createElement("button");
												btnBack.setAttribute("class","btn-std-2");
												btnBack.innerText="Back";

												bottomContainer.appendChild(btnSave);
												bottomContainer.appendChild(btnBack);

												btnSave.addEventListener('click',(e)=>{

														console.log("entry");

														const index = attrTypes.indexOf(attrType);

														const inputMap = {};

															document.querySelectorAll(`.${classType}`).forEach((it,i)=>{

																const dbKey = it.id.split("-")[2];

																inputMap[dbKey] = it.value;

															});

														const tArray=[];

														const length = Object.keys(inputMap).length;

														for(z=0;z<dbKeys.length;z++){

															const key = dbKeys[z];

															if(z!=0){
																tArray.push(`${key}='${inputMap[key]}'`)
															}
														};


														console.log(tArray);
														console.log(index);
														console.log(tableNames)

														const query2 = `UPDATE ${tableNames[index]} 
														SET ${tArray} 
														WHERE ${dbKeys[0]}='${inputMap[dbKeys[0]]}';`

															con.connect((err)=>{

																	con.query(query2,(err,result)=>{

																		console.log(query2);
																		if(result["affectedRows"]>=1){

																			showNotification("Success","Successfully Edited")

																		};
																	})

																})


													})//btnSave.addEvent

												btnBack.addEventListener('click',(e)=>{

													displayDashboard();
												})

												}//if(idName)


										});//btn.addEventListener

		        				}//for(w=0,btnLabels);


						})


					});

				 
		});//select-filter.addEvent

		
		const changeEvent = new Event("change");

		document.querySelector('.select-filter').dispatchEvent(changeEvent);

//@132
	}else if(action=="manage-contract-person"){


		title.innerText = "Manage Contract Personnel";

		bodyContainer.innerHTML="";
		mainContainer.style.backgroundColor="";
		bodyContainer.setAttribute("class","c-flex-col");

		const container = document.createElement("div");
		container.setAttribute("class","id-select-cont-b");

		console.log(appDataMap.contractorId);
		console.log(appDataMap.personId);

			for(y=0;y<2;y++){

				const subCont = document.createElement("div");
				subCont.setAttribute("class","id-select-cont2b c-flex-col");

				subCont.innerText=(y==0)?"SELECT CONTRACTOR":"SELECT CONTRACT PERSONNEL";

			
				const datas = (y==0)?sqlToSimpleMap(appDataMap["contrIdNameData"]):sqlToSimpleMap(appDataMap["contrPersIdNameData"]);

				const identifier=["contractor","person"];

					console.log(datas);
					const child = document.createElement("select");
					child.setAttribute("class",(y==0)?"select-box select-filter":"select-box select-filter-sub");
					child.setAttribute("id",(y==0)?"contractor-selection":"contract-person-selection");
					
					child.style.color="black";

					if(y==0){

						for(z=0;z<datas[identifier[y]+"Id"].length;z++){

							console.log(datas[identifier[y]+"Id"][z])

							const subChild = document.createElement("option");
							subChild.setAttribute("value",datas[identifier[y]+"Id"][z]);
							subChild.innerText=datas[identifier[y]+"Id"][z] + " - "+ datas[identifier[y]+"Name"][z];

							child.appendChild(subChild);
						}

					}

					subCont.appendChild(child);

				
				container.appendChild(subCont);
			}

			bodyContainer.appendChild(container);






		document.querySelector(".select-filter").addEventListener("change",(e)=>{

			const parent = e.target.parentElement.parentElement;
			const id = e.target.value;

			con.connect((err)=>{

				const query=`SELECT personId,personName,isHeld,personStatus FROM contractor_person_data WHERE contractorId='${id}'`;

				con.query(query,(err,result)=>{


					console.log(query);
					console.log(result);

					const datas = sqlToSimpleMap(result);

					const child = document.querySelector('.select-filter-sub');

					child.innerHTML="";


					const options = result;

					console.log(options);

					for(x=0;x<options.length;x++){

						console.log("isHeld is",options[x]["isHeld"])

						const subChild = document.createElement("option");
						subChild.setAttribute("value",options[x]["personId"]);
						subChild.innerText=options[x]["personId"]+" - "+options[x]["personName"];
						subChild.style.backgroundColor=(options[x]["isHeld"]=="Yes")?"red":(options[x]["personStatus"]=="Expired")?colorExp:"";
						subChild.style.color=(options[x]["isHeld"]=="Yes")?"white":(options[x]["personStatus"]=="Expired")?"white":"";
						child.appendChild(subChild);

					}

					console.log(appDataMap.firstVisit);

//Maintaining the same person when returning from View Details Screen
					if(!appDataMap.firstVisit){
							appDataMap.firstVisit=true;
							child.value = appDataMap.personId; //here child is the dropdown of "SELECT PERSONNEL"
					}



				})



			})



		})//select-filter.addEvent

//Maintaining the same contractor when returning from View Details Screen
	if(!appDataMap.firstVisit){
		 document.querySelector(".select-filter").value=appDataMap.contractorId;
	}


				
//Causing a change in the "Select Contractor" Selection so that "Select Contract Personnel" is Created
	const changeEvent = new Event("change");

	document.querySelectorAll(".select-filter").forEach((item)=>{

	   item.dispatchEvent(changeEvent);

	});




		bottomContainer.innerHTML="";


		const btnLabels = ["Go","Back"];
		const btnIds = ["view-contract-personnel","btn-back-dashboard"];
		const functions = ["view-contract-person","display-dashboard"];

		for(y=0;y<btnLabels.length;y++){

		const button = document.createElement("button");
		button.innerText=btnLabels[y];
		button.setAttribute("class","btn-std-2");
		button.setAttribute("data-function_name",functions[y]);
		button.setAttribute("id",btnIds[y]);

		bottomContainer.appendChild(button);

		console.log(bottomContainer.innerHTML);

			document.getElementById(btnIds[y]).addEventListener('click',(e)=>{
					
				const functionName = e.target.dataset.function_name;

				if(e.target.id=="btn-back-dashboard"){
					
					appDataMap.firstVisit=true; //Reverting "First Visit" value when exiting to the Dashboard
					displayDashboard();

				}else{

//Changing the "First Visit" value so that on coming back the same person is maintained
					appDataMap.firstVisit=false;
					appDataMap.contractorId = document.querySelector(".select-filter").value; //Storing the contractor id
					appDataMap.personId = document.querySelector(".select-filter-sub").value; // Stroing the person id

					main(functionName);
				}

			    

			});

		}


		


	
//@14
	}else if(action=="view-contract-person"){



		title.innerText="View Contract Personnel";

		//const personId = document.getElementById("contract-person-selection").value.split(/\-/)[0].trim();

		const personId = appDataMap.personId;


		con.connect((err)=>{

					con.on('error',(err)=>{
						console.log("Error ="+err.message);
						handleError();
					});

					const query = `SELECT * FROM contractor_person_data WHERE personId='${personId}'`;

					con.query(query,(err,result)=>{

						con.on('error',(err)=>{
						console.log("Error ="+err.message);
						handleError();
					});


						appDataMap["curPersonData"]  = {...result[0]};

						mMap={};
						mMap={...appDataMap["curPersonData"]};

						mMap["hInsuranceNo"]=(mMap["esiApplicability"]=="Yes")?mMap["esiNo"]:mMap["insuranceNo"];

						console.log(result);



		bodyContainer.innerHTML="";
		bottomContainer.innerHTML="";

		bodyContainer.style.height="80%";
		bottomContainer.style.height="10%";

		const classType="input-cp"

		const noOfRows = 15;

		const labels = ["Name","Contractor Name","Person ID","Date of Birth","Trade Name","Local Address","Permanent Address","Date of Joining","Fathers Name", "Mothers Name","Nominee Name", "Blood Group","Gender","Marital Status", "Identification Marks", "Contact No", "Emg Contact No", "Wage Rate","Card Expiry Date","Type","ESI/EPF","ESI No","Insurance No","UAN","Passport Issue Date","Aadhar No"];
		const dbKeys = ["personName", "contractorName", "personId","dateOfBirth","tradeName","localAddress","permanentAddress","dateOfJoining","fathersName", "mothersName","nomineeName", "bloodGroup","gender","maritalStatus", "identificationMarks", "personContactNo","personEmgContactNo", "wageRate","dateOfCardExpiry", "personType","","esiNo","insuranceNo","uan","passportDate","aadharNo"];
		const gridRows=["1/2","2/3","3/4","4/5","5/6","6/9","9/12","12/13","13/14","14/15","15/16","1/2","2/3","3/4","4/5","5/6","6/7","7/8","8/9","9/10","10/11","10/11","11/12","12/13","13/14","14/15","15/16"];
		const gridColumns=["1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3"];
		const inputType = ["text","select","text","date","select","textarea","textarea","date","text", "text","text","select","select","select", "text", "number", "number", "text","date","select","","text","text","text","date","number"];
		const xKeys = ["ESI No","Insurance No","UAN","Passport Issue Date","Aadhar No"];
		const xIds = ["tile-esi","tile-insurance","tile-uan","tile-passportDate","tile-aadharCard"];
		const hiddenKeys = ["Insurance No","Passport Issue Date","Aadhar No"];
		const ids=keyToIdArray(classType,dbKeys);


		const blockTags = ["Hold","Expired"];
		const isBlocked = (blockTags.includes(mMap["personStatus"]))?true:false;

		const xLabels = ["ESI No","Insurance No","UAN","Passport Issue Date","Aadhar No"];
		const keyFactors = ["esiApplicability","esiApplicability","epfApplicability","passportSubmitted","aadharCardSubmitted"];





		bodyContainer.setAttribute("class","input-list-cont");
		bodyContainer.style.gridTemplateRows=`repeat(${noOfRows},2rem)`;
		mainContainer.style.backgroundColor=(mMap["isHeld"]=="Yes")?colorBlockBack:(mMap["personStatus"]=="Expired")?colorExpBack:"";

		for(x=0;x<labels.length;x++){

			const container = document.createElement("div");
			container.setAttribute("class","input-tile");
			
			if(labels[x]=="Aadhar No"){

				console.log(gridColumns[x]+" "+gridRows[x]);
			}

			container.style.gridColumn = gridColumns[x];
			container.style.gridRow = gridRows[x];

			if(xLabels.includes(labels[x])){

				const index = xLabels.indexOf(labels[x]);

				container.setAttribute("id",xIds[index]);
				container.style.gridRow = "";
				container.style.display=(mMap[keyFactors[index]]=="Yes")?(labels[x]!="Insurance No")?"grid":"none":"none";
				container.style.display=(labels[x]!="Insurance No")?(mMap[keyFactors[index]]=="Yes")?"grid":"none":(mMap[keyFactors[index]]=="Yes")?"none":"grid";
				container.style.innerText=(labels[x]!="Insurance No")?(mMap[keyFactors[index]]=="Yes")?mMap[dbKeys[x]]:"":(mMap[keyFactors[index]]=="Yes")?mMap[dbKeys[x]]:"";

			}



			//container.style.gridRow=(x>=noOfRows)?"1/2":"";

		if(labels[x]=="ESI/EPF"){




			for(y=0;y<2;y++){

				const child = document.createElement("div");
				child.setAttribute("class","input-tile");

				container.appendChild(child);

				for(z=0;z<2;z++){
					const subChild = document.createElement("div");
					subChild.setAttribute("class",(z==0)?"input-tile-label c-flex":"input-tile-desc c-flex input-cp");
					//subChild.setAttribute("type",(z==1)?inputType[x]:"");
					//subChild.setAttribute("id",(z==1)?ids[x]:"");
					subChild.innerText=(z==0)?(y==0)?"ESI":"EPF":"";



					if(z==1){

						for(q=0;q<2;q++){


							const sub2Child = document.createElement("div");
							sub2Child.setAttribute("class","btn-small");
							//sub2Child.setAttribute("id",(y==0)?(q==0)?"esi-yes":"esi-no":(q==0)?"epf-yes":"epf-no");
							//sub2Child.classList.add((y==0)?"esi":"epf");
							//sub2Child.style.backgroundColor =(y==0)?(appDataMap["esiApplicability"]=="Yes")?
							sub2Child.innerText=(q==0)?"YES":"NO";

							if(y==0){

								sub2Child.style.backgroundColor=(mMap["esiApplicability"]=="Yes")?(q==0)?tickBlue:"":(q==1)?tickBlue:"";
							}else{

								sub2Child.style.backgroundColor=(mMap["epfApplicability"]=="Yes")?(q==0)?tickBlue:"":(q==1)?tickBlue:"";
							}


							subChild.appendChild(sub2Child);

							}

					}


					child.appendChild(subChild);
				}


			}



		}else{

			for(y=0;y<2;y++){

				//const child = document.createElement((y==0)?"div":(inputType[x]=="select")?"select":"input");
				const child = document.createElement("div");
				child.setAttribute("class",(y==0)?"input-tile-label c-flex":"input-tile-desc c-flex");
				//child.setAttribute("type",(y==1)?inputType[x]:"");
				//child.setAttribute("id",(y==1)?ids[x]:"");
				child.innerText=(y==0)?labels[x]:mMap[dbKeys[x]];


				if(y==1){


						if(inputType[x]=="date" && mMap[dbKeys[x]]!="0000-00-00" && mMap[dbKeys[x]]!=null){

							child.innerText=getIndiaDate(mMap[dbKeys[x]]);

							mMap[dbKeys[x]+"India"]=getIndiaDate(mMap[dbKeys[x]]);

						}



				}




						container.appendChild(child);

				}

			}//else of if(labels[x]=="ESI/EPF")

			bodyContainer.appendChild(container);

		};//for(x=0;x<labels.length;x++)



//@111
		for(x=0;x<3;x++){


			const containerA = document.createElement("div");
			containerA.setAttribute("class","submission-cont c-flex-col");
			containerA.style.gridColumn = "3/4";
			containerA.style.gridRow = (x==0)?"1/8":(x==1)?"8/13":"13/16";
			//containerA.style.height="400px";

				const head = document.createElement("div");
				head.setAttribute("class","subm-cont-head");
				head.innerText=(x==0)?"FORM SUBMISSIONS":(x==1)?"DOCUMENTS":"OTHER";
				containerA.appendChild(head);


			if(x==0){


				const labels = ["Gate Pass Application","Register of Workmen Employed by Contractor","ESIC Declaration","EPF Declaration","EPF Nomination","Contract Worker Interview","ESI and EPF Exemption Undertaking","Employee Compensation Package"];
				const ids=["sub-gatePassFormSubmitted","sub-workmenBioSubmitted","sub-esiDeclSubmitted","sub-epfDeclSubmitted","sub-epfNomSubmitted","sub-contractIntvwSubmitted","sub-esiEpfUndSubmitted","sub-empCompPackSubmitted"];
				const submDbKeys = idToKeyArray2(ids);

				for(y=0;y<labels.length;y++){

					const container = document.createElement("div");
					container.setAttribute("class","checkbox-cp c-flex");
					container.setAttribute("id",ids[y]);


					  for(z=0;z<2;z++){

						const child = document.createElement((z==0)?"input":"div");
						child.setAttribute("class",(z==0)?"":"");
						child.innerText=(z==1)?labels[y]:"";

						if(z==0){
							child.setAttribute("type","checkbox");
							child.checked=(mMap[submDbKeys[y]]=="Yes")?true:false;
							child.disabled=true;
						}

						container.appendChild(child);

					 }

					 containerA.appendChild(container);

				}



			}else if(x==1){


				const labels = ["Aadhar Card","Police Verification","Passport (Within 6 Months Issue)", "Medical Certificate","Age Proof Certificate","Savings Bank A/C (First Page)"];
				const ids=["sub-aadharCardSubmitted","sub-polVerSubmitted","sub-passportSubmitted","sub-mediCertSubmitted","sub-ageProofCertSubmitted","sub-savBankSubmitted"];
				const docDbKeys = idToKeyArray2(ids);



				for(y=0;y<labels.length;y++){

					const container = document.createElement("div");
					container.setAttribute("class","checkbox-cp c-flex");
					container.setAttribute("id",ids[y]);


					  for(z=0;z<2;z++){

						const child = document.createElement((z==0)?"input":"div");
						child.setAttribute("class",(z==0)?"":"");
						child.innerText=(z==1)?labels[y]:"";

						if(z==0){
							child.setAttribute("type","checkbox");
							child.checked=(mMap[docDbKeys[y]]=="Yes")?true:false;
							child.disabled=true;
						}

						container.appendChild(child);

					 }

					 containerA.appendChild(container);

				}




			}else if(x==2){

				const labels = ["HSE Training Attendance"];
				const ids=["att-hseTrainingAttended"];
				const attDbKeys = idToKeyArray2(ids);

				for(y=0;y<labels.length;y++){

					const container = document.createElement("div");
					container.setAttribute("class","checkbox-cp c-flex");
					container.setAttribute("id",ids[y]);


					  for(z=0;z<2;z++){

						const child = document.createElement((z==0)?"input":"div");
						child.setAttribute("class",(z==0)?"":"");
						child.innerText=(z==1)?labels[y]:"";

						if(z==0){
							child.setAttribute("type","checkbox");
							child.checked=(mMap[attDbKeys[y]]=="Yes")?true:false;
							child.disabled=true
						}

						container.appendChild(child);

					 }

					 containerA.appendChild(container);

				}





			}//else if(x==2)



			bodyContainer.appendChild(containerA);
		}//for(x=0;x<3)



		//Photo Display

		const container = document.createElement("div");
		container.setAttribute("class","camera-cont c-flex-col");
		container.style.gridColumn="4/5";
		container.style.gridRow = "1/11";

		bodyContainer.appendChild(container);


		const labelsA = ["","Generate ID"];
		const elements = ["img","button"];
		const photoIds = ["input-cp-photo","btn-card"];
		const classes = ["img-area","btn-std-2"];


		for(x=0;x<labelsA.length;x++){

			const child = document.createElement(elements[x]);
			child.setAttribute("class",classes[x]);
			child.setAttribute("id",photoIds[x]);
			child.disabled=(elements[x]=="button")?(mMap["isHeld"]=='Yes' || mMap["personStatus"]=='Expired'):false;
			child.style.backgroundColor=(elements[x]=="button")?((mMap["isHeld"]=='Yes' || mMap["personStatus"]=='Expired')?"grey":""):"";
			child.innerText=(x==1)?labelsA[x]:"";
			child.setAttribute("src",elements[x]=="img" ? mMap["personPhoto"] : "");

			// if(elements[x]=="img"){
			// 	if(mMap["personPhotoPath"]!=""){
			// 		child.setAttribute("src",`../${mMap["personPhotoPath"]}`);
			// 	}else{
			// 		child.setAttribute("src",mMap["personPhoto"]);
			// 	}
			// }
	

			container.appendChild(child);
		};


		const mArray = [];
		mArray.push(mMap);



		const btnCard = document.getElementById("btn-card");

		btnCard.addEventListener('click',function(){



				ipcRenderer.send('open-window',{name:"card",
				data:{datas:mArray,cardType:"A",personType:"contractor"}});

		});


		bottomContainer.innerHTML="";
		//Part of v.0.07
			// const btnLabels = ["Edit Personnel","Delete Personnel","Renew Card","Block","Back"];
			// const btnIds2 = ["btn-edit-contract-person-input","btn-delete-contract-person","btn-renew-contract-person","btn-block-unblock-contract-person","btn-manage-contract-person"];
			// const functionName2 = ["edit-contract-person-input","delete-contract-person","renew-contract-person","block-contract-person","manage-contract-person"];
			// const btnColors = ["",colorWarning,colorRenew,colorBlock,""];+

	//Changes of v.0.08
			const btnLabels = ["Edit Personnel","Delete Personnel","Block","Back"];
			const btnIds2 = ["btn-edit-contract-person-input","btn-delete-contract-person","btn-block-unblock-contract-person","btn-manage-contract-person"];
			const functionName2 = ["edit-contract-person-input","delete-contract-person","block-contract-person","manage-contract-person"];
			const btnColors = ["",colorWarning,colorBlock,""];

			for(w=0;w<btnLabels.length;w++){

				const button = document.createElement("button");
				button.setAttribute("class","btn-std-2");
				button.setAttribute("data-function_name",functionName2[w]);
				button.style.backgroundColor=(btnLabels[w]=="Block" && mMap["isHeld"]=="Yes")?"black":btnColors[w];
				button.innerText=(btnLabels[w]=="Block" && mMap["isHeld"]=="Yes")?"Unblock":btnLabels[w];
				button.setAttribute("id",btnIds2[w]);

				if(btnLabels[w]=="Renew Card" && mMap["personStatus"]=="Active"){

				}else{

					bottomContainer.appendChild(button);
				}


				

				button.addEventListener('click',(e)=>{

					const idName = e.target.id;
					const label=e.target.innerText;

					if(idName=="btn-delete-contract-person"){

							showNotification("Warning","This will delete all the records pertaining to this Contract Personnel, do you want to proceed?");

							notifBtn.addEventListener("click",deleteData);

											
													function deleteData(e){

													const parent = e.target.parentElement.parentElement.parentElement;
													parent.style.display="none";

													const query = `DELETE FROM contractor_person_data WHERE personId='${mMap["personId"]}';`

																con.query(query,(err,result)=>{

																	console.log(result);
																	console.log(query);

																showResult(result,err,"delete");

																setTimeout(()=>{

																	main("manage-contract-person");

																},2000);
															});

														notifBtn.removeEventListener("click",deleteData);

													}




					}else if(idName=="btn-renew-contract-person"){

							showNotification("Confirmation",`The Contractor ID Expiry Date will be extended to 90 days from today i.e. ${getIndiaDate(getfutureDate(90))}, do you want to proceed?`);

							notifBtn.addEventListener("click",renewPersonId);

											
													function renewPersonId(e){

													const parent = e.target.parentElement.parentElement.parentElement;
													parent.style.display="none";

															mMap["dateOfCardExpiry"] = getFormattedDate(getfutureDate(90));
															mMap["dateOfCardRenewal"]= getFormattedDate(new Date());
															mMap["modificationDate"]= getFormattedDate(new Date());

														con.connect((err)=>{

																con.on('error',(err)=>{
																	console.log("Error ="+err.message);
																	handleError();
														});



														const query= `UPDATE contractor_person_data
																		SET
																		dateOfCardExpiry = '${mMap["dateOfCardExpiry"]}',
																		dateOfCardRenewal='${mMap["dateOfCardRenewal"]}',
																		personStatus = 'Active',
																		modificationDate = '${mMap["modificationDate"]}'
																		WHERE personId = '${mMap["personId"]}'`; 


																						con.query(query,(err,result)=>{

																								console.log(query);
																								console.log(result);
																								showResult(result,err,"renew");
																								
																									setTimeout(()=>{

																										main("view-contract-person");

																									},2000);

																						})

																						notifBtn.removeEventListener("click",renewPersonId);

																					})

													}


					}else if(idName=="btn-block-unblock-contract-person"){

						const todaysDateString = getFormattedDate(new Date());


													const parent = e.target.parentElement.parentElement.parentElement;
													//parent.style.display="none";

														con.connect((err)=>{

																con.on('error',(err)=>{
																	console.log("Error ="+err.message);
																	handleError();
																});



														const query=`UPDATE contractor_person_data
																		SET
																		isHeld = '${(label=="Block")?`Yes`:`No`}',
																		modificationDate = '${todaysDateString}'
																		WHERE personId = '${mMap["personId"]}'`; 


																						con.query(query,(err,result)=>{

																								console.log(query);
																								console.log(result);

																								showResult(result,err,label.toLowerCase());
																								
																									setTimeout(()=>{

																										main("view-contract-person");

																									},2000);

																						})

																					

																					})

												


					}else{
						main(e.target.dataset.function_name);
					}

						

				})
			}

			});//con.query

		});//con.connect
//@15
	}else if(action=="edit-contract-person-input"){


		bodyContainer.innerHTML = "";

		let mMap = {};
		mMap = {...appDataMap["curPersonData"]} ;

		console.log(mMap["dateOfBirth"]);


		//bodyContainer.style.height="85%";
		//bottomContainer.style.height="10%";

		title.innerText="Edit Contract Personnel";

		const classType="input-cp"

		const inputClassInitial="cp"

		const noOfRows = 15;

		const labels = ["Name","Contractor Name","Person Serial No","Date of Birth","Trade Name","Local Address","Permanent Address","Blood Group","Fathers Name", "Mothers Name","Nominee Name","Gender","Marital Status", "Identification Marks", "Contact No", "Emg Contact No", "Wage Rate", "Card Expiry Date","Type","Status","ESI/EPF","ESI No","Insurance No","UAN","Passport Issue Date","Aadhar No"];
		const ids = ["input-cp-personName", "input-cp-contractorName", "input-cp-personSlNo","input-cp-dateOfBirth","input-cp-tradeName","input-cp-localAddress","input-cp-permanentAddress","input-cp-bloodGroup","input-cp-fathersName", "input-cp-mothersName","input-cp-nomineeName", "input-cp-gender","input-cp-maritalStatus", "input-cp-identificationMarks", "input-cp-personContactNo", "input-cp-personEmgContactNo", "input-cp-wageRate","input-cp-dateOfCardExpiry", "input-cp-personType","input-cp-status","","input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate","input-cp-aadharNo"];
		const gridRows=["1/2","2/3","3/4","4/5","5/6","6/9","9/12","12/13","13/14","14/15","15/16","1/2","2/3","3/4","4/5","5/6","6/7","7/8","8/9","9/10","10/11","11/12","12/13","13/14"];
		const gridColumns=["1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3"];
		const inputType = ["text","text","text","date","select","textarea","textarea","select","text", "text","text","select","select", "text", "number", "number", "text","date","select","select","","text","text","text","date","number"];
		const infoDbKeys = idToKeyArray(ids);
		const xLabels = ["ESI No","Insurance No","UAN","Passport Issue Date","Aadhar No"];
		const keyFactors = ["esiApplicability","esiApplicability","epfApplicability","passportSubmitted","aadharCardSubmitted"];
		const disabledKeys = ["personId","contractorName","status"];

		const xIds = ["tile-esi","tile-insurance","tile-uan","tile-passportDate","tile-aadharNo"];
		const hiddenLabels = ["Insurance No","Passport Issue Date","Aadhar No"];
		const xDbKeys = idToKeyArray2(xIds);

		console.log(mMap["esiApplicability"]);


		bodyContainer.setAttribute("class","input-list-cont");
		bodyContainer.style.gridTemplateRows=`repeat(${noOfRows},2rem)`;

		for(x=0;x<labels.length;x++){

			const container = document.createElement("div");
			container.setAttribute("class","input-tile");
			
			container.style.gridColumn = gridColumns[x];
			container.style.gridRow = gridRows[x];

			if(xLabels.includes(labels[x])){

				const index = xLabels.indexOf(labels[x]);

				console.log(labels[x]+"="+mMap[keyFactors[index]]);

				container.setAttribute("id",xIds[index]);
				container.style.gridRow = "";
				container.style.gridColumn = "";
				container.style.display=(labels[x]!="Insurance No")?(mMap[keyFactors[index]]=="Yes")?"grid":"none":(mMap[keyFactors[index]]=="Yes")?"none":"grid";
				container.style.innerText=(labels[x]!="Insurance No")?(mMap[keyFactors[index]]=="Yes")?mMap[infoDbKeys[x]]:"":(mMap[keyFactors[index]]=="Yes")?mMap[infoDbKeys[x]]:"";

			};





			//container.style.gridRow=(x>=noOfRows)?"1/2":"";

		if(labels[x]=="ESI/EPF"){


			for(y=0;y<2;y++){

				const child = document.createElement("div");
				child.setAttribute("class","input-tile");

				container.appendChild(child);

				for(z=0;z<2;z++){
					const subChild = document.createElement("div");
					subChild.setAttribute("class",(z==0)?"input-tile-label c-flex":"input-tile-desc c-flex input-cp");
					subChild.setAttribute("type",(z==1)?inputType[x]:"");
					subChild.setAttribute("id",(z==1)?ids[x]:"");
					subChild.innerText=(z==0)?(y==0)?"ESI":"EPF":"";



					if(z==1){

						for(q=0;q<2;q++){

							const sub2Child = document.createElement("div");
							sub2Child.setAttribute("class","btn-small");
							sub2Child.setAttribute("id",(y==0)?(q==0)?"esi-yes":"esi-no":(q==0)?"epf-yes":"epf-no");
							sub2Child.classList.add((y==0)?"esi":"epf");
							//sub2Child.style.backgroundColor =(q==0)?tickBlue:"";
							sub2Child.innerText=(q==0)?"YES":"NO";

							if(y==0){

								sub2Child.style.backgroundColor=(mMap["esiApplicability"]=="Yes")?(q==0)?tickBlue:"":(q==1)?tickBlue:"";
							}else{

								sub2Child.style.backgroundColor=(mMap["epfApplicability"]=="Yes")?(q==0)?tickBlue:"":(q==1)?tickBlue:"";
							}

							subChild.appendChild(sub2Child);

							}

					}


					child.appendChild(subChild);
				}


			}



		}else{

			for(y=0;y<2;y++){
//For non select items 
				const child = document.createElement((y==0)?"div":(inputType[x]=="select"||inputType[x]=="textarea")?inputType[x]:"input");
				child.setAttribute("class",(y==0)?"input-tile-label c-flex":"input-tile-desc input-cp");
				child.setAttribute("type",(y==1)?inputType[x]:"");
				child.setAttribute("id",(y==1)?ids[x]:"");
				child.setAttribute("value",(y==1)?mMap[infoDbKeys[x]]:"");
				child.innerText=(y==0)?labels[x]:(inputType[x]=="textarea")?mMap[infoDbKeys[x]]:"";



				if(y==1){

					if(inputType[x]=="date" && mMap[infoDbKeys[x]]!="0000-00-00" && mMap[infoDbKeys[x]]!=null){

						child.value=getFormattedDate(mMap[infoDbKeys[x]]);

					}else if(labels[x]=="Contractor Name"){
						child.value = mMap["contractorId"]+" - "+mMap["contractorName"];

					}

					child.disabled=(disabledKeys.includes(infoDbKeys[x]))?true:false;

				}





//]]

//Extra assignment for select items
					if(y==1 && inputType[x]=="select"){



						if(labels[x]=="Contractor Name"){
/*

								for(t1=0;t1<options.length;t1++){

												const option = options[t1];

												const subChild = document.createElement("option");
												subChild.setAttribute("value",mMap["contractorId"]+" - "+mMap["contractorName"]);
												subChild.innerText = mMap["contractorId"]+" - "+mMap["contractorName"];

												child.disabled=true;

												child.appendChild(subChild);



							}


							*/

						
						}else if(labels[x]=="Blood Group"){

							console.log("blood group");

							options = ["A+","A-","A1+","A1-","B+","B-","AB+","AB-","O+","O-"];


						}else if(labels[x]=="Gender"){

							options = ["Male","Female","Other"];


						}else if(labels[x]=="Type"){

							options = personnelTypes


						}else if(labels[x]=="Marital Status"){

							options = ["Married","Single"];


						}else if(labels[x]=="Trade Name"){



									options = sqlToSimpleArray(appDataMap["tradeNameData"],"tradeName");//["Site Incharge","Engineer","Supervisor","Marker","Welder","Tack Welder","Fitter","Grinder","Painter","Blaster","Power Tooler","Store Keeper","Rigger","Helper","Others"];

										for(t1=0;t1<options.length;t1++){

											const option = options[t1];

											const subChild = document.createElement("option");
											subChild.setAttribute("value",option);
											subChild.innerText = option;

											//child.appendChild(subChild);   Disabled this (no logic wanted to save time) line as I was encountering double population of options for the selection box

										}


						}else if(labels[x]=="Status"){

							options = ["Active","Expired"];

						};


										for(t1=0;t1<options.length;t1++){

											const option = options[t1];

											const subChild = document.createElement("option");
											subChild.setAttribute("value",option);
											subChild.innerText = option;
											subChild.disabled = (mMap["personType"]=="Temporary Contract" && option!="Temporary Contract")?true:(mMap["personType"]!="Temporary Contract" && option=="Temporary Contract")?true:false;
											//subChild.style.backgroundColor = (mMap["personType"]=="Temporary Contract" && option!="Temporary Contract")?true:(mMap["personType"]!="Temporary Contract" && option=="Temporary Contract")?true:false;

											child.appendChild(subChild);

										}


						console.log(ids[x]);

						child.value=(labels[x]=="Contractor Name")?mMap["contractorId"]+" - "+mMap["contractorName"]:mMap[infoDbKeys[x]];
						


				
				}//if(select)

					container.appendChild(child);




			}

		}

			bodyContainer.appendChild(container);

		};



//@111
		for(x=0;x<3;x++){


			const containerA = document.createElement("div");
			containerA.setAttribute("class","submission-cont c-flex-col");
			containerA.style.gridColumn = "3/4";
			containerA.style.gridRow = (x==0)?"1/8":(x==1)?"8/13":"13/16";
			//containerA.style.height="400px";

				const head = document.createElement("div");
				head.setAttribute("class","subm-cont-head");
				head.innerText=(x==0)?"FORM SUBMISSIONS":(x==1)?"DOCUMENTS":"OTHER";
				containerA.appendChild(head);


			if(x==0){


				const labels = ["Gate Pass Application","Register of Workmen Employed by Contractor","ESIC Declaration","EPF Declaration","EPF Nomination","Contract Worker Interview","ESI and EPF Exemption Undertaking","Employee Compensation Package"];
				const ids=["sub-gatePassFormSubmitted","sub-workmenBioSubmitted","sub-esiDeclSubmitted","sub-epfDeclSubmitted","sub-epfNomSubmitted","sub-contractIntvwSubmitted","sub-esiEpfUndSubmitted","sub-empCompPackSubmitted"];

				const submDbKeys = idToKeyArray2(ids);




				for(y=0;y<labels.length;y++){

					const container = document.createElement("div");
					container.setAttribute("class","checkbox-cp c-flex");
					container.setAttribute("id",ids[y]);


					  for(z=0;z<2;z++){

						const child = document.createElement((z==0)?"input":"div");
						child.setAttribute("class",(z==0)?"":"");
						child.innerText=(z==1)?labels[y]:"";

						if(z==0){
							child.setAttribute("type","checkbox");
							child.checked=(mMap[submDbKeys[y]]=="Yes")?true:false;
							
						}

						container.appendChild(child);

					 }

					 containerA.appendChild(container);

				}



			}else if(x==1){


				const labels = ["Aadhar Card","Police Verification","Passport (Within 6 Months Issue)", "Medical Certificate","Age Proof Certificate","Savings Bank A/C (First Page)"];
				const ids=["sub-aadharCardSubmitted","sub-polVerSubmitted","sub-passportSubmitted","sub-mediCertSubmitted","sub-ageProofCertSubmitted","sub-savBankSubmitted"];
				const docDbKeys = idToKeyArray2(ids);



				for(y=0;y<labels.length;y++){

					const container = document.createElement("div");
					container.setAttribute("class","checkbox-cp c-flex");
					container.setAttribute("id",ids[y]);


					  for(z=0;z<2;z++){

						const child = document.createElement((z==0)?"input":"div");
						child.setAttribute("class",(z==0)?"":"");
						child.innerText=(z==1)?labels[y]:"";

						if(z==0){
							child.setAttribute("type","checkbox");
							child.checked=(mMap[docDbKeys[y]]=="Yes")?true:false;
						}

						container.appendChild(child);

					 }

					 containerA.appendChild(container);

				}




			}else if(x==2){

				const labels = ["HSE Training Attendance"];
				const ids=["att-hseTrainingAttended"];
				const attDbKeys = idToKeyArray2(ids);

				for(y=0;y<labels.length;y++){

					const container = document.createElement("div");
					container.setAttribute("class","checkbox-cp c-flex");
					container.setAttribute("id",ids[y]);


					  for(z=0;z<2;z++){

						const child = document.createElement((z==0)?"input":"div");
						child.setAttribute("class",(z==0)?"":"");
						child.innerText=(z==1)?labels[y]:"";

						if(z==0){
							child.setAttribute("type","checkbox");
							child.checked=(mMap[attDbKeys[y]]=="Yes")?true:false;
						}

						container.appendChild(child);

					 }

					 containerA.appendChild(container);

				}





			}



		bodyContainer.appendChild(containerA);
		}

	bottomContainer.innerHTML="";

    const btnLabels = ["Save Data", "Back"];
	//const btnIds2 = ["btn-edit-contract-person","btn-back-manage"];
	const btnIds2 = ["btn-edit-contract-person","btn-view-contract-person"];

	for(w=0;w<btnLabels.length;w++){

		const button = document.createElement("button");
		button.setAttribute("class","btn-std-2");
		button.innerText=btnLabels[w];
		button.setAttribute("id",btnIds2[w]);

		bottomContainer.appendChild(button);

		button.addEventListener('click',(e)=>{

			const idName = e.target.id;

			main(idName.slice(4));
/*
			if(idName=="btn-back-manage"){
				main("view-contract-person")
			}else{
				main(idName.slice(4));
			}
*/
		})
	}

		//const btnApprove = document.getElementById("btn-edit-contract-person");




		const epfDecl = document.getElementById("sub-epfDeclSubmitted").children[0];
		const esiDecl = document.getElementById("sub-esiDeclSubmitted").children[0];
		const epfNom = document.getElementById("sub-epfNomSubmitted").children[0];
		const empCompPack = document.getElementById("sub-empCompPackSubmitted").children[0];
		const esiEpfUnd = document.getElementById("sub-esiEpfUndSubmitted").children[0];

		const passport = document.getElementById("sub-passportSubmitted").children[0];
		const aadharCard = document.getElementById("sub-aadharCardSubmitted").children[0];



		if(mMap["esiApplicability"]=="Yes" || mMap["epfApplicability"]=="Yes"){

			empCompPack.disabled=true;
			esiEpfUnd.disabled=true;

			empCompPack.checked=false;
			esiEpfUnd.checked=false;

		}else{

			epfDecl.disabled = true;
			esiDecl.disabled = true;
			epfNom.disabled = true;

			epfDecl.checked = false;
			esiDecl.checked = false;
			epfNom.checked = false;


		}





//@112

		const btnIds = ["esi-yes","esi-no","epf-yes","epf-no"];

			for(a1=0;a1<btnIds.length;a1++){

				document.getElementById(btnIds[a1]).addEventListener('click',(e)=>{

					const btnClass = (e.target.id == "esi-yes" || e.target.id == "esi-no")?"esi":"epf";

					const esiEpfBtns= document.getElementsByClassName(btnClass);

					for(a2=0;a2<esiEpfBtns.length;a2++){

						const btn = esiEpfBtns[a2];

						btn.style.backgroundColor="";

					}


					const idName = e.target.id;

					if(idName=="esi-yes"){

						document.getElementById("tile-insurance").style.display="none";
						document.getElementById("tile-esi").style.display="grid";

						e.target.style.backgroundColor = tickBlue;

						empCompPack.disabled = true;
						esiEpfUnd.disabled = true;
						empCompPack.checked = false;
						esiEpfUnd.checked = false;
						esiDecl.disabled=false;

						document.getElementById("epf-yes").click();

						checkMandatoryInputs()


					}else if(idName=="esi-no"){

						document.getElementById("tile-insurance").style.display="grid";
						document.getElementById("tile-esi").style.display="none";

						e.target.style.backgroundColor = tickBlue

						esiDecl.disabled=true;
						esiDecl.checked=false;
						empCompPack.disabled = false;
						esiEpfUnd.disabled = false;

						document.getElementById("epf-no").click();

						checkMandatoryInputs()


					}else if(idName=="epf-yes"){

						document.getElementById("tile-uan").style.display="grid";
						//document.getElementById("input-esi").style.display="grid";

						e.target.style.backgroundColor = tickBlue

						epfDecl.disabled=false;
						epfNom.disabled=false;
						empCompPack.disabled = true;
						esiEpfUnd.disabled = true;
						empCompPack.checked = false;
						esiEpfUnd.checked = false;

						document.getElementById("esi-yes").click();

						checkMandatoryInputs()


					}else if(idName=="epf-no"){

						document.getElementById("tile-uan").style.display="none";
						//document.getElementById("input-esi").style.display="grid";

						e.target.style.backgroundColor = tickBlue

						epfDecl.disabled=true;
						epfNom.disabled=true;

						epfDecl.checked=false;
						epfNom.checked=false;

						empCompPack.disabled = false;
						esiEpfUnd.disabled = false;

						document.getElementById("esi-no").click();

						checkMandatoryInputs()

					}

				})


			}




		passport.addEventListener('change',(e)=>{

			if(e.target.checked){
				
				document.getElementById("tile-passportDate").style.display="grid";

			}else{
				document.getElementById("tile-passportDate").style.display="none";
			}

		});


		aadharCard.addEventListener('change',(e)=>{

			if(e.target.checked){
				
				document.getElementById("tile-aadharCard").style.display="grid";

			}else{
				document.getElementById("tile-aadharCard").style.display="none";
			}

		});




		


		//epfDecl.disabled=true;

		//document.getElementById("sub-polVer").children[0].disabled=true;
		// /document.getElementById("sub-polVer").children[0].checked=true;

		//Camera Interface

		const container = document.createElement("div");
		container.setAttribute("class","camera-cont c-flex-col");
		container.style.gridColumn="4/5";
		container.style.gridRow = "1/13";

		bodyContainer.appendChild(container);


		const labelsA = ["","","","Capture","Capture Again","","Upload"];
		const elements = ["canvas","video","img","div","div","input","div"];
		const photoIds = ["canvas","video","input-cp-photo","btn-capture","btn-capture-reset","img-input","btn-upload"];
		const classes = ["canvas-add","img-area","img-area","btn-std-3","btn-std-3","","btn-std-3"];
		const displays = ["none","block","none","flex","flex","none","flex"];


		for(x=0;x<labelsA.length;x++){

			const child = document.createElement(elements[x]);
			child.setAttribute("class",classes[x]);
			child.setAttribute("id",photoIds[x]);
			child.innerText=(x==3 || x==6)?labelsA[x]:"";
			child.style.display=displays[x];

			if(elements[x]=="canvas" || elements[x]=="video"){
				child.width=(elements[x]=="canvas")?250:600;
				child.height=(elements[x]=="canvas")?320:768;
			}else if(elements[x]=="input"){
				child.setAttribute("type","file");
			} 

			container.appendChild(child);
		}

//@113
		
		let width=320;
		let height=0;

		let streaming=false;

		const video= document.getElementById("video");
		const canvas = document.getElementById("canvas");
		const photo = document.getElementById(`input-${inputClassInitial}-photo`);
		const btnCapture = document.getElementById("btn-capture");
		const btnCaptureReset = document.getElementById("btn-capture-reset");
		const btnUpload = document.getElementById("btn-upload");
		const btnAdd = document.getElementById("btn-add");
		let imgInput = document.getElementById("img-input");


		video.style.display="none";
		photo.style.display="block";
		photo.src = mMap["personPhoto"];
		appDataMap["personPhoto"] = mMap["personPhoto"];
		// photo.src = mMap["personPhotoPath"]!=""?`../${mMap["personPhotoPath"]}`:mMap["personPhoto"];
		// appDataMap["personPhotoPath"] = mMap["personPhotoPath"];

		// appDataMap["newPhoto"] = mMap["personPhotoPath"]!=""?fs.readFileSync(`${mMap["personPhotoPath"]}`,"base64"):null;
		 
		// console.log(appDataMap["newPhoto"]);

		btnCapture.style.display="none";

		btnCapture.innerText = "CAPTURE";
		btnCaptureReset.innerText = "CAPTURE AGAIN";

//Connecting the Camera
		navigator.mediaDevices.getUserMedia({video:{"width":400,"height":512},audio:false})
		.then(function(stream){

			video.srcObject = stream;
			video.play();

			appDataMap["camStream"]=stream.getTracks()[0];

		}).catch((error)=>{
			//showNotification("Error",error.message);
			console.log("Error = " + error.message);

		});

//Setting the height of the Canvas ast Start of Video Play, this function runs only at start

		video.addEventListener('canplay',function(e){
			if(!streaming){
				height=video.videoHeight/ (video.videoWidth/width);
				streaming=true;
			}
		},false);


		btnCapture.addEventListener('click',function(ev){
			takePicture();

			//checkMandatoryInputs();

			console.log(ev.target);
			ev.target.style.display = "none";
			btnCaptureReset.style.display = "block";
	
			ev.preventDefault();
		},false);


		function takePicture(){

			var context = canvas.getContext('2d');
	
			if(width && height){
				canvas.width=width;
				canvas.height=height;
				context.drawImage(video,0,0,width,height);
	
				
				
			var data = canvas.toDataURL('image/jpeg');
			photo.setAttribute('src',data); //setting the image placeholder in the input view to the image captured
			appDataMap["personPhoto"] = data;
			//appDataMap["newPhoto"] = data.split(";base64,").pop(); //holding the image in the upload map. So that it can be inserted to db


			// const base64Img= data.split(";base64,").pop();

			// fs.writeFile("image.jpg",base64Img,{encoding:"base64"},function(err){
			// 	console.log(err)
			// });
	
			video.style.display="none";
			photo.style.display="block";
	

	
	
				checkMandatoryInputs();
	
			}else{
				clearPhoto();
			}
		}



	
		btnCaptureReset.addEventListener('click',function(ev){

			video.style.display="block";
			photo.style.display="none";
			photo.src=dummyImgPath;

			appDataMap["newPhoto"]=null;

			//takePicture();
			ev.preventDefault();

			this.style.display = "none";
			btnCapture.style.display = "block";


				checkMandatoryInputs();
		},false);


		btnUpload.addEventListener('click',()=>{
			console.log("clicked button");
			photoUpload();
		});


		imgInput.addEventListener('change',(ev)=>{
			console.log(URL.createObjectURL(ev.target.files[0]));

			console.log(ev.target);


			const imgUploaded = document.createElement('img');
			imgUploaded.src=URL.createObjectURL(ev.target.files[0]);
			//photo.src=URL.createObjectURL(ev.target.files[0]);


			imgUploaded.addEventListener('load',e=>{

			var context = canvas.getContext('2d');

			console.log(photo.style.height);
			console.log(photo.style.width);

			context.drawImage(imgUploaded,0,0,canvas.width,canvas.height);

			const data = canvas.toDataURL('image/jpeg',1);

			photo.setAttribute('src',data);
			appDataMap["personPhoto"] = data;

			//appDataMap["newPhoto"] = data.split(";base64,").pop();
			//console.log(appDataMap["newPhoto"])

		
				video.style.display="none";
				photo.style.display="block";

				checkMandatoryInputs();

			});


		});



	function photoUpload(){
		imgInput.click();
	};




	//btnApprove.style.display="none";

	//const mandItems = ["input-cp-personName", "input-cp-personId", "input-cp-contractorName", "input-cp-contractorCode", "input-cp-slNo","input-cp-dateOfBirth","input-cp-localAddress","input-cp-permanentAddress","input-cp-dateOfJoining","input-cp-fathersName", "input-cp-mothersName", "input-cp-bloodGroup","input-cp-gender","input-cp-maritalStatus", "input-cp-identificationMark", "input-cp-personContactNo", "input-cp-personEmgContactNo", "input-cp-wageRate", "input-cp-personType","","input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate","input-cp-aadharNo","sub-aadharCard","sub-polVer","sub-passport","sub-mediCert","sub-ageProofCert","sub-savBank","sub-gatePass","sub-workmenBio","sub-esiDecl","sub-epfDecl","sub-epfNom","sub-contractIntvw","sub-esiEpfUnd","sub-empCompPack"]

//const mandItems = ["input-cp-personName", "input-cp-contractorName", "input-cp-personSlNo","input-cp-dateOfBirth","input-cp-localAddress","input-cp-permanentAddress","input-cp-fathersName", "input-cp-mothersName", "input-cp-bloodGroup","input-cp-gender","input-cp-maritalStatus", "input-cp-identificationMarks", "input-cp-personContactNo", "input-cp-personEmgContactNo", "input-cp-wageRate", "input-cp-personType","input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate","input-cp-aadharNo","sub-aadharCardSubmitted","sub-polVerSubmitted","sub-passportSubmitted","sub-mediCertSubmitted","sub-ageProofCertSubmitted","sub-savBankSubmitted","sub-gatePassFormSubmitted","sub-workmenBioSubmitted","sub-esiDeclSubmitted","sub-epfDeclSubmitted","sub-epfNomSubmitted","sub-contractIntvwSubmitted","sub-esiEpfUndSubmitted","sub-empCompPackSubmitted","att-hseTrainingAttended"];
const mandItems = ["input-cp-personName","input-cp-dateOfBirth","input-cp-tradeName","input-cp-localAddress","input-cp-permanentAddress","input-cp-fathersName", "input-cp-mothersName", "input-cp-bloodGroup","input-cp-gender","input-cp-maritalStatus", "input-cp-identificationMarks", "input-cp-personContactNo", "input-cp-personEmgContactNo", "input-cp-wageRate", "input-cp-personType","input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate","input-cp-aadharNo","sub-aadharCardSubmitted","sub-polVerSubmitted","sub-passportSubmitted","sub-mediCertSubmitted","sub-ageProofCertSubmitted","sub-savBankSubmitted","sub-gatePassFormSubmitted","sub-workmenBioSubmitted","sub-esiDeclSubmitted","sub-epfDeclSubmitted","sub-epfNomSubmitted","sub-contractIntvwSubmitted","sub-esiEpfUndSubmitted","sub-empCompPackSubmitted","att-hseTrainingAttended"];
	for(q=0;q<mandItems.length;q++){

		document.getElementById(mandItems[q]).addEventListener('change',(e)=>{

			checkMandatoryInputs();

		})
	};

//@114

	function checkMandatoryInputs(){

		//const mandIds = ["input-cp-personName", "input-cp-personId", "input-cp-contractorName", "input-cp-contractorCode", "input-cp-slNo","input-cp-dateOfBirth","input-cp-localAddress","input-cp-permanentAddress","input-cp-dateOfJoining","input-cp-fathersName", "input-cp-mothersName", "input-cp-bloodGroup","input-cp-gender","input-cp-maritalStatus", "input-cp-identificationMark", "input-cp-personContactNo", "input-cp-personEmgContactNo", "input-cp-wageRate", "input-cp-personType","","input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate","input-cp-aadharNo"];
		//const mandSubms = ["sub-aadharCard","sub-polVer","sub-passport","sub-mediCert","sub-ageProofCert","sub-savBank","sub-gatePass","sub-workmenBio","sub-esiDecl","sub-epfDecl","sub-epfNom","sub-contractIntvw","sub-esiEpfUnd","sub-empCompPack"];

		const mandInfos = ["input-cp-personName", "input-cp-contractorName","input-cp-dateOfBirth","input-cp-tradeName","input-cp-localAddress","input-cp-permanentAddress","input-cp-bloodGroup","input-cp-gender","input-cp-maritalStatus", "input-cp-personContactNo", "input-cp-personEmgContactNo", "input-cp-personType","input-cp-aadharNo"];
		//const mandInfos2 = ["input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate"];
		const mandInfosEsiEpf = ["input-cp-esiNo","input-cp-uan"];
		const mandInfosEpf = ["input-cp-uan","input-cp-insuranceNo"];
		const mandInfosExem = ["input-cp-insuranceNo"];
		const mandOthers = ["att-hseTrainingAttended"];

		const mandDocs = ["sub-aadharCardSubmitted","sub-mediCertSubmitted","sub-ageProofCertSubmitted","sub-savBankSubmitted"];
		const mandDocs2 = ["sub-polVerSubmitted","sub-passportSubmitted"];

		const mandSubms = ["sub-gatePassFormSubmitted","sub-workmenBioSubmitted","sub-contractIntvwSubmitted"];
		const mandSubmsEsiEpf = ["sub-esiDeclSubmitted","sub-epfDeclSubmitted","sub-epfNomSubmitted"];
		//const mandEsiSubms = ["sub-gatePass","sub-workmenBio","sub-esiDecl","sub-epfDecl","sub-epfNom","sub-contractIntvw","sub-esiEpfUnd","sub-empCompPack"];
		const mandSubmsEpf = ["sub-epfDeclSubmitted","sub-epfNomSubmitted","sub-esiEpfUndSubmitted","sub-empCompPackSubmitted"];
		const mandSubmsExem = ["sub-epfNomSubmitted","sub-esiEpfUndSubmitted","sub-empCompPackSubmitted"];


		const epfStatus = (document.getElementById("epf-no").style.backgroundColor=="")?true:false;
		const esiStatus = (document.getElementById("esi-no").style.backgroundColor=="")?true:false;

		console.log(epfStatus+esiStatus);

		let mandInfos2 =(epfStatus && esiStatus)?mandInfosEsiEpf:(epfStatus)?mandInfosEpf:mandInfosExem;
		let mandSubms2 = (epfStatus && esiStatus)?mandSubmsEsiEpf:(epfStatus)?mandSubmsEpf:mandSubmsExem;

		console.log(mandInfos2);
		console.log(mandSubms2);

		const nMap={};

		nMap["info"]=0;
		nMap["info2"]=0;

		nMap["subm"]=0;
		nMap["subm2"]=0;

		nMap["doc"]=0;
		nMap["doc2"]=0;

		nMap["other"]=0;

		let countId = 0;
		let countSubm = 0;

		const arrays = [mandInfos,mandInfos2,mandSubms,mandSubms2,mandDocs,mandDocs2,mandOthers];
		const key = ["info","info2","subm","subm2","doc","doc2","other"];

		for(x=0;x<arrays.length;x++){

			const array = arrays[x];

			console.log(nMap[key[x]]);

			//console.log(array);

			for(y=0;y<array.length;y++){
				
				if(x==0 || x==1){

					const info = document.getElementById(array[y]);

					if(info.value!=""){
					 	nMap[key[x]]=nMap[key[x]]+1;
					 	console.log(nMap[key[x]]);
					}
				}else{
					console.log(x);

					console.log(array[y]);
					const info = document.getElementById(array[y]).children[0];

					console.log(info);


					if(info.checked==true){
					 nMap[key[x]]++;
					}

				}


				}



			}


	let nCount = 0;
	let sCount=0;



		for(x=0;x<arrays.length;x++){

			const array = arrays[x];

				if(array!=mandDocs2){

					if(nMap[key[x]]>=array.length){
						nCount++;

						console.log(array.length);
						console.log(x);

					}

				}else{

					if(nMap[key[x]]>=1){
						nCount++;
					}

				}

				


			}


		sCount=(photo.style.display=="none")?0:1;


			

		key.forEach((key)=>{

			console.log(key+"="+nMap[key]);

		});



		console.log(nCount+sCount);


		//btnApprove.style.display=(nCount+sCount==arrays.length+1)?"block":"none";

		
	}//function checkMandatoryInputs








//@16

	}else if(action=="edit-contract-person"){


		const mMap={};

		let greenSignal = true;

		const labels = ["Name","Date of Birth","Trade Name","Local Address","Permanent Address","Fathers Name", "Mothers Name","Nominee Name", "Blood Group","Gender","Marital Status", "Identification Marks", "Contact No", "Emg Contact No", "Wage Rate", "Type","Status","ESI/EPF","ESI No","Insurance No","UAN","Passport Issue Date","Aadhar No"];
		const ids = ["input-cp-personName","input-cp-dateOfBirth","input-cp-tradeName","input-cp-localAddress","input-cp-permanentAddress","input-cp-fathersName", "input-cp-mothersName","input-cp-nomineeName", "input-cp-bloodGroup","input-cp-gender","input-cp-maritalStatus", "input-cp-identificationMarks", "input-cp-personContactNo", "input-cp-personEmgContactNo", "input-cp-wageRate","input-cp-dateOfCardExpiry", "input-cp-personType","input-cp-status","input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate","input-cp-aadharNo"];
		const docIds=["sub-aadharCardSubmitted","sub-polVerSubmitted","sub-passportSubmitted","sub-mediCertSubmitted","sub-ageProofCertSubmitted","sub-savBankSubmitted"];
		const submIds=["sub-gatePassFormSubmitted","sub-workmenBioSubmitted","sub-esiDeclSubmitted","sub-epfDeclSubmitted","sub-epfNomSubmitted","sub-contractIntvwSubmitted","sub-esiEpfUndSubmitted","sub-empCompPackSubmitted"];
		const attIds=["att-hseTrainingAttended"];

		const otherDbKeys=["esiApplicability","epfApplicability"];

		const inputType = ["text","date","select","textarea","textarea","text", "text","text","select","select","select", "text", "number", "number", "text","select","","text","text","text","date","number"];
		const xKeys = ["ESI No","Insurance No","UAN","Passport Issue Date","Aadhar No"];
		const xIds = ["tile-esi","tile-insurance","tile-uan","tile-passportDate","tile-aadharCard"];
		const hiddenKeys = ["Insurance No","Passport Issue Date","Aadhar No"];

		const dateInputKeys= ["dateOfBirth","passportDate"]

		const dbKeys=idToKeyArray(ids);
		const submDbKeys = idToKeyArray2(submIds);
		const docDbKeys = idToKeyArray2(docIds);
		const attDbKeys = idToKeyArray2(attIds);
		//const otherDbKeys = idToKeyArray(otherIds);

		//const impIds=["input-cp-personName", "input-cp-contractorName", "input-cp-slNo","input-cp-dateOfBirth","input-cp-tradeName","input-cp-localAddress","input-cp-permanentAddress","input-cp-dateOfJoining","input-cp-bloodGroup","input-cp-gender","input-cp-maritalStatus","input-cp-personContactNo", "input-cp-personEmgContactNo", "input-cp-personType","","input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate","input-cp-aadharNo"];

		const inputs = bodyContainer.getElementsByClassName("input-cp");
		const checkboxs = bodyContainer.getElementsByClassName("checkbox-cp");
		const missedInputs = [];

//Input Validation
		for(x=0;x<inputs.length;x++){

			const input = inputs[x];	
				const key = input.id.split(/\-/)[2];
				mMap[key] = input.value;
		};

		for(x=0;x<checkboxs.length;x++){
			const checkbox = checkboxs[x];	
				//const key = (checkbox.id=="att-hseTraining")?checkbox.id.split(/\-/)[1]+"Attended":checkbox.id.split(/\-/)[1]+"Submitted";
				const key = checkbox.id.split(/\-/)[1];
				mMap[key] = (checkbox.children[0].checked)?"Yes":"No";
				console.log(key+"-"+mMap[key]);
		};



		mMap["esiApplicability"]=(document.getElementById("esi-no").style.backgroundColor=="")?"Yes":"No";
		mMap["epfApplicability"] = (document.getElementById("epf-no").style.backgroundColor=="")?"Yes":"No";




//]]
		console.log(mMap["contractorName"]);

		console.log(mMap["tradeName"]);


		//mMap["dateOfJoining"] = getDate();
		//mMap["dateOfCardExpiry"] = getFormattedDate(getfutureDate(90));

		//mMap["creationDate"] = getDate();
		mMap["modificationDate"] = getFormattedDate(new Date());
		//mMap["contractorId"] = mMap["contractorName"].split(/\-/)[0].trim();
		//mMap["contractorName"] = mMap["contractorName"].split(/\-/)[1].trim();
		//mMap["personId"] = mMap["contractorId"]+mMap["personSlNo"];

		mMap["personId"] = appDataMap["curPersonData"] ["personId"];
		mMap["personStatus"]=(getFormattedDate(new Date(mMap["dateOfCardExpiry"])) < getDate())?"Expired":"Active";

		console.log("dateOfCardExpiry=",getFormattedDate(new Date(mMap["dateOfCardExpiry"])));
		console.log("todaysDate=",getDate());

		//Setting the date inputs to 0000-00-00 in case they are not inputted, because inputting a ' ' will cause
		//db Error
		dateInputKeys.forEach((keyName)=>{
			mMap[keyName] = mMap[keyName]==""?null:mMap[keyName];
		})

		mMap["personPhoto"] = appDataMap["personPhoto"];
		// mMap["personPhotoPath"] = appDataMap["personPhotoPath"];
		
		// const folder1Name = "AppData";
		// const folder2Name = "images"
		// const folder3Name = "contractor-person";

		// const photoFolderName =`./${folder1Name}/${folder2Name}/${folder3Name}/${mMap["personId"]}`;
		// const photoFilePath = `${photoFolderName}/photo.jpg`


		// console.log(appDataMap["newPhoto"])
		//  mMap["photoUploadCond"] = appDataMap["newPhoto"]!=null;


		// if(mMap["photoUploadCond"]){

			// if(mMap["personPhotoPath"]!=""){

			// }else{
			// 	mMap["personPhotoPath"] = photoFilePath;

			// 	if(!fs.existsSync(`./${folder1Name}`)){
			// 		fs.mkdirSync(`./${folder1Name}`)
			// 		fs.mkdirSync(`./${folder1Name}/${folder2Name}`)
			// 		fs.mkdirSync(`./${folder1Name}/${folder2Name}/${folder3Name}`)
			// 	}else{
			// 		if(!fs.existsSync(`./${folder1Name}/${folder2Name}`)){
			// 			fs.mkdirSync(`./${folder1Name}/${folder2Name}`)
			// 			fs.mkdirSync(`./${folder1Name}/${folder2Name}/${folder3Name}`)
			// 		}else{
			// 			if(!fs.existsSync(`./${folder1Name}/${folder2Name}/${folder3Name}`)){
			// 				fs.mkdirSync(`./${folder1Name}/${folder2Name}/${folder3Name}`)
			// 			}
			// 		}
			// 	}
			// }



		// }else{

		// 	mMap["personPhotoPath"] = "";
		// }






		if(greenSignal){


			con.connect((err)=>{

					con.on('error',(err)=>{
						console.log("Error ="+err.message);
						handleError();
					});



const query= `UPDATE contractor_person_data
				SET
				personName =  '${mMap["personName"]}',
				dateOfBirth = '${mMap["dateOfBirth"]}',
				tradeName = '${mMap["tradeName"]}',
				localAddress = '${mMap["localAddress"]}',
				permanentAddress = '${mMap["permanentAddress"]}',
				bloodGroup = '${mMap["bloodGroup"]}',
				gender = '${mMap["gender"]}',
				fathersName = '${mMap["fathersName"]}',
				mothersName = '${mMap["mothersName"]}',
				nomineeName = '${mMap["nomineeName"]}',
				maritalStatus = '${mMap["maritalStatus"]}',
				identificationMarks = '${mMap["identificationMarks"]}',
				personContactNo = '${mMap["personContactNo"]}',
				personEmgContactNo = '${mMap["personEmgContactNo"]}',
				wageRate = '${mMap["wageRate"]}',
				dateOfCardExpiry = '${mMap["dateOfCardExpiry"]}',
				personType = '${mMap["personType"]}',
				personStatus = '${mMap["personStatus"]}',
				esiApplicability = '${mMap["esiApplicability"]}',
				epfApplicability = '${mMap["epfApplicability"]}',
				esiNo = '${mMap["esiNo"]}',
				insuranceNo = '${mMap["insuranceNo"]}',
				uan = '${mMap["uan"]}',
				passportDate = ${formatData(mMap["passportDate"])},
				aadharNo = '${mMap["aadharNo"]}',
				personPhoto = '${mMap["personPhoto"]}',
				gatePassFormSubmitted = '${mMap["gatePassFormSubmitted"]}',
				workmenBioSubmitted = '${mMap["workmenBioSubmitted"]}',
				esiDeclSubmitted = '${mMap["esiDeclSubmitted"]}',
				epfDeclSubmitted = '${mMap["epfDeclSubmitted"]}',
				epfNomSubmitted = '${mMap["epfNomSubmitted"]}',
				contractIntvwSubmitted = '${mMap["contractIntvwSubmitted"]}',
				esiEpfUndSubmitted = '${mMap["esiEpfUndSubmitted"]}',
				empCompPackSubmitted = '${mMap["empCompPackSubmitted"]}',
				aadharCardSubmitted = '${mMap["aadharCardSubmitted"]}',
				polVerSubmitted = '${mMap["polVerSubmitted"]}',
				passportSubmitted = '${mMap["passportSubmitted"]}',
				mediCertSubmitted = '${mMap["mediCertSubmitted"]}',
				ageProofCertSubmitted = '${mMap["ageProofCertSubmitted"]}',
				savBankSubmitted = '${mMap["savBankSubmitted"]}',
				hseTrainingAttended = '${mMap["hseTrainingAttended"]}',
				modificationDate = '${mMap["modificationDate"]}'
				WHERE personId = '${mMap["personId"]}'`; 




				con.query(query,(err,result)=>{

						console.log(query);
						console.log(result);

						// if(mMap["photoUploadCond"]){

						// 	if(!fs.existsSync(`./${folder1Name}/${folder2Name}/${folder3Name}/${mMap["personId"]}`)){
						// 		fs.mkdirSync(`./${folder1Name}/${folder2Name}/${folder3Name}/${mMap["personId"]}`)
						// 	}
					
						// 	fs.writeFile(mMap["personPhotoPath"], appDataMap["newPhoto"],{encoding:"base64"},function(err2){
						// 		showResult(result,err,"edit");
										
						// 			});

						// }else{
							showResult(result,err,"edit");
						// }

				})



			})





		}

//@16
	}else if(action=="add-contractor-input"){

		bodyContainer.innerHTML="";

		title.innerText = "Add Contractor";

		const noOfRows = 14;


		const labels = ["Name", "Contractor Code", "Department", "Date of Establishment","Registered Address","Local Address","Contact No","Email","Local Representative","Local Rep Contact","Bank Account No","Bank Name","IFSC Code","Status"];
		const inputType = ["text","text","select","date","textarea","textarea","number","email","text","number","text","text","text","select"];
		const gridRows=["1/2","2/3","3/4","4/5","5/8","8/11","11/12","12/13","13/14","14/15","1/2","2/3","3/4","4/5"];
		const gridColumns=["1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","2/3","2/3","2/3","2/3"];
		const inputIds=["input-ct-contractorName","input-ct-contractorId","input-ct-department","input-ct-dateOfIncorporation","input-ct-registeredAddress","input-ct-localAddress","input-ct-contractorContactNo","input-ct-contractorEmail","input-ct-localRepName","input-ct-localRepContactNo","input-ct-bankAccountNo","input-ct-bankName","input-ct-bankIfscCode","input-ct-contractorStatus"];


		bodyContainer.setAttribute("class","input-list-cont-2");
		bodyContainer.style.height="80%";

		bottomContainer.style.height="10%";
		bodyContainer.style.gridTemplateRows=`repeat(${noOfRows},2rem)`;

		for(x=0;x<labels.length;x++){  

			const container = document.createElement("div");
			container.setAttribute("class","input-tile");


			container.style.gridColumn = gridColumns[x];
			container.style.gridRow = gridRows[x];


			for(y=0;y<2;y++){
				//const child = document.createElement((y==0)?"div":"input");
				const child = document.createElement((y==0)?"div":(inputType[x]=="select" || inputType[x]=="textarea")?inputType[x]:"input");
				child.setAttribute("class",(y==0)?"input-tile-label c-flex":"input-tile-desc input-ct");
				child.setAttribute("id",(y==1)?inputIds[x]:"");
				child.setAttribute("type",(y==1)?inputType[x]:"");
				child.innerText=(y==0)?labels[x]:"";

				
						if(y==1 && inputType[x]=="select"){

							if(labels[x]=="Department"){

										options = sqlToSimpleArray(appDataMap["departmentNameData"],"departmentName");

											for(t1=0;t1<options.length;t1++){

															const option = options[t1];

															const subChild = document.createElement("option");
															subChild.setAttribute("value",option);
															subChild.innerText = option;

															child.appendChild(subChild);


										}
									
									}else if(labels[x]=="Status"){

										options = ["Approved","Temporary"]

											for(t1=0;t1<options.length;t1++){

															const option = options[t1];

															const subChild = document.createElement("option");
															subChild.setAttribute("value",option);
															subChild.innerText = option;

															child.appendChild(subChild);


										}
									
									}
					}//if(select)

				container.appendChild(child);
			}

			bodyContainer.appendChild(container);

		}




		const button = document.createElement("button");
		button.innerText="Add";
		button.setAttribute("class","btn-std-2");
		//button.setAttribute("onclick",`main("add-contractor-final")`);

		bottomContainer.appendChild(button);

		const button2 = document.createElement("button");
		button2.innerText="Back";
		button2.setAttribute("class","btn-std-2");
		//button.setAttribute("onclick",`main("add-contractor-final")`);

		bottomContainer.appendChild(button2);


		button.addEventListener('click',()=>{
			main("add-contractor");
		});

		button2.addEventListener('click',()=>{
			displayDashboard();
		});




	}else if(action=="add-contractor"){

		let greenSignal = true;

		let mMap={};
		
		const inputIds=["input-ct-contractorName","input-ct-contractorId","input-ct-department","input-ct-dateOfIncorporation","input-ct-registeredAddress","input-ct-localAddress","input-ct-contractorContactNo","input-ct-contractorEmail","input-ct-localRepName","input-ct-localRepContactNo","input-ct-bankAccountNo","input-ct-bankName","input-ct-bankIfscCode","input-ct-contractorStatus"];
		const impIds=["input-ct-contractorName","input-ct-contractorId"];
		const impLabels = ["Contractor Name", "Contractor ID"];

		const dbKeys=idToKeyArray(inputIds);

		console.log(`${dbKeys}`);

		const inputs = bodyContainer.getElementsByClassName("input-ct");
		const missedInputs = [];



//Input Validation
		for(x=0;x<inputs.length;x++){

			const input = inputs[x];
			

			if(input.value == "" && impIds.includes(input.id)){

				input.style.backgroundColor="red";
				missedInputs.push(impLabels[impIds.indexOf(input.id)]);

			}else{

				const key = input.id.split(/\-/)[2];
				mMap[key] = input.value;

			}

		}

		if(missedInputs.length!=0){
			alert("You have not inputted"+missedInputs);

			greenSignal=false;
		}

//]]


//Green Signal means all the inputs are okay
		if(greenSignal){

			mMap["isHeld"]= "No";
			mMap["creationDate"]= getFormattedDate(new Date());
			mMap["dateOfRegistry"] =getFormattedDate(new Date());

			const adlDbKeys = ['dateOfRegistry','isHeld']; 


			con.connect((err)=>{

					con.on('error',(err)=>{
						console.log("Error ="+err.message);
						handleError();
					});


				//const query= `INSERT INTO contractor_data (contractorName,contractorId,department,dateOfIncorporation,dateOfRegistry,registeredAddress,contractorContactNo,contractorEmail,localAddress,localRepName,localRepContactNo,bankAccountNo) VALUES('${mMap["contractorName"]}','${mMap["contractorId"]}','${mMap["department"]}','${mMap["dateOfIncorporation"]}','${mMap["dateOfRegistry"]}','${mMap["registeredAddress"]}','${mMap["contractorContactNo"]}','${mMap["contractorEmail"]}','${mMap["localAddress"]}','${mMap["localRepName"]}','${mMap["localRepContactNo"]}','${mMap["bankAccountNo"]}')`;
				const query= `INSERT INTO contractor_data (${dbKeys},${adlDbKeys},creationDate) 
				VALUES('${mMap["contractorName"]}',
				'${mMap["contractorId"]}',
				'${mMap["department"]}',
				'${mMap["dateOfIncorporation"]}',
				'${mMap["registeredAddress"]}',
				'${mMap["localAddress"]}',
				'${mMap["contractorContactNo"]}',
				'${mMap["contractorEmail"]}',
				'${mMap["localRepName"]}',
				'${mMap["localRepContactNo"]}',
				'${mMap["bankAccountNo"]}',
				'${mMap["bankName"]}',
				'${mMap["bankIfscCode"]}',
				'${mMap["contractorStatus"]}',
				'${mMap["dateOfRegistry"]}',
				'${mMap["isHeld"]}',
				'${mMap["creationDate"]}')`;
				//const query= `INSERT INTO contractor_data (contractorName,contractorId,bankAccountNo) VALUES('${mMap["contractorName"]}','${mMap["contractorId"]}','${mMap["bankAccountNo"]}')`;

				con.query(query,(err,result)=>{

					

						console.log(result);
						console.log(query);

						showResult(result,err,"add");
	

				})



			})





		}

		

//@32
	}else if(action=="manage-contractor"){


		bodyContainer.innerHTML="";
		bodyContainer.setAttribute("class","select-cont");

		title.innerText="Manage Contractor";

//Initializing and Configuring refMap
		let refMap = {};

		const attrTypes=["Contractor"];
		const tableNames = ["contractor_data"];

		const attrType = "Contractor";

		refMap[attrType] = {};
		refMap[attrType]["options"]={};


		refMap["Contractor"]["labels"] = ["Contractor Code", "Name", "Department", "Date of Establishment","Registered Address","Local Address","Contact No","Email","Local Representative","Local Rep Contact","Bank Account No","Bank Name","IFSC Code","Date of Joining","Status"];
		refMap["Contractor"]["inputType"] = ["text","text","select","date","textarea","textarea","number","email","text","number","text","text","text","date","select"];
		refMap["Contractor"]["gridRows"]=["1/2","2/3","3/4","4/5","5/8","8/11","1/2","2/3","3/4","4/5","5/6","6/7","7/8","8/9","9/10"];
		refMap["Contractor"]["gridCols"]=["1/2","1/2","1/2","1/2","1/2","1/2","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3"];
		refMap["Contractor"]["dbKeys"]=["contractorId","contractorName","department","dateOfIncorporation","registeredAddress","localAddress","contractorContactNo","contractorEmail","localRepName","localRepContactNo","bankAccountNo","bankName","bankIfscCode","dateOfRegistry","contractorStatus"];
		refMap["Contractor"]["disDbKeys"]=[""]; //Keys which will be disabled
		refMap["Contractor"]["hidDbKeys"]=[];
		refMap["Contractor"]["classType"]="input-ct";
		refMap["Contractor"]["options"]["department"] = sqlToSimpleArray(appDataMap["departmentNameData"],"departmentName");
		refMap["Contractor"]["options"]["contractorStatus"] = ["Approved","Temporary"];
        	
//]]

		const colors = [prColor1,prColor3,prColor4];

        		const filterContainer = document.createElement("div");
        		filterContainer.setAttribute("class","filter-cont-b c-block c-flex");

		        		const labels = ["SELECT CONTRACTOR"]

		        		for(w=0;w<labels.length;w++){

			        		const subCont = document.createElement("div");
			        		subCont.setAttribute("class","grid-tile-2c");
			        		//subCont.setAttribute("id",(w==1)?"");

			        		for(x=0;x<2;x++){

			        			const child = document.createElement((x==0)?"div":"select");
			        			child.setAttribute("class",(x==0)?"c-flex filter-tile filter-label":"");
			                    child.style.backgroundColor = colors[x];
			        			//child.setAttribute("id",(x!=0)?)
			        			child.innerText=(x==0)?labels[w]:"";

			        			if(x==1){

			        				child.setAttribute("class",(w==0)?"select-filter filter-tile":"select-filter-sub filter-tile");
			        				child.setAttribute("data-filter_type","main");

			        				const options = appDataMap["contrIdNameData"];

			        				console.log(options);

			        				for(y=0;y<options.length;y++){
			        					const subChild = document.createElement("option");
			        					subChild.setAttribute("value",options[y]["contractorId"]);
			        					subChild.innerText = options[y]["contractorId"]+" - "+options[y]["contractorName"]; 

			        					child.appendChild(subChild);
			        				}
			        			}


			        			subCont.append(child);

			        		}
			        		    filterContainer.appendChild(subCont);
		        	}

        	
        		bodyContainer.appendChild(filterContainer);


        		const rangeContainer = document.createElement("div");
        		rangeContainer.setAttribute("class","c-flex-col range-cont");
        		rangeContainer.style.height="100%";
        		rangeContainer.style.paddingTop="2rem";

        		bodyContainer.appendChild(rangeContainer);


				document.querySelector('.select-filter').addEventListener("change",(e)=>{

					const mainValue = e.target.value;

        			const query = `SELECT * FROM contractor_data WHERE contractorId='${mainValue}';`

        			con.connect((err)=>{

        				con.query(query,(err,result)=>{

        					console.log(result);
        					console.log(query);

        			const classType = refMap[attrType]["classType"];
							const labels = refMap[attrType]["labels"];
							const dbKeys = refMap[attrType]["dbKeys"];
							const disDbKeys = refMap[attrType]["disDbKeys"];
							const hidDbKeys = refMap[attrType]["hidDbKeys"];
							const inputType = refMap[attrType]["inputType"];
							const gridRows=refMap[attrType]["gridRows"];
							const gridColumns=refMap[attrType]["gridCols"];
						
							const ids = keyToIdArray(classType,dbKeys);

							const noOfRows = 10;
							const noOfCols = Math.ceil(labels.length/noOfRows);

							let mMap={};

							mMap=result[0];

							mainContainer.style.backgroundColor=(mMap["isHeld"]=="Yes")?colorBlockBack:"";

							const curContractorId = mMap["contractorId"];

							rangeContainer.innerHTML="";

							rangeContainer.setAttribute("class","input-list-cont-"+noOfCols);
							rangeContainer.style.gridTemplateRows=`repeat(${noOfRows},2rem)`;


									for(x=0;x<labels.length;x++){

									
										const container = document.createElement("div");
										container.setAttribute("class","input-tile "+classType);
										container.style.display=(hidDbKeys.includes(dbKeys[x]))?"none":"";

										container.style.gridColumn = gridColumns[x];
										container.style.gridRow = gridRows[x];

										for(y=0;y<2;y++){

											const child = document.createElement((y==0)?"div":(inputType[x]=="select" || inputType[x]=="textarea")?inputType[x]:"input");
											child.setAttribute("class",(y==0)?"input-tile-label c-flex":"input-tile-desc "+classType);
											child.setAttribute("type",(y==1)?inputType[x]:"");
											child.setAttribute("id",(y==1)?classType+"-"+dbKeys[x]:"");
											child.setAttribute("value",(y==1)?result[0][dbKeys[x]]:"");
											child.disabled=(y==1)?true:false;
											//child.setAttribute("id",(y==1)?ids[x]:"");
											child.innerText=(y==0)?labels[x]:(inputType[x]=="select")?result[0][dbKeys[x]]:"";

												if(y==1){

													if(inputType[x]=="select"){

															let options=[];

															options = refMap[attrType]["options"][dbKeys[x]];

															console.log(refMap[attrType]["options"][dbKeys[x]]);

																	for(t1=0;t1<options.length;t1++){

																					const option = options[t1];

																					const subChild = document.createElement("option");
																					subChild.setAttribute("value",option);
																					subChild.innerText = option;

																					child.appendChild(subChild);

																	}
															
													
														child.value=result[0][dbKeys[x]];
														

													}else if(inputType[x]=="date" && result[0][dbKeys[x]]!="0000-00-00"){

														child.value=getFormattedDate(result[0][dbKeys[x]]);

													}else if(inputType[x]=="textarea"){
														child.value=result[0][dbKeys[x]];

													}


											}//if(select)

											
												container.appendChild(child);
											

								
										}

										rangeContainer.appendChild(container);

									
						        			
									}//for(labels.length)


									bottomContainer.innerHTML="";

									const btnLabels = ["Edit","Block","Delete","Back"];
									const btnIds2 = ["btn-edit","btn-block","btn-delete","btn-back-dashboard"];
									const btnColors = ["",colorBlock,colorWarning,""];


									for(w=0;w<btnLabels.length;w++){

										const button = document.createElement("button");
										button.setAttribute("class","btn-std-2");
										button.innerText=(btnLabels[w]=="Block" && mMap["isHeld"]=="Yes")?"Unblock":btnLabels[w];
										button.style.backgroundColor=(btnLabels[w]=="Block" && mMap["isHeld"]=="Yes")?"black":btnColors[w];
										button.setAttribute("id",btnIds2[w]);

										bottomContainer.appendChild(button);

										button.addEventListener('click',(e)=>{

											const idName = e.target.id;
											const btnLabel = e.target.innerText;

											if(idName=="btn-back-dashboard"){
												displayDashboard();
											}else if(idName=="btn-delete"){

												showNotification("Warning","This will delete all the records pertaining to this contractor, do you want to proceed?");

												notifBtn.addEventListener("click",deleteData);

												

													function deleteData(e){

													const parent = e.target.parentElement.parentElement.parentElement;
													parent.style.display="none";

													const query = `DELETE FROM contractor_data WHERE contractorId='${mainValue}';`

																con.query(query,(err,result)=>{

																	console.log(result);
																	console.log(query);

																showResult(result,err,"delete");

																setTimeout(()=>{

																	displayDashboard();

																},2000);
															});

														notifBtn.removeEventListener("click",deleteData);

													}


											}else if(idName=="btn-block"){

												
													const query = `UPDATE contractor_data SET isHeld='${(btnLabel=="Block")?`Yes`:`No`}' WHERE contractorId='${mainValue}';`

																con.query(query,(err,result)=>{

																	console.log(result);
																	console.log(query);

																showResult(result,(btnLabel=="Block")?"block":"unblock");

																setTimeout(()=>{

																	main("manage-contractor");

																},2000);
															});


											}else{ //To edit the contractor details

												console.log("Edit entered")

												//const attrType = e.target.dataset.attribute_type;
												const values = [];


												console.log(classType);
												const items = document.querySelectorAll(`.${classType}`);

												for(z=0;z<items.length;z++){

													const itemKey = items[z].id.split(/\-/)[2];

													if(!disDbKeys.includes(itemKey)){
														items[z].disabled=false;
													}	

												}

												bottomContainer.innerHTML="";

												const btnSave = document.createElement("button");
												btnSave.setAttribute("class","btn-std-2");
												btnSave.setAttribute("data-attribute_type",attrType);
												btnSave.innerText="Save";

												const btnBack = document.createElement("button");
												btnBack.setAttribute("class","btn-std-2");
												btnBack.innerText="Back";

												bottomContainer.appendChild(btnSave);
												bottomContainer.appendChild(btnBack);

												btnSave.addEventListener('click',(e)=>{

														console.log("entry");

														const index = attrTypes.indexOf(attrType);

														const inputMap = {};

															document.querySelectorAll(`.${classType}`).forEach((it,i)=>{

																const dbKey = it.id.split("-")[2];

																inputMap[dbKey] = it.value;

															});

														const tArray=[];

														const length = Object.keys(inputMap).length;

														for(z=0;z<dbKeys.length;z++){

															const key = dbKeys[z];
															tArray.push(`${key}='${inputMap[key]}'`);

/* 
															if(z!=0){   //Excluding contractorId from the key List
																tArray.push(`${key}='${inputMap[key]}'`)
															}
	*/
														};


														console.log(tArray);
														console.log(index);
														console.log(tableNames)
/*
														refMap["query1"]="";
														refMap["query2"]="";

														if(inputMap["contractorId"]!=curContractorId){

															refMap["query"] = `UPDATE ${tableNames[index]} 
																SET ${tArray} 
																WHERE {dbKeys[0]}='${curContractorId}'`; 

															refMap["query2"]=`UPDATE contractor_person_data SET personId=CONCAT(contractorId,personSlNo) WHERE contractorId='${inputMap["contractorId"]}'`



														}else{


														}
*/

														const query2=`UPDATE ${tableNames[index]} 
																SET ${tArray} 
																WHERE ${dbKeys[0]}='${curContractorId}'`
																
																
										

/*
														const query2=(inputMap["contractorId"]!=curContractorId)?`UPDATE ${tableNames[index]} 
																SET ${tArray} 
																WHERE ${dbKeys[0]}='${curContractorId}';UPDATE contractor_person_data SET personId=CONCAT(contractorId,personSlNo) WHERE contractorId='${inputMap["contractorId"]}'`:`UPDATE ${tableNames[index]} 
																SET ${tArray} 
																WHERE ${dbKeys[0]}='${curContractorId}'`;
*/
															con.connect((err)=>{

																	con.query(query2,(err,result)=>{

																		console.log(query2);
																		console.log(result);
																		console.log(err);

																		if(inputMap["contractorId"]!=curContractorId){

																					showResult(result[0],"edit")
																					showResult(result[1],"update")

																					main()

																		}else{

																				showResult(result,err,"edit")


																		}


;
																	})

																})


													})//btnSave.addEvent

												btnBack.addEventListener('click',(e)=>{

													displayDashboard();
												})

												}//if(idName)


										});//btn.addEventListener

		        				}//for(w=0,btnLabels);


						})


					});

				 
		});//select-filter.addEvent

		
		const changeEvent = new Event("change");

		document.querySelector('.select-filter').dispatchEvent(changeEvent);






//@33
	}else if(action=="view-contractor"){


		const contId = document.getElementById("contractor-selection").value.split(/\-/)[0];

		con.connect((err)=>{

					con.on('error',(err)=>{
						console.log("Error ="+err.message);
						handleError();
					});


				
				const query= `SELECT * FROM contractor_data WHERE contractorId='${contId}'`;
				

				con.query(query,(err,res)=>{

						con.on('error',(err)=>{
							console.log("Error ="+err.message);
							handleError();
						});

						console.log(res[0]);


		const data = res[0];

		appDataMap["curContrData"] = data;


		bodyContainer.innerHTML="";

		title.innerText = "View Contractor";

		const noOfRows = 10;

		const labels = ["Name", "Contractor Code", "Department", "Date of Establishment","Registered Address","Local Address","Contact No","Email","Local Representative","Local Rep Contact","Bank Account No","Bank Name","IFSC Code","Date of Joining"];
		const inputType = ["text","text","text","date","textarea","textarea","number","email","text","number","text","text","text","date"];
		const gridRows=["1/2","2/3","3/4","4/5","5/8","8/11","1/2","2/3","3/4","4/5","5/6","6/7","7/8","8/9"];
		const gridColumns=["1/2","1/2","1/2","1/2","1/2","1/2","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3"];
		const inputIds=["input-ct-contractorName","input-ct-contractorId","input-ct-department","input-ct-dateOfIncorporation","input-ct-registeredAddress","input-ct-localAddress","input-ct-contractorContactNo","input-ct-contractorEmail","input-ct-localRepName","input-ct-localRepContactNo","input-ct-bankAccountNo","input-ct-bankName","input-ct-bankIfscCode","input-ct-dateOfRegistry"];
		const dbKeys = idToKeyArray(inputIds);


		bodyContainer.setAttribute("class","input-list-cont-2");
		//bodyContainer.style.gridTemplateRows=`repeat(${noOfRows},2rem)`;

		for(x=0;x<labels.length;x++){

			const container = document.createElement("div");
			container.setAttribute("class","input-tile");


			container.style.gridColumn = gridColumns[x];
			container.style.gridRow = gridRows[x];


			for(y=0;y<2;y++){
				const child = document.createElement("div");
				child.setAttribute("class",(y==0)?"input-tile-label c-flex":"input-tile-desc input-ct");
				//child.setAttribute("id",(y==1)?inputIds[x]:"");
				//child.setAttribute("type",(y==1)?inputType[x]:"");
				child.innerText=(y==0)?labels[x]:data[dbKeys[x]];



				if(inputType[x]=="date" && data[dbKeys[x]]!="0000-00-00" && y==1){

					child.innerText=getIndiaDate(data[dbKeys[x]]);

				}

				container.appendChild(child);
			}

			bodyContainer.appendChild(container);

		}

		bottomContainer.innerHTML="";

		const btnLabels = ["Edit","Delete","Back"];
		const btnIds = ["btn-edit-contractor-input","btn-delete-contractor","btn-back"];
		const functions = ["edit-contractor-input","delete-contractor","manage-contractor"];

		for(y=0;y<btnLabels.length;y++){

		const button = document.createElement("button");
		button.innerText=btnLabels[y];
		button.setAttribute("class","btn-std-2");
		button.setAttribute("data-function_name",functions[y]);
		button.setAttribute("id",btnIds[y]);

		bottomContainer.appendChild(button);

			document.getElementById(btnIds[y]).addEventListener('click',(e)=>{
					
				const functionName = e.target.dataset.function_name;

				main(functionName);


			});

		}


					});

			});





	}else if(action=="edit-contractor-input"){

		bodyContainer.innerHTML="";

		title.innerText = "Edit Contractor";

		const data = appDataMap["curContrData"];

		const noOfRows = 10;

		const labels = ["Name","Contractor Code", "Department", "Date of Establishment","Registered Address","Local Address","Contact No","Email","Local Representative","Local Rep Contact","Bank Account No","Bank Name","IFSC Code"];
		const inputType = ["text","text","text","date","textarea","textarea","number","email","text","number","text","text","text"];
		const gridRows=["1/2","2/3","3/4","4/5","5/8","8/11","1/2","2/3","3/4","4/5","5/6","6/7","7/8"];
		const gridColumns=["1/2","1/2","1/2","1/2","1/2","1/2","2/3","2/3","2/3","2/3","2/3","2/3","2/3"];
		//const inputIds=["input-ct-contractorName","input-ct-contractorId","input-ct-department","input-ct-dateOfIncorporation","input-ct-registeredAddress","input-ct-localAddress","input-ct-contractorContactNo","input-ct-contractorEmail","input-ct-localRepName","input-ct-localRepContactNo","input-ct-bankAccountNo","input-ct-bankName","input-ct-bankIfscCode"];

		//const inputIds=["input-ct-contractorName","input-ct-contractorId","input-ct-department","input-ct-dateOfIncorporation","input-ct-dateOfRegistry","input-ct-registeredAddress","input-ct-contractorContactNo","input-ct-contractorEmail","input-ct-localAddress","input-ct-localRepName","input-ct-localRepContactNo","input-ct-bankAccountNo"];
		const inputIds=["edit-ct-contractorName","edit-ct-contractorId","edit-ct-department","edit-ct-dateOfIncorporation","edit-ct-registeredAddress","edit-ct-localAddress","edit-ct-contractorContactNo","edit-ct-contractorEmail","edit-ct-localRepName","edit-ct-localRepContactNo","edit-ct-bankAccountNo","edit-ct-bankName","edit-ct-bankIfscCode"];   
		const dbKeys = idToKeyArray(inputIds);


		bodyContainer.setAttribute("class","input-list-cont-2");
		//bodyContainer.style.gridTemplateRows=`repeat(${noOfRows},2rem)`;

		for(x=0;x<labels.length;x++){

			const container = document.createElement("div");
			container.setAttribute("class","input-tile");


			container.style.gridColumn = gridColumns[x];
			container.style.gridRow = gridRows[x];


			for(y=0;y<2;y++){
				const child = document.createElement((y==0)?"div":(inputType[x]=="select" || inputType[x]=="textarea")?inputType[x]:"input");
				child.setAttribute("class",(y==0)?"input-tile-label c-flex":"input-tile-desc edit-ct");
				child.setAttribute("id",(y==1)?inputIds[x]:"");
				child.setAttribute("type",(y==1)?inputType[x]:"");
				child.setAttribute("value",(y==1)?data[dbKeys[x]]:"");
				child.innerText=(y==0)?labels[x]:(inputType[x]=="textarea")?data[dbKeys[x]]:"";


				if(inputType[x]=="date" && data[dbKeys[x]]!="0000-00-00" && y==1){
					child.setAttribute("value",getFormattedDate(data[dbKeys[x]]));
				}

				container.appendChild(child);
			}

			bodyContainer.appendChild(container);

		}
		

		bottomContainer.innerHTML="";

		const btnLabels = ["Edit Contractor","Back"];
		const btnIds = ["btn-edit-contractor","btn-back"];
		const functions = ["edit-contractor","manage-contractor"];

		for(y=0;y<btnLabels.length;y++){

		const button = document.createElement("button");
		button.innerText=btnLabels[y];
		button.setAttribute("class","btn-std-2");
		button.setAttribute("data-function_name",functions[y]);
		button.setAttribute("id",btnIds[y]);

		bottomContainer.appendChild(button);

			document.getElementById(btnIds[y]).addEventListener('click',(e)=>{
					
				const functionName = e.target.dataset.function_name;

				main(functionName);


			});

		}



	}else if(action=="edit-contractor"){


		let greenSignal = true;

		let mMap={};
		
		const inputIds=["edit-ct-contractorName","edit-ct-contractorId","edit-ct-department","edit-ct-dateOfIncorporation","edit-ct-dateOfRegistry","edit-ct-registeredAddress","edit-ct-contractorContactNo","edit-ct-contractorEmail","edit-ct-localAddress","edit-ct-localRepName","edit-ct-localRepContactNo","edit-ct-bankAccountNo"];
		const impIds=["input-ct-contractorName","input-ct-contractorId"];
		const impLabels = ["Contractor Name", "Contractor ID"];

		const dbKeys=idToKeyArray(inputIds);

		const inputs = bodyContainer.getElementsByClassName("edit-ct");
		const missedInputs = [];

//Input Validation
		for(x=0;x<inputs.length;x++){

			const input = inputs[x];
			

			if(input.value == "" && impIds.includes(input.id)){

				input.style.backgroundColor="red";
				missedInputs.push(impLabels[impIds.indexOf(input.id)]);

			}else{

				const key = input.id.split(/\-/)[2];
				mMap[key] = input.value;

			}

		}

		if(missedInputs.length!=0){
			alert("You have not inputted"+missedInputs);

			greenSignal=false;
		}

//]]



		if(greenSignal){

			mMap["modificationDate"] = getFormattedDate(new Date());


			con.connect((err)=>{

					con.on('error',(err)=>{
						console.log("Error ="+err.message);
						handleError();
					});


				//const query= `INSERT INTO contractor_data (contractorName,contractorId,department,dateOfIncorporation,dateOfRegistry,registeredAddress,contractorContactNo,contractorEmail,localAddress,localRepName,localRepContactNo,bankAccountNo) VALUES('${mMap["contractorName"]}','${mMap["contractorId"]}','${mMap["department"]}','${mMap["dateOfIncorporation"]}','${mMap["dateOfRegistry"]}','${mMap["registeredAddress"]}','${mMap["contractorContactNo"]}','${mMap["contractorEmail"]}','${mMap["localAddress"]}','${mMap["localRepName"]}','${mMap["localRepContactNo"]}','${mMap["bankAccountNo"]}')`;

				const query= `UPDATE contractor_data
				SET contractorId = '${mMap["contractorId"]}',
				contractorName = '${mMap["contractorName"]}',
				department = '${mMap["department"]}',
				dateOfIncorporation = '${mMap["dateOfIncorporation"]}',
				registeredAddress = '${mMap["registeredAddress"]}',
				localAddress = '${mMap["localAddress"]}',
				contractorContactNo = '${mMap["contractorContactNo"]}',
				contractorEmail = '${mMap["contractorEmail"]}',
				localRepName = '${mMap["localRepName"]}',
				localRepContactNo = '${mMap["localRepContactNo"]}',
				bankAccountNo = '${mMap["bankAccountNo"]}',
				bankName = '${mMap["bankName"]}',
				bankIfscCode = '${mMap["bankIfscCode"]}',
				modificationDate = '${mMap["modificationDate"]}'
				WHERE contractorId ='${appDataMap["curContrData"]["contractorId"]}'`;
				//const query= `INSERT INTO contractor_data (contractorName,contractorId,bankAccountNo) VALUES('${mMap["contractorName"]}','${mMap["contractorId"]}','${mMap["bankAccountNo"]}')`;



				con.query(query,(err,result)=>{

						con.on('error',(err)=>{
							console.log("Error ="+err.message);
							handleError();
						});

						console.log(query);

						console.log("Successfully Updated");



				})



			})





		}

		

	}else if(action=="delete-contractor"){
	

			con.connect((err)=>{

					con.on('error',(err)=>{
						console.log("Error ="+err.message);
						handleError();
					});


				//const query= `INSERT INTO contractor_data (contractorName,contractorId,department,dateOfIncorporation,dateOfRegistry,registeredAddress,contractorContactNo,contractorEmail,localAddress,localRepName,localRepContactNo,bankAccountNo) VALUES('${mMap["contractorName"]}','${mMap["contractorId"]}','${mMap["department"]}','${mMap["dateOfIncorporation"]}','${mMap["dateOfRegistry"]}','${mMap["registeredAddress"]}','${mMap["contractorContactNo"]}','${mMap["contractorEmail"]}','${mMap["localAddress"]}','${mMap["localRepName"]}','${mMap["localRepContactNo"]}','${mMap["bankAccountNo"]}')`;

				const query= `DELETE FROM contractor_data
				WHERE contractorId='${appDataMap["curContrData"]["contractorId"]}'`;
				//const query= `INSERT INTO contractor_data (contractorName,contractorId,bankAccountNo) VALUES('${mMap["contractorName"]}','${mMap["contractorId"]}','${mMap["bankAccountNo"]}')`;



				con.query(query,(err,result)=>{

						con.on('error',(err)=>{
							console.log("Error ="+err.message);
							handleError();
						});

						console.log("Successfully Deleted");



				})



			});








	//else if(action=="delete-contractor"){}
//@7
	}else if(action=="print-id-input"){

      console.log("hello in print")

		bodyContainer.innerHTML="";

		title.innerText = "Print ID's";

		bodyContainer.setAttribute("class","id-tile-cont");
		bodyContainer.style.height="80%";

		bottomContainer.style.height="10%";
		//bodyContainer.style.gridTemplateRows=`repeat(${noOfRows},2rem)`;

		//const query = `SELECT contractorName,`



		for(x=0;x<4;x++){

			const container = document.createElement("div");
			container.setAttribute("class","id-select-cont");


			const sHeadCont = document.createElement("div");
			sHeadCont.setAttribute("class","c-flex");
			container.appendChild(sHeadCont);


			const sTitle = document.createElement("div");
			sTitle.setAttribute("class","display-title");
			sTitle.innerText="For ID "+(x+1);

			sHeadCont.appendChild(sTitle);


			for(y=0;y<2;y++){

				const subCont = document.createElement("div");
				subCont.setAttribute("class","id-select-cont2 c-flex-col");

				subCont.innerText=(y==0)?"SELECT CONTRACTOR":"SELECT CONTRACT PERSONNEL";

				const datas=(y==0)?sqlToSimpleMap(appDataMap["contrIdNameData"]):sqlToSimpleMap(appDataMap["contrPersIdNameData"]);

				const identifier=["contractor","person"];

				//if(y==0){

					const child = document.createElement("select");
					child.setAttribute("class",(y==0)?"select-box contractor-selection-id":"select-box contract-personnel-selection-id");

					for(z=0;z<datas[identifier[y]+"Id"].length;z++){

						const subChild = document.createElement("option");
						subChild.setAttribute("value",datas[identifier[y]+"Id"][z]);
						subChild.innerText=datas[identifier[y]+"Id"][z] + " - "+ datas[identifier[y]+"Name"][z];
						subChild.disabled=(y==0)?(datas["isHeld"][z]=="Yes")?true:false:false;

						child.appendChild(subChild);
					}

					subCont.appendChild(child);

				//}

				
				container.appendChild(subCont);
			}

			bodyContainer.appendChild(container);


	}


	document.querySelectorAll(".contractor-selection-id").forEach((item)=>{

		item.addEventListener("change",(e)=>{


			const parent = e.target.parentElement.parentElement;
			const id = e.target.value;

			con.connect((err)=>{

				const query=`SELECT personId,personName FROM contractor_person_data WHERE contractorId='${id}' AND personStatus='Active' AND isHeld='No' `;

				con.query(query,(err,result)=>{


					console.log(query);
					console.log(result);

					const datas = sqlToSimpleMap(result);


					const child = parent.querySelector(".contract-personnel-selection-id");

					child.innerHTML="";

					for(x=0;x<datas["personId"].length;x++){

						const subChild = document.createElement("option");
						subChild.setAttribute("value",datas["personId"][x]);
						subChild.innerText=datas["personId"][x] + " - "+ datas["personName"][x];

						child.appendChild(subChild);

					}


					


				})



			})



		})
				


	});


	const changeEvent = new Event("change");

	document.querySelectorAll(".contractor-selection-id").forEach((item)=>{

	   item.dispatchEvent(changeEvent);

	});




	const btnLabels = ["Print ID", "Back"];
	const btnIds2 = ["btn-print-id","btn-back-dashboard"];


	for(w=0;w<btnLabels.length;w++){

		const button = document.createElement("button");
		button.setAttribute("class","btn-std-2");
		button.innerText=btnLabels[w];
		button.setAttribute("id",btnIds2[w]);

		bottomContainer.appendChild(button);

		button.addEventListener('click',(e)=>{

			const idName = e.target.id;

			if(idName=="btn-back-dashboard"){
				displayDashboard();
			}else{
				main(idName.slice(4));
			}

		})
	}





		
	}else if(action=="print-contract-person-id-input"){

		const personGroupTerm = "contractor";
		const personTerm = "contract-person";
		const personGroupIdNameMap =  appDataMap["contrIdNameData"]
		const personIdNameMap =  appDataMap["contrPersIdNameData"]
		const identifiers=["contractor","person"];
		const personDbTableName = "contractor_person_data" 
	    const personGroupIdKeyName = "contractorId"

		appDataMap["curIdPrintDomain"] = "contractor";

		console.log("hello in print")
  
		  bodyContainer.innerHTML="";
  
		  title.innerText = "Print ID's";
  
		  bodyContainer.setAttribute("class","id-tile-cont");
		  bodyContainer.style.height="80%";
  
		  bottomContainer.style.height="10%";
		  //bodyContainer.style.gridTemplateRows=`repeat(${noOfRows},2rem)`;
  
		  //const query = `SELECT contractorName,`

		  
  
  
  
		  for(x=0;x<4;x++){
  
			  const container = document.createElement("div");
			  container.setAttribute("class","id-select-cont");
  
  
			  const sHeadCont = document.createElement("div");
			  sHeadCont.setAttribute("class","c-flex");
			  container.appendChild(sHeadCont);
  
  
			  const sTitle = document.createElement("div");
			  sTitle.setAttribute("class","display-title");
			  sTitle.innerText="For ID "+(x+1);
  
			  sHeadCont.appendChild(sTitle);
  
  
			  for(y=0;y<2;y++){
  
				  const subCont = document.createElement("div");
				  subCont.setAttribute("class","id-select-cont2 c-flex-col");


  
				  subCont.innerText=(y==0)?`SELECT ${personGroupTerm.toUpperCase()}`:`SELECT ${personTerm.toUpperCase()}`;
  
				  const datas=(y==0)?sqlToSimpleMap(personGroupIdNameMap):sqlToSimpleMap(personIdNameMap);
  
  
				  //if(y==0){
  
					  const child = document.createElement("select");
					  child.setAttribute("class",(y==0)?"select-box contractor-selection-id":"select-box contract-personnel-selection-id");
  
					  for(z=0;z<datas[identifiers[y]+"Id"].length;z++){
  
						  const subChild = document.createElement("option");
						  subChild.setAttribute("value",datas[identifiers[y]+"Id"][z]);
						  subChild.innerText=datas[identifiers[y]+"Id"][z] + " - "+ datas[identifiers[y]+"Name"][z];
						  subChild.disabled=(y==0)?(datas["isHeld"][z]=="Yes")?true:false:false;
  
						  child.appendChild(subChild);
					  }
  
					  subCont.appendChild(child);
  
				  //}
  
				  
				  container.appendChild(subCont);
			  }
  
			  bodyContainer.appendChild(container);
  
  
	  }
  
  
	  document.querySelectorAll(".contractor-selection-id").forEach((item)=>{
  
		  item.addEventListener("change",(e)=>{
  
  
			  const parent = e.target.parentElement.parentElement;
			  const id = e.target.value;
  
			  con.connect((err)=>{
  
				  const query=`SELECT personId,personName FROM ${personDbTableName} WHERE ${personGroupIdKeyName}='${id}' AND personStatus='Active' AND isHeld='No' `;
  
				  con.query(query,(err,result)=>{
  
  
					  console.log(query);
					  console.log(result);
  
					  const datas = sqlToSimpleMap(result);
  
  
					  const child = parent.querySelector(".contract-personnel-selection-id");
  
					  child.innerHTML="";
  
					  for(x=0;x<datas["personId"].length;x++){
  
						  const subChild = document.createElement("option");
						  subChild.setAttribute("value",datas["personId"][x]);
						  subChild.innerText=datas["personId"][x] + " - "+ datas["personName"][x];
  
						  child.appendChild(subChild);
  
					  }
  
  
					  
  
  
				  })

			  })

		  })
			
	  });
  
  
	  const changeEvent = new Event("change");
  
	  document.querySelectorAll(".contractor-selection-id").forEach((item)=>{
  
		 item.dispatchEvent(changeEvent);
  
	  });
  
  
  
  
	  const btnLabels = ["Print ID", "Back"];
	  const btnIds2 = ["btn-print-id","btn-back-dashboard"];
  
  
	  for(w=0;w<btnLabels.length;w++){
  
		  const button = document.createElement("button");
		  button.setAttribute("class","btn-std-2");
		  button.innerText=btnLabels[w];
		  button.setAttribute("id",btnIds2[w]);
  
		  bottomContainer.appendChild(button);
  
		  button.addEventListener('click',(e)=>{
  
			  const idName = e.target.id;
  
			  if(idName=="btn-back-dashboard"){
				  displayDashboard();
			  }else{
				  main(idName.slice(4));
			  }
  
		  })
	  }
  
  	  
	}else if(action=="print-id"){

		
		const personDbTableName = appDataMap["curIdPrintDomain"]=="contractor"?"contractor_person_data":"student_person_data";

		const selections = document.getElementsByClassName("contract-personnel-selection-id"); // currenly there are 4 input selections
		const idArray=[];

		for(x=0;x<selections.length;x++){

			idArray.push(selections[x].value);

		};

		const array2=[];

		idArray.forEach((elem)=>{

			array2.push(`personId= '${elem}'`);

		})

		const condString = array2.join(" OR ");

		query = `SELECT * FROM ${personDbTableName} WHERE ${condString}`;


				con.connect((err)=>{

					con.query(query,(err,result)=>{

						console.log(query);
						console.log(result);

							initiateGenerateId(sqlToMapArray(result),"A",appDataMap["curIdPrintDomain"]);

						});


					});

				
//@9
	}else if(action=="add-student-person-input"){
		
		bodyContainer.innerHTML = "";

		bodyContainer.style.height="80%";
		bottomContainer.style.height="10%";

		title.innerText="Add Student"; // title got from displayDashboard Function

		const inputClassInitial = "sp";

		const noOfRows = 15;

		const labels = ["Name","Institute Name","Person Serial No","Date of Birth","Class","Course","Local Address","Permanent Address","Blood Group","Fathers Name", "Mothers Name","Gender","Contact No", "Emg Contact No", "Type","Aadhar No","Pass Validity Start","Pass Validity End"];
		const ids = ["input-sp-personName","input-sp-instituteName", "input-sp-personSlNo","input-sp-dateOfBirth","input-sp-className","input-sp-courseName","input-sp-localAddress","input-sp-permanentAddress","input-sp-bloodGroup","input-sp-fathersName", "input-sp-mothersName","input-sp-gender", "input-sp-personContactNo", "input-sp-personEmgContactNo","input-sp-personType","input-sp-aadharNo","input-sp-dateOfPassValidityStart","input-sp-dateOfPassExpiry"];
		const gridRows=["1/2","2/3","3/4","4/5","5/6","6/7","7/10","10/13","13/14","14/15","15/16","1/2","2/3","3/4","4/5","5/6","6/7","7/8","8/9","9/10","10/11","11/12","12/13","13/14"];
		const gridColumns=["1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3"];
		const inputType = ["text","select","text","date","select","select","textarea","textarea","select","text","text","select","number", "number", "select", "number", "date","date"];
		const xKeys = [];
		const xIds = [];
		const hiddenKeys = [];

		bodyContainer.setAttribute("class","input-list-cont");
		bodyContainer.style.gridTemplateRows=`repeat(${noOfRows},2rem)`;

//Hiding the tiles which have to be hidden
		for(x=0;x<labels.length;x++){

			const container = document.createElement("div");
			container.setAttribute("class","input-tile");
			

			container.style.gridColumn = gridColumns[x];
			container.style.gridRow = gridRows[x];

			if(xKeys.includes(labels[x])){

				const index = xKeys.indexOf(labels[x]);

				container.setAttribute("id",xIds[index]);
				container.style.gridRow = "";
				container.style.display=(hiddenKeys.includes(labels[x]))?"none":"";

			}

//]]

			//container.style.gridRow=(x>=noOfRows)?"1/2":"";

			for(y=0;y<2;y++){

				const child = document.createElement((y==0)?"div":(inputType[x]=="select" || inputType[x]=="textarea")?inputType[x]:"input");
				child.setAttribute("class",(y==0)?"input-tile-label c-flex":`input-tile-desc input-${inputClassInitial}`);
				child.setAttribute("type",(y==1)?inputType[x]:"");
				child.setAttribute("id",(y==1)?ids[x]:"");
				child.innerText=(y==0)?labels[x]:"";

					if(y==1 && inputType[x]=="select"){

						let options=[];

						let dMapArray = [{contractorId:"DEF",
							contractorName:"DEFAULT"}]

						
//Populating the Contractor Name Dropdown
						if(labels[x]=="Institute Name"){

							console.log(appDataMap)

							options = sqlToSimpleArray(appDataMap["instituteNameData"],"instituteName");//["Site Incharge","Engineer","Supervisor","Marker","Welder","Tack Welder","Fitter","Grinder","Painter","Blaster","Power Tooler","Store Keeper","Rigger","Helper","Others"];

							for(t1=0;t1<options.length;t1++){

								const option = options[t1];

								const subChild = document.createElement("option");
								subChild.setAttribute("value",option);
								subChild.innerText = option;

								child.appendChild(subChild);

							}

							// options = (appDataMap["instituteIdNameData"]!=null)?appDataMap["instituteIdNameData"]:dMapArray;

							// 	for(t1=0;t1<options.length;t1++){

							// 					const option = options[t1];

							// 					const subChild = document.createElement("option");
							// 					subChild.setAttribute("value",option["instituteId"]+" - "+option["instituteName"]);
							// 					subChild.innerText = option["instituteId"]+" - "+option["instituteName"];
							// 					subChild.disabled=(option["isHeld"]=="Yes")?true:false;

							// 					child.appendChild(subChild);
							//    }
						
						}else if(labels[x]=="Class"){

					
							options = sqlToSimpleArray(appDataMap["classNameData"],"className");//["Site Incharge","Engineer","Supervisor","Marker","Welder","Tack Welder","Fitter","Grinder","Painter","Blaster","Power Tooler","Store Keeper","Rigger","Helper","Others"];

										for(t1=0;t1<options.length;t1++){

											const option = options[t1];

											const subChild = document.createElement("option");
											subChild.setAttribute("value",option);
											subChild.innerText = option;

											child.appendChild(subChild);

										}


						}else if(labels[x]=="Blood Group"){

							console.log("blood group");

							options = ["A+","A-","A1+","A1-","B+","B-","AB+","AB-","O+","O-"];

										for(t1=0;t1<options.length;t1++){

											const option = options[t1];

											const subChild = document.createElement("option");
											subChild.setAttribute("value",option);
											subChild.innerText = option;

											child.appendChild(subChild);

										}


						}else if(labels[x]=="Gender"){

							options = ["Male","Female","Other"];

										for(t1=0;t1<options.length;t1++){

											const option = options[t1];

											const subChild = document.createElement("option");
											subChild.setAttribute("value",option);
											subChild.innerText = option;

											child.appendChild(subChild);

										}


						}else if(labels[x]=="Type"){

							options = ["Intern"];

										for(t1=0;t1<options.length;t1++){

											const option = options[t1];

											const subChild = document.createElement("option");
											subChild.setAttribute("value",option);
											subChild.innerText = option;

											child.appendChild(subChild);

										}


						}else if(labels[x]=="Course"){



							options = sqlToSimpleArray(appDataMap["courseNameData"],"courseName");//["Site Incharge","Engineer","Supervisor","Marker","Welder","Tack Welder","Fitter","Grinder","Painter","Blaster","Power Tooler","Store Keeper","Rigger","Helper","Others"];

										for(t1=0;t1<options.length;t1++){

											const option = options[t1];

											const subChild = document.createElement("option");
											subChild.setAttribute("value",option);
											subChild.innerText = option;

											child.appendChild(subChild);

										}


						};
				
			}//if(select)

				container.appendChild(child);

			}

	
			bodyContainer.appendChild(container);

		};

		//const personGroupIds = sqlToSimpleArray(appDataMap["instituteIdNameData"],"instituteId");

	//	console.log(appDataMap["instituteIdNameData"]);

		

		assignSlNoByAnalyzingDbStudent("student_person_data","sp"); //For First Contractor in the List, hence contrIdArray[0]
		//maintainContractorStatus(contrIdArray[0]); //Set the Person Type for First Contractor in the List, hence contrIdArray[0]



		// 	document.getElementById("input-sp-instituteName").addEventListener('change',(e)=>{

		// 		transmitPersonSlNoAndStatus(e,"instituteId","student_person_data","sp"); //Automatically input the SlNo of the person based on the entries for that Contractor

		// })





//@111
		for(x=0;x<3;x++){


			const containerA = document.createElement("div");
			containerA.setAttribute("class","submission-cont c-flex-col");
			containerA.style.gridColumn = "3/4";
			containerA.style.gridRow = (x==0)?"1/8":(x==1)?"8/13":"13/16";
			//containerA.style.height="400px";

				const head = document.createElement("div");
				head.setAttribute("class","subm-cont-head");
				head.innerText=(x==0)?"FORM SUBMISSIONS":(x==1)?"DOCUMENTS":"OTHER";
				containerA.appendChild(head);


			if(x==0){


				const labels = [];
				const ids=[];


				for(y=0;y<labels.length;y++){

					const container = document.createElement("div");
					container.setAttribute("class",`checkbox-${inputClassInitial} c-flex`);
					container.setAttribute("id",ids[y]);


					  for(z=0;z<2;z++){

						const child = document.createElement((z==0)?"input":"div");
						child.setAttribute("class",(z==0)?"":"");
						child.innerText=(z==1)?labels[y]:"";

						if(z==0){
							child.setAttribute("type","checkbox");
						}

						container.appendChild(child);

					 }

					 containerA.appendChild(container);

				}



			}else if(x==1){


				const labels = ["Aadhar Card","Institution ID"];
				const ids=["sub-aadharCardSubmitted","sub-instituteIdSubmitted"];




				for(y=0;y<labels.length;y++){

					const container = document.createElement("div");
					container.setAttribute("class",`checkbox-${inputClassInitial} c-flex`);
					container.setAttribute("id",ids[y]);


					  for(z=0;z<2;z++){

						const child = document.createElement((z==0)?"input":"div");
						child.setAttribute("class",(z==0)?"":"");
						child.innerText=(z==1)?labels[y]:"";

						if(z==0){
							child.setAttribute("type","checkbox");
						}

						container.appendChild(child);

					 }

					 containerA.appendChild(container);

				}




			}else if(x==2){

				const labels = ["HSE Training Attendance"];
				const ids=["att-hseTrainingAttended"];

				for(y=0;y<labels.length;y++){

					const container = document.createElement("div");
					container.setAttribute("class",`checkbox-${inputClassInitial} c-flex`);
					container.setAttribute("id",ids[y]);


					  for(z=0;z<2;z++){

						const child = document.createElement((z==0)?"input":"div");
						child.setAttribute("class",(z==0)?"":"");
						child.innerText=(z==1)?labels[y]:"";

						if(z==0){
							child.setAttribute("type","checkbox");
						}

						container.appendChild(child);

					 }

					 containerA.appendChild(container);

				}





			}



		bodyContainer.appendChild(containerA);
		}


	const btnLabels = ["Save Draft","Add Personnel", "Back"];
	const btnIds2 = ["btn-add-contractor-draft","btn-add-student-person","btn-back-dashboard"];


	for(w=1;w<btnLabels.length;w++){

		const button = document.createElement("button");
		button.setAttribute("class","btn-std-2");
		button.innerText=btnLabels[w];
		button.setAttribute("id",btnIds2[w]);

		bottomContainer.appendChild(button);

		button.addEventListener('click',(e)=>{

			const idName = e.target.id;

			if(idName=="btn-back-dashboard"){
				displayDashboard();
			}else{
				main(idName.slice(4));
			}

		})
	}

		//const btnApprove = document.getElementById("btn-add-contract-person");




		const instituteIdCard = document.getElementById("sub-instituteIdSubmitted").children[0];
		const aadharCard = document.getElementById("sub-aadharCardSubmitted").children[0];



//@112


		//Camera Interface

		const container = document.createElement("div");
		container.setAttribute("class","camera-cont c-flex-col");
		container.style.gridColumn="4/5";
		container.style.gridRow = "1/12";

		bodyContainer.appendChild(container);


		const labelsA = ["","","","Capture","Capture Again","","Upload"];
		const elements = ["canvas","video","img","div","div","input","div"];
		const photoIds = ["canvas","video","input-sp-photo","btn-capture","btn-capture-reset","img-input","btn-upload"];
		const classes = ["canvas-add","img-area","img-area","btn-std-3","btn-std-3","","btn-std-3"];
		const displays = ["none","block","none","flex","flex","none","flex"];


		for(x=0;x<labelsA.length;x++){

			const child = document.createElement(elements[x]);
			child.setAttribute("class",classes[x]);
			child.setAttribute("id",photoIds[x]);
			child.innerText=(x==3 || x==6)?labelsA[x]:"";
			child.style.display=displays[x];

			if(elements[x]=="canvas" || elements[x]=="video"){
				child.width=(elements[x]=="canvas")?195:600;
				child.height=(elements[x]=="canvas")?250:768;
			}else if(elements[x]=="input"){
				child.setAttribute("type","file");
			} 

			container.appendChild(child);
		}

//@113
		
		 let width=320;
		 let height=0;

		let streaming=false;

		const  video= document.getElementById("video");
		const  canvas = document.getElementById("canvas");
		const  photo = document.getElementById("input-sp-photo");
		//const btnCamRestart = document.getElementById("btn-restart")
		const  btnCapture = document.getElementById("btn-capture");
		const  btnCaptureReset = document.getElementById("btn-capture-reset");
		const btnUpload = document.getElementById("btn-upload");
		const btnAdd = document.getElementById("btn-add");
		let imgInput = document.getElementById("img-input");

	//	btnCapture.setAttribute("onclick","takePicture(this,canvas,photo,video,btnCapture)");

		btnCaptureReset.style.display="none";

		btnCapture.innerText = "CAPTURE";
		btnCaptureReset.innerText = "CAPTURE AGAIN";
		appDataMap["personPhoto"] = "";

//Connecting the Camera
		navigator.mediaDevices.getUserMedia({video:{"width":400,"height":512},audio:false})
		.then(function(stream){

			video.srcObject = stream;
			video.play();

			appDataMap["camStream"] = stream.getTracks()[0];

		}).catch((error)=>{
			//showNotification("Error",error.message);
			console.log("Error = " + error.message);

		});

//Setting the height of the Canvas ast Start of Video Play, this function runs only at start

		video.addEventListener('canplay',function(e){
			if(!streaming){
				height=video.videoHeight/ (video.videoWidth/width);
				streaming=true;
			}
		},false);


		function cameraReset(){
			video.style.display="block";
			photo.style.display="none";
			photo.src=dummyImgPath;  
		}


		btnCapture.addEventListener('click',function(ev){
				takePicture();

				//checkMandatoryInputs();

				console.log(ev.target);
				ev.target.style.display = "none";
				btnCaptureReset.style.display = "block";
		
				ev.preventDefault();
			},false);


			function takePicture(){

				var context = canvas.getContext('2d');
		
				if(width && height){
					canvas.width=width;
					canvas.height=height;
					context.drawImage(video,0,0,width,height);
		
					
					
				var data = canvas.toDataURL('image/jpeg');
				photo.setAttribute('src',data); //setting the image placeholder in the input view to the image captured
				appDataMap["personPhoto"] = data
				//appDataMap["personPhoto"] = data.split(";base64,").pop(); //holding the image in the upload map. So that it can be inserted to db

				// const base64Img= data.split(";base64,").pop();

				// fs.writeFile("image.jpg",base64Img,{encoding:"base64"},function(err){
				// 	console.log(err)
				// });
		
				video.style.display="none";
				photo.style.display="block";

		
					checkMandatoryInputs();
		
				}else{
					clearPhoto();
				}
			}


	
		
			btnCaptureReset.addEventListener('click',function(ev){

				video.style.display="block";
				photo.style.display="none";
				photo.src=dummyImgPath;
				appDataMap["personPhoto"] = "";

				//takePicture();
				ev.preventDefault();

				this.style.display = "none";
				btnCapture.style.display = "block";


					checkMandatoryInputs();
			},false);


			btnUpload.addEventListener('click',()=>{
				console.log("clicked button");
				photoUpload();

			});


			imgInput.addEventListener('change',(ev)=>{
				console.log(URL.createObjectURL(ev.target.files[0]));

				console.log(ev.target);

	//Resetting the camera

				//btnCapture.innerText = "Camera Capture";	

				// btnCapture.addEventListener('click',function(ev){

				// 	video.style.display="block";
				// 	photo.style.display="none";
				// 	photo.src=dummyImgPath;   //Resetting the image area src

				// 	//takePicture();
				// 	ev.preventDefault();
				// 	btnCapture.innerText = "CAPTURE IMAGE";

				// 		btnCapture.addEventListener('click',function(ev){
				// 			takePicture();
						
				// 			ev.preventDefault();
				// 		},false);

				// 		checkMandatoryInputs();

				// },false);

//]]


				//const imgUploaded = URL.createObjectURL(ev.target.files[0]);

				const imgUploaded = document.createElement('img');
				imgUploaded.src=URL.createObjectURL(ev.target.files[0]);
				//photo.src=URL.createObjectURL(ev.target.files[0]);


				imgUploaded.addEventListener('load',e=>{

				var context = canvas.getContext('2d');

				console.log(photo.style.height);
				console.log(photo.style.width);

				context.drawImage(imgUploaded,0,0,canvas.width,canvas.height);

				const data = canvas.toDataURL('image/jpeg',1)
				photo.setAttribute('src',data);
				appDataMap["personPhoto"] = data

				//appDataMap["personPhoto"] = data.split(";base64,").pop();

				
				btnCapture.style.display = "none";
				btnCaptureReset.style.display = "flex";

	
					video.style.display="none";
					photo.style.display="block";

					checkMandatoryInputs();

				});


			});


	function photoUpload(){
		imgInput.click();
	};











//const mandItems = ["input-sp-personName", "input-sp-instituteName", "input-sp-personSlNo","input-sp-dateOfBirth","input-sp-localAddress","input-sp-permanentAddress","input-sp-fathersName", "input-sp-mothersName", "input-sp-bloodGroup","input-sp-gender","input-sp-maritalStatus", "input-sp-identificationMarks", "input-sp-contactNo", "input-sp-emgContactNo", "input-sp-wageRate", "input-sp-personType","input-sp-esiNo","input-sp-insuranceNo","input-sp-uan","input-sp-passportDate","input-sp-aadharNo","sub-aadharCardSubmitted","sub-polVerSubmitted","sub-passportSubmitted","sub-mediCertSubmitted","sub-ageProofCertSubmitted","sub-savBankSubmitted","sub-gatePassFormSubmitted","sub-workmenBioSubmitted","sub-esiDeclSubmitted","sub-epfDeclSubmitted","sub-epfNomSubmitted","sub-contractIntvwSubmitted","sub-esiEpfUndSubmitted","sub-empCompPackSubmitted","att-hseTrainingAttended"]
	const mandItems = ["input-sp-personName"]
for(q=0;q<mandItems.length;q++){

		document.getElementById(mandItems[q]).addEventListener('change',(e)=>{

			checkMandatoryInputs();

		})
	};

//@114
//Function to check all important inputs are inputted


	// function checkMandatoryInputs(){



	// 	const mandInfos = ["input-sp-personName", "input-sp-contractorName","input-sp-personSlNo","input-sp-dateOfBirth","input-sp-localAddress","input-sp-permanentAddress","input-sp-bloodGroup","input-sp-gender","input-sp-maritalStatus", "input-sp-contactNo", "input-sp-emgContactNo", "input-sp-personType","input-sp-aadharNo"];
	// 	//const mandInfos2 = ["input-sp-esiNo","input-sp-insuranceNo","input-sp-uan","input-sp-passportDate"];
	// 	const mandInfosEsiEpf = ["input-sp-esiNo","input-sp-uan"];
	// 	const mandInfosEpf = ["input-sp-uan","input-sp-insuranceNo"];
	// 	const mandInfosExem = ["input-sp-insuranceNo"];
	// 	const mandOthers = ["att-hseTrainingAttended"];

	// 	const mandDocs = ["sub-aadharCardSubmitted","sub-mediCertSubmitted","sub-ageProofCertSubmitted","sub-savBankSubmitted"];
	// 	const mandDocs2 = ["sub-polVerSubmitted","sub-passportSubmitted"];

	// 	const mandSubms = ["sub-gatePassFormSubmitted","sub-workmenBioSubmitted","sub-contractIntvwSubmitted"];
	// 	const mandSubmsEsiEpf = ["sub-esiDeclSubmitted","sub-epfDeclSubmitted","sub-epfNomSubmitted"];
	// 	//const mandEsiSubms = ["sub-gatePass","sub-workmenBio","sub-esiDecl","sub-epfDecl","sub-epfNom","sub-contractIntvw","sub-esiEpfUnd","sub-empCompPack"];
	// 	const mandSubmsEpf = ["sub-epfDeclSubmitted","sub-epfNomSubmitted","sub-esiEpfUndSubmitted","sub-empCompPackSubmitted"];
	// 	const mandSubmsExem = ["sub-esiEpfUndSubmitted","sub-empCompPackSubmitted"];


	// //	const epfStatus = (document.getElementById("epf-no").style.backgroundColor=="")?true:false;
	// //	const esiStatus = (document.getElementById("esi-no").style.backgroundColor=="")?true:false;

	// 	console.log(epfStatus+esiStatus);

	// 	//let mandInfos2 =(epfStatus && esiStatus)?mandInfosEsiEpf:(epfStatus)?mandInfosEpf:mandInfosExem;
	// 	//let mandSubms2 = (epfStatus && esiStatus)?mandSubmsEsiEpf:(epfStatus)?mandSubmsEpf:mandSubmsExem;

	// 	let mandInfos2 =(epfStatus && esiStatus)?mandInfosEsiEpf:mandInfosExem;
	// 	let mandSubms2 = (epfStatus && esiStatus)?mandSubmsEsiEpf:mandSubmsExem;

	// 	console.log(mandInfos2);
	// 	console.log(mandSubms2);

	// 	const nMap={};

	// 	nMap["info"]=0;
	// 	nMap["info2"]=0;

	// 	nMap["subm"]=0;
	// 	nMap["subm2"]=0;

	// 	nMap["doc"]=0;
	// 	nMap["doc2"]=0;

	// 	nMap["other"]=0;

	// 	let countId = 0;
	// 	let countSubm = 0;

	// 	const arrays = [mandInfos,mandInfos2,mandSubms,mandSubms2,mandDocs,mandDocs2,mandOthers];
	// 	const key = ["info","info2","subm","subm2","doc","doc2","other"];

	// 	for(x=0;x<arrays.length;x++){

	// 		const array = arrays[x];

	// 		console.log(nMap[key[x]]);

	// 		//console.log(array);

	// 		for(y=0;y<array.length;y++){
				
	// 			if(x==0 || x==1){

	// 				const info = document.getElementById(array[y]);

	// 				if(info.value!=""){
	// 					console.log(key[x]);
	// 				 	nMap[key[x]]=nMap[key[x]]+1;
	// 				 	console.log(nMap[key[x]]);
	// 				}
	// 			}else{
	// 				console.log(x);

	// 				console.log(array[y]);
	// 				const info = document.getElementById(array[y]).children[0];

	// 				console.log(info);


	// 				if(info.checked==true){
	// 				  nMap[key[x]]++;
	// 				}

	// 			}


	// 			}



	// 		}


	// let nCount = 0;
	// let sCount=0;



	// 	for(x=0;x<arrays.length;x++){

	// 		const array = arrays[x];

	// 			if(array!=mandDocs2){

	// 				if(nMap[key[x]]>=array.length){
	// 					nCount++;

	// 					console.log(array.length);
	// 					console.log(x);

	// 				}

	// 			}else{

	// 				if(nMap[key[x]]>=1){
	// 					nCount++;
	// 				}

	// 			}

				


	// 		}


	// 	sCount=(photo.style.display=="none")?0:1;


			

	// 	key.forEach((key)=>{

	// 		console.log(key+"="+nMap[key]);

	// 	});



	// 	console.log(nCount+sCount);


	// 	//btnApprove.style.display=(nCount+sCount==arrays.length+1)?"block":"none";

		
	// }

//dummy function for temporary purpose, when needed please DELETE this and uncomment the above actual function
	function checkMandatoryInputs(){}


//@12
	}else if(action=="add-student-person"){

		showProgressLoader()

		const mMap={};

		let greenSignal = true;


		const labels = ["Name","Institute Name","Person Serial No","Date of Birth","Class","Course","Local Address","Permanent Address","Blood Group","Fathers Name", "Mothers Name","Gender","Contact No", "Emg Contact No", "Type","Aadhar No","Pass Validity Start","Pass Validity End"];

		const ids = ["input-sp-personName","input-sp-instituteName", "input-sp-personSlNo","input-sp-dateOfBirth","input-sp-className","input-sp-courseName","input-sp-localAddress","input-sp-permanentAddress","input-sp-bloodGroup","input-sp-fathersName", "input-sp-mothersName","input-sp-gender", "input-sp-personContactNo", "input-sp-personEmgContactNo","input-sp-personType","input-sp-aadharNo","input-sp-dateOfPassValidityStart","input-sp-dateOfPassExpiry"];

		const docIds=["sub-aadharCardSubmitted","sub-instituteIdSubmitted"];
		const submIds=[];
		const attIds=["att-hseTrainingAttended"];

		const otherDbKeys=[];
		
		const inputType = ["text","select","text","date","select","select","textarea","textarea","select", "text","text","select","number","number", "select", "number", "date", "date"];

		const xKeys = ["Institute ID","Aadhar No"];
		const xIds = ["tile-instituteId","tile-aadharCard"];
		const hiddenKeys = [];

		const dbKeys=idToKeyArray(ids);
		const submDbKeys = idToKeyArray2(submIds);
		const docDbKeys = idToKeyArray2(docIds);
		const attDbKeys = idToKeyArray2(attIds);
		//const otherDbKeys = idToKeyArray(otherIds);


		const inputs = bodyContainer.getElementsByClassName("input-sp");
		const checkboxs = bodyContainer.getElementsByClassName("checkbox-sp");
		const missedInputs = [];

//Input Validation
		for(x=0;x<inputs.length;x++){

			const input = inputs[x];	
				const key = input.id.split(/\-/)[2];
				mMap[key] = input.value;
		};

		for(x=0;x<checkboxs.length;x++){
			const checkbox = checkboxs[x];	
				//const key = (checkbox.id=="att-hseTraining")?checkbox.id.split(/\-/)[1]+"Attended":checkbox.id.split(/\-/)[1]+"Submitted";
				const key = checkbox.id.split(/\-/)[1];
				mMap[key] = (checkbox.children[0].checked)?"Yes":"No";
				console.log(key+"-"+mMap[key]);
		};






//]]



		mMap["dateOfJoining"] = getFormattedDate(new Date());
		mMap["dateOfCardExpiry"] = getFormattedDate(getfutureDate(90));
		mMap["isHeld"] = "No";
		mMap["personStatus"] = "Active";

		console.log(mMap)

		mMap["creationDate"] = getDate();
		
		mMap["personId"] = "INT"+mMap["personSlNo"];

		mMap["personPhoto"] = appDataMap["personPhoto"];


		const adlDbKeys = ["personId","personPhoto","isHeld","personStatus"];

		// const photoFolderName = `AppData/images/student-person/${mMap["personId"]}`
		// mMap["personPhotoPath"] = `${photoFolderName}/photo.jpg`

		// const folder1Name = "AppData";
		// const folder2Name = "images"
		// const folder3Name = "student-person";

		// if(!fs.existsSync(`./${folder1Name}`)){
		// 	fs.mkdirSync(`./${folder1Name}`)
		// 	fs.mkdirSync(`./${folder1Name}/${folder2Name}`)
		// 	fs.mkdirSync(`./${folder1Name}/${folder2Name}/${folder3Name}`)
		// }else{
		// 	if(!fs.existsSync(`./${folder1Name}/${folder2Name}`)){
		// 		fs.mkdirSync(`./${folder1Name}/${folder2Name}`)
		// 		fs.mkdirSync(`./${folder1Name}/${folder2Name}/${folder3Name}`)
		// 	}else{
		// 		if(!fs.existsSync(`./${folder1Name}/${folder2Name}/${folder3Name}`)){
		// 			fs.mkdirSync(`./${folder1Name}/${folder2Name}/${folder3Name}`)
		// 		}
		// 	}
		// }


		//const dbKeys1=['personName','contractorName','personSlNo','dateOfBirth','tradeName','localAddress','permanentAddress','dateOfJoining','personId','contractorId']


		if(greenSignal){


			con.connect((err)=>{

					con.on('error',(err)=>{
						console.log("Error ="+err.message);
						handleError();
					});


		


const query= `INSERT INTO student_person_data (${dbKeys},${adlDbKeys},${docDbKeys},${attDbKeys},creationDate) 
				VALUES('${mMap["personName"]}',
				'${mMap["instituteName"]}',
				'${mMap["personSlNo"]}',
				'${mMap["dateOfBirth"]}',
				'${mMap["className"]}',
				'${mMap["courseName"]}',
				'${mMap["localAddress"]}',
				'${mMap["permanentAddress"]}',
				'${mMap["bloodGroup"]}',
				'${mMap["fathersName"]}',
				'${mMap["mothersName"]}',
				'${mMap["gender"]}',
				'${mMap["personContactNo"]}',
				'${mMap["personEmgContactNo"]}',
				'${mMap["personType"]}',
				'${mMap["aadharNo"]}',
				'${mMap["dateOfPassValidityStart"]}',
				'${mMap["dateOfPassExpiry"]}',
				'${mMap["personId"]}',
				'${mMap["personPhoto"]}',
				'${mMap["isHeld"]}',
				'${mMap["personStatus"]}',
				'${mMap["aadharCardSubmitted"]}',
				'${mMap["instituteIdSubmitted"]}',
				'${mMap["hseTrainingAttended"]}',
				'${mMap["creationDate"]}')`;

// const query= `INSERT INTO student_person_data (personName,instituteName,personSlNo,personId,instituteId,courseName) 
// 				VALUES('${mMap["personName"]}',
//  				'${mMap["instituteName"]}',
// 				'12','INST011020','48dsjdf','Accomodation')`;




				con.query(query,(err,result)=>{



						con.on('error',(err)=>{
							console.log(query);
							console.log("Error ="+err.message);
							handleError();
						});

						console.log(query);

					

						if(err != null){
							showNotification("Error","Student Personnel Addition Error")
							console.log("errorCode=",err.code)
							console.log("errorMessage=",err.message)
							console.log("errorNo",err.errno)
							console.log("errObj",err)
							hideProgressLoader()
						}else{
							hideProgressLoader()
							showNotification("Success","Student Personnel Succesfully Added")	

						// 	if(!fs.existsSync(`./${folder1Name}/${folder2Name}/${folder3Name}/${mMap["personId"]}`)){
						// 		fs.mkdirSync(`./${folder1Name}/${folder2Name}/${folder3Name}/${mMap["personId"]}`)
						// 	}
					
						// 	fs.writeFile(mMap["personPhotoPath"], appDataMap["personPhoto"],{encoding:"base64"},function(err){
									
						// 					if (err==null){
						// 						showNotification("Success","Student Personnel Succesfully Added")	
						// 					}else{
						// 						showNotification("Success","Student Personnel Succesfully Added without Photo")	
						// 					}
										
						// 			});
						// 	console.log("result=",result)
						// }
						}
					



				})



			})

		
			


		}




//@13
	}else if(action=="manage-student-person"){

		const personGroupTerm = "institute";
		const personTerm = "student";
		//const personGroupIdNameMap =  appDataMap["instituteIdNameData"]
		const personGroupIdNameMap =  appDataMap["instituteNameData"]
		const personIdNameMap =  appDataMap["studentIdNameData"]
		const identifiers=["institute","person"];
		const personDbTableName = "student_person_data" 
	    const personGroupKeyName = "instituteName"

		title.innerText = "Manage Student";

		bodyContainer.innerHTML="";
		mainContainer.style.backgroundColor="";
		bodyContainer.setAttribute("class","c-flex-col");

		const container = document.createElement("div");
		container.setAttribute("class","id-select-cont-b");

		console.log(appDataMap.contractorId);
		console.log(appDataMap.personId);

			for(y=0;y<2;y++){

				const subCont = document.createElement("div");
				subCont.setAttribute("class","id-select-cont2b c-flex-col");

				subCont.innerText=(y==0)?`SELECT ${personGroupTerm.toUpperCase()}`:`SELECT ${personTerm.toUpperCase()}`;

			
				const datas = (y==0)?sqlToSimpleMap(personGroupIdNameMap):sqlToSimpleMap(personIdNameMap);

				const identifier=[...identifiers];

					console.log(datas);
					const child = document.createElement("select");
					child.setAttribute("class",(y==0)?"select-box select-filter":"select-box select-filter-sub");
					child.setAttribute("id",(y==0)?"contractor-selection":"contract-person-selection");
					
					child.style.color="black";

					if(y==0){

						for(z=0;z<datas[identifier[y]+"Name"]?.length;z++){

							console.log(datas[identifier[y]+"Name"][z])

							const subChild = document.createElement("option");
							subChild.setAttribute("value",datas[identifier[y]+"Name"][z]);
							subChild.innerText=datas[identifier[y]+"Name"][z];

							child.appendChild(subChild);
						}

					}

					subCont.appendChild(child);

				
				container.appendChild(subCont);
			}

			bodyContainer.appendChild(container);






		document.querySelector(".select-filter").addEventListener("change",(e)=>{

			const parent = e.target.parentElement.parentElement;
			const id = e.target.value; // actually instituteName

			con.connect((err)=>{


				const query=`SELECT personId,personName,isHeld,personStatus FROM ${personDbTableName} WHERE ${personGroupKeyName}='${id}'`;

				con.query(query,(err,result)=>{


					console.log(query);
					console.log(result);

					const datas = sqlToSimpleMap(result);

					const child = document.querySelector('.select-filter-sub');

					child.innerHTML="";


					const options = result;

					console.log(options);

					for(x=0;x<options.length;x++){

						const subChild = document.createElement("option");
						subChild.setAttribute("value",options[x]["personId"]);
						subChild.innerText=options[x]["personId"]+" - "+options[x]["personName"];
						subChild.style.backgroundColor=(options[x]["isHeld"]=="Yes")?"red":(options[x]["personStatus"]=="Expired")?colorExp:"";
						subChild.style.color=(options[x]["isHeld"]=="Yes")?"white":(options[x]["personStatus"]=="Expired")?"white":"";
						child.appendChild(subChild);

					}

					console.log(appDataMap.firstVisit);

//Maintaining the same person when returning from View Details Screen
					if(!appDataMap.firstVisit){
							appDataMap.firstVisit=true;
							child.value = appDataMap.personId; //here child is the dropdown of "SELECT PERSONNEL"
					}



				})



			})



		})//select-filter.addEvent

//Maintaining the same contractor when returning from View Details Screen
	if(!appDataMap.firstVisit){
		 document.querySelector(".select-filter").value=appDataMap.contractorId;
	}


				
//Causing a change in the "Select Contractor" Selection so that "Select Contract Personnel" is Created
	const changeEvent = new Event("change");

	document.querySelectorAll(".select-filter").forEach((item)=>{

	   item.dispatchEvent(changeEvent);

	});




		bottomContainer.innerHTML="";


		const btnLabels = ["Go","Back"];
		const btnIds = ["view-student-person","btn-back-dashboard"];
		const functions = ["view-student-person","display-dashboard"];

		for(y=0;y<btnLabels.length;y++){

		const button = document.createElement("button");
		button.innerText=btnLabels[y];
		button.setAttribute("class","btn-std-2");
		button.setAttribute("data-function_name",functions[y]);
		button.setAttribute("id",btnIds[y]);

		bottomContainer.appendChild(button);

		console.log(bottomContainer.innerHTML);

			document.getElementById(btnIds[y]).addEventListener('click',(e)=>{
					
				const functionName = e.target.dataset.function_name;

				if(e.target.id=="btn-back-dashboard"){
					
					appDataMap.firstVisit=true; //Reverting "First Visit" value when exiting to the Dashboard
					displayDashboard();

				}else{

//Changing the "First Visit" value so that on coming back the same person is maintained
					appDataMap.firstVisit=false;
					appDataMap.contractorId = document.querySelector(".select-filter").value; //Storing the contractor id
					appDataMap.personId = document.querySelector(".select-filter-sub").value; // Stroing the person id

					main(functionName);
				}

			    

			});

		}


		


	
//@14
	}else if(action=="view-student-person"){

		title.innerText="View Student";


		const personGroupTerm = "institute";
		const personTerm = "student";
		//const personGroupIdNameMap =  appDataMap["instituteIdNameData"]
		const personGroupIdNameMap =  appDataMap["instituteNameData"]
		const personIdNameMap =  appDataMap["studentIdNameData"]
		const identifiers=["institute","person"];
		const personDbTableName = "student_person_data" 
	    const personGroupIdKeyName = "instituteId"

		//const personId = document.getElementById("contract-person-selection").value.split(/\-/)[0].trim();

		const personId = appDataMap.personId;


		con.connect((err)=>{

					con.on('error',(err)=>{
						console.log("Error ="+err.message);
						handleError();
					});

					const query = `SELECT * FROM ${personDbTableName} WHERE personId='${personId}'`;

					con.query(query,(err,result)=>{

						con.on('error',(err)=>{
						console.log("Error ="+err.message);
						handleError();
					});


						appDataMap["curPersonData"]  = {...result[0]};

						mMap={};
						mMap={...appDataMap["curPersonData"]} ;

						//mMap["hInsuranceNo"]=(mMap["esiApplicability"]=="Yes")?mMap["esiNo"]:mMap["insuranceNo"];

						console.log(result);



		bodyContainer.innerHTML="";
		bottomContainer.innerHTML="";

		bodyContainer.style.height="80%";
		bottomContainer.style.height="10%";

		const classType="input-cp"

		const noOfRows = 15;

		const labels = ["Name","Institute Name","Person Serial No","Date of Birth","Class","Course","Local Address","Permanent Address","Blood Group","Fathers Name", "Mothers Name","Gender","Contact No", "Emg Contact No", "Type","Aadhar No","Pass Validity Start","Pass Validity End"];
		const dbKeys = ["personName","instituteName", "personSlNo","dateOfBirth","className","courseName","localAddress","permanentAddress","bloodGroup","fathersName", "mothersName","gender", "personContactNo", "personEmgContactNo","personType","aadharNo","dateOfPassValidityStart","dateOfPassExpiry"];
		const ids = ["input-sp-personName","input-sp-instituteName", "input-sp-personSlNo","input-sp-dateOfBirth","input-sp-className","input-sp-courseName","input-sp-localAddress","input-sp-permanentAddress","input-sp-bloodGroup","input-sp-fathersName", "input-sp-mothersName","input-sp-gender", "input-sp-personContactNo", "input-sp-personEmgContactNo","input-sp-personType","input-sp-aadharNo","input-sp-dateOfPassValidityStart","input-sp-dateOfPassExpiry"];
		const gridRows=["1/2","2/3","3/4","4/5","5/6","6/7","7/10","10/13","13/14","14/15","15/16","1/2","2/3","3/4","4/5","5/6","6/7","7/8","8/9","9/10","10/11","11/12","12/13","13/14"];
		const gridColumns=["1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3"];
		const inputType = ["text","select","text","date","select","select","textarea","textarea","select","text","text","select","number", "number", "select", "number", "date","date"];
		const xKeys = [];
		const xIds = [];
		const hiddenKeys = [];
	


		const blockTags = ["Hold","Expired"];
		const isBlocked = (blockTags.includes(mMap["personStatus"]))?true:false;

		//const xLabels = ["ESI No","Insurance No","UAN","Passport Issue Date","Aadhar No"];
		//const keyFactors = ["esiApplicability","esiApplicability","epfApplicability","passportSubmitted","aadharCardSubmitted"];



		bodyContainer.setAttribute("class","input-list-cont");
		bodyContainer.style.gridTemplateRows=`repeat(${noOfRows},2rem)`;
		mainContainer.style.backgroundColor=(mMap["isHeld"]=="Yes")?colorBlockBack:(mMap["personStatus"]=="Expired")?colorExpBack:"";

		for(x=0;x<labels.length;x++){

			const container = document.createElement("div");
			container.setAttribute("class","input-tile");
			
			if(labels[x]=="Aadhar No"){

				console.log(gridColumns[x]+" "+gridRows[x]);
			}

			container.style.gridColumn = gridColumns[x];
			container.style.gridRow = gridRows[x];





			for(y=0;y<2;y++){

				//const child = document.createElement((y==0)?"div":(inputType[x]=="select")?"select":"input");
				const child = document.createElement("div");
				child.setAttribute("class",(y==0)?"input-tile-label c-flex":"input-tile-desc c-flex");
				//child.setAttribute("type",(y==1)?inputType[x]:"");
				//child.setAttribute("id",(y==1)?ids[x]:"");
				child.innerText=(y==0)?labels[x]:mMap[dbKeys[x]];


				if(y==1){


						if(inputType[x]=="date" && mMap[dbKeys[x]]!="0000-00-00"){

							child.innerText=getIndiaDate(mMap[dbKeys[x]]);

							mMap[dbKeys[x]+"India"]=getIndiaDate(mMap[dbKeys[x]]);

						}



				}




						container.appendChild(child);

				}



			bodyContainer.appendChild(container);

		};//for(x=0;x<labels.length;x++)



//@111
		for(x=0;x<3;x++){


			const containerA = document.createElement("div");
			containerA.setAttribute("class","submission-cont c-flex-col");
			containerA.style.gridColumn = "3/4";
			containerA.style.gridRow = (x==0)?"1/8":(x==1)?"8/13":"13/16";
			//containerA.style.height="400px";

				const head = document.createElement("div");
				head.setAttribute("class","subm-cont-head");
				head.innerText=(x==0)?"FORM SUBMISSIONS":(x==1)?"DOCUMENTS":"OTHER";
				containerA.appendChild(head);


			if(x==0){


				// const labels = ["Gate Pass Application","Register of Workmen Employed by Contractor","ESIC Declaration","EPF Declaration","EPF Nomination","Contract Worker Interview","ESI and EPF Exemption Undertaking","Employee Compensation Package"];
				// const ids=["sub-gatePassFormSubmitted","sub-workmenBioSubmitted","sub-esiDeclSubmitted","sub-epfDeclSubmitted","sub-epfNomSubmitted","sub-contractIntvwSubmitted","sub-esiEpfUndSubmitted","sub-empCompPackSubmitted"];
				// const submDbKeys = idToKeyArray2(ids);

				// for(y=0;y<labels.length;y++){

				// 	const container = document.createElement("div");
				// 	container.setAttribute("class","checkbox-cp c-flex");
				// 	container.setAttribute("id",ids[y]);


				// 	  for(z=0;z<2;z++){

				// 		const child = document.createElement((z==0)?"input":"div");
				// 		child.setAttribute("class",(z==0)?"":"");
				// 		child.innerText=(z==1)?labels[y]:"";

				// 		if(z==0){
				// 			child.setAttribute("type","checkbox");
				// 			child.checked=(mMap[submDbKeys[y]]=="Yes")?true:false;
				// 			child.disabled=true;
				// 		}

				// 		container.appendChild(child);

				// 	 }

				// 	 containerA.appendChild(container);

				// }



			}else if(x==1){


				const labels = ["Aadhar Card","Institution ID"];
				const ids=["sub-aadharCardSubmitted","sub-instituteIdSubmitted"];
				const docDbKeys = idToKeyArray2(ids);



				for(y=0;y<labels.length;y++){

					const container = document.createElement("div");
					container.setAttribute("class","checkbox-cp c-flex");
					container.setAttribute("id",ids[y]);


					  for(z=0;z<2;z++){

						const child = document.createElement((z==0)?"input":"div");
						child.setAttribute("class",(z==0)?"":"");
						child.innerText=(z==1)?labels[y]:"";

						if(z==0){
							child.setAttribute("type","checkbox");
							child.checked=(mMap[docDbKeys[y]]=="Yes")?true:false;
							child.disabled=true;
						}

						container.appendChild(child);

					 }

					 containerA.appendChild(container);

				}




			}else if(x==2){

				const labels = ["HSE Training Attendance"];
				const ids=["att-hseTrainingAttended"];
				const attDbKeys = idToKeyArray2(ids);

				for(y=0;y<labels.length;y++){

					const container = document.createElement("div");
					container.setAttribute("class","checkbox-cp c-flex");
					container.setAttribute("id",ids[y]);


					  for(z=0;z<2;z++){

						const child = document.createElement((z==0)?"input":"div");
						child.setAttribute("class",(z==0)?"":"");
						child.innerText=(z==1)?labels[y]:"";

						if(z==0){
							child.setAttribute("type","checkbox");
							child.checked=(mMap[attDbKeys[y]]=="Yes")?true:false;
							child.disabled=true
						}

						container.appendChild(child);

					 }

					 containerA.appendChild(container);

				}





			}//else if(x==2)



			bodyContainer.appendChild(containerA);
		}//for(x=0;x<3)



		//Photo Display

		const container = document.createElement("div");
		container.setAttribute("class","camera-cont c-flex-col");
		container.style.gridColumn="4/5";
		container.style.gridRow = "1/11";

		bodyContainer.appendChild(container);


		const labelsA = ["","Generate ID"];
		const elements = ["img","button"];
		const photoIds = ["input-cp-photo","btn-card"];
		const classes = ["img-area","btn-std-2"];



		for(x=0;x<labelsA.length;x++){

			const child = document.createElement(elements[x]);
			child.setAttribute("class",classes[x]);
			child.setAttribute("id",photoIds[x]);
			child.disabled=(elements[x]=="button")?(mMap["isHeld"]=='Yes' || mMap["personStatus"]=='Expired'):false;
			child.style.backgroundColor=(elements[x]=="button")?((mMap["isHeld"]=='Yes' || mMap["personStatus"]=='Expired')?"grey":""):"";
			child.innerText=(x==1)?labelsA[x]:"";
			//child.setAttribute("src",(elements[x]=="img")?`../${mMap["personPhotoPath"]}`:"");
			child.setAttribute("src",(elements[x]=="img")?mMap["personPhoto"]:"");
		//	console.log("photoPath",mMap["personPhotoPath"])

			container.appendChild(child);
		};


		const mArray = [];
		mArray.push(mMap);



		const btnCard = document.getElementById("btn-card");

		btnCard.addEventListener('click',function(){

				ipcRenderer.send('open-window',{name:"card",
				data:{datas:mArray,cardType:"A",personType:"student"}});

		});


		bottomContainer.innerHTML="";


			const btnLabels = ["Edit Personnel","Delete Personnel","Back"];
			const btnIds2 = ["btn-edit-student-person-input","btn-delete-student-person","btn-manage-student-person"];
			const functionName2 = ["edit-student-person-input","delete-student-person","manage-student-person"];
			const btnColors = ["",colorWarning,""];

			for(w=0;w<btnLabels.length;w++){

				const button = document.createElement("button");
				button.setAttribute("class","btn-std-2");
				button.setAttribute("data-function_name",functionName2[w]);
				button.style.backgroundColor=(btnLabels[w]=="Block" && mMap["isHeld"]=="Yes")?"black":btnColors[w];
				button.innerText=(btnLabels[w]=="Block" && mMap["isHeld"]=="Yes")?"Unblock":btnLabels[w];
				button.setAttribute("id",btnIds2[w]);

				if(btnLabels[w]=="Renew Card" && mMap["personStatus"]=="Active"){

				}else{

					bottomContainer.appendChild(button);
				}



				

				button.addEventListener('click',(e)=>{

					const idName = e.target.id;
					const label=e.target.innerText;

					if(idName=="btn-delete-student-person"){

							showNotification("Warning","This will delete all the records pertaining to this Contract Personnel, do you want to proceed?");

							notifBtn.addEventListener("click",deleteData);

											
													function deleteData(e){

													const parent = e.target.parentElement.parentElement.parentElement;
													parent.style.display="none";

													const query = `DELETE FROM ${personDbTableName} WHERE personId='${mMap["personId"]}';`

																con.query(query,(err,result)=>{

																	console.log(result);
																	console.log(query);

																showResult(result,err,"delete");

																setTimeout(()=>{

																	main("manage-student-person");

																},2000);
															});

														notifBtn.removeEventListener("click",deleteData);

													}




					}else{
						main(e.target.dataset.function_name);
					}

						

				})
			}

			});//con.query

		});//con.connect
//@15
	}else if(action=="edit-student-person-input"){


		bodyContainer.innerHTML = "";

		let mMap = {};
		console.log(appDataMap["curPersonData"])
		mMap = appDataMap["curPersonData"] ;


		//bodyContainer.style.height="85%";
		//bottomContainer.style.height="10%";

		title.innerText="Edit Student";

		const inputClassInitial="sp"

		const noOfRows = 15;

		const labels = ["Name","Institute Name","Person Serial No","Date of Birth","Class","Course","Local Address","Permanent Address","Blood Group","Fathers Name", "Mothers Name","Gender","Contact No", "Emg Contact No", "Type","Aadhar No","Pass Validity Start","Pass Validity End"];
		const dbKeys = ["personName","instituteName", "personSlNo","dateOfBirth","className","courseName","localAddress","permanentAddress","bloodGroup","fathersName", "mothersName","gender", "personContactNo", "personEmgContactNo","personType","aadharNo","dateOfPassValidityStart","dateOfPassExpiry"];
		//const ids = ["input-sp-personName","input-sp-instituteName", "input-sp-personSlNo","input-sp-dateOfBirth","input-sp-className","input-sp-courseName","input-sp-localAddress","input-sp-permanentAddress","input-sp-bloodGroup","input-sp-fathersName", "input-sp-mothersName","input-sp-gender", "input-sp-personContactNo", "input-sp-personEmgContactNo","input-sp-personType","input-sp-aadharNo","input-sp-dateOfPassValidityStart","input-sp-dateOfPassExpiry"];
		const gridRows=["1/2","2/3","3/4","4/5","5/6","6/7","7/10","10/13","13/14","14/15","15/16","1/2","2/3","3/4","4/5","5/6","6/7","7/8","8/9","9/10","10/11","11/12","12/13","13/14"];
		const gridColumns=["1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3"];
		const inputType = ["text","text","text","date","select","select","textarea","textarea","select","text","text","select","number", "number", "select", "number", "date","date"];
		//please note the inputType corresponding to Institute Name has been changed to text as we do not want to edit it once it has been assigned
		
		const ids=keyToIdArray(`input-${inputClassInitial}`,dbKeys);
		const infoDbKeys = idToKeyArray(ids);
		const disabledKeys=[]
		const xKeys = [];
		const xIds = [];
		const hiddenKeys = [];
		let options=[];


		bodyContainer.setAttribute("class","input-list-cont");
		bodyContainer.style.gridTemplateRows=`repeat(${noOfRows},2rem)`;

		for(x=0;x<labels.length;x++){

			const container = document.createElement("div");
			container.setAttribute("class","input-tile");
			
			container.style.gridColumn = gridColumns[x];
			container.style.gridRow = gridRows[x];


			for(y=0;y<2;y++){
//For non select items 
				const child = document.createElement((y==0)?"div":(inputType[x]=="select"||inputType[x]=="textarea")?inputType[x]:"input");
				child.setAttribute("class",(y==0)?"input-tile-label c-flex":`input-tile-desc input-${inputClassInitial}`);
				child.setAttribute("type",(y==1)?inputType[x]:"");
				child.setAttribute("id",(y==1)?ids[x]:"");
				child.setAttribute("value",(y==1)?mMap[infoDbKeys[x]]:"");
				child.innerText=(y==0)?labels[x]:(inputType[x]=="textarea")?mMap[infoDbKeys[x]]:"";



				if(y==1){

					if(inputType[x]=="date" && mMap[infoDbKeys[x]]!="0000-00-00"){

						child.value=getFormattedDate(mMap[infoDbKeys[x]]);

					}else if(labels[x]=="Contractor Name"){
						child.value = mMap["contractorId"]+" - "+mMap["contractorName"];

					}else if(labels[x]=="Institute Name"){
						child.value = mMap["instituteName"];
					}

					child.disabled=(disabledKeys.includes(infoDbKeys[x]))?true:false;

				}





//]]

//Extra assignment for select items
					if(y==1 && inputType[x]=="select"){

						
						if(labels[x]=="Blood Group"){

							console.log("blood group");

							options = ["A+","A-","A1+","A1-","B+","B-","AB+","AB-","O+","O-"];


						}else if(labels[x]=="Gender"){

							options = ["Male","Female","Other"];


						}else if(labels[x]=="Type"){

							options = ["Intern"];


						}else if(labels[x]=="Marital Status"){

							options = ["Married","Single"];


						}else if(labels[x]=="Course"){

									options = sqlToSimpleArray(appDataMap["courseNameData"],"courseName");//["Site Incharge","Engineer","Supervisor","Marker","Welder","Tack Welder","Fitter","Grinder","Painter","Blaster","Power Tooler","Store Keeper","Rigger","Helper","Others"];

										for(t1=0;t1<options.length;t1++){

											const option = options[t1];

											const subChild = document.createElement("option");
											subChild.setAttribute("value",option);
											subChild.innerText = option;

											//child.appendChild(subChild);   Disabled this (no logic wanted to save time) line as I was encountering double population of options for the selection box

										}


						}else if(labels[x]=="Class"){


							options = sqlToSimpleArray(appDataMap["classNameData"],"className");//["Site Incharge","Engineer","Supervisor","Marker","Welder","Tack Welder","Fitter","Grinder","Painter","Blaster","Power Tooler","Store Keeper","Rigger","Helper","Others"];

							for(t1=0;t1<options.length;t1++){

								const option = options[t1];

								const subChild = document.createElement("option");
								subChild.setAttribute("value",option);
								subChild.innerText = option;

								//child.appendChild(subChild);   Disabled this (no logic wanted to save time) line as I was encountering double population of options for the selection box

							}
	


						}else if(labels[x]=="Status"){

							options = ["Active","Expired"];

						};


										for(t1=0;t1<options.length;t1++){

											const option = options[t1];

											const subChild = document.createElement("option");
											subChild.setAttribute("value",option);
											subChild.innerText = option;
											subChild.disabled = (mMap["personType"]=="Temporary Contract" && option!="Temporary Contract")?true:(mMap["personType"]!="Temporary Contract" && option=="Temporary Contract")?true:false;
											//subChild.style.backgroundColor = (mMap["personType"]=="Temporary Contract" && option!="Temporary Contract")?true:(mMap["personType"]!="Temporary Contract" && option=="Temporary Contract")?true:false;

											child.appendChild(subChild);

										}


						console.log(ids[x]);

						child.value=(labels[x]=="Institute Name")?mMap["instituteId"]+" - "+mMap["instituteName"]:mMap[infoDbKeys[x]];
						

				
				}//if(select)

					container.appendChild(child);




			}

		

			bodyContainer.appendChild(container);

		};



//@111
		for(x=0;x<3;x++){


			const containerA = document.createElement("div");
			containerA.setAttribute("class","submission-cont c-flex-col");
			containerA.style.gridColumn = "3/4";
			containerA.style.gridRow = (x==0)?"1/8":(x==1)?"8/13":"13/16";
			//containerA.style.height="400px";

				const head = document.createElement("div");
				head.setAttribute("class","subm-cont-head");
				head.innerText=(x==0)?"FORM SUBMISSIONS":(x==1)?"DOCUMENTS":"OTHER";
				containerA.appendChild(head);


			if(x==0){


				const labels = [];
				const ids=["sub-gatePassFormSubmitted","sub-workmenBioSubmitted","sub-esiDeclSubmitted","sub-epfDeclSubmitted","sub-epfNomSubmitted","sub-contractIntvwSubmitted","sub-esiEpfUndSubmitted","sub-empCompPackSubmitted"];

				const submDbKeys = idToKeyArray2(ids);




				for(y=0;y<labels.length;y++){

					const container = document.createElement("div");
					container.setAttribute("class",`checkbox-${inputClasInitial} c-flex`);
					container.setAttribute("id",ids[y]);


					  for(z=0;z<2;z++){

						const child = document.createElement((z==0)?"input":"div");
						child.setAttribute("class",(z==0)?"":"");
						child.innerText=(z==1)?labels[y]:"";

						if(z==0){
							child.setAttribute("type","checkbox");
							child.checked=(mMap[submDbKeys[y]]=="Yes")?true:false;
							
						}

						container.appendChild(child);

					 }

					 containerA.appendChild(container);

				}



			}else if(x==1){


				const labels = ["Aadhar Card","Institute ID"]
				const ids=["sub-aadharCardSubmitted","sub-instituteIdSubmitted"]
				const docDbKeys = idToKeyArray2(ids);



				for(y=0;y<labels.length;y++){

					const container = document.createElement("div");
					container.setAttribute("class",`checkbox-${inputClassInitial} c-flex`);
					container.setAttribute("id",ids[y]);


					  for(z=0;z<2;z++){

						const child = document.createElement((z==0)?"input":"div");
						child.setAttribute("class",(z==0)?"":"");
						child.innerText=(z==1)?labels[y]:"";

						if(z==0){
							child.setAttribute("type","checkbox");
							child.checked=(mMap[docDbKeys[y]]=="Yes")?true:false;
						}

						container.appendChild(child);

					 }

					 containerA.appendChild(container);

				}




			}else if(x==2){

				const labels = ["HSE Training Attendance"];
				const ids=["att-hseTrainingAttended"];
				const attDbKeys = idToKeyArray2(ids);

				for(y=0;y<labels.length;y++){

					const container = document.createElement("div");
					container.setAttribute("class",`checkbox-${inputClassInitial} c-flex`);
					container.setAttribute("id",ids[y]);


					  for(z=0;z<2;z++){

						const child = document.createElement((z==0)?"input":"div");
						child.setAttribute("class",(z==0)?"":"");
						child.innerText=(z==1)?labels[y]:"";

						if(z==0){
							child.setAttribute("type","checkbox");
							child.checked=(mMap[attDbKeys[y]]=="Yes")?true:false;
						}

						container.appendChild(child);

					 }

					 containerA.appendChild(container);

				}





			}



		bodyContainer.appendChild(containerA);
		}

	bottomContainer.innerHTML="";

    const btnLabels = ["Save Data", "Back"];
	//const btnIds2 = ["btn-edit-contract-person","btn-back-manage"];
	const btnIds2 = ["btn-edit-student-person","btn-view-student-person"];

	for(w=0;w<btnLabels.length;w++){

		const button = document.createElement("button");
		button.setAttribute("class","btn-std-2");
		button.innerText=btnLabels[w];
		button.setAttribute("id",btnIds2[w]);

		bottomContainer.appendChild(button);

		button.addEventListener('click',(e)=>{

			const idName = e.target.id;

			main(idName.slice(4));
/*
			if(idName=="btn-back-manage"){
				main("view-contract-person")
			}else{
				main(idName.slice(4));
			}
*/
		})
	}

		//const btnApprove = document.getElementById("btn-edit-contract-person");




		// const epfDecl = document.getElementById("sub-epfDeclSubmitted").children[0];
		// const esiDecl = document.getElementById("sub-esiDeclSubmitted").children[0];
		// const epfNom = document.getElementById("sub-epfNomSubmitted").children[0];
		// const empCompPack = document.getElementById("sub-empCompPackSubmitted").children[0];
		// const esiEpfUnd = document.getElementById("sub-esiEpfUndSubmitted").children[0];

		// const passport = document.getElementById("sub-passportSubmitted").children[0];
		// const aadharCard = document.getElementById("sub-aadharCardSubmitted").children[0];



		// if(mMap["esiApplicability"]=="Yes" || mMap["epfApplicability"]=="Yes"){

		// 	empCompPack.disabled=true;
		// 	esiEpfUnd.disabled=true;

		// 	empCompPack.checked=false;
		// 	esiEpfUnd.checked=false;

		// }else{

		// 	epfDecl.disabled = true;
		// 	esiDecl.disabled = true;
		// 	epfNom.disabled = true;

		// 	epfDecl.checked = false;
		// 	esiDecl.checked = false;
		// 	epfNom.checked = false;


		// }




		//Camera Interface

		const container = document.createElement("div");
		container.setAttribute("class","camera-cont c-flex-col");
		container.style.gridColumn="4/5";
		container.style.gridRow = "1/13";

		bodyContainer.appendChild(container);


		// const labelsA = ["","","","Capture","","Upload"];
		// const elements = ["canvas","video","img","div","input","div"];
		// const photoIds = ["canvas","video","input-cp-photo","btn-capture","btn-capture-reset","img-input","btn-upload"];
		// const classes = ["canvas-add","img-area","img-area","btn-std-2","","btn-std-2"];
		// const displays = ["none","block","none","flex","none","flex"];

		const labelsA = ["","","","Capture","Capture Again","","Upload"];
		const elements = ["canvas","video","img","div","div","input","div"];
		const photoIds = ["canvas","video","input-sp-photo","btn-capture","btn-capture-reset","img-input","btn-upload"];
		const classes = ["canvas-add","img-area","img-area","btn-std-3","btn-std-3","","btn-std-3"];
		const displays = ["none","block","none","flex","flex","none","flex"];


		for(x=0;x<labelsA.length;x++){

			const child = document.createElement(elements[x]);
			child.setAttribute("class",classes[x]);
			child.setAttribute("id",photoIds[x]);
			child.innerText=(x==3 || x==6)?labelsA[x]:"";
			child.style.display=displays[x];

			if(elements[x]=="canvas" || elements[x]=="video"){
				child.width=(elements[x]=="canvas")?250:600;
				child.height=(elements[x]=="canvas")?320:768;
			}else if(elements[x]=="input"){
				child.setAttribute("type","file");
			} 

			container.appendChild(child);
		}

//@113
		
		let width=320;
		let height=0;

		let streaming=false;

		const video= document.getElementById("video");
		const canvas = document.getElementById("canvas");
		const photo = document.getElementById(`input-${inputClassInitial}-photo`);
		const btnCapture = document.getElementById("btn-capture");
		const btnCaptureReset = document.getElementById("btn-capture-reset");
		const btnUpload = document.getElementById("btn-upload");
		const btnAdd = document.getElementById("btn-add");
		let imgInput = document.getElementById("img-input");


		video.style.display="none";
		photo.style.display="block";
		photo.src = mMap["personPhoto"];
		appDataMap["personPhoto"] = mMap["personPhoto"];
		//photo.src = `../${mMap["personPhotoPath"]}`;

		//appDataMap["personPhotoPath"] = mMap["personPhotoPath"];

		//appDataMap["newPhoto"] = mMap["personPhotoPath"]!=""?fs.readFileSync(`${mMap["personPhotoPath"]}`,"base64"):null;
		 


		btnCapture.style.display="none";

		btnCapture.innerText = "CAPTURE";
		btnCaptureReset.innerText = "CAPTURE AGAIN";

//Connecting the Camera
		navigator.mediaDevices.getUserMedia({video:{"width":400,"height":512},audio:false})
		.then(function(stream){

			video.srcObject = stream;
			video.play();

			appDataMap["camStream"]=stream.getTracks()[0];

		}).catch((error)=>{
			//showNotification("Error",error.message);
			console.log("Error = " + error.message);

		});

//Setting the height of the Canvas ast Start of Video Play, this function runs only at start

		video.addEventListener('canplay',function(e){
			if(!streaming){
				height=video.videoHeight/ (video.videoWidth/width);
				streaming=true;
			}
		},false);


		btnCapture.addEventListener('click',function(ev){
			takePicture();

			//checkMandatoryInputs();

			console.log(ev.target);
			ev.target.style.display = "none";
			btnCaptureReset.style.display = "block";
	
			ev.preventDefault();
		},false);


		function takePicture(){

			var context = canvas.getContext('2d');
	
			if(width && height){
				canvas.width=width;
				canvas.height=height;
				context.drawImage(video,0,0,width,height);
	
				
				
			var data = canvas.toDataURL('image/jpeg');
			photo.setAttribute('src',data); //setting the image placeholder in the input view to the image captured
			appDataMap["personPhoto"] = data

			//appDataMap["newPhoto"] = data.split(";base64,").pop(); //holding the image in the upload map. So that it can be inserted to db


			// const base64Img= data.split(";base64,").pop();

			// fs.writeFile("image.jpg",base64Img,{encoding:"base64"},function(err){
			// 	console.log(err)
			// });
	
			video.style.display="none";
			photo.style.display="block";
	

	
	
				checkMandatoryInputs();
	
			}else{
				clearPhoto();
			}
		}



	
		btnCaptureReset.addEventListener('click',function(ev){

			video.style.display="block";
			photo.style.display="none";
			photo.src=dummyImgPath;

		//	appDataMap["newPhoto"]=null;

			//takePicture();
			ev.preventDefault();

			this.style.display = "none";
			btnCapture.style.display = "block";


				checkMandatoryInputs();
		},false);


		btnUpload.addEventListener('click',()=>{
			console.log("clicked button");
			photoUpload();
		});


		imgInput.addEventListener('change',(ev)=>{
			console.log(URL.createObjectURL(ev.target.files[0]));

			console.log(ev.target);


			const imgUploaded = document.createElement('img');
			imgUploaded.src=URL.createObjectURL(ev.target.files[0]);
			//photo.src=URL.createObjectURL(ev.target.files[0]);


			imgUploaded.addEventListener('load',e=>{

			var context = canvas.getContext('2d');

			console.log(photo.style.height);
			console.log(photo.style.width);

			context.drawImage(imgUploaded,0,0,canvas.width,canvas.height);

			const data = canvas.toDataURL('image/jpeg',1);

			photo.setAttribute('src',data);

			appDataMap["personPhoto"] = data

		//	appDataMap["newPhoto"] = data.split(";base64,").pop();
		//	console.log(appDataMap["newPhoto"])

		
				video.style.display="none";
				photo.style.display="block";

				checkMandatoryInputs();

			});


		});



	function photoUpload(){
		imgInput.click();
	};




	//btnApprove.style.display="none";

	//const mandItems = ["input-cp-personName", "input-cp-personId", "input-cp-contractorName", "input-cp-contractorCode", "input-cp-slNo","input-cp-dateOfBirth","input-cp-localAddress","input-cp-permanentAddress","input-cp-dateOfJoining","input-cp-fathersName", "input-cp-mothersName", "input-cp-bloodGroup","input-cp-gender","input-cp-maritalStatus", "input-cp-identificationMark", "input-cp-contactNo", "input-cp-emgContactNo", "input-cp-wageRate", "input-cp-personType","","input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate","input-cp-aadharNo","sub-aadharCard","sub-polVer","sub-passport","sub-mediCert","sub-ageProofCert","sub-savBank","sub-gatePass","sub-workmenBio","sub-esiDecl","sub-epfDecl","sub-epfNom","sub-contractIntvw","sub-esiEpfUnd","sub-empCompPack"]

//const mandItems = ["input-cp-personName", "input-cp-contractorName", "input-cp-personSlNo","input-cp-dateOfBirth","input-cp-localAddress","input-cp-permanentAddress","input-cp-fathersName", "input-cp-mothersName", "input-cp-bloodGroup","input-cp-gender","input-cp-maritalStatus", "input-cp-identificationMarks", "input-cp-contactNo", "input-cp-emgContactNo", "input-cp-wageRate", "input-cp-personType","input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate","input-cp-aadharNo","sub-aadharCardSubmitted","sub-polVerSubmitted","sub-passportSubmitted","sub-mediCertSubmitted","sub-ageProofCertSubmitted","sub-savBankSubmitted","sub-gatePassFormSubmitted","sub-workmenBioSubmitted","sub-esiDeclSubmitted","sub-epfDeclSubmitted","sub-epfNomSubmitted","sub-contractIntvwSubmitted","sub-esiEpfUndSubmitted","sub-empCompPackSubmitted","att-hseTrainingAttended"];
// const mandItems = ["input-cp-personName","input-cp-dateOfBirth","input-cp-tradeName","input-cp-localAddress","input-cp-permanentAddress","input-cp-fathersName", "input-cp-mothersName", "input-cp-bloodGroup","input-cp-gender","input-cp-maritalStatus", "input-cp-identificationMarks", "input-cp-contactNo", "input-cp-emgContactNo", "input-cp-wageRate", "input-cp-personType","input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate","input-cp-aadharNo","sub-aadharCardSubmitted","sub-polVerSubmitted","sub-passportSubmitted","sub-mediCertSubmitted","sub-ageProofCertSubmitted","sub-savBankSubmitted","sub-gatePassFormSubmitted","sub-workmenBioSubmitted","sub-esiDeclSubmitted","sub-epfDeclSubmitted","sub-epfNomSubmitted","sub-contractIntvwSubmitted","sub-esiEpfUndSubmitted","sub-empCompPackSubmitted","att-hseTrainingAttended"];
// 	for(q=0;q<mandItems.length;q++){

// 		document.getElementById(mandItems[q]).addEventListener('change',(e)=>{

// 			checkMandatoryInputs();

// 		})
// 	};

//@114

	// function checkMandatoryInputs(){

	// 	//const mandIds = ["input-cp-personName", "input-cp-personId", "input-cp-contractorName", "input-cp-contractorCode", "input-cp-slNo","input-cp-dateOfBirth","input-cp-localAddress","input-cp-permanentAddress","input-cp-dateOfJoining","input-cp-fathersName", "input-cp-mothersName", "input-cp-bloodGroup","input-cp-gender","input-cp-maritalStatus", "input-cp-identificationMark", "input-cp-contactNo", "input-cp-emgContactNo", "input-cp-wageRate", "input-cp-personType","","input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate","input-cp-aadharNo"];
	// 	//const mandSubms = ["sub-aadharCard","sub-polVer","sub-passport","sub-mediCert","sub-ageProofCert","sub-savBank","sub-gatePass","sub-workmenBio","sub-esiDecl","sub-epfDecl","sub-epfNom","sub-contractIntvw","sub-esiEpfUnd","sub-empCompPack"];

	// 	const mandInfos = ["input-cp-personName", "input-cp-contractorName","input-cp-dateOfBirth","input-cp-tradeName","input-cp-localAddress","input-cp-permanentAddress","input-cp-bloodGroup","input-cp-gender","input-cp-maritalStatus", "input-cp-contactNo", "input-cp-emgContactNo", "input-cp-personType","input-cp-aadharNo"];
	// 	//const mandInfos2 = ["input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate"];
	// 	const mandInfosEsiEpf = ["input-cp-esiNo","input-cp-uan"];
	// 	const mandInfosEpf = ["input-cp-uan","input-cp-insuranceNo"];
	// 	const mandInfosExem = ["input-cp-insuranceNo"];
	// 	const mandOthers = ["att-hseTrainingAttended"];

	// 	const mandDocs = ["sub-aadharCardSubmitted","sub-mediCertSubmitted","sub-ageProofCertSubmitted","sub-savBankSubmitted"];
	// 	const mandDocs2 = ["sub-polVerSubmitted","sub-passportSubmitted"];

	// 	const mandSubms = ["sub-gatePassFormSubmitted","sub-workmenBioSubmitted","sub-contractIntvwSubmitted"];
	// 	const mandSubmsEsiEpf = ["sub-esiDeclSubmitted","sub-epfDeclSubmitted","sub-epfNomSubmitted"];
	// 	//const mandEsiSubms = ["sub-gatePass","sub-workmenBio","sub-esiDecl","sub-epfDecl","sub-epfNom","sub-contractIntvw","sub-esiEpfUnd","sub-empCompPack"];
	// 	const mandSubmsEpf = ["sub-epfDeclSubmitted","sub-epfNomSubmitted","sub-esiEpfUndSubmitted","sub-empCompPackSubmitted"];
	// 	const mandSubmsExem = ["sub-epfNomSubmitted","sub-esiEpfUndSubmitted","sub-empCompPackSubmitted"];


	// 	const epfStatus = (document.getElementById("epf-no").style.backgroundColor=="")?true:false;
	// 	const esiStatus = (document.getElementById("esi-no").style.backgroundColor=="")?true:false;

	// 	console.log(epfStatus+esiStatus);

	// 	let mandInfos2 =(epfStatus && esiStatus)?mandInfosEsiEpf:(epfStatus)?mandInfosEpf:mandInfosExem;
	// 	let mandSubms2 = (epfStatus && esiStatus)?mandSubmsEsiEpf:(epfStatus)?mandSubmsEpf:mandSubmsExem;

	// 	console.log(mandInfos2);
	// 	console.log(mandSubms2);

	// 	const nMap={};

	// 	nMap["info"]=0;
	// 	nMap["info2"]=0;

	// 	nMap["subm"]=0;
	// 	nMap["subm2"]=0;

	// 	nMap["doc"]=0;
	// 	nMap["doc2"]=0;

	// 	nMap["other"]=0;

	// 	let countId = 0;
	// 	let countSubm = 0;

	// 	const arrays = [mandInfos,mandInfos2,mandSubms,mandSubms2,mandDocs,mandDocs2,mandOthers];
	// 	const key = ["info","info2","subm","subm2","doc","doc2","other"];

	// 	for(x=0;x<arrays.length;x++){

	// 		const array = arrays[x];

	// 		console.log(nMap[key[x]]);

	// 		//console.log(array);

	// 		for(y=0;y<array.length;y++){
				
	// 			if(x==0 || x==1){

	// 				const info = document.getElementById(array[y]);

	// 				if(info.value!=""){
	// 				 	nMap[key[x]]=nMap[key[x]]+1;
	// 				 	console.log(nMap[key[x]]);
	// 				}
	// 			}else{
	// 				console.log(x);

	// 				console.log(array[y]);
	// 				const info = document.getElementById(array[y]).children[0];

	// 				console.log(info);


	// 				if(info.checked==true){
	// 				 nMap[key[x]]++;
	// 				}

	// 			}


	// 			}



	// 		}


	// let nCount = 0;
	// let sCount=0;



	// 	for(x=0;x<arrays.length;x++){

	// 		const array = arrays[x];

	// 			if(array!=mandDocs2){

	// 				if(nMap[key[x]]>=array.length){
	// 					nCount++;

	// 					console.log(array.length);
	// 					console.log(x);

	// 				}

	// 			}else{

	// 				if(nMap[key[x]]>=1){
	// 					nCount++;
	// 				}

	// 			}

				


	// 		}


	// 	sCount=(photo.style.display=="none")?0:1;


			

	// 	key.forEach((key)=>{

	// 		console.log(key+"="+nMap[key]);

	// 	});



	// 	console.log(nCount+sCount);


	// 	//btnApprove.style.display=(nCount+sCount==arrays.length+1)?"block":"none";

		
	// }//function checkMandatoryInputs

//dummy fn DELETE this and uncomment above when using the features of above
	function checkMandatoryInputs(){

	}





//@16

	}else if(action=="edit-student-person"){


		const mMap={};
	

		let greenSignal = true;

		const inputClassInitial="sp"

		const noOfRows = 15;

		const labels = ["Name","Institute Name","Person Serial No","Date of Birth","Class","Course","Local Address","Permanent Address","Blood Group","Fathers Name", "Mothers Name","Gender","Contact No", "Emg Contact No", "Type","Aadhar No","Pass Validity Start","Pass Validity End"];
		const dbKeys = ["personName","instituteName", "personSlNo","dateOfBirth","className","courseName","localAddress","permanentAddress","bloodGroup","fathersName", "mothersName","gender", "personContactNo", "personEmgContactNo","personType","aadharNo","dateOfPassValidityStart","dateOfPassExpiry"];
		//const ids = ["input-sp-personName","input-sp-instituteName", "input-sp-personSlNo","input-sp-dateOfBirth","input-sp-className","input-sp-courseName","input-sp-localAddress","input-sp-permanentAddress","input-sp-bloodGroup","input-sp-fathersName", "input-sp-mothersName","input-sp-gender", "input-sp-personContactNo", "input-sp-personEmgContactNo","input-sp-personType","input-sp-aadharNo","input-sp-dateOfPassValidityStart","input-sp-dateOfPassExpiry"];
		const docIds=["sub-aadharCardSubmitted","sub-instituteIdSubmitted"];
		//const submIds=["sub-gatePassFormSubmitted","sub-workmenBioSubmitted","sub-esiDeclSubmitted","sub-epfDeclSubmitted","sub-epfNomSubmitted","sub-contractIntvwSubmitted","sub-esiEpfUndSubmitted","sub-empCompPackSubmitted"];
		const attIds=["att-hseTrainingAttended"];
		
		const inputType = ["text","text","text","date","select","select","textarea","textarea","select","text","text","select","number", "number", "select", "number", "date","date"];
		//please note the inputType corresponding to Institute Name has been changed to text as we do not want to edit it once it has been assigned
		
		const ids=keyToIdArray(`input-${inputClassInitial}`,dbKeys);
		const infoDbKeys = idToKeyArray(ids);
		const disabledKeys=[]
		const xKeys = [];
		const xIds = [];
		const hiddenKeys = [];
		let options=[];





		const inputs = bodyContainer.getElementsByClassName(`input-${inputClassInitial}`);
		const checkboxs = bodyContainer.getElementsByClassName(`checkbox-${inputClassInitial}`);
		const missedInputs = [];

//Input Validation
		for(x=0;x<inputs.length;x++){

			const input = inputs[x];	
				const key = input.id.split(/\-/)[2];
				mMap[key] = input.value;
		};

		for(x=0;x<checkboxs.length;x++){
			const checkbox = checkboxs[x];	
				//const key = (checkbox.id=="att-hseTraining")?checkbox.id.split(/\-/)[1]+"Attended":checkbox.id.split(/\-/)[1]+"Submitted";
				const key = checkbox.id.split(/\-/)[1];
				mMap[key] = (checkbox.children[0].checked)?"Yes":"No";
				console.log(key+"-"+mMap[key]);
		};



	//	mMap["esiApplicability"]=(document.getElementById("esi-no").style.backgroundColor=="")?"Yes":"No";
	//	mMap["epfApplicability"] = (document.getElementById("epf-no").style.backgroundColor=="")?"Yes":"No";




//]]



		//mMap["dateOfJoining"] = getDate();
		//mMap["dateOfCardExpiry"] = getFormattedDate(getfutureDate(90));

		//mMap["creationDate"] = getDate();
		mMap["modificationDate"] = getFormattedDate(new Date());
		//mMap["contractorId"] = mMap["contractorName"].split(/\-/)[0].trim();
		//mMap["contractorName"] = mMap["contractorName"].split(/\-/)[1].trim();
		//mMap["personId"] = mMap["contractorId"]+mMap["personSlNo"];
		//console.log(appDataMap["personPhotoPath"])
	//	mMap["personPhotoPath"] = appDataMap["personPhotoPath"];
		mMap["personPhoto"] = appDataMap["personPhoto"];

		mMap["personId"] = appDataMap["curPersonData"]["personId"];
		mMap["personStatus"]=(getFormattedDate(new Date(mMap["dateOfCardExpiry"])) < getDate())?"Expired":"Active";

	

		// const folder1Name = "AppData";
		// const folder2Name = "images"
		// const folder3Name = "student-person";

		// const photoFolderName =`./${folder1Name}/${folder2Name}/${folder3Name}/${mMap["personId"]}`;
		// const photoFilePath = `${photoFolderName}/photo.jpg`

		//const photoFolderName = `AppData/images/student-person/${mMap["personId"]}`

		//those who have uploaded new photo but do not have old photo - upload photo and upload photo path
		 //those who have not uploaded new photo but have old photo - do nothing
		 //those who have not uploaded new photo, and have removed old photo - remove the photoPath
		 //those who do not have old photo and no new photo - do nothing 

		// console.log(appDataMap["newPhoto"])
		//  mMap["photoUploadCond"] = appDataMap["newPhoto"]!=null;


		// if(mMap["photoUploadCond"]){

		// 	if(mMap["personPhotoPath"]!=""){

		// 	}else{
		// 		mMap["personPhotoPath"] = photoFilePath;

		// 		if(!fs.existsSync(`./${folder1Name}`)){
		// 			fs.mkdirSync(`./${folder1Name}`)
		// 			fs.mkdirSync(`./${folder1Name}/${folder2Name}`)
		// 			fs.mkdirSync(`./${folder1Name}/${folder2Name}/${folder3Name}`)
		// 		}else{
		// 			if(!fs.existsSync(`./${folder1Name}/${folder2Name}`)){
		// 				fs.mkdirSync(`./${folder1Name}/${folder2Name}`)
		// 				fs.mkdirSync(`./${folder1Name}/${folder2Name}/${folder3Name}`)
		// 			}else{
		// 				if(!fs.existsSync(`./${folder1Name}/${folder2Name}/${folder3Name}`)){
		// 					fs.mkdirSync(`./${folder1Name}/${folder2Name}/${folder3Name}`)
		// 				}
		// 			}
		// 		}
		// 	}



		// }else{

		// 	mMap["personPhotoPath"] = "";
		// }


		if(greenSignal){


			con.connect((err)=>{

					con.on('error',(err)=>{
						console.log("Error ="+err.message);
						handleError();
					});



const query= `UPDATE student_person_data
				SET
				personName =  '${mMap["personName"]}',
				dateOfBirth = '${mMap["dateOfBirth"]}',
				courseName = '${mMap["courseName"]}',
				className='${mMap["className"]}',
				localAddress = '${mMap["localAddress"]}',
				permanentAddress = '${mMap["permanentAddress"]}',
				bloodGroup = '${mMap["bloodGroup"]}',
				gender = '${mMap["gender"]}',
				fathersName = '${mMap["fathersName"]}',
				mothersName = '${mMap["mothersName"]}',
				personContactNo = '${mMap["personContactNo"]}',
				personEmgContactNo = '${mMap["personEmgContactNo"]}',
				dateOfPassValidityStart = '${mMap["dateOfPassValidityStart"]}',
				dateOfPassExpiry = '${mMap["dateOfPassExpiry"]}',
				personType = '${mMap["personType"]}',
				personStatus = '${mMap["personStatus"]}',
				aadharNo = '${mMap["aadharNo"]}',
				personPhoto = '${mMap["personPhoto"]}',
				aadharCardSubmitted = '${mMap["aadharCardSubmitted"]}',
				instituteIdSubmitted = '${mMap["instituteIdSubmitted"]}',
				hseTrainingAttended = '${mMap["hseTrainingAttended"]}',
				modificationDate = '${mMap["modificationDate"]}'
				WHERE personId = '${mMap["personId"]}'`; 


				con.query(query,(err,result)=>{

						console.log(query);
						console.log(result);

						showResult(result,err,"edit");

						// if(mMap["photoUploadCond"]){

						// 	if(!fs.existsSync(`./${folder1Name}/${folder2Name}/${folder3Name}/${mMap["personId"]}`)){
						// 		fs.mkdirSync(`./${folder1Name}/${folder2Name}/${folder3Name}/${mMap["personId"]}`)
						// 	}
					
						// 	fs.writeFile(mMap["personPhotoPath"], appDataMap["newPhoto"],{encoding:"base64"},function(err2){
						// 		showResult(result,err,"edit");
						// 					// if (err==null){
						// 					// 	showNotification("Success","Student Personnel Succesfully Added")	
						// 					// }else{
						// 					// 	showNotification("Success","Student Personnel Succesfully Added without Photo")	
						// 					// }
										
						// 			});

						// }else{
						// 	showResult(result,err,"edit");
						// }

						


				})



			})





		}

//@16
	}else if(action=="add-institute-input"){

		bodyContainer.innerHTML="";

		title.innerText = "Add Institute";

		const noOfRows = 14;

		const noOfCols = 1; //since this is institute addition only one column is needed


		const labels = ["Name", "Institute Code","Registered Address","Contact No","Email","Representative Name","Rep Contact No","Status"];
		const inputType = ["text","text","textarea","number","email","text","number","select"];
		const gridRows=["1/2","2/3","3/6","6/7","7/8","8/9","9/10","10/11"];
		const gridColumns=["1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2"];
		const inputIds=["input-in-instituteName","input-in-instituteId","input-in-instituteAddress","input-in-instituteContactNo","input-in-instituteEmail","input-in-instituteRepName","input-in-instituteRepContactNo","input-in-instituteStatus"];


		bodyContainer.setAttribute("class",`input-list-cont-${noOfCols}`);
		bodyContainer.style.height="80%";

		bottomContainer.style.height="10%";
		bodyContainer.style.gridTemplateRows=`repeat(${noOfRows},2rem)`;

		for(x=0;x<labels.length;x++){  

			const container = document.createElement("div");
			container.setAttribute("class","input-tile");


			container.style.gridColumn = gridColumns[x];
			container.style.gridRow = gridRows[x];


			for(y=0;y<2;y++){
				//const child = document.createElement((y==0)?"div":"input");
				const child = document.createElement((y==0)?"div":(inputType[x]=="select" || inputType[x]=="textarea")?inputType[x]:"input");
				child.setAttribute("class",(y==0)?"input-tile-label c-flex":"input-tile-desc input-in");
				child.setAttribute("id",(y==1)?inputIds[x]:"");
				child.setAttribute("type",(y==1)?inputType[x]:"");
				child.innerText=(y==0)?labels[x]:"";

				
						if(y==1 && inputType[x]=="select"){

						if(labels[x]=="Status"){

										options = ["Approved","Temporary"]

											for(t1=0;t1<options.length;t1++){

															const option = options[t1];

															const subChild = document.createElement("option");
															subChild.setAttribute("value",option);
															subChild.innerText = option;

															child.appendChild(subChild);


										}
									
									}
					}//if(select)

				container.appendChild(child);
			}

			bodyContainer.appendChild(container);

		}




		const button = document.createElement("button");
		button.innerText="Add";
		button.setAttribute("class","btn-std-2");
		//button.setAttribute("onclick",`main("add-contractor-final")`);

		bottomContainer.appendChild(button);

		const button2 = document.createElement("button");
		button2.innerText="Back";
		button2.setAttribute("class","btn-std-2");
		//button.setAttribute("onclick",`main("add-contractor-final")`);

		bottomContainer.appendChild(button2);


		button.addEventListener('click',()=>{
			main("add-institute");
		});

		button2.addEventListener('click',()=>{
			displayDashboard();
		});




	}else if(action=="add-institute"){

		let greenSignal = true;

		let mMap={};

		const inputClassCode = "input-in"
		
		const inputIds=["input-in-instituteName","input-in-instituteId","input-in-instituteAddress","input-in-instituteContactNo","input-in-instituteEmail","input-in-instituteRepName","input-in-instituteRepContactNo","input-in-instituteStatus"];

		const impIds=["input-in-instituteName","input-in-instituteId"]; // Non null inputs
		const impLabels = ["Institute Name", "Institute ID"];

		const dbKeys=idToKeyArray(inputIds);

		console.log(`${dbKeys}`);

		const inputs = bodyContainer.getElementsByClassName("input-in");
		const missedInputs = [];



//Input Validation
		for(x=0;x<inputs.length;x++){

			const input = inputs[x];
			

			if(input.value == "" && impIds.includes(input.id)){

				input.style.backgroundColor="red";
				missedInputs.push(impLabels[impIds.indexOf(input.id)]);

			}else{

				const key = input.id.split(/\-/)[2];
				mMap[key] = input.value;

			}

		}

		if(missedInputs.length!=0){
			alert("You have not inputted"+missedInputs);

			greenSignal=false;
		}

//]]


//Green Signal means all the inputs are okay
		if(greenSignal){

			mMap["isHeld"]= "No";
			mMap["creationDate"]= getFormattedDate(new Date());


			const adlDbKeys = ['isHeld']; 


			con.connect((err)=>{

					con.on('error',(err)=>{
						console.log("Error ="+err.message);
						handleError();
					});


				//const query= `INSERT INTO contractor_data (contractorName,contractorId,department,dateOfIncorporation,dateOfRegistry,registeredAddress,contractorContactNo,contractorEmail,localAddress,localRepName,localRepContactNo,bankAccountNo) VALUES('${mMap["contractorName"]}','${mMap["contractorId"]}','${mMap["department"]}','${mMap["dateOfIncorporation"]}','${mMap["dateOfRegistry"]}','${mMap["registeredAddress"]}','${mMap["contractorContactNo"]}','${mMap["contractorEmail"]}','${mMap["localAddress"]}','${mMap["localRepName"]}','${mMap["localRepContactNo"]}','${mMap["bankAccountNo"]}')`;

				const query= `INSERT INTO institute_data (${dbKeys},${adlDbKeys},creationDate)
				VALUES('${mMap["instituteName"]}',
				'${mMap["instituteId"]}',
				'${mMap["instituteAddress"]}',
				'${mMap["instituteContactNo"]}',
				'${mMap["instituteEmail"]}',
				'${mMap["instituteRepName"]}',
				'${mMap["instituteRepContactNo"]}',
				'${mMap["instituteStatus"]}',
				'${mMap["isHeld"]}',
				'${mMap["creationDate"]}')`;

				// const query= `INSERT INTO institute_data (instituteName,instituteId)
				// VALUES('MANIPAL',
				// 'INT0008')`;
				
				//const query= `INSERT INTO contractor_data (contractorName,contractorId,bankAccountNo) VALUES('${mMap["contractorName"]}','${mMap["contractorId"]}','${mMap["bankAccountNo"]}')`;

				con.query(query,(err,result)=>{
					console.log(err);
						console.log(result);
						console.log(query);

						showResult(result,err,"add");
	

				})



			})





		}

		

//@32
	}else if(action=="manage-institute"){


		bodyContainer.innerHTML="";
		bodyContainer.setAttribute("class","select-cont");

		title.innerText="Manage Institute";

//Initializing and Configuring refMap
		let refMap = {};

		const attrTypes=["Institute"];
		const tableNames = ["institute_data"];

		const entityName = "institute";
	//	const moduleDbNameData = appDataMap["instituteIdNameData"];


		const entityDbTableName = "institute_data";
		const moduleIdKeyName = "instituteId"


		const attrType = "Institute";

		refMap[attrType] = {};
		refMap[attrType]["options"]={};

		refMap[attrType]["classType"]="input-in";

		refMap[attrType]["labels"] = ["Institute Code","Name", "Registered Address","Contact No","Email","Representative Name","Rep Contact No","Status"];
		refMap[attrType]["inputType"] = ["text","text","textarea","number","email","text","number","select"];
		refMap[attrType]["gridRows"]=["1/2","2/3","3/6","6/7","7/8","8/9","9/10","10/11"];
		refMap[attrType]["gridCols"]=["1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2"];
		const inputIds=["input-in-instituteId","input-in-instituteName","input-in-instituteAddress","input-in-instituteContactNo","input-in-instituteEmail","input-in-instituteRepName","input-in-instituteRepContactNo","input-in-instituteStatus"];
		refMap[attrType]["dbKeys"]=idToKeyArray(inputIds)
		refMap[attrType]["disDbKeys"]=[""]; //Keys which will be disabled
		refMap[attrType]["hidDbKeys"]=[];
		
		refMap[attrType]["options"]["instituteStatus"] = ["Approved","Temporary"];

        	
//]]

		const colors = [prColor1,prColor3,prColor4];

        		const filterContainer = document.createElement("div");
        		filterContainer.setAttribute("class","filter-cont-b c-block c-flex");

		        		const labels = [`SELECT ${entityName.toUpperCase()}`]

		        		for(w=0;w<labels.length;w++){

			        		const subCont = document.createElement("div");
			        		subCont.setAttribute("class","grid-tile-2c");
			        		//subCont.setAttribute("id",(w==1)?"");

			        		for(x=0;x<2;x++){

			        			const child = document.createElement((x==0)?"div":"select");
			        			child.setAttribute("class",(x==0)?"c-flex filter-tile filter-label":"");
			                    child.style.backgroundColor = colors[x];
			        			//child.setAttribute("id",(x!=0)?)
			        			child.innerText=(x==0)?labels[w]:"";

			        			if(x==1){

			        				child.setAttribute("class",(w==0)?"select-filter filter-tile":"select-filter-sub filter-tile");
			        				child.setAttribute("data-filter_type","main");

			        				const options = appDataMap[`${entityName}IdNameData`];

			        				console.log(options);

			        				for(y=0;y<options.length;y++){
			        					const subChild = document.createElement("option");
			        					subChild.setAttribute("value",options[y][`${entityName}Id`]);
			        					subChild.innerText = options[y][`${entityName}Id`]+" - "+options[y][`${entityName}Name`]; 

			        					child.appendChild(subChild);
			        				}
			        			}


			        			subCont.append(child);

			        		}
			        		    filterContainer.appendChild(subCont);
		        	}

        	
        		bodyContainer.appendChild(filterContainer);


        		const rangeContainer = document.createElement("div");
        		rangeContainer.setAttribute("class","c-flex-col range-cont");
        		rangeContainer.style.height="100%";
        		rangeContainer.style.paddingTop="2rem";

        		bodyContainer.appendChild(rangeContainer);


				document.querySelector('.select-filter').addEventListener("change",(e)=>{

					const mainValue = e.target.value;

        			const query = `SELECT * FROM ${entityDbTableName} WHERE ${entityName}Id='${mainValue}';`

        			con.connect((err)=>{

        				con.query(query,(err,result)=>{

        					console.log(result);
        					console.log(query);

        			const classType = refMap[attrType]["classType"];
							const labels = refMap[attrType]["labels"];
							const dbKeys = refMap[attrType]["dbKeys"];
							const disDbKeys = refMap[attrType]["disDbKeys"];
							const hidDbKeys = refMap[attrType]["hidDbKeys"];
							const inputType = refMap[attrType]["inputType"];
							const gridRows=refMap[attrType]["gridRows"];
							const gridColumns=refMap[attrType]["gridCols"];
						
							const ids = keyToIdArray(classType,dbKeys);

							const noOfRows = 10;
							const noOfCols = Math.ceil(labels.length/noOfRows);

							let mMap={};

							mMap=result[0];

							mainContainer.style.backgroundColor=(mMap["isHeld"]=="Yes")?colorBlockBack:"";

							const curContractorId = mMap[moduleIdKeyName];

							rangeContainer.innerHTML="";

							rangeContainer.setAttribute("class","input-list-cont-"+noOfCols);
							rangeContainer.style.gridTemplateRows=`repeat(${noOfRows},2rem)`;


									for(x=0;x<labels.length;x++){

									
										const container = document.createElement("div");
										container.setAttribute("class","input-tile "+classType);
										container.style.display=(hidDbKeys.includes(dbKeys[x]))?"none":"";

										container.style.gridColumn = gridColumns[x];
										container.style.gridRow = gridRows[x];

										for(y=0;y<2;y++){

											const child = document.createElement((y==0)?"div":(inputType[x]=="select" || inputType[x]=="textarea")?inputType[x]:"input");
											child.setAttribute("class",(y==0)?"input-tile-label c-flex":"input-tile-desc "+classType);
											child.setAttribute("type",(y==1)?inputType[x]:"");
											child.setAttribute("id",(y==1)?classType+"-"+dbKeys[x]:"");
											child.setAttribute("value",(y==1)?result[0][dbKeys[x]]:"");
											child.disabled=(y==1)?true:false;
											//child.setAttribute("id",(y==1)?ids[x]:"");
											child.innerText=(y==0)?labels[x]:(inputType[x]=="select")?result[0][dbKeys[x]]:"";

												if(y==1){

													if(inputType[x]=="select"){

															let options=[];

															options = refMap[attrType]["options"][dbKeys[x]];

															console.log(refMap[attrType]["options"]);

																	for(t1=0;t1<options.length;t1++){

																					const option = options[t1];

																					const subChild = document.createElement("option");
																					subChild.setAttribute("value",option);
																					subChild.innerText = option;

																					child.appendChild(subChild);

																	}
															
													
														child.value=result[0][dbKeys[x]];
														

													}else if(inputType[x]=="date" && result[0][dbKeys[x]]!="0000-00-00"){

														child.value=getFormattedDate(result[0][dbKeys[x]]);

													}else if(inputType[x]=="textarea"){
														child.value=result[0][dbKeys[x]];

													}


											}//if(select)

											
												container.appendChild(child);
											

								
										}

										rangeContainer.appendChild(container);

									
						        			
									}//for(labels.length)


									bottomContainer.innerHTML="";

									const btnLabels = ["Edit","Block","Delete","Back"];
									const btnIds2 = ["btn-edit","btn-block","btn-delete","btn-back-dashboard"];
									const btnColors = ["",colorBlock,colorWarning,""];


									for(w=0;w<btnLabels.length;w++){

										const button = document.createElement("button");
										button.setAttribute("class","btn-std-2");
										button.innerText=(btnLabels[w]=="Block" && mMap["isHeld"]=="Yes")?"Unblock":btnLabels[w];
										button.style.backgroundColor=(btnLabels[w]=="Block" && mMap["isHeld"]=="Yes")?"black":btnColors[w];
										button.setAttribute("id",btnIds2[w]);

										bottomContainer.appendChild(button);

										button.addEventListener('click',(e)=>{

											const idName = e.target.id;
											const btnLabel = e.target.innerText;

											if(idName=="btn-back-dashboard"){
												displayDashboard();
											}else if(idName=="btn-delete"){

												showNotification("Warning","This will delete all the records pertaining to this contractor, do you want to proceed?");

												notifBtn.addEventListener("click",deleteData);

												

													function deleteData(e){

													const parent = e.target.parentElement.parentElement.parentElement;
													parent.style.display="none";

													const query = `DELETE FROM ${entityDbTableName} WHERE ${entityName}Id='${mainValue}';`

																con.query(query,(err,result)=>{

																	console.log(result);
																	console.log(query);

																showResult(result,err,"delete");

																setTimeout(()=>{

																	displayDashboard();

																},2000);
															});

														notifBtn.removeEventListener("click",deleteData);

													}


											}else if(idName=="btn-block"){

												
													const query = `UPDATE ${entityDbTableName} SET isHeld='${(btnLabel=="Block")?`Yes`:`No`}' WHERE ${entityName}Id='${mainValue}';`

																con.query(query,(err,result)=>{

																	console.log(result);
																	console.log(query);

																showResult(result,(btnLabel=="Block")?"block":"unblock");

																setTimeout(()=>{

																	main(`manage-${entityName}`);

																},2000);
															});


											}else{ //To edit the contractor details

												console.log("Edit entered")

												//const attrType = e.target.dataset.attribute_type;
												const values = [];


												console.log(classType);
												const items = document.querySelectorAll(`.${classType}`);

												for(z=0;z<items.length;z++){

													const itemKey = items[z].id.split(/\-/)[2];

													if(!disDbKeys.includes(itemKey)){
														items[z].disabled=false;
													}	

												}

												bottomContainer.innerHTML="";

												const btnSave = document.createElement("button");
												btnSave.setAttribute("class","btn-std-2");
												btnSave.setAttribute("data-attribute_type",attrType);
												btnSave.innerText="Save";

												const btnBack = document.createElement("button");
												btnBack.setAttribute("class","btn-std-2");
												btnBack.innerText="Back";

												bottomContainer.appendChild(btnSave);
												bottomContainer.appendChild(btnBack);

												btnSave.addEventListener('click',(e)=>{

														console.log("entry");

														const index = attrTypes.indexOf(attrType);

														const inputMap = {};

															document.querySelectorAll(`.${classType}`).forEach((it,i)=>{

																const dbKey = it.id.split("-")[2];

																inputMap[dbKey] = it.value;

															});

														const tArray=[];

														const length = Object.keys(inputMap).length;

														for(z=0;z<dbKeys.length;z++){

															const key = dbKeys[z];
															tArray.push(`${key}='${inputMap[key]}'`);

/* 
															if(z!=0){   //Excluding contractorId from the key List
																tArray.push(`${key}='${inputMap[key]}'`)
															}
	*/
														};


														console.log(tArray);
														console.log(index);
														console.log(tableNames)
/*
														refMap["query1"]="";
														refMap["query2"]="";

														if(inputMap["contractorId"]!=curContractorId){

															refMap["query"] = `UPDATE ${tableNames[index]} 
																SET ${tArray} 
																WHERE {dbKeys[0]}='${curContractorId}'`; 

															refMap["query2"]=`UPDATE contractor_person_data SET personId=CONCAT(contractorId,personSlNo) WHERE contractorId='${inputMap["contractorId"]}'`



														}else{


														}
*/

														const query2=`UPDATE ${tableNames[index]} 
																SET ${tArray} 
																WHERE ${dbKeys[0]}='${curContractorId}'`;

/*
														const query2=(inputMap["contractorId"]!=curContractorId)?`UPDATE ${tableNames[index]} 
																SET ${tArray} 
																WHERE ${dbKeys[0]}='${curContractorId}';UPDATE contractor_person_data SET personId=CONCAT(contractorId,personSlNo) WHERE contractorId='${inputMap["contractorId"]}'`:`UPDATE ${tableNames[index]} 
																SET ${tArray} 
																WHERE ${dbKeys[0]}='${curContractorId}'`;
*/
															con.connect((err)=>{

																	con.query(query2,(err,result)=>{

																		console.log(query2);
																		console.log(result);
																		if(err==null){

																		if(inputMap[`${entityName}Id`]!=curContractorId){
																			console.log("Red Alert")

																					showResult(result[0],"edit")
																					showResult(result[1],"update")

																					main()

																		}else{

																				showResult(result,err,"edit")

																		}
																	}else{
																					console.log(err.message)
																	}


;
																	})

																})


													})//btnSave.addEvent

												btnBack.addEventListener('click',(e)=>{

													displayDashboard();
												})

												}//if(idName)


										});//btn.addEventListener

		        				}//for(w=0,btnLabels);


						})


					});

				 
		});//select-filter.addEvent

		
		const changeEvent = new Event("change");

		document.querySelector('.select-filter').dispatchEvent(changeEvent);






//@33
	}else if(action=="view-institute"){

		const entityName = "institute";
		const entityDbTableName = "institute_data";
		//const moduleDbNameData = appDataMap["instituteIdNameData"];


		const moduleDbTableName = "institute_data";
		const moduleIdKeyName = "instituteId"


		const contId = document.getElementById("contractor-selection").value.split(/\-/)[0];

		con.connect((err)=>{

					con.on('error',(err)=>{
						console.log("Error ="+err.message);
						handleError();
					});


				
				const query= `SELECT * FROM ${entityDbTableName} WHERE ${entityName}Id='${contId}'`;
				

				con.query(query,(err,res)=>{

						con.on('error',(err)=>{
							console.log("Error ="+err.message);
							handleError();
						});

						console.log(res[0]);


		const data = res[0];

		appDataMap["curContrData"] = data;


		bodyContainer.innerHTML="";

		title.innerText = "View Contractor";

		const noOfRows = 10;

		const labels = ["Name", "Contractor Code", "Department", "Date of Establishment","Registered Address","Local Address","Contact No","Email","Local Representative","Local Rep Contact","Bank Account No","Bank Name","IFSC Code","Date of Joining"];
		const inputType = ["text","text","text","date","textarea","textarea","number","email","text","number","text","text","text","date"];
		const gridRows=["1/2","2/3","3/4","4/5","5/8","8/11","1/2","2/3","3/4","4/5","5/6","6/7","7/8","8/9"];
		const gridColumns=["1/2","1/2","1/2","1/2","1/2","1/2","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3"];
		const inputIds=["input-ct-contractorName","input-ct-contractorId","input-ct-department","input-ct-dateOfIncorporation","input-ct-registeredAddress","input-ct-localAddress","input-ct-contractorContactNo","input-ct-contractorEmail","input-ct-localRepName","input-ct-localRepContactNo","input-ct-bankAccountNo","input-ct-bankName","input-ct-bankIfscCode","input-ct-dateOfRegistry"];
		const dbKeys = idToKeyArray(inputIds);


		bodyContainer.setAttribute("class","input-list-cont-2");
		//bodyContainer.style.gridTemplateRows=`repeat(${noOfRows},2rem)`;

		for(x=0;x<labels.length;x++){

			const container = document.createElement("div");
			container.setAttribute("class","input-tile");


			container.style.gridColumn = gridColumns[x];
			container.style.gridRow = gridRows[x];


			for(y=0;y<2;y++){
				const child = document.createElement("div");
				child.setAttribute("class",(y==0)?"input-tile-label c-flex":"input-tile-desc input-ct");
				//child.setAttribute("id",(y==1)?inputIds[x]:"");
				//child.setAttribute("type",(y==1)?inputType[x]:"");
				child.innerText=(y==0)?labels[x]:data[dbKeys[x]];



				if(inputType[x]=="date" && data[dbKeys[x]]!="0000-00-00" && y==1){

					child.innerText=getIndiaDate(data[dbKeys[x]]);

				}

				container.appendChild(child);
			}

			bodyContainer.appendChild(container);

		}

		bottomContainer.innerHTML="";

		const btnLabels = ["Edit","Delete","Back"];
		const btnIds = ["btn-edit-contractor-input","btn-delete-contractor","btn-back"];
		const functions = ["edit-contractor-input","delete-contractor","manage-contractor"];

		for(y=0;y<btnLabels.length;y++){

		const button = document.createElement("button");
		button.innerText=btnLabels[y];
		button.setAttribute("class","btn-std-2");
		button.setAttribute("data-function_name",functions[y]);
		button.setAttribute("id",btnIds[y]);

		bottomContainer.appendChild(button);

			document.getElementById(btnIds[y]).addEventListener('click',(e)=>{
					
				const functionName = e.target.dataset.function_name;

				main(functionName);


			});

		}


					});

			});





	}else if(action=="edit-institute-input"){

		bodyContainer.innerHTML="";

		title.innerText = "Edit Contractor";

		const data = appDataMap["curContrData"];

		const noOfRows = 10;

		const labels = ["Name","Contractor Code", "Department", "Date of Establishment","Registered Address","Local Address","Contact No","Email","Local Representative","Local Rep Contact","Bank Account No","Bank Name","IFSC Code"];
		const inputType = ["text","text","text","date","textarea","textarea","number","email","text","number","text","text","text"];
		const gridRows=["1/2","2/3","3/4","4/5","5/8","8/11","1/2","2/3","3/4","4/5","5/6","6/7","7/8"];
		const gridColumns=["1/2","1/2","1/2","1/2","1/2","1/2","2/3","2/3","2/3","2/3","2/3","2/3","2/3"];
		//const inputIds=["input-ct-contractorName","input-ct-contractorId","input-ct-department","input-ct-dateOfIncorporation","input-ct-registeredAddress","input-ct-localAddress","input-ct-contractorContactNo","input-ct-contractorEmail","input-ct-localRepName","input-ct-localRepContactNo","input-ct-bankAccountNo","input-ct-bankName","input-ct-bankIfscCode"];

		//const inputIds=["input-ct-contractorName","input-ct-contractorId","input-ct-department","input-ct-dateOfIncorporation","input-ct-dateOfRegistry","input-ct-registeredAddress","input-ct-contractorContactNo","input-ct-contractorEmail","input-ct-localAddress","input-ct-localRepName","input-ct-localRepContactNo","input-ct-bankAccountNo"];
		const inputIds=["edit-ct-contractorName","edit-ct-contractorId","edit-ct-department","edit-ct-dateOfIncorporation","edit-ct-registeredAddress","edit-ct-localAddress","edit-ct-contractorContactNo","edit-ct-contractorEmail","edit-ct-localRepName","edit-ct-localRepContactNo","edit-ct-bankAccountNo","edit-ct-bankName","edit-ct-bankIfscCode"];   
		const dbKeys = idToKeyArray(inputIds);


		bodyContainer.setAttribute("class","input-list-cont-2");
		//bodyContainer.style.gridTemplateRows=`repeat(${noOfRows},2rem)`;

		for(x=0;x<labels.length;x++){

			const container = document.createElement("div");
			container.setAttribute("class","input-tile");


			container.style.gridColumn = gridColumns[x];
			container.style.gridRow = gridRows[x];


			for(y=0;y<2;y++){
				const child = document.createElement((y==0)?"div":(inputType[x]=="select" || inputType[x]=="textarea")?inputType[x]:"input");
				child.setAttribute("class",(y==0)?"input-tile-label c-flex":"input-tile-desc edit-ct");
				child.setAttribute("id",(y==1)?inputIds[x]:"");
				child.setAttribute("type",(y==1)?inputType[x]:"");
				child.setAttribute("value",(y==1)?data[dbKeys[x]]:"");
				child.innerText=(y==0)?labels[x]:(inputType[x]=="textarea")?data[dbKeys[x]]:"";


				if(inputType[x]=="date" && data[dbKeys[x]]!="0000-00-00" && y==1){
					child.setAttribute("value",getFormattedDate(data[dbKeys[x]]));
				}

				container.appendChild(child);
			}

			bodyContainer.appendChild(container);

		}
		

		bottomContainer.innerHTML="";

		const btnLabels = ["Edit Contractor","Back"];
		const btnIds = ["btn-edit-contractor","btn-back"];
		const functions = ["edit-contractor","manage-contractor"];

		for(y=0;y<btnLabels.length;y++){

		const button = document.createElement("button");
		button.innerText=btnLabels[y];
		button.setAttribute("class","btn-std-2");
		button.setAttribute("data-function_name",functions[y]);
		button.setAttribute("id",btnIds[y]);

		bottomContainer.appendChild(button);

			document.getElementById(btnIds[y]).addEventListener('click',(e)=>{
					
				const functionName = e.target.dataset.function_name;

				main(functionName);


			});

		}



	}else if(action=="edit-institute"){


		let greenSignal = true;

		let mMap={};
		
		const inputIds=["edit-ct-contractorName","edit-ct-contractorId","edit-ct-department","edit-ct-dateOfIncorporation","edit-ct-dateOfRegistry","edit-ct-registeredAddress","edit-ct-contractorContactNo","edit-ct-contractorEmail","edit-ct-localAddress","edit-ct-localRepName","edit-ct-localRepContactNo","edit-ct-bankAccountNo"];
		const impIds=["input-ct-contractorName","input-ct-contractorId"];
		const impLabels = ["Contractor Name", "Contractor ID"];

		const dbKeys=idToKeyArray(inputIds);

		const inputs = bodyContainer.getElementsByClassName("edit-ct");
		const missedInputs = [];

//Input Validation
		for(x=0;x<inputs.length;x++){

			const input = inputs[x];
			

			if(input.value == "" && impIds.includes(input.id)){

				input.style.backgroundColor="red";
				missedInputs.push(impLabels[impIds.indexOf(input.id)]);

			}else{

				const key = input.id.split(/\-/)[2];
				mMap[key] = input.value;

			}

		}

		if(missedInputs.length!=0){
			alert("You have not inputted"+missedInputs);

			greenSignal=false;
		}

//]]



		if(greenSignal){

			mMap["modificationDate"] = getFormattedDate(new Date());


			con.connect((err)=>{

					con.on('error',(err)=>{
						console.log("Error ="+err.message);
						handleError();
					});


				//const query= `INSERT INTO contractor_data (contractorName,contractorId,department,dateOfIncorporation,dateOfRegistry,registeredAddress,contractorContactNo,contractorEmail,localAddress,localRepName,localRepContactNo,bankAccountNo) VALUES('${mMap["contractorName"]}','${mMap["contractorId"]}','${mMap["department"]}','${mMap["dateOfIncorporation"]}','${mMap["dateOfRegistry"]}','${mMap["registeredAddress"]}','${mMap["contractorContactNo"]}','${mMap["contractorEmail"]}','${mMap["localAddress"]}','${mMap["localRepName"]}','${mMap["localRepContactNo"]}','${mMap["bankAccountNo"]}')`;

				const query= `UPDATE contractor_data
				SET contractorId = '${mMap["contractorId"]}',
				contractorName = '${mMap["contractorName"]}',
				department = '${mMap["department"]}',
				dateOfIncorporation = '${mMap["dateOfIncorporation"]}',
				registeredAddress = '${mMap["registeredAddress"]}',
				localAddress = '${mMap["localAddress"]}',
				contractorContactNo = '${mMap["contractorContactNo"]}',
				contractorEmail = '${mMap["contractorEmail"]}',
				localRepName = '${mMap["localRepName"]}',
				localRepContactNo = '${mMap["localRepContactNo"]}',
				bankAccountNo = '${mMap["bankAccountNo"]}',
				bankName = '${mMap["bankName"]}',
				bankIfscCode = '${mMap["bankIfscCode"]}',
				modificationDate = '${mMap["modificationDate"]}'
				WHERE contractorId ='${appDataMap["curContrData"]["contractorId"]}'`;
				//const query= `INSERT INTO contractor_data (contractorName,contractorId,bankAccountNo) VALUES('${mMap["contractorName"]}','${mMap["contractorId"]}','${mMap["bankAccountNo"]}')`;



				con.query(query,(err,result)=>{

						con.on('error',(err)=>{
							console.log("Error ="+err.message);
							handleError();
						});

						console.log(query);

						console.log("Successfully Updated");



				})



			})





		}

		

	}else if(action=="delete-institute"){
	

			con.connect((err)=>{

					con.on('error',(err)=>{
						console.log("Error ="+err.message);
						handleError();
					});


				//const query= `INSERT INTO contractor_data (contractorName,contractorId,department,dateOfIncorporation,dateOfRegistry,registeredAddress,contractorContactNo,contractorEmail,localAddress,localRepName,localRepContactNo,bankAccountNo) VALUES('${mMap["contractorName"]}','${mMap["contractorId"]}','${mMap["department"]}','${mMap["dateOfIncorporation"]}','${mMap["dateOfRegistry"]}','${mMap["registeredAddress"]}','${mMap["contractorContactNo"]}','${mMap["contractorEmail"]}','${mMap["localAddress"]}','${mMap["localRepName"]}','${mMap["localRepContactNo"]}','${mMap["bankAccountNo"]}')`;

				const query= `DELETE FROM contractor_data
				WHERE contractorId='${appDataMap["curContrData"]["contractorId"]}'`;
				//const query= `INSERT INTO contractor_data (contractorName,contractorId,bankAccountNo) VALUES('${mMap["contractorName"]}','${mMap["contractorId"]}','${mMap["bankAccountNo"]}')`;



				con.query(query,(err,result)=>{

						con.on('error',(err)=>{
							console.log("Error ="+err.message);
							handleError();
						});

						console.log("Successfully Deleted");



				})



			});








	//else if(action=="delete-contractor"){}
//@7
	}else if(action=="print-student-id-input"){



		const personGroupTerm = "institute";
		const personTerm = "student";
		//const personGroupIdNameMap =  appDataMap["instituteIdNameData"]
		const personGroupIdNameMap =  appDataMap["instituteNameData"]
		const personIdNameMap =  appDataMap["studentIdNameData"]
		const identifiers=["institute","person"];
		const personDbTableName = "student_person_data" 
	    const personGroupKeyName = "instituteName"

		appDataMap["curIdPrintDomain"] = "student";

		personDbTableName

		console.log("hello in print")
  
		  bodyContainer.innerHTML="";
  
		  title.innerText = "Print ID's";
  
		  bodyContainer.setAttribute("class","id-tile-cont");
		  bodyContainer.style.height="80%";
  
		  bottomContainer.style.height="10%";
		  //bodyContainer.style.gridTemplateRows=`repeat(${noOfRows},2rem)`;
  
		  //const query = `SELECT contractorName,`

		  
  
  
  
		  for(x=0;x<4;x++){
  
			  const container = document.createElement("div");
			  container.setAttribute("class","id-select-cont");
  
  
			  const sHeadCont = document.createElement("div");
			  sHeadCont.setAttribute("class","c-flex");
			  container.appendChild(sHeadCont);
  
  
			  const sTitle = document.createElement("div");
			  sTitle.setAttribute("class","display-title");
			  sTitle.innerText="For ID "+(x+1);
  
			  sHeadCont.appendChild(sTitle);
  
  
			  for(y=0;y<2;y++){
  
				  const subCont = document.createElement("div");
				  subCont.setAttribute("class","id-select-cont2 c-flex-col");


  
				  subCont.innerText=(y==0)?`SELECT ${personGroupTerm.toUpperCase()}`:`SELECT ${personTerm.toUpperCase()}`;
  
				  const datas=(y==0)?sqlToSimpleMap(personGroupIdNameMap):sqlToSimpleMap(personIdNameMap);
  
   
				  console.log(sqlToSimpleMap(personGroupIdNameMap))


				  //if(y==0){
  
					  const child = document.createElement("select");
					  child.setAttribute("class",(y==0)?"select-box contractor-selection-id":"select-box contract-personnel-selection-id");
							
					
								for(z=0;z<datas[identifiers[y]+"Name"]?.length;z++){
									const subChild = document.createElement("option");
									subChild.setAttribute("value",datas[identifiers[y]+"Name"][z]);
									subChild.innerText=datas[identifiers[y]+"Name"][z]
								// subChild.disabled=(y==0)?(datas["isHeld"][z]=="Yes")?true:false:false;

									child.appendChild(subChild);
							}

					  
  
					  subCont.appendChild(child);
  
				  //}
  
				  
				  container.appendChild(subCont);
			  }
  
			  bodyContainer.appendChild(container);
  
  
	  }
  
  
	  document.querySelectorAll(".contractor-selection-id").forEach((item)=>{
  
		  item.addEventListener("change",(e)=>{
  
  
			  const parent = e.target.parentElement.parentElement;
			  const id = e.target.value;
  
			  con.connect((err)=>{
  
				  const query=`SELECT personId,personName FROM ${personDbTableName} WHERE ${personGroupKeyName}='${id}' AND personStatus='Active' AND isHeld='No' `;
  
				  con.query(query,(err,result)=>{
  
  
					  console.log(query);
					  console.log(result);
  
					  const datas = sqlToSimpleMap(result);
  
  
					  const child = parent.querySelector(".contract-personnel-selection-id");
  
					  child.innerHTML="";

  
					  for(x=0;x<datas["personId"]?.length;x++){
  
						  const subChild = document.createElement("option");
						  subChild.setAttribute("value",datas["personId"][x]);
						  subChild.innerText=datas["personId"][x] + " - "+ datas["personName"][x];
  
						  child.appendChild(subChild);
  
					  }
  
  
					  
  
  
				  })
  
  
  
			  })
  
  
  
		  })
				  
  
  
	  });
  
  
	  const changeEvent = new Event("change");
  
	  document.querySelectorAll(".contractor-selection-id").forEach((item)=>{
  
		 item.dispatchEvent(changeEvent);
  
	  });
  
  
  
  
	  const btnLabels = ["Print ID", "Back"];
	  const btnIds2 = ["btn-print-id","btn-back-dashboard"];
  
  
	  for(w=0;w<btnLabels.length;w++){
  
		  const button = document.createElement("button");
		  button.setAttribute("class","btn-std-2");
		  button.innerText=btnLabels[w];
		  button.setAttribute("id",btnIds2[w]);
  
		  bottomContainer.appendChild(button);
  
		  button.addEventListener('click',(e)=>{
  
			  const idName = e.target.id;
  
			  if(idName=="btn-back-dashboard"){
				  displayDashboard();
			  }else{
				  main(idName.slice(4));
			  }
  
		  })
	  }
  
  	  
	}else if(action=="print-student-id"){
	
		const selections = document.getElementsByClassName("contract-personnel-selection-id");
		const idArray=[];

		for(x=0;x<selections.length;x++){

			idArray.push(selections[x].value);

		};

		const array2=[];

		idArray.forEach((elem)=>{

			array2.push(`personId= '${elem}'`);

		})

		const condString = array2.join(" OR ");

		const dbTableName = "student_person_data";

		query = `SELECT * FROM ${dbTableName} WHERE ${condString}`;


				con.connect((err)=>{

					con.query(query,(err,result)=>{

						console.log(query);
						console.log(result);

							initiateGenerateId(sqlToMapArray(result),"A","student");

						});


					});

				
//@9
	}else if(action=="add-visitor-pass-input"){
/*
		const visitorLabels = ["Visitor ID","Name","Company","Designation","Date of Birth","Address","Blood Group","Gender","Contact No","Emg Contact No","Purpose of Visit","Person to Visit","Dept of Person","Contact Person Ph No","In Time","Valid Upto","Out Time","Issued At","Permitted Areas","Pass No","Gadget Type","Gadget Name","Gadget SL No","Vehicle Type","Vehicle Name","Vehicle Reg No"];
		const visitorDbKeys = ["visitorId","visitorName","companyName","designation","dateOfBirth","address","bloodGroup","gender","contactNo","emgContactNo","purposeOfVisit","tebmaContactPerson","tebmaContactDept","tebmaContactPhoneNo","inTime","validUpto","outTime","visitorPassIssuedAt","visitorPassPermittedAreas","visitorPassNo","gadgetType","gadgetName","gadgetSlNo","vehicleType","vehicleName","vehicleRegNo" ]
		const visitorInputTypeAdd =  ["text","text","text","text","date","textarea","select","select","number","number","text","select","text","number","dateTime","dateTime","dateTime","select","text","text","text","text","text","text","text","text" ];

		const labels = visitorLabels;
		const dbKeys = visitorDbKeys;

		const hiddenKeys = ["validUpto"];
		const deletedKeys =["outTime"];
		const disabledKeys =["visitorId","tebmaContactDept","tebmaContactPhoneNo"];
*/


		bodyContainer.innerHTML = "";

		bodyContainer.style.height="80%";
		bottomContainer.style.height="10%";

		title.innerText="Add Visitor"; // title got from displayDashboard Function

		const noOfRows = 1;

		const classType = "input-vi";


		const labels = ["Contact No","Visitor ID","Name","Company","Designation","Email","Date of Birth","Address","Blood Group","Gender","Emg Contact No","Nationality","Photo ID Type","Photo ID No","Purpose of Visit","Person to Visit","Dept of Person","Contact Person Ph No","Type","Pass Validity (Days)","Gadget Type","Gadget Description","Gadget Sl No","Vehicle Type","Vehicle Name","Vehicle Reg No","Visa Type","Visa No","Visa Validity"];
		const dbKeys = ["contactNo","visitorId","visitorName","companyName","designation","email","dateOfBirth","address","bloodGroup","gender","emgContactNo","nationality","photoIdType","photoIdNo","purposeOfVisit","tebmaContactPerson","tebmaContactDept","tebmaContactPhoneNo","passType","validUpto","gadgetType","gadgetDesc","gadgetSlNo","vehicleType","vehicleName","vehicleRegNo","visaType","visaNo","visaValidity"];
		
		const inputType = ["number","text","text","text","text","email","date","textarea","select","select","number","select","select","text","text","select","text","number","select","number","select","text","text","select","text","text","select","text","date"];
								
		const gridRows=["1/2","2/3","3/4","4/5","5/6","6/7","7/9","9/10","10/11","11/12","12/13","13/14","14/15","15/16","16/17","1/2","2/3","3/4","4/5","5/6","6/7","7/8","8/9","9/10","10/11","11/12","12/13","13/14","14/15","15/16"]//   ,"13/14"];
		const gridColumns=["1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3"]//   ,"2/3"];
		
		const delKeys = ["outTime"];
		const hidKeys = ["gadgetType","gadgetDesc","gadgetSlNo","vehicleType","vehicleName","vehicleRegNo","visaType","visaNo","visaValidity"];
		const disKeys = ["visitorId","inTime","tebmaContactDept","tebmaContactPhoneNo","visitorPassIssuedAt","visitorPassNo",];

		const ids = keyToIdArray(classType,dbKeys);


		bodyContainer.setAttribute("class","input-list-cont");
		bodyContainer.style.gridTemplateRows=`repeat(${noOfRows},1.75rem)`;

//Hiding the tiles which have to be hidden
		for(x=0;x<labels.length;x++){

					const container = document.createElement("div");
					container.setAttribute("class","input-tile");
					
					container.style.gridColumn = gridColumns[x];
					container.style.gridRow = gridRows[x];

			//condition for hiding tiles
					if(hidKeys.includes(dbKeys[x])){

						const index = hidKeys.indexOf(dbKeys[x]);

						console.log(dbKeys[x]);
						console.log(gridColumns[x]);
						//container.setAttribute("id",ids[x]);
						container.style.gridRow = "";
						container.style.gridColumn = gridColumns[x];
						container.style.display=(hidKeys.includes(dbKeys[x]))?"none":"";

					}

//]]



						//container.style.gridRow=(x>=noOfRows)?"1/2":"";

					if(labels[x]==""){


					}else{

						for(y=0;y<2;y++){

							const child = document.createElement((y==0)?"div":(inputType[x]=="select" || inputType[x]=="textarea")?inputType[x]:"input");
							child.setAttribute("class",(y==0)?"input-tile-label c-flex":"input-tile-desc "+classType);
							child.disabled = (y==1)?(disKeys.includes(dbKeys))?true:false:false;
							child.setAttribute("type",(y==1)?inputType[x]:"");
							child.setAttribute("id",(y==1)?ids[x]:"");
							child.innerText=(y==0)?labels[x]:"";

							if(dbKeys[x]=="validUpto"){
								child.setAttribute("min",1);
								child.setAttribute("max",7);
							}

							if(inputType[x]=="time"){

								child.setAttribute("min",getTime(new Date()));
								child.value=getTime(new Date());

							}

								if(y==1 && inputType[x]=="select"){

									let options=[];


									if(labels[x]=="Blood Group"){

										console.log("blood group");

										options = ["A+","A-","A1+","A1-","B+","B-","AB+","AB-","O+","O-","NA"];


									}else if(labels[x]=="Gender"){

										options = ["Male","Female","Transgender"];


									}else if(labels[x]=="Photo ID Type"){

										options = ["Pan Card","Aadhar","Driving License","Other"];

									}else if(labels[x]=="Person to Visit"){

										const tMap = sqlToSimpleMap(appDataMap["employeeAppData"]);

										for(z=0;z<tMap["employeeId"].length;z++){

											options.push(tMap["employeeId"][z]+" - "+tMap["employeeName"][z]);
										}


									}else if(labels[x]=="Gadget Type"){

											options = ["LAPTOP","TAB","CAMERA","OTHER"];

									}else if(labels[x]=="Vehicle Type"){

											options = ["4-WHEELER","2-WHEELER","OTHER"];

									}else if(labels[x]=="Nationality"){

											options = ["Indian","Foreigner"];

									}else if(labels[x]=="Visa Type"){

											options = ["Business","Student","Tourist","Employment","Visa on Arrival","e-Visa", "Project","Research","Conference",'Diplomatic',"Official","Medical"];

									}else if(labels[x]=="Type"){

											options = ["Visitor","Service Engineer","Owner Rep","Sub Contract Personnel"];

									};

													for(t1=0;t1<options.length;t1++){

														const option = options[t1];

														const subChild = document.createElement("option");
														subChild.setAttribute("value",option);
														subChild.innerText = option;

														child.appendChild(subChild);

													}

							
						}//if(select)

							container.appendChild(child);

						}

					}

						bodyContainer.appendChild(container);

		};


			//const visitorIdArray = sqlToSimpleArray(appDataMap["visitorIdNameData"],"visitorId");
			//assignSlNoByAnalyzingDb(visitorIdArray[0]);
//**


			document.getElementById("input-vi-validUpto").addEventListener('change',(e)=>{

				const timeSelected = e.target.value;
				appDataMap["timeValidityCheck"]=false;

				console.log(timeSelected);
				console.log(getTime(new Date()));

				if(timeSelected>getTime(new Date())){
					console.log(timeSelected);

					appDataMap["timeValidityCheck"]=true;

					checkMandatoryInputs();
				}
			});

			const visaType = document.getElementById("input-vi-visaType");
			const visaNo = document.getElementById("input-vi-visaNo");
			const visaValidity = document.getElementById("input-vi-visaValidity"); 

			const visaBoxes = [visaType,visaNo,visaValidity];

			document.getElementById("input-vi-nationality").addEventListener('change',(e)=>{


				const value = e.target.value;

				appDataMap["visitorNationality"]=value;

				const idTypeBox = document.getElementById("input-vi-photoIdType");

				idTypeBox.innerHTML="";

				const options=(value=="Indian")?["Pan Card","Aadhar","Driving License","Other"]:["Passport"];

				for(a1=0;a1<options.length;a1++){
					const option = document.createElement("option");
					option.setAttribute("value",options[a1]);
					option.innerText=options[a1];

					idTypeBox.appendChild(option);
				};


			
				visaBoxes.forEach((box)=>{
					box.parentElement.style.display=(value=="Indian")?"none":"grid";
				});

				checkMandatoryInputs();
				

			});

/*
			const changeEvent = new Event("change");
			document.getElementById("input-vi-tebmaContactPerson").dispatchEvent(changeEvent);
*/


			document.getElementById("input-vi-tebmaContactPerson").addEventListener('change',(e)=>{
					const id = e.target.value.split(/\-/)[0].trim();

					console.log(id);

					console.log(appDataMap["employeeAppData"]);

					const tMap = sqlToSimpleMap(appDataMap["employeeAppData"]);


					document.getElementById("input-vi-tebmaContactDept").value = findKeyValueInMap(tMap,"employeeId",id,"department");
					document.getElementById("input-vi-tebmaContactPhoneNo").value = findKeyValueInMap(tMap,"employeeId",id,"contactNo");
			});





//@111
		for(x=0;x<3;x++){


			const containerA = document.createElement("div");
			containerA.setAttribute("class","submission-cont c-flex-col");
			containerA.style.gridColumn = "3/4";
			containerA.style.gridRow = (x==0)?"1/10":(x==1)?"10/13":"13/17";
			//containerA.style.height="400px";

				const head = document.createElement("div");
				head.setAttribute("class","subm-cont-head");
				head.innerText=(x==0)?"PERMITTED AREAS":(x==1)?"OTHER":"FORMALITIES";
				containerA.appendChild(head);


			if(x==0){


				const labels = ["Malpe Office","Sub Store Malpe","NBS & Production Shops","Malpe Canteen","Malpe Hospital","Hangarkatte Yard","Babuthota Store","Santhakatte","Kalmady Site","Vadamandeshwara Site"];
				const dbKeys=["malpeOffice","malpeStore","nbsProdShops","malpeCanteen","malpeHospital","hktYard","bptStores","santhakatte","kalmadySite","vmdSite"];
				const ids = keyToIdArray("area-vi",dbKeys);



				for(y=0;y<labels.length;y++){

					const container = document.createElement("div");
					container.setAttribute("class","checkbox-vi c-flex");
					container.setAttribute("id",ids[y]);


					  for(z=0;z<2;z++){

						const child = document.createElement((z==0)?"input":"div");
						child.setAttribute("class",(z==0)?"":"");
						child.innerText=(z==1)?labels[y]:"";

						if(z==0){
							child.setAttribute("type","checkbox");
						}

						container.appendChild(child);

					 }

					 containerA.appendChild(container);

				}



			}else if(x==1){


				const labels = ["Gadget","Vehicle"];
				const dbKeys=["gadget","vehicle"];
				const ids = keyToIdArray("extr-vi",dbKeys);


				for(y=0;y<labels.length;y++){

					const container = document.createElement("div");
					container.setAttribute("class","checkbox-vi c-flex");
					container.setAttribute("id",ids[y]);


					  for(z=0;z<2;z++){

						const child = document.createElement((z==0)?"input":"div");
						child.setAttribute("class",(z==0)?"":"");
						child.innerText=(z==1)?labels[y]:"";

						if(z==0){
							child.setAttribute("type","checkbox");
						}

						container.appendChild(child);

					 }

					 containerA.appendChild(container);

				}

			}else if(x==2){


				const labels = ["Email from Concerned Dept","Safety Awareness Programme"];
				const dbKeys=["emailDept","safetyAwareness"];
				const ids = keyToIdArray("frml-vi",dbKeys);


				for(y=0;y<labels.length;y++){

					const container = document.createElement("div");
					container.setAttribute("class","checkbox-vi c-flex");
					container.setAttribute("id",ids[y]);


					  for(z=0;z<2;z++){

						const child = document.createElement((z==0)?"input":"div");
						child.setAttribute("class",(z==0)?"":"");
						child.innerText=(z==1)?labels[y]:"";

						if(z==0){
							child.setAttribute("type","checkbox");
						}

						container.appendChild(child);

					 }

					 containerA.appendChild(container);

				}

			}



		bodyContainer.appendChild(containerA);
		}


	const btnLabels = ["Issue Pass","Back"];
	const btnIds2 = ["btn-add-visitor-pass","btn-back-dashboard"];


	for(w=0;w<btnLabels.length;w++){

		const button = document.createElement("button");
		button.setAttribute("class","btn-std-2");
		button.innerText=btnLabels[w];
		button.setAttribute("id",btnIds2[w]);

		bottomContainer.appendChild(button);

		button.addEventListener('click',(e)=>{

			const idName = e.target.id;

			if(idName=="btn-back-dashboard"){
				displayDashboard();
			}else{
				main(idName.slice(4));
			}

		})
	}



		const btnApprove = document.getElementById("btn-add-visitor-pass");

//Logic for handling pass types

const emailDept = document.getElementById("frml-vi-emailDept").children[0];
const safetyAwareness = document.getElementById("frml-vi-safetyAwareness").children[0];

emailDept.disabled=true;
safetyAwareness.disabled=true;


document.getElementById("input-vi-passType").addEventListener("change",(e)=>{

	const value = e.target.value;

	emailDept.disabled=(value=="Visitor")?true:false;
	safetyAwareness.disabled=(value=="Visitor")?true:false;


	//if(value=="Visitor"){
	emailDept.checked=(value=="Visitor")?false:"";
	safetyAwareness.checked=(value=="Visitor")?false:"";

	//}



})

//]]





		const gadjBox = document.getElementById("extr-vi-gadget").children[0];
		const vehiBox = document.getElementById("extr-vi-vehicle").children[0];

		const boxNames = [gadjBox,vehiBox];

		for(q=0;q<boxNames.length;q++){

			boxNames[q].addEventListener('change',(e)=>{

				const elem = e.target;
				const idName = e.target.parentElement.id;

				const classType = idName.split(/\-/)[0]+"-"+idName.split(/\-/)[1];
				let dbKeys=[];
				
					if(idName=="extr-vi-gadget"){

						dbKeys = ["gadgetType","gadgetDesc","gadgetSlNo"];
					}else if(idName=="extr-vi-vehicle"){

						dbKeys = ["vehicleType","vehicleName","vehicleRegNo"];
					}

							dbKeys.forEach((dbKey)=>{
								document.getElementById("input-vi-"+dbKey).parentElement.style.display=(elem.checked)?"grid":"none";
							})


			})


		};



		//epfDecl.disabled=true;

		//document.getElementById("sub-polVer").children[0].disabled=true;
		// /document.getElementById("sub-polVer").children[0].checked=true;

		//Camera Interface

		const container = document.createElement("div");
		container.setAttribute("class","camera-cont c-flex-col");
		container.style.gridColumn="4/5";
		container.style.gridRow = "1/12";

		bodyContainer.appendChild(container);


		const labelsA = ["","","","Capture"];
		const elements = ["canvas","video","img","div"];
		const photoIds = ["canvas","video","input-vi-photo","btn-capture"];
		const classes = ["canvas-add","img-area","img-area","btn-std-2"];
		const displays = ["none","block","none","flex"];


		for(x=0;x<labelsA.length;x++){

			const child = document.createElement(elements[x]);
			child.setAttribute("class",classes[x]);
			child.setAttribute("id",photoIds[x]);
			child.innerText=(x==3 || x==5)?labelsA[x]:"";
			child.style.display=displays[x];

			if(elements[x]=="canvas" || elements[x]=="video"){
				child.width=(elements[x]=="canvas")?195:600;
				child.height=(elements[x]=="canvas")?250:768;
			}else if(elements[x]=="input"){
				child.setAttribute("type","file");
			} 

			container.appendChild(child);
		}

//@113
		
		let width=320;
		let height=0;

		let streaming=false;

		const video= document.getElementById("video");
		const canvas = document.getElementById("canvas");
		const photo = document.getElementById(classType+"-photo");
		//const btnCamRestart = document.getElementById("btn-restart")
		const btnCapture = document.getElementById("btn-capture");
		//const btnUpload = document.getElementById("btn-upload");
		const btnAdd = document.getElementById("btn-add");
		let imgInput = document.getElementById("img-input");


//Connecting the Camera
		navigator.mediaDevices.getUserMedia({video:{"width":400,"height":512},audio:false})
		.then(function(stream){

			video.srcObject = stream;
			video.play();

			appDataMap["camStream"]=stream.getTracks()[0];

		}).catch((error)=>{
			//showNotification("Error",error.message);
			console.log("Error = " + error.message);

		});

//Setting the height of the Canvas ast Start of Video Play, this function runs only at start

		video.addEventListener('canplay',function(e){
			if(!streaming){
				height=video.videoHeight/ (video.videoWidth/width);
				streaming=true;
			}
		},false);


		btnCapture.addEventListener('click',function(ev){
				takePicture();

				//checkMandatoryInputs();
		
				ev.preventDefault();
			},false);


	function takePicture(){

		var context = canvas.getContext('2d');

		if(width && height){
			canvas.width=width;
			canvas.height=height;
			context.drawImage(video,0,0,width,height);

			
		var data = canvas.toDataURL('image/jpeg');
		photo.setAttribute('src',data);
		appDataMap["photo"] = data;

		video.style.display="none";
		photo.style.display="block";

		btnCapture.innerText = "CAPTURE AGAIN";

			btnCapture.addEventListener('click',function(ev){

				video.style.display="block";
				photo.style.display="none";
				photo.src=dummyImgPath;

				//takePicture();
				ev.preventDefault();
				btnCapture.innerText = "CAPTURE IMAGE";

					btnCapture.addEventListener('click',function(ev){
						takePicture();
						//checkMandatoryInputs();
						ev.preventDefault();
					},false);

					checkMandatoryInputs();
			},false);


			checkMandatoryInputs();

		}else{
			clearPhoto();
		}
	}

			document.getElementById("input-vi-contactNo").addEventListener('change',(e)=>{
					transmitDbData(e,"visitorId");
			});






	btnApprove.style.display="none";


		const visNationality = document.getElementById("input-vi-nationality").value;
		const visType = document.getElementById("input-vi-passType").value;

const mandKeys1 = ["contactNo","visitorName", "companyName", "designation","dateOfBirth","address","gender","nationality","photoIdType","photoIdNo","purposeOfVisit","tebmaContactPerson","passType","validUpto","gadgetType","gadgetDesc","gadgetSlNo","vehicleType","vehicleName","vehicleRegNo","visaType","visaNo","visaValidity"];
const mandKeys2 = ["malpeOffice","malpeStore","nbsProdShops","malpeCanteen","malpeHospital","hktYard","bptStores","santhakatte","kalmadySite","vmdSite"];
const mandKeys3 = (visNationality=="Indian")?["photoIdNo"]:["photoIdNo","visaType","visaNo","visaValidity"];
const mandKeys4=["emailDept","safetyAwareness"];

const mandIds1 = keyToIdArray("input-vi",mandKeys1);
const mandIds2 = keyToIdArray("area-vi",mandKeys2);
const mandIds3 = keyToIdArray("input-vi",mandKeys3);
const mandIds4 = keyToIdArray("frml-vi",mandKeys4);

const mandIds = mandIds1.concat(mandIds2.concat(mandIds3.concat(mandIds4)));

	for(q=0;q<mandIds.length;q++){

		console.log(mandIds[q]);

		document.getElementById(mandIds[q]).addEventListener('change',(e)=>{

			checkMandatoryInputs();

		})
	};


			const changeEvent = new Event("change");
			document.getElementById("input-vi-tebmaContactPerson").dispatchEvent(changeEvent);



//@114

	function checkMandatoryInputs(){

		//const mandIds = ["input-cp-personName", "input-cp-personId", "input-cp-contractorName", "input-cp-contractorCode", "input-cp-slNo","input-cp-dateOfBirth","input-cp-localAddress","input-cp-permanentAddress","input-cp-dateOfJoining","input-cp-fathersName", "input-cp-mothersName", "input-cp-bloodGroup","input-cp-gender","input-cp-maritalStatus", "input-cp-identificationMark", "input-cp-contactNo", "input-cp-emgContactNo", "input-cp-wageRate", "input-cp-personType","","input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate","input-cp-aadharNo"];
		//const mandSubms = ["sub-aadharCard","sub-polVer","sub-passport","sub-mediCert","sub-ageProofCert","sub-savBank","sub-gatePass","sub-workmenBio","sub-esiDecl","sub-epfDecl","sub-epfNom","sub-contractIntvw","sub-esiEpfUnd","sub-empCompPack"];

		const mandKeys1 = ["contactNo","visitorName", "companyName", "designation","dateOfBirth","address","gender","purposeOfVisit","tebmaContactPerson","passType","validUpto","nationality","photoIdType"];
		const mandKeys2 = ["malpeOffice","malpeStore","nbsProdShops","malpeCanteen","malpeHospital","hktYard","bptStores","santhakatte","kalmadySite","vmdSite"];

		const visNationality = document.getElementById("input-vi-nationality").value;
		const visType = document.getElementById("input-vi-passType").value;

		const mandKeys3 = (visNationality=="Indian")?["photoIdNo"]:["photoIdNo","visaType","visaNo","visaValidity"];
		const mandKeys4 = (visType=="Visitor")?[]:["emailDept","safetyAwareness"];



		const mandIds1 = keyToIdArray("input-vi",mandKeys1);
		const mandIds2 = keyToIdArray("area-vi",mandKeys2);
		const mandIds3 = keyToIdArray("input-vi",mandKeys3);
		const mandIds4 = keyToIdArray("frml-vi",mandKeys4);

		const gadgetStatus = document.getElementById("extr-vi-gadget").children[0].checked;
		const vehicleStatus = document.getElementById("extr-vi-vehicle").children[0].checked;

		const gadgIds = (gadgetStatus)?["input-vi-gadgetType","input-vi-gadgetDesc","input-vi-gadgetSlNo"]:[];
		const vehiIds = (vehicleStatus)?["input-vi-vehicleType","input-vi-vehicleName","input-vi-vehicleRegNo"]:[];
		


		const nMap={};


		nMap["doc"]=0;
		nMap["doc2"]=0;

		nMap["other"]=0;

		let countId = 0;
		let countSubm = 0;

		const arrays = [mandIds1,mandIds2,mandIds3,mandIds4,gadgIds,vehiIds];
		const keys = ["type1","type2","type3","type4","type5","type6"];

		keys.forEach((key)=>{

			nMap[key]=0;
		})

		for(x=0;x<arrays.length;x++){

			const array = arrays[x];

			console.log(nMap[keys[x]]);

			//console.log(array);

			for(y=0;y<array.length;y++){
				
					if(x!=1 && x!=3){//As for x=1, the box is int the children of the id element

						const info = document.getElementById(array[y]);

						if(info.value!=""){
							console.log(keys[x]);
						 	nMap[keys[x]]=nMap[keys[x]]+1;
						 	console.log(nMap[keys[x]]);
						}
					}else{
						console.log(x);

						console.log(array[y]);
						const info = document.getElementById(array[y]).children[0];

						console.log(info);


						if(info.checked==true){
						  nMap[keys[x]]++;
						}

					}


				}



			}


	let nCount = 0;
	let sCount=0;
	let tCount=0;



		for(x=0;x<arrays.length;x++){

			const array = arrays[x];

				if(array!=mandIds2){

					if(nMap[keys[x]]>=array.length){
						nCount++;

						console.log(array.length);
						console.log(x);

					}

				}else{

					if(nMap[keys[x]]>=1){
						nCount++;
					}

				}

				


			}


		sCount=(photo.style.display=="none")?0:1;
		//tCount=(appDataMap["timeValidityCheck"])?1:0;

			

		keys.forEach((key)=>{

			console.log(key+"="+nMap[key]);

		});



		console.log(nCount+sCount);


		//btnApprove.style.display=(nCount+sCount+tCount==arrays.length+2)?"block":"none";
		btnApprove.style.display=(nCount+sCount==arrays.length+1)?"block":"none";
		
	}


//@10
	}else if(action=="add-visitor-pass"){

		showProgressLoader()

		const mMap={};
		const aMap={};

		let greenSignal = true;

		//const labels = ["Contact No","Visitor ID","Name","Company","Designation","Date of Birth","Address","Blood Group","Gender","Emg Contact No","Photo ID Type","Photo ID No","Purpose of Visit","Person to Visit","Dept of Person","Contact Person Ph No","Validity","Gadget Type","Gadget Description","Gadget Sl No","Vehicle Type","Vehicle Name","Vehicle Reg No"];
		const dbKeys = ["contactNo","visitorId","visitorName","companyName","designation","dateOfBirth","address","bloodGroup","gender","emgContactNo"];
		const dbKeys1 = ["visitorId","visitorName","companyName","designation","nationality"];
		const dbKeys2 = ["photoIdType","photoIdNo","purposeOfVisit","tebmaContactPerson","tebmaContactDept","tebmaContactPhoneNo","gadgetType","gadgetDesc","gadgetSlNo","vehicleType","vehicleName","vehicleRegNo","visaType","visaNo","visaValidity"];
		const dbKeys3 = ["passType","validUpto","visitorPassIssuedAt","visitorPassPermittedAreas","gadgetApplicability","vehicleApplicability","visaApplicability","emailDeptSubmitted","safetyAwarenessAttended","dateOfIssue","inTime","passStatus"];

	


		//const dbKeys=idToKeyArray(ids);
		

		const otherDbKeys=["esiApplicability","epfApplicability"];

		//const actualIds = ["input-cp-personName", "input-cp-contractorName", "input-cp-slNo","input-cp-dateOfBirth","input-cp-tradeName","input-cp-localAddress","input-cp-permanentAddress","input-cp-dateOfJoining","input-cp-fathersName", "input-cp-mothersName","input-cp-nomineeName", "input-cp-bloodGroup","input-cp-gender","input-cp-maritalStatus", "input-cp-identificationMark", "input-cp-contactNo", "input-cp-emgContactNo", "input-cp-wageRate", "input-cp-personType","","input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate","input-cp-aadharNo"];
		
		const inputType = ["text","select","text","date","select","textarea","textarea","date","text", "text","text","select","select","select", "text", "number", "number", "text","select","","text","text","text","date","number"];
		const xKeys = ["ESI No","Insurance No","UAN","Passport Issue Date","Aadhar No"];
		const xIds = ["tile-esi","tile-insurance","tile-uan","tile-passportDate","tile-aadharCard"];
		const hiddenKeys = ["Insurance No","Passport Issue Date","Aadhar No"];

		const dateInputKeys = ["dateOfBirth","visaValidity","validUpto","dateOfIssue"]

/*
		const dbKeys=idToKeyArray(ids);
		const submDbKeys = idToKeyArray2(submIds);
		const docDbKeys = idToKeyArray2(docIds);
		const attDbKeys = idToKeyArray2(attIds);
*/
		//const otherDbKeys = idToKeyArray(otherIds);

		//const impIds=["input-cp-personName", "input-cp-contractorName", "input-cp-slNo","input-cp-dateOfBirth","input-cp-tradeName","input-cp-localAddress","input-cp-permanentAddress","input-cp-dateOfJoining","input-cp-bloodGroup","input-cp-gender","input-cp-maritalStatus","input-cp-contactNo", "input-cp-emgContactNo", "input-cp-personType","","input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate","input-cp-aadharNo"];

		const inputs = bodyContainer.getElementsByClassName("input-vi");
		const checkboxs = bodyContainer.getElementsByClassName("checkbox-vi");
		const missedInputs = [];

//Input Validation
		for(x=0;x<inputs.length;x++){

			const input = inputs[x];	
				const key = input.id.split(/\-/)[2];
				mMap[key] = input.value;
		};

		mMap["visitorPassPermittedAreas"]=[];

		for(x=0;x<checkboxs.length;x++){
			const checkbox = checkboxs[x];	
				//const key = (checkbox.id=="att-hseTraining")?checkbox.id.split(/\-/)[1]+"Attended":checkbox.id.split(/\-/)[1]+"Submitted";
				const key = checkbox.id.split(/\-/)[2];
				const classType = checkbox.id.split(/\-/)[0]+"-"+checkbox.id.split(/\-/)[1];

				mMap[key] = (checkbox.children[0].checked)?"Yes":"No";

				if(classType=="area-vi" && checkbox.children[0].checked){
					mMap["visitorPassPermittedAreas"].push(checkbox.children[1].innerText);
				}

				console.log(key+"-"+mMap[key]);
		};





		mMap["gadgetApplicability"]=(document.getElementById("extr-vi-gadget").children[0].checked)?"Yes":"No";
		mMap["vehicleApplicability"] = (document.getElementById("extr-vi-vehicle").children[0].checked)?"Yes":"No";
		mMap["emailDeptSubmitted"] = (document.getElementById("frml-vi-emailDept").children[0].checked)?"Yes":"No";
		mMap["safetyAwarenessAttended"] = (document.getElementById("frml-vi-safetyAwareness").children[0].checked)?"Yes":"No";
		mMap["visaApplicability"] = (mMap["nationality"]=="Indian")?"No":"Yes";

//]]

		const visaKeys = ["visaType","visaNo","visaValidity"]

			if(mMap["nationality"]=="Indian"){

				visaKeys.forEach((visaKey)=>{
					mMap[visaKey]="";
				})
			}



		mMap["inTime"] = getFormattedDateTime(new Date());
		//mMap["validUpto"] = getFormattedDate(new Date())+" "+mMap["validUpto"];
		valDays = (mMap["validUpto"]>7)?7:(mMap["validUpto"]==0)?1:mMap["validUpto"];
		mMap["validUpto"] = getFormattedDate(getfutureDate(valDays-1));

		mMap["passStatus"] = "Active";
		mMap["status"] = "Active";
		mMap["dateOfIssue"] =  getFormattedDate(new Date())

		mMap["dateOfCardExpiry"] = getFormattedDate(getfutureDate(90));
		mMap["visitorPassIssuedAt"] = userMap["location"];
		mMap["photo"] = appDataMap["photo"];


		dateInputKeys.forEach((keyName)=>{
			if(mMap[keyName]==""){
				mMap[keyName]=null;
			}
		})





		const visDbKeys = ["contactNo","visitorId","visitorName","companyName","designation","email","dateOfBirth","address","bloodGroup","gender","nationality","emgContactNo","photo","status"];

		if(greenSignal){


			con.connect((err)=>{

					con.on('error',(err)=>{
						console.log("Error ="+err.message);
						handleError();
					});


				//const query= `INSERT INTO contractor_data (contractorName,contractorId,department,dateOfIncorporation,dateOfRegistry,registeredAddress,contractorContactNo,contractorEmail,localAddress,localRepName,localRepContactNo,bankAccountNo) VALUES('${mMap["contractorName"]}','${mMap["contractorId"]}','${mMap["department"]}','${mMap["dateOfIncorporation"]}','${mMap["dateOfRegistry"]}','${mMap["registeredAddress"]}','${mMap["contractorContactNo"]}','${mMap["contractorEmail"]}','${mMap["localAddress"]}','${mMap["localRepName"]}','${mMap["localRepContactNo"]}','${mMap["bankAccountNo"]}')`;
				//const query= `INSERT INTO contractor_person_data (${dbKeys},${adlDbKeys},creationDate) 




const query1= `INSERT INTO visitor_data (${visDbKeys}) 
				VALUES('${mMap["contactNo"]}',
				'${mMap["visitorId"]}',
				'${mMap["visitorName"]}',
				'${getEscapedString(mMap["companyName"])}',
				'${mMap["designation"]}',
				'${mMap["email"]}',
				'${mMap["dateOfBirth"]}',
				'${mMap["address"]}',
				'${mMap["bloodGroup"]}',
				'${mMap["gender"]}',
				'${mMap["nationality"]}',
				'${mMap["emgContactNo"]}',
				'${mMap["photo"]}',
				'${mMap["status"]}')
				ON DUPLICATE KEY UPDATE
				visitorName = '${mMap["visitorName"]}',
				companyName ='${getEscapedString(mMap["companyName"])}',
				designation ='${mMap["designation"]}',
				email ='${mMap["email"]}',
				dateOfBirth ='${mMap["dateOfBirth"]}',
				address ='${mMap["address"]}',
				bloodGroup ='${mMap["bloodGroup"]}',
				gender ='${mMap["gender"]}',
				nationality = '${mMap["nationality"]}',
				emgContactNo ='${mMap["emgContactNo"]}',
				photo ='${mMap["photo"]}'`;


const query= `INSERT INTO visitor_pass_data (${dbKeys1},${dbKeys2},${dbKeys3}) 
				VALUES(
				'${mMap["visitorId"]}',
				'${mMap["visitorName"]}',
				'${getEscapedString(mMap["companyName"])}',
				'${mMap["designation"]}',
				'${mMap["nationality"]}',
				'${mMap["photoIdType"]}',
				'${mMap["photoIdNo"]}',
				'${mMap["purposeOfVisit"]}',
				'${mMap["tebmaContactPerson"]}',
				'${mMap["tebmaContactDept"]}',
				'${mMap["tebmaContactPhoneNo"]}',
				'${mMap["gadgetType"]}',
				'${mMap["gadgetDesc"]}',
				'${mMap["gadgetSlNo"]}',
				'${mMap["vehicleType"]}',
				'${mMap["vehicleName"]}',
				'${mMap["vehicleRegNo"]}',
				'${mMap["visaType"]}',
				'${mMap["visaNo"]}',
				${formatData(mMap["visaValidity"])},
				'${mMap["passType"]}',
				'${mMap["validUpto"]}',
				'${mMap["visitorPassIssuedAt"]}',
				'${mMap["visitorPassPermittedAreas"]}',
				'${mMap["gadgetApplicability"]}',
				'${mMap["vehicleApplicability"]}',
				'${mMap["visaApplicability"]}',
				'${mMap["emailDeptSubmitted"]}',
				'${mMap["safetyAwarenessAttended"]}',
				'${mMap["dateOfIssue"]}',			
				'${mMap["inTime"]}',
				'${mMap["passStatus"]}')`;
				//const query= `INSERT INTO contractor_data (contractorName,contractorId,bankAccountNo) VALUES('${mMap["contractorName"]}','${mMap["contractorId"]}','${mMap["bankAccountNo"]}')`;



/*
				'${mMap["companyName"]}',
				'${mMap["designation"]}',
				'${mMap["dateOfBirth"]}',
				'${mMap["address"]}',
				'${mMap["bloodGroup"]}',
				'${mMap["gender"]}',
				'${mMap["emgContactNo"]}',

*/






				con.query(query1,(err,result)=>{

						con.on('error',(err)=>{
							console.log(query);
							
							console.log("Error ="+err.message);
							handleError();
						});

						console.log(query1);
						console.log(result);

						if(err!=null){
							console.log(err.message)
							hideProgressLoader()
						}
						
						hideProgressLoader()

						showResult(result,err,"add");
				



				});


				con.query(query,(err,result)=>{

						con.on('error',(err)=>{
							console.log(query);

							console.log("Error ="+err.message);
							handleError();
						});

						console.log(query);
						console.log(result);

						if(err!=null){
							console.log(err.message)
						}else{
							console.log("Successfully Inserted");
						}

					

						//showResult(result,err,"add");
						//showNotification("Success","Visitor Pass Issued");
/*
						const cameraCont = document.querySelector(".camera-cont");

						const button = document.createElement("div");
						button.setAttribute("class","btn-std-2");
						button.innerText="Print Visitor Pass";

*/



				})




			})





		}


	

//@11a
	}else if(action=="manage-visitor-pass"){


		bodyContainer.innerHTML="";
		bodyContainer.style.height="80%";
		bottomContainer.style.height="10%";

		title.innerText="MANAGE VISITOR PASS";

		bodyContainer.setAttribute("class","");

		con.connect((err)=>{

			const query = `SELECT visitor_pass_data.visitorPassNo,visitor_pass_data.tebmaContactPerson,visitor_pass_data.passStatus,visitor_data.visitorId,visitor_data.visitorName,visitor_data.companyName
            FROM visitor_pass_data INNER JOIN visitor_data ON visitor_pass_data.visitorId=visitor_data.visitorId;`

            con.query(query,(err,result)=>{


                console.log(query);
                console.log(result);

                appDataMap["visitorPassDetails"] = sqlToSimpleMap(result);

                console.log(appDataMap["visitorPassDetails"]);


     

//Adding in the search contaier

                const colors = [prColor1,prColor3,prColor4];

        		const searchContainer = document.createElement("div");
        		searchContainer.setAttribute("class","filter-cont c-block");

        		const subCont = document.createElement("div");
        		subCont.setAttribute("class","grid-tile-3a");

        		for(x=0;x<2;x++){

        			const child = document.createElement((x==0)?"div":(x==1)?"select":"input");
        			child.setAttribute("class",(x==0)?"c-flex filter-tile":"");
                    child.style.backgroundColor = colors[x];
        			//child.setAttribute("id",(x!=0)?)
        			child.innerText=(x==0)?"SEARCH BY":"";

        			if(x==1){

        				child.setAttribute("class","select-filter filter-tile");
        				child.setAttribute("data-filter_type",(x==1)?"main":"sub")

        				const options = (x==1)?["Date","Company Name","Status"]:"";

        				for(y=0;y<options.length;y++){
        					const subChild = document.createElement("option");
        					subChild.setAttribute("value",options[y]);
        					subChild.innerText = options[y]; 

        					child.appendChild(subChild);
        				}


        				
        			}


        			subCont.append(child);

        		}


        		searchContainer.appendChild(subCont);

        		bodyContainer.appendChild(searchContainer);


        //Adding head of result container

        		const resultHeadContainer = document.createElement("div");
        		resultHeadContainer.setAttribute("class","long-grid-tile-2a");


        		for(x=0;x<1;x++){

        			const subCont = document.createElement("div");
        			subCont.setAttribute("class","long-grid-tile-7b");


        					subCont.style.fontSize = `${14/16}rem`;

        					const labels = ["Sl No","Date","Gate Pass No", "Name", "Company Name", "Contact Person","Status"];
        					const colors = [prColor1,prColor2,prColor3,prColor1,prColor2,prColor4,prColor5];

        					for(y=0;y<labels.length;y++){

        						const label = labels[y];

        						const child = document.createElement("div");
        						child.setAttribute("class","c-flex table-head-tile");
        						child.style.backgroundColor=colors[y];
        						//child.setAttribute("id",(x!=0)?)
        						child.innerText=label.toUpperCase();
        					
        						subCont.append(child);

        					};


        			resultHeadContainer.appendChild(subCont);


        		}

        		bodyContainer.appendChild(resultHeadContainer);

//Adding in the result container

                const resultContainer = document.createElement("div");
                resultContainer.setAttribute("class","result-cont");
                resultContainer.setAttribute("id","visitor-query-result-cont");

                resultContainer.innerText="NO RECORDS, PLEASE FILTER RESULTS";


/*
                    const subContA = document.createElement("div");
                    subContA.setAttribute("class","");

                    subContA.innerText="NO RECORDS, PLEASE FILTER RESULTS";


                    resultContainer.appendChild(subContA);

*/
                bodyContainer.appendChild(resultContainer);
//]]

        		document.querySelector('.select-filter').addEventListener("change",(item)=>{


                        const elem = event.target;
        				const filterType = elem.dataset.filter_type;
                        const mainValue = elem.value;
        				console.log(filterType);

      

                            const filterValue = elem.value;

                            const labels = ["Date","Company Name","Status"];
                            const dbKeys = ["","companyName","passStatus"]
                            const inputType = ["date","select","select"];

                            const index = labels.indexOf(filterValue);

                            const subCont = elem.parentElement;

                            if(subCont.children.length>2){

                                subCont.removeChild(subCont.children[2]);

                            }

                            const child = document.createElement((inputType[index]=="select")?inputType[index]:"input");
                            child.setAttribute("class","select-filter-sub filter-tile");
                            child.style.backgroundColor = prColor6l6;
                            child.setAttribute("data-filter_type","sub");
                            

                            if(inputType[index]=="select"){


                                const options = toUniqueArray(appDataMap["visitorPassDetails"][dbKeys[index]]);

                                options.unshift("Please Select");


                                for(y=0;y<options.length;y++){
                                    const subChild = document.createElement("option");
                                    subChild.setAttribute("value",options[y]);
                                    subChild.innerText = options[y]; 

                                    child.appendChild(subChild);
                                }


                            }else{
                                child.setAttribute("type",inputType[index]);
                                child.value=getFormattedDate(new Date());
                            }

                            subCont.appendChild(child);

                            document.querySelector('.select-filter-sub').addEventListener("change",(e)=>{

                                const elem = e.target;
                                const elemType = elem.tagName;
                               // const mainValue = elem.parentElement.children[1].value;

                                const value = elem.value;
                                let query ="";

                                const labels = ["Date","Company Name","Status"];
                                const reqKeys = ["dateOfIssue","companyName","passStatus"];

                                const index = labels.indexOf(mainValue);

                                const formattedValue = getEscapedString(value) //The string may have a ' in it so formatting to escape any

                                query = `SELECT dateOfIssue,visitorPassNo,tebmaContactPerson,passStatus,visitorId,visitorName,companyName
                                             FROM visitor_pass_data WHERE ${reqKeys[index]}='${formattedValue}';`;


/*
                                if(mainValue=="Date"){

                                    const tDate = getFormattedDate(new Date(value)).split(/\-/).join("");

                                    console.log(tDate); 

                                    query = `SELECT visitor_pass_data.visitorPassNo,visitor_pass_data.tebmaContactPerson,visitor_pass_data.passStatus,visitor_data.visitorId,visitor_data.visitorName,visitor_data.companyName
                                             FROM visitor_pass_data INNER JOIN visitor_data ON visitor_pass_data.visitorId=visitor_data.visitorId WHERE SUBSTR(visitor_pass_data.visitorPassNo,1,8)=${tDate};`;


                                }else if(mainValue=="Company Name"){

                                     // query = `SELECT visitor_pass_data.visitorPassNo,visitor_pass_data.tebmaContactPerson,visitor_pass_data.passStatus,visitor_data.visitorId,visitor_data.visitorName,visitor_data.companyName
                                      //       FROM visitor_pass_data INNER JOIN visitor_data ON visitor_pass_data.visitorId=visitor_data.visitorId WHERE visitor_data.companyName='${value}';`;

                                      	query = `SELECT dateOfIssue,visitorPassNo,tebmaContactPerson,passStatus,visitorId,visitorName,companyName
                                             FROM visitor_pass_data WHERE dateOfIssue=${tDate};`;
                                }else if(mainValue=="Status"){

                                        query = `SELECT visitor_pass_data.visitorPassNo,visitor_pass_data.tebmaContactPerson,visitor_pass_data.passStatus,visitor_data.visitorId,visitor_data.visitorName,visitor_data.companyName
                                             FROM visitor_pass_data INNER JOIN visitor_data ON visitor_pass_data.visitorId=visitor_data.visitorId WHERE visitor_pass_data.passStatus='${value}';`;


                                }

*/
                                        con.query(query,(err,result)=>{



                                        console.log(query);


                                        console.log(result);

                                        const dbKeys = ["slNo","date","visitorPassNo","visitorName","companyName","tebmaContactPerson","passStatus"];
                                        const colors = [prColor1,prColor2,prColor3,prColor1,prColor2,prColor4,prColor5];


                                        const  fMap = sqlToSimpleMap(result);

                                        if(Object.keys(fMap).length!=0){

                                        resultContainer.innerHTML="";

                                        //const noOfCols = Object.keys(fMap).length;
                                        const noOfCols = 7;
                                        const noOfRows = fMap[Object.keys(fMap)[0]].length;

                                        for(q1=0;q1<noOfRows;q1++){

                                            const container = document.createElement("div");
                                            container.setAttribute("class","long-grid-tile-2a");
                                            container.style.height = "3rem";


                                            const subCont = document.createElement("div");
                                            subCont.setAttribute("class","long-grid-tile-7b");

                                             for(q2=0;q2<noOfCols;q2++){

                                                const child = document.createElement("div");
                                                child.setAttribute("class","result-tile-1 c-flex");
                                                child.style.backgroundColor = colors[q2];

                                                if(q2==0){

                                                    child.innerText=q1+1;
                                                    child.style.backgroundColor=prColor1;

                                                }else{

                                                    if(dbKeys[q2]=="date"){

                                                        const dateNumber = fMap["visitorPassNo"][q1].slice(0,8);

                                                        child.innerText = numberToDateString(dateNumber);



                                                    }else{

                                                        child.innerText=fMap[dbKeys[q2]][q1];

                                                    }

                                                    

                                                    
                                                        }


                                                    subCont.appendChild(child);

                                                  }


                                                container.appendChild(subCont);


                                                const subContBtn = document.createElement("div");
                                                subContBtn.setAttribute("class","grid-tile-3b c-block c-flex");
                                                subContBtn.style.backgroundColor = prColor7;

                                                //const fileNames = ["visitorPass-view","visitorPass-edit","visitorPass-print"];
                                                const actions = ["exit","view","print"];

                                                for(a1=0;a1<actions.length;a1++){

                                                    appDataMap["backSnapshot"]=mainContainer.innerHTML;

                                                    const child = document.createElement("img");
                                                    child.setAttribute("class","c-block img-size-1-5 btn-action-visitorPass");
                                                    child.setAttribute("data-visitor_pass_no",fMap["visitorPassNo"][q1]);
                                                    child.setAttribute("data-action_type",actions[a1]);
                                                    child.src = "../source/logo--"+actions[a1]+".svg";
                                                    child.style.visibility=(actions[a1]=="exit")?(fMap["passStatus"][q1]=="Exit")?"hidden":"visible":"visible";


                                                    subContBtn.appendChild(child);
                                                }

                                                container.appendChild(subContBtn);

                                                resultContainer.appendChild(container);

                                             }

                                             document.querySelectorAll('.btn-action-visitorPass').forEach((item)=>{

                                                item.addEventListener("click",(e)=>{

                                                    const elem = e.target;
                                                    const btnAction = elem.dataset.action_type;
                                                    const passNo = elem.dataset.visitor_pass_no;

                                                    appDataMap["visitorPassNo"] = passNo;

                                                    main(btnAction+"-visitor-pass");

                                                    console.log(btnAction + passNo);


                                                    	

                                                })
                                             })

                                            


                                        }else{

                                            resultContainer.innerHTML="";
                                            resultContainer.innerText="NO RECORDS FOUND"


                                        }

                                    })
                                   

                            })


                        });


				const changeEvent = new Event('change');
				document.querySelector('.select-filter').dispatchEvent(changeEvent);

				const changeEvent2 = new Event('change');
				document.querySelector('.select-filter-sub').dispatchEvent(changeEvent2);



							const btnLabels = ["Back"];
						    const btnIds2 = ["btn-back-dashboard"];


						    for(w=0;w<btnLabels.length;w++){

						        const button = document.createElement("button");
						        button.setAttribute("class","btn-std-2");
						        button.innerText=btnLabels[w];
						        button.setAttribute("id",btnIds2[w]);

						        bottomContainer.appendChild(button);

						        button.addEventListener('click',(e)=>{

						            const idName = e.target.id;

						            if(idName=="btn-back-dashboard"){
						                displayDashboard();
						            }else{
						                main(idName.slice(4));
						            }

						        })
						    }

					

        			});



        		});



//@12a
		
	}else if(action=="view-visitor-pass"){

        let mMap = {};


        con.connect((err)=>{

            const query = `SELECT * FROM visitor_pass_data INNER JOIN visitor_data ON visitor_pass_data.visitorId=visitor_data.visitorId WHERE visitor_pass_data.visitorPassNo='${appDataMap["visitorPassNo"]}';`;

            con.query(query,(err,result)=>{

                console.log(query);
                console.log(result);

                appDataMap["curVisitorPassData"] = result[0];
                mMap = appDataMap["curVisitorPassData"];


                 bodyContainer.innerHTML = "";

        bodyContainer.style.height="80%";
        bottomContainer.style.height="10%";

        title.innerText="View Visitor Pass"; // title got from displayDashboard Function

        const noOfRows = 16;

        const classType = "input-vi";

//no of entries = 29
        const labels = ["Visitor Pass No","Visitor ID","Name","Company","Designation","Email","Date of Birth","Address","Blood Group","Gender","Nationality","Contact No","Emg Contact No","Photo ID Type","Photo ID No","Purpose of Visit","Person to Visit","Dept of Person","Contact Person Ph No","In Time","Pass Type","Validity","Out Time","Issued At","Status","Gadget Type","Gadget Description","Gadget Sl No","Vehicle Type","Vehicle Name","Vehicle Reg No","Visa Type","Visa No","Visa Validity"];
        const dbKeys = ["visitorPassNo","visitorId","visitorName","companyName","designation","email","dateOfBirth","address","bloodGroup","gender","nationality","contactNo","emgContactNo","photoIdType","photoIdNo","purposeOfVisit","tebmaContactPerson","tebmaContactDept","tebmaContactPhoneNo","inTime","passType","validUpto","outTime","visitorPassIssuedAt","passStatus","gadgetType","gadgetDesc","gadgetSlNo","vehicleType","vehicleName","vehicleRegNo","visaType","visaNo","visaValidity"];
        
        const inputType =  ["text","text","text","text","text","email","date","textarea","select","select","select","number","number","select"
        ,"text","text","select","text","number","dateTime","select","date","dateTime","text","select","text","text","select","text","text","text","select","text","date" ];
                                
        const gridRows=["1/2","2/3","3/4","4/5","5/6","6/7","7/8","8/10","10/11","11/12","12/13","13/14","14/15","15/16","16/17","1/2","2/3","3/4","4/5","5/6","6/7","7/8","8/9","9/10","10/11","11/12","12/13","13/14","14/15","15/16","16/17"]//   ,"13/14"];
        const gridColumns=["1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3"]//   ,"2/3"];
        
        const hidKeys = ["gadgetType","gadgetDesc","gadgetSlNo","vehicleType","vehicleName","vehicleRegNo","visaType","visaNo","visaValidity"];
        const disKeys = ["visitorId","inTime","validUpto","Out Time","visitorPassIssuedAt","visitorPassNo"];
        const visFactors = ["gadgetApplicability","gadgetApplicability","gadgetApplicability","vehicleApplicability","vehicleApplicability","vehicleApplicability","visaApplicability","visaApplicability","visaApplicability"];


        const ids = keyToIdArray(classType,dbKeys);

        bodyContainer.setAttribute("class","input-list-cont");
        bodyContainer.style.gridTemplateRows=`repeat(${noOfRows},2rem)`;

//Hiding the tiles which have to be hidden
        for(x=0;x<labels.length;x++){

                    const container = document.createElement("div");
                    container.setAttribute("class","input-tile");
                    
                    container.style.gridColumn = gridColumns[x];
                    container.style.gridRow = gridRows[x];

            //condition for hiding tiles
                    if(hidKeys.includes(dbKeys[x])){

                        const index = hidKeys.indexOf(dbKeys[x]);

                        container.style.gridRow = "";
                        //container.style.gridColumn = "";
                        container.style.display=(mMap[visFactors[index]]=="Yes")?"grid":"none";
                        container.style.innerText=(mMap[visFactors[index]]=="Yes")?mMap[dbKeys[x]]:"";

                    }

//]]



                        //container.style.gridRow=(x>=noOfRows)?"1/2":"";

                    if(labels[x]==""){


                    }else{

                        for(y=0;y<2;y++){

                            const child = document.createElement("div");
                            child.setAttribute("class",(y==0)?"input-tile-label c-flex":"input-tile-desc c-flex "+classType);
                            child.disabled = (y==1)?(disKeys.includes(dbKeys))?true:false:false;
                            child.setAttribute("type",(y==1)?inputType[x]:"");
                           	child.setAttribute("id",(y==1)?ids[x]:"");

                           if(y==0){

                           	child.innerText=labels[x];

                           }else if(y==1 && mMap[dbKeys[x]]!=null){

                           		if(inputType[x]=="date" || inputType[x]=="dateTime"){

                           			child.innerText=(inputType[x]=="date")?getIndiaDate(new Date(mMap[dbKeys[x]])):getIndiaDateTime(new Date(mMap[dbKeys[x]]));
                           		}else{
                           			child.innerText=mMap[dbKeys[x]];

                           		}

                           }
                            
                            container.appendChild(child);

                        }

                    }

                        bodyContainer.appendChild(container);

        };


            //const visitorIdArray = sqlToSimpleArray(appDataMap["visitorIdNameData"],"visitorId");
            //assignSlNoByAnalyzingDb(visitorIdArray[0]);
/*
            document.getElementById("input-vi-contactNo").addEventListener('change',(e)=>{
                    transmitDbData(e,"visitorId");
            });



            document.getElementById("input-vi-tebmaContactPerson").addEventListener('change',(e)=>{
                    const id = e.target.value.split(/\-/)[0].trim();

                    console.log(id);

                    console.log(appDataMap["employeeAppData"]);

                    const tMap = sqlToSimpleMap(appDataMap["employeeAppData"]);


                    document.getElementById("input-vi-tebmaContactDept").value = findKeyValueInMap(tMap,"employeeId",id,"department");
                    document.getElementById("input-vi-tebmaContactPhoneNo").value = findKeyValueInMap(tMap,"employeeId",id,"contactNo");
            });


*/
	
		

        for(x=0;x<3;x++){


            const containerA = document.createElement("div");
            containerA.setAttribute("class","submission-cont c-flex-col");
            containerA.style.gridColumn = "3/4";
            containerA.style.gridRow = (x==0)?"1/10":(x==1)?"10/13":"13/17";
            //containerA.style.height="400px";

                const head = document.createElement("div");
                head.setAttribute("class","subm-cont-head");
                head.innerText=(x==0)?"PERMITTED AREAS":(x==1)?"OTHER":"FORMALITIES";
                containerA.appendChild(head);


            if(x==0){


                const labels = ["Malpe Office","Sub Store Malpe","NBS & Production Shops","Malpe Canteen","Malpe Hospital","Hangarkatte Yard","Babuthota Store","Santhakatte","Kalmady Site","Vadamandeshwara Site"];
                const dbKeys=["malpeOffice","malpeStore","nbsProdShops","malpeCanteen","malpeHospital","hktYard","bptStores","santhakatte","kalmadySite","vmdSite"];
                const ids = keyToIdArray("area-vi",dbKeys);



                for(y=0;y<labels.length;y++){

                    const container = document.createElement("div");
                    container.setAttribute("class","checkbox-vi c-flex");
                    container.setAttribute("id",ids[y]);


                      for(z=0;z<2;z++){

                        const child = document.createElement((z==0)?"input":"div");
                        child.setAttribute("class",(z==0)?"":"");
                        child.innerText=(z==1)?labels[y]:"";

                        if(z==0){
                            child.setAttribute("type","checkbox");
                            child.checked=(mMap["visitorPassPermittedAreas"].includes(labels[y]))?true:false;
                            child.disabled = true;
                        }

                        container.appendChild(child);

                     }

                     containerA.appendChild(container);

                }



            }else if(x==1){


                const labels = ["Gadget","Vehicle"];
                const dbKeys=["gadget","vehicle"];
                const ids = keyToIdArray("extr-vi",dbKeys);


                for(y=0;y<labels.length;y++){

                    const container = document.createElement("div");
                    container.setAttribute("class","checkbox-vi c-flex");
                    container.setAttribute("id",ids[y]);


                      for(z=0;z<2;z++){

                        const child = document.createElement((z==0)?"input":"div");
                        child.setAttribute("class",(z==0)?"":"");
                        child.innerText=(z==1)?labels[y]:"";

                        if(z==0){
                            child.setAttribute("type","checkbox");
                            child.checked=(mMap[dbKeys[y]+"Applicability"]=="Yes")?true:false;
                            child.disabled = true;
                        }

                        container.appendChild(child);

                     }

                     containerA.appendChild(container);

                }

            }else if(x==2){


				const labels = ["Email from Concerned Dept","Safety Awareness Programme"];
				const dbKeys=["emailDept","safetyAwareness"];
				const suffixes = ["Submitted","Attended"];
				const ids = keyToIdArray("frml-vi",dbKeys);


				for(y=0;y<labels.length;y++){

					const container = document.createElement("div");
					container.setAttribute("class","checkbox-vi c-flex");
					container.setAttribute("id",ids[y]);


					  for(z=0;z<2;z++){

						const child = document.createElement((z==0)?"input":"div");
						child.setAttribute("class",(z==0)?"":"");
						child.innerText=(z==1)?labels[y]:"";

						if(z==0){
							child.setAttribute("type","checkbox");
                            child.checked=(mMap[dbKeys[y]+suffixes[y]]=="Yes")?true:false;
                            child.disabled = true;
						}

						container.appendChild(child);

					 }

					 containerA.appendChild(container);

				}

			}



        bodyContainer.appendChild(containerA);
        }


    bottomContainer.innerHTML="";

    const btnLabels = ["Edit Pass","Back"];
    const btnIds2 = ["btn-edit-visitor-pass-input","btn-back-dashboard"];


    for(w=0;w<btnLabels.length;w++){

        const button = document.createElement("button");
        button.setAttribute("class","btn-std-2");
        button.innerText=btnLabels[w];
        button.setAttribute("id",btnIds2[w]);

        bottomContainer.appendChild(button);

        button.addEventListener('click',(e)=>{

            const idName = e.target.id;

            if(idName=="btn-back-dashboard"){
                displayDashboard();
            }else{
                main(idName.slice(4));
            }

        })
    }

        const btnApprove = document.getElementById("btn-add-contract-person");


        const gadjBox = document.getElementById("extr-vi-gadget").children[0];
        const vehiBox = document.getElementById("extr-vi-vehicle").children[0];
        //const epfNom = document.getElementById("sub-epfNomSubmitted").children[0];
        //const passport = document.getElementById("sub-passportSubmitted").children[0];
        //const aadharCard = document.getElementById("sub-aadharCardSubmitted").children[0];
    

        //const empCompPack = document.getElementById("sub-empCompPackSubmitted").children[0];
        //const esiEpfUnd = document.getElementById("sub-esiEpfUndSubmitted").children[0];


        //empCompPack.disabled = true;
        //esiEpfUnd.disabled=true;

        const boxNames = [gadjBox,vehiBox];

        for(q=0;q<boxNames.length;q++){

            boxNames[q].addEventListener('change',(e)=>{

                const elem = e.target;
                const idName = e.target.parentElement.id;

                const classType = idName.split(/\-/)[0]+"-"+idName.split(/\-/)[1];
                let dbKeys=[];
                
                    if(idName=="extr-vi-gadget"){

                        dbKeys = ["gadgetType","gadgetDesc","gadgetSlNo"];
                    }else if(idName=="extr-vi-vehicle"){

                        dbKeys = ["vehicleType","vehicleName","vehicleRegNo"];
                    }

                            dbKeys.forEach((dbKey)=>{
                                document.getElementById("input-vi-"+dbKey).parentElement.style.display=(elem.checked)?"grid":"none";
                            })

            })


        };


        const container = document.createElement("div");
		container.setAttribute("class","camera-cont c-flex-col");
		container.style.gridColumn="4/5";
		container.style.gridRow = "1/11";

		bodyContainer.appendChild(container);


		const labelsA = ["","Generate Pass"];
		const elements = ["img","div"];
		const photoIds = ["input-cp-photo","btn-card"];
		const classes = ["img-area","btn-std-2"];



		for(x=0;x<labelsA.length;x++){

			const child = document.createElement(elements[x]);
			child.setAttribute("class",classes[x]);
			child.setAttribute("id",photoIds[x]);
			child.innerText=(x==1)?labelsA[x]:"";
			child.setAttribute("src",(elements[x]=="img")?mMap["photo"]:"");

			container.appendChild(child);
		};


		const mArray = [];
		mArray.push(mMap);



		const btnCard = document.getElementById("btn-card");

		btnCard.addEventListener('click',function(){

				ipcRenderer.send('open-window',{name:"card",
				data:{datas:mArray,type:"visitor"}});


		});



            })//end of con.query


        });//end of con


//@13a
    }else if(action=="edit-visitor-pass-input"){

    	let mMap={};

    	mMap = appDataMap["curVisitorPassData"];

		console.log(appDataMap["curVisitorPassData"]);
		
        bodyContainer.innerHTML = "";

        bodyContainer.style.height="80%";
        bottomContainer.style.height="10%";

        title.innerText="Edit Visitor Pass"; // title got from displayDashboard Function

        const noOfRows = 16;

        const classType = "input-vi";

//no of entries = 29
        const labels = ["Visitor Pass No","Visitor ID","Name","Company","Designation","Email","Date of Birth","Address","Blood Group","Gender","Contact No","Emg Contact No","Nationality","Photo ID Type","Photo ID No","Purpose of Visit","Person to Visit","Dept of Person","Contact Person Ph No","Validity","Issued At","Gadget Type","Gadget Description","Gadget Sl No","Vehicle Type","Vehicle Name","Vehicle Reg No","Visa Type","Visa No","Visa Validity","In Time","Out Time","Status",];
        const dbKeys = ["visitorPassNo","visitorId","visitorName","companyName","designation","email","dateOfBirth","address","bloodGroup","gender","contactNo","emgContactNo","nationality","photoIdType","photoIdNo","purposeOfVisit","tebmaContactPerson","tebmaContactDept","tebmaContactPhoneNo","validUpto","visitorPassIssuedAt","gadgetType","gadgetDesc","gadgetSlNo","vehicleType","vehicleName","vehicleRegNo","visaType","visaNo","visaValidity","inTime","outTime","passStatus",];
        
        const inputType =  ["text","text","text","text","text","email","date","textarea","select","select","number","number","select","select"
        ,"text","text","select","text","number","number","text","select","text","text","select","text","text","select","text","date","dateTime","dateTime","select"];
                                
        const gridRows=["1/2","2/3","3/4","4/5","5/6","6/7","7/8","8/11","11/12","12/13","13/14","14/15","15/16","16/17","1/2","2/3","3/4","4/5","5/6","6/7","7/8","8/9","9/10","10/11","11/12","12/13","13/14","14/15","15/16",,"16/17"]//   ,"13/14"];
        const gridColumns=["1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","1/2","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3","2/3"]//   ,"2/3"];
        
        const hidKeys = ["passStatus","outTime","inTime","gadgetType","gadgetDesc","gadgetSlNo","vehicleType","vehicleName","vehicleRegNo","visaType","visaNo","visaValidity"];
        const disKeys = ["inTime","OutTime","visitorPassIssuedAt","visitorPassNo"];
        const visFactors = ["gadgetApplicability","gadgetApplicability","gadgetApplicability","vehicleApplicability","vehicleApplicability","vehicleApplicability","visaApplicability","visaApplicability","visaApplicability"];


        const ids = keyToIdArray(classType,dbKeys);


        bodyContainer.setAttribute("class","input-list-cont");
        bodyContainer.style.gridTemplateRows=`repeat(${noOfRows},2rem)`;

//Hiding the tiles which have to be hidden
        for(x=0;x<labels.length;x++){

                    const container = document.createElement("div");
                    container.setAttribute("class","input-tile");
                    
                    container.style.gridColumn = gridColumns[x];
                    container.style.gridRow = gridRows[x];

            //condition for hiding tiles
                    if(hidKeys.includes(dbKeys[x])){

                        const index = hidKeys.indexOf(dbKeys[x]);

                        container.style.gridRow = "";
                        //container.style.gridColumn = "";
                        container.style.display=(mMap[visFactors[index]]=="Yes")?"grid":"none";
                        container.style.innerText=(mMap[visFactors[index]]=="Yes")?mMap[dbKeys[x]]:"";

                    }

//]]



                        //container.style.gridRow=(x>=noOfRows)?"1/2":"";

                    if(labels[x]==""){


                    }else{

                        for(y=0;y<2;y++){

                           	const child = document.createElement((y==0)?"div":(inputType[x]=="select" || inputType[x]=="textarea")?inputType[x]:"input");
							child.setAttribute("class",(y==0)?"input-tile-label c-flex":"input-tile-desc "+classType);
							
							child.setAttribute("type",(y==1)?inputType[x]:"");
							child.setAttribute("id",(y==1)?ids[x]:"");
							child.innerText=(y==0)?labels[x]:"";

                           if(y==0){

                           	child.innerText=labels[x];

                           }else if(y==1){

	                           	if(mMap[dbKeys[x]]!=null){

		                           		if(inputType[x]=="date" || inputType[x]=="dateTime" || inputType[x]=="time"){

		                           			child.setAttribute("value",(inputType[x]=="date")?getFormattedDate(new Date(mMap[dbKeys[x]])):getIndiaDateTime(new Date(mMap[dbKeys[x]])));

		                           			if(labels[x]=="Validity"){

		                           				console.log("Validity Entry");
		                           				child.setAttribute("value",getTime(new Date(mMap[dbKeys[x]])));
		                           				//child.value = getTime(new Date(mMap[dbKeys[x]]));
		                           			}

		                           		}else{
		                           			child.setAttribute("value",mMap[dbKeys[x]]);
		                           			child.disabled=(disKeys.includes(dbKeys[x]))?true:false;
		 

		                           		}


				                    	if(inputType[x]=="select"){

											let options=[];


											if(labels[x]=="Blood Group"){

												console.log("blood group");

												options = ["A+","A-","A1+","A1-","B+","B-","AB+","AB-","O+","O-","NA"];


											}else if(labels[x]=="Gender"){

												options = ["Male","Female","Transgender"];


											}else if(labels[x]=="Photo ID Type"){

												options = ["PAN CARD","AADHAR","DRIVING LICENSE","OTHER"];

											}else if(labels[x]=="Person to Visit"){

												const tMap = sqlToSimpleMap(appDataMap["employeeAppData"]);

												for(z=0;z<tMap["employeeId"].length;z++){

													options.push(tMap["employeeId"][z]+" - "+tMap["employeeName"][z]);
												}


											}else if(labels[x]=="Gadget Type"){

													options = ["LAPTOP","TAB","CAMERA","OTHER"];

											}else if(labels[x]=="Vehicle Type"){

													options = ["4-WHEELER","2-WHEELER","OTHER"];

											}else if(labels[x]=="Status"){

													options = ["Active","Exit","Hold"];

											}else if(labels[x]=="Nationality"){

											options = ["Indian","Foreigner"];

											}else if(labels[x]=="Visa Type"){



													options = ["Business","Student","Tourist","Employment","Visa on Arrival","e-Visa", "Project","Research","Conference",'Diplomatic',"Official","Medical"];

											};;

															for(t1=0;t1<options.length;t1++){

																const option = options[t1];

																const subChild = document.createElement("option");
																subChild.setAttribute("value",option);
																subChild.innerText = option;

																child.appendChild(subChild);

															}

											//child.setAttribute("value",mMap[dbKeys[x]]);
											child.value=mMap[dbKeys[x]];
											console.log(mMap[dbKeys[x]]);
									
										}else if(inputType[x]=="textarea"){

											child.innerText = mMap[dbKeys[x]];


										}//if(select)

	                           		}







                           } //if(y1==0);





                            
                            container.appendChild(child);

                        }

                    }

                        bodyContainer.appendChild(container);

        };


            //const visitorIdArray = sqlToSimpleArray(appDataMap["visitorIdNameData"],"visitorId");
            //assignSlNoByAnalyzingDb(visitorIdArray[0]);

            document.getElementById("input-vi-contactNo").addEventListener('change',(e)=>{
                    transmitDbData(e,"visitorId");
            });



            document.getElementById("input-vi-tebmaContactPerson").addEventListener('change',(e)=>{
                    const id = e.target.value.split(/\-/)[0].trim();

                    console.log(id);

                    console.log(appDataMap["employeeAppData"]);

                    const tMap = sqlToSimpleMap(appDataMap["employeeAppData"]);


                    document.getElementById("input-vi-tebmaContactDept").value = findKeyValueInMap(tMap,"employeeId",id,"department");
                    document.getElementById("input-vi-tebmaContactPhoneNo").value = findKeyValueInMap(tMap,"employeeId",id,"contactNo");
            });


            const visaType = document.getElementById("input-vi-visaType");
            const visaNo = document.getElementById("input-vi-visaNo");
            const visaValidity = document.getElementById("input-vi-visaValidity");

        document.getElementById("input-vi-nationality").addEventListener('change',(e)=>{


				const value = e.target.value;

				appDataMap["visitorNationality"]=value;

				const idTypeBox = document.getElementById("input-vi-photoIdType");

				idTypeBox.innerHTML="";

				const options=(value=="Indian")?["Pan Card","Aadhar","Driving License","Other"]:["Passport"];

				for(a1=0;a1<options.length;a1++){
					const option = document.createElement("option");
					option.setAttribute("value",options[a1]);
					option.innerText=options[a1];

					idTypeBox.appendChild(option);
				};

			const visaBoxes = [visaType,visaNo,visaValidity]
			
				visaBoxes.forEach((box)=>{
					box.parentElement.style.display=(value=="Indian")?"none":"grid";
				});

				//checkMandatoryInputs();
				

			});


        const changeEvent = new Event("change");
         document.getElementById("input-vi-nationality").dispatchEvent(changeEvent);
	
		

        for(x=0;x<3;x++){


            const containerA = document.createElement("div");
            containerA.setAttribute("class","submission-cont c-flex-col");
            containerA.style.gridColumn = "3/4";
            containerA.style.gridRow = (x==0)?"1/9":(x==1)?"9/13":"13/17";
            //containerA.style.height="400px";

                const head = document.createElement("div");
                head.setAttribute("class","subm-cont-head");
                head.innerText=(x==0)?"PERMITTED AREAS":(x==1)?"OTHER":"FORMALITIES";
                containerA.appendChild(head);


            if(x==0){


                const labels = ["Malpe Office","Sub Store Malpe","NBS & Production Shops","Malpe Canteen","Malpe Hospital","Hangarkatte Yard","Babuthota Store","Santhakatte","Kalmady Site","Vadamandeshwara Site"];
                const dbKeys=["malpeOffice","malpeStore","nbsProdShops","malpeCanteen","malpeHospital","hktYard","bptStores","santhakatte","kalmadySite","vmdSite"];
                const ids = keyToIdArray("area-vi",dbKeys);



                for(y=0;y<labels.length;y++){

                    const container = document.createElement("div");
                    container.setAttribute("class","checkbox-vi c-flex");
                    container.setAttribute("id",ids[y]);


                      for(z=0;z<2;z++){

                        const child = document.createElement((z==0)?"input":"div");
                        child.setAttribute("class",(z==0)?"":"");
                        child.innerText=(z==1)?labels[y]:"";

                        if(z==0){
                            child.setAttribute("type","checkbox");
                            child.checked=(mMap["visitorPassPermittedAreas"].includes(labels[y]))?true:false;
                            //child.disabled = true;
                        }

                        container.appendChild(child);

                     }

                     containerA.appendChild(container);

                }



            }else if(x==1){


                const labels = ["Gadget","Vehicle"];
                const dbKeys=["gadget","vehicle"];
                const ids = keyToIdArray("extr-vi",dbKeys);


                for(y=0;y<labels.length;y++){

                    const container = document.createElement("div");
                    container.setAttribute("class","checkbox-vi c-flex");
                    container.setAttribute("id",ids[y]);


                      for(z=0;z<2;z++){

                        const child = document.createElement((z==0)?"input":"div");
                        child.setAttribute("class",(z==0)?"":"");
                        child.innerText=(z==1)?labels[y]:"";

                        if(z==0){
                            child.setAttribute("type","checkbox");
                            child.checked=(mMap[dbKeys[y]+"Applicability"]=="Yes")?true:false;
                            //child.disabled = true;
                        }

                        container.appendChild(child);

                     }

                     containerA.appendChild(container);

                }

            }else if(x==2){


				const labels = ["Email from Concerned Dept","Safety Awareness Programme"];
				const dbKeys=["emailDept","safetyAwareness"];
				const suffixes = ["Submitted","Attended"];
				const ids = keyToIdArray("frml-vi",dbKeys);


				for(y=0;y<labels.length;y++){

					const container = document.createElement("div");
					container.setAttribute("class","checkbox-vi c-flex");
					container.setAttribute("id",ids[y]);


					  for(z=0;z<2;z++){

						const child = document.createElement((z==0)?"input":"div");
						child.setAttribute("class",(z==0)?"":"");
						child.innerText=(z==1)?labels[y]:"";

						if(z==0){
							child.setAttribute("type","checkbox");
                            child.checked=(mMap[dbKeys[y]+suffixes[y]]=="Yes")?true:false;
                            //child.disabled = true;
						}

						container.appendChild(child);

					 }

					 containerA.appendChild(container);

				}

			}



        bodyContainer.appendChild(containerA);
        }


    bottomContainer.innerHTML="";

    const btnLabels = ["Edit Pass","Back"];
    const btnIds2 = ["btn-edit-visitor-pass","btn-back-dashboard"];


    for(w=0;w<btnLabels.length;w++){

        const button = document.createElement("button");
        button.setAttribute("class","btn-std-2");
        button.innerText=btnLabels[w];
        button.setAttribute("id",btnIds2[w]);

        bottomContainer.appendChild(button);

        button.addEventListener('click',(e)=>{

            const idName = e.target.id;

            if(idName=="btn-back-dashboard"){
                displayDashboard();
            }else{
                main(idName.slice(4));
            }

        })
    }

        const btnApprove = document.getElementById("btn-add-contract-person");


        const gadjBox = document.getElementById("extr-vi-gadget").children[0];
        const vehiBox = document.getElementById("extr-vi-vehicle").children[0];
        //const epfNom = document.getElementById("sub-epfNomSubmitted").children[0];
        //const passport = document.getElementById("sub-passportSubmitted").children[0];
        //const aadharCard = document.getElementById("sub-aadharCardSubmitted").children[0];
    

        //const empCompPack = document.getElementById("sub-empCompPackSubmitted").children[0];
        //const esiEpfUnd = document.getElementById("sub-esiEpfUndSubmitted").children[0];


        //empCompPack.disabled = true;
        //esiEpfUnd.disabled=true;

        const boxNames = [gadjBox,vehiBox];

        for(q=0;q<boxNames.length;q++){

            boxNames[q].addEventListener('change',(e)=>{

                const elem = e.target;
                const idName = e.target.parentElement.id;

                const classType = idName.split(/\-/)[0]+"-"+idName.split(/\-/)[1];
                let dbKeys=[];
                
                    if(idName=="extr-vi-gadget"){

                        dbKeys = ["gadgetType","gadgetDesc","gadgetSlNo"];
                    }else if(idName=="extr-vi-vehicle"){

                        dbKeys = ["vehicleType","vehicleName","vehicleRegNo"];
                    }

                            dbKeys.forEach((dbKey)=>{
                                document.getElementById("input-vi-"+dbKey).parentElement.style.display=(elem.checked)?"grid":"none";
                            })


            })


        };


		//Camera Interface

		const container = document.createElement("div");
		container.setAttribute("class","camera-cont c-flex-col");
		container.style.gridColumn="4/5";
		container.style.gridRow = "1/12";

		bodyContainer.appendChild(container);


		const labelsA = ["","","","Capture"];
		const elements = ["canvas","video","img","div"];
		const photoIds = ["canvas","video","input-vi-photo","btn-capture"];
		const classes = ["canvas-add","img-area","img-area","btn-std-2"];
		const displays = ["none","block","none","flex"];


		for(x=0;x<labelsA.length;x++){

			const child = document.createElement(elements[x]);
			child.setAttribute("class",classes[x]);
			child.setAttribute("id",photoIds[x]);
			child.innerText=(x==3 || x==5)?labelsA[x]:"";
			child.style.display=displays[x];

			if(elements[x]=="canvas" || elements[x]=="video"){
				child.width=(elements[x]=="canvas")?195:600;
				child.height=(elements[x]=="canvas")?250:768;
			}else if(elements[x]=="input"){
				child.setAttribute("type","file");
			} 

			container.appendChild(child);
		}

//@113
		
		let width=320;
		let height=0;

		let streaming=false;

		const video= document.getElementById("video");
		const canvas = document.getElementById("canvas");
		const photo = document.getElementById(classType+"-photo");
		//const btnCamRestart = document.getElementById("btn-restart")
		const btnCapture = document.getElementById("btn-capture");
		const btnCaptureReset = document.getElementById("btn-capture-reset");
		//const btnUpload = document.getElementById("btn-upload");
		const btnAdd = document.getElementById("btn-add");
		let imgInput = document.getElementById("img-input");

		video.style.display="none";
		photo.style.display="block";
		photo.src = mMap["photo"];
		appDataMap["photo"] = mMap["photo"];

		btnCaptureReset.style.display = "none";  //hiding the capture reset button





		//Connecting the Camera
		navigator.mediaDevices.getUserMedia({video:{"width":400,"height":512},audio:false})
		.then(function(stream){

			video.srcObject = stream;
			video.play();

			appDataMap["camStream"]=stream.getTracks()[0];

		}).catch((error)=>{
			//showNotification("Error",error.message);
			console.log("Error = " + error.message);

		});

//Setting the height of the Canvas ast Start of Video Play, this function runs only at start

		video.addEventListener('canplay',function(e){
			if(!streaming){
				height=video.videoHeight/ (video.videoWidth/width);
				streaming=true;
			}
		},false);

		btnCapture.innerText = "CAPTURE IMAGE";


		btnCapture.addEventListener('click',function(ev){

					video.style.display="block";
					photo.style.display="none";
					photo.src=dummyImgPath;   //Resetting the image area src

					//takePicture();
					ev.preventDefault();
				//	btnCapture.innerText = "CAPTURE IMAGE";

						// btnCapture.addEventListener('click',function(ev){
						// 	takePicture();
						
						// 	ev.preventDefault();
						// },false);
						takePicture();

						checkMandatoryInputs();

		},false);


		
			btnCaptureReset.addEventListener('click',function(ev){

				video.style.display="block";
				photo.style.display="none";
				photo.src=dummyImgPath;

			

				//takePicture();
				ev.preventDefault();


				checkMandatoryInputs();
			},false);




	function takePicture(){

		var context = canvas.getContext('2d');

		if(width && height){
			canvas.width=width;
			canvas.height=height;
			context.drawImage(video,0,0,width,height);

			
		var data = canvas.toDataURL('image/jpeg');
		photo.setAttribute('src',data);
		appDataMap["photo"] = data;

		video.style.display="none";
		photo.style.display="block";

			checkMandatoryInputs();

		}else{
			clearPhoto();
		}
	}

	imgInput.addEventListener('change',(ev)=>{
		console.log(URL.createObjectURL(ev.target.files[0]));

		console.log(ev.target);

		const imgUploaded = document.createElement('img');
		imgUploaded.src=URL.createObjectURL(ev.target.files[0]);
		//photo.src=URL.createObjectURL(ev.target.files[0]);


		imgUploaded.addEventListener('load',e=>{

		var context = canvas.getContext('2d');

		console.log(photo.style.height);
		console.log(photo.style.width);

		context.drawImage(imgUploaded,0,0,canvas.width,canvas.height);

		const data = canvas.toDataURL('image/jpeg',1)
		photo.setAttribute('src',data);

		appDataMap["photo"] = data;

		
		btnCapture.style.display = "none";
		btnCaptureReset.style.display = "flex";


			video.style.display="none";
			photo.style.display="block";

			checkMandatoryInputs();

		});


	});




btnApprove.style.display="none";


const mandKeys1 = ["contactNo","visitorName", "companyName", "designation","dateOfBirth","address","gender", "purposeOfVisit","tebmaContactPerson","validUpto","gadgetType","gadgetDesc","gadgetSlNo","vehicleType","vehicleName","vehicleRegNo"];
const mandKeys2 = ["malpeOffice","malpeStore","nbsProdShops","malpeCanteen","malpeHospital","hktYard","bptStores","santhakatte","kalmadySite","vmdSite"];
const mandKeys3=["gadget","vehicle"];

const mandIds = keyToIdArray("input-vi",mandKeys1).concat(keyToIdArray("area-vi",mandKeys2).concat(keyToIdArray("extr-vi",mandKeys3)));

	for(q=0;q<mandIds.length;q++){

		document.getElementById(mandIds[q]).addEventListener('change',(e)=>{

			checkMandatoryInputs();

		})
	};



//@114

	function checkMandatoryInputs(){

		//const mandIds = ["input-cp-personName", "input-cp-personId", "input-cp-contractorName", "input-cp-contractorCode", "input-cp-slNo","input-cp-dateOfBirth","input-cp-localAddress","input-cp-permanentAddress","input-cp-dateOfJoining","input-cp-fathersName", "input-cp-mothersName", "input-cp-bloodGroup","input-cp-gender","input-cp-maritalStatus", "input-cp-identificationMark", "input-cp-contactNo", "input-cp-emgContactNo", "input-cp-wageRate", "input-cp-personType","","input-cp-esiNo","input-cp-insuranceNo","input-cp-uan","input-cp-passportDate","input-cp-aadharNo"];
		//const mandSubms = ["sub-aadharCard","sub-polVer","sub-passport","sub-mediCert","sub-ageProofCert","sub-savBank","sub-gatePass","sub-workmenBio","sub-esiDecl","sub-epfDecl","sub-epfNom","sub-contractIntvw","sub-esiEpfUnd","sub-empCompPack"];

		const mandKeys1 = ["contactNo","visitorName", "companyName", "designation","dateOfBirth","address","gender", "purposeOfVisit","tebmaContactPerson","validUpto"];
		const mandKeys2 = ["malpeOffice","malpeStore","nbsProdShops","malpeCanteen","malpeHospital","hktYard","bptStores","santhakatte","kalmadySite","vmdSite"];



		const mandIds1 = keyToIdArray("input-vi",mandKeys1);
		const mandIds2 = keyToIdArray("area-vi",mandKeys2);


		const gadgetStatus = document.getElementById("extr-vi-gadget").children[0].checked;
		const vehicleStatus = document.getElementById("extr-vi-vehicle").children[0].checked;

		const gadgIds = (gadgetStatus)?["input-vi-gadgetType","input-vi-gadgetDesc","input-vi-gadgetSlNo"]:[];
		const vehiIds = (vehicleStatus)?["input-vi-vehicleType","input-vi-vehicleName","input-vi-vehicleRegNo"]:[];



		const nMap={};

		nMap["type1"]=0;
		nMap["type2"]=0;

		nMap["type3"]=0;
		nMap["type4"]=0;

		nMap["doc"]=0;
		nMap["doc2"]=0;

		nMap["other"]=0;

		let countId = 0;
		let countSubm = 0;

		const arrays = [mandIds1,mandIds2,gadgIds,vehiIds];
		const key = ["type1","type2","type3","type4"];

		for(x=0;x<arrays.length;x++){

			const array = arrays[x];

			console.log(nMap[key[x]]);

			//console.log(array);

			for(y=0;y<array.length;y++){
				
					if(x!=1){//As for x=1, the box is int the children of the id element

						const info = document.getElementById(array[y]);

						if(info.value!=""){
							console.log(key[x]);
						 	nMap[key[x]]=nMap[key[x]]+1;
						 	console.log(nMap[key[x]]);
						}
					}else{
						console.log(x);

						console.log(array[y]);
						const info = document.getElementById(array[y]).children[0];

						console.log(info);


						if(info.checked==true){
						  nMap[key[x]]++;
						}

					}


				}



			}


	let nCount = 0;
	let sCount=0;
	let tCount=0;



		for(x=0;x<arrays.length;x++){

			const array = arrays[x];

				if(array!=mandIds2){

					if(nMap[key[x]]>=array.length){
						nCount++;

						console.log(array.length);
						console.log(x);

					}

				}else{

					if(nMap[key[x]]>=1){
						nCount++;
					}

				}

				


			}


		sCount=(photo.style.display=="none")?0:1;
		tCount=(appDataMap["timeValidityCheck"])?1:0;

			

		key.forEach((key)=>{

			console.log(key+"="+nMap[key]);

		});



		console.log(nCount+sCount+tCount);


		btnApprove.style.display=(nCount+sCount+tCount==arrays.length+2)?"block":"none";

		
	}


	}else if(action=="edit-visitor-pass"){

		console.log(appDataMap["curVisitorPassData"]);

		const mMap={};
		const aMap={};

		let greenSignal = true;

		//const labels = ["Contact No","Visitor ID","Name","Company","Designation","Date of Birth","Address","Blood Group","Gender","Emg Contact No","Photo ID Type","Photo ID No","Purpose of Visit","Person to Visit","Dept of Person","Contact Person Ph No","Validity","Gadget Type","Gadget Description","Gadget Sl No","Vehicle Type","Vehicle Name","Vehicle Reg No"];
		const dbKeys = ["contactNo","visitorId","visitorName","companyName","designation","dateOfBirth","address","bloodGroup","gender","nationality","emgContactNo"];
		const dbKeys1 = ["visitorPassNo","visitorId","visitorName","nationality","passType"];
		const dbKeys2 = ["photoIdType","photoIdNo","purposeOfVisit","tebmaContactPerson","tebmaContactDept","tebmaContactPhoneNo","gadgetType","gadgetDesc","gadgetSlNo","vehicleType","vehicleName","vehicleRegNo","visaType","visaNo","visaValidity"];
		const dbKeys3 = ["validUpto","visitorPassPermittedAreas","gadgetApplicability","vehicleApplicability","visaApplicability","passStatus"];


		const inputs = bodyContainer.getElementsByClassName("input-vi");
		const checkboxs = bodyContainer.getElementsByClassName("checkbox-vi");
		const missedInputs = [];

//Input Validation
		for(x=0;x<inputs.length;x++){

			const input = inputs[x];	
				const key = input.id.split(/\-/)[2];
				mMap[key] = input.value;
		};

		mMap["visitorPassPermittedAreas"]=[];

		for(x=0;x<checkboxs.length;x++){
			const checkbox = checkboxs[x];	
				//const key = (checkbox.id=="att-hseTraining")?checkbox.id.split(/\-/)[1]+"Attended":checkbox.id.split(/\-/)[1]+"Submitted";
				const key = checkbox.id.split(/\-/)[2];
				const classType = checkbox.id.split(/\-/)[0]+"-"+checkbox.id.split(/\-/)[1];

				mMap[key] = (checkbox.children[0].checked)?"Yes":"No";

				if(classType=="area-vi" && checkbox.children[0].checked){
					mMap["visitorPassPermittedAreas"].push(checkbox.children[1].innerText);
				}

				console.log(key+"-"+mMap[key]);
		};


		mMap["gadgetApplicability"]=(document.getElementById("extr-vi-gadget").children[0].checked)?"Yes":"No";
		mMap["vehicleApplicability"] = (document.getElementById("extr-vi-vehicle").children[0].checked)?"Yes":"No";
		mMap["visaApplicability"] = (mMap["nationality"]=="Indian")?"No":"Yes";

//]]

		const visaKeys = ["visaType","visaNo","visaValidity"]

			if(mMap["nationality"]=="Indian"){

					mMap["visaType"]="";
					mMap["visaNo"]="";
					mMap["visaValidity"]=null;
				
			}


//]]


		valDays = (mMap["validUpto"]>7)?7:(mMap["validUpto"]==0)?1:mMap["validUpto"];
		mMap["validUpto"] = getFormattedDate(getfutureDate(valDays-1));
		mMap["visitorPassIssuedAt"] = "Malpe"
		mMap["photo"] = appDataMap["photo"];
		mMap["passType"]=appDataMap["curVisitorPassData"]["passType"]
		mMap["status"] = 'Active';



		if(greenSignal){


			con.connect((err)=>{

					con.on('error',(err)=>{
						console.log("Error ="+err.message);
						handleError();
					});

const visDbKeys = ["contactNo","visitorId","visitorName","companyName","designation","email","nationality","dateOfBirth","address","bloodGroup","gender","emgContactNo","photo","status"];

				//const query= `INSERT INTO contractor_data (contractorName,contractorId,department,dateOfIncorporation,dateOfRegistry,registeredAddress,contractorContactNo,contractorEmail,localAddress,localRepName,localRepContactNo,bankAccountNo) VALUES('${mMap["contractorName"]}','${mMap["contractorId"]}','${mMap["department"]}','${mMap["dateOfIncorporation"]}','${mMap["dateOfRegistry"]}','${mMap["registeredAddress"]}','${mMap["contractorContactNo"]}','${mMap["contractorEmail"]}','${mMap["localAddress"]}','${mMap["localRepName"]}','${mMap["localRepContactNo"]}','${mMap["bankAccountNo"]}')`;
				//const query= `INSERT INTO contractor_person_data (${dbKeys},${adlDbKeys},creationDate) 

const query1= `INSERT INTO visitor_data (${visDbKeys}) 
				VALUES('${mMap["contactNo"]}',
				'${mMap["visitorId"]}',
				'${mMap["visitorName"]}',
				'${mMap["companyName"]}',
				'${mMap["designation"]}',
				'${mMap["email"]}',
				'${mMap["nationality"]}',
				'${mMap["dateOfBirth"]}',
				'${mMap["address"]}',
				'${mMap["bloodGroup"]}',
				'${mMap["gender"]}',
				'${mMap["emgContactNo"]}',
				'${mMap["photo"]}',
				'${mMap["status"]}')
				ON DUPLICATE KEY UPDATE
				visitorName = '${mMap["visitorName"]}',
				companyName ='${mMap["companyName"]}',
				designation ='${mMap["designation"]}',
				email ='${mMap["email"]}',
				nationality ='${mMap["nationality"]}',
				dateOfBirth ='${mMap["dateOfBirth"]}',
				address ='${mMap["address"]}',
				bloodGroup ='${mMap["bloodGroup"]}',
				gender ='${mMap["gender"]}',
				emgContactNo ='${mMap["emgContactNo"]}',
				photo ='${mMap["photo"]}'`;


const query= `UPDATE visitor_pass_data 
			  SET
				visitorId = '${mMap["visitorId"]}',
				visitorName = '${mMap["visitorName"]}',
				companyName = '${mMap["companyName"]}',
				designation = '${mMap["designation"]}',
				nationality = '${mMap["nationality"]}',
				photoIdType = '${mMap["photoIdType"]}',
				photoIdNo = '${mMap["photoIdNo"]}',
				purposeOfVisit = '${mMap["purposeOfVisit"]}',
				tebmaContactPerson = '${mMap["tebmaContactPerson"]}',
				tebmaContactDept = '${mMap["tebmaContactDept"]}',
				tebmaContactPhoneNo = '${mMap["tebmaContactPhoneNo"]}',
				gadgetType = '${mMap["gadgetType"]}',
				gadgetDesc = '${mMap["gadgetDesc"]}',
				gadgetSlNo = '${mMap["gadgetSlNo"]}',
				vehicleType = '${mMap["vehicleType"]}',
				vehicleName = '${mMap["vehicleName"]}',
				vehicleRegNo = '${mMap["vehicleRegNo"]}',
				visaType = '${mMap["visaType"]}',
				visaNo = '${mMap["visaNo"]}',
				visaValidity = ${formatData(mMap["visaValidity"])},
				validUpto = '${mMap["validUpto"]}',
				visitorPassPermittedAreas = '${mMap["visitorPassPermittedAreas"]}',
				gadgetApplicability = '${mMap["gadgetApplicability"]}',
				vehicleApplicability = '${mMap["vehicleApplicability"]}',
				visaApplicability = '${mMap["visaApplicability"]}',
				passType = '${mMap["passType"]}',					
				passStatus = '${mMap["passStatus"]}'
				WHERE visitorPassNo = '${mMap["visitorPassNo"]}' `;
				//const query= `INSERT INTO contractor_data (contractorName,contractorId,bankAccountNo) VALUES('${mMap["contractorName"]}','${mMap["contractorId"]}','${mMap["bankAccountNo"]}')`;



/*
				'${mMap["companyName"]}',
				'${mMap["designation"]}',
				'${mMap["dateOfBirth"]}',
				'${mMap["address"]}',
				'${mMap["bloodGroup"]}',
				'${mMap["gender"]}',
				'${mMap["emgContactNo"]}',

*/






				con.query(query1,(err,result)=>{

						con.on('error',(err)=>{
							console.log(query);
							console.log("Error ="+err.message);
							handleError();
						});

						console.log(query1);
						console.log(result);

						//showResult(result,err,"edit");

				})


				con.query(query,(err,result)=>{

						con.on('error',(err)=>{
							console.log(query);
							console.log("Error ="+err.message);
							handleError();
						});

						console.log(query);

						console.log(result);

						showResult(result,err,"edit");

				})




			})





		}

	}else if(action=="exit-visitor-pass"){






		con.connect((err)=>{


			const query = `UPDATE visitor_pass_data SET passStatus='Exit', outTime='${getFormattedDateTime(new Date())}' WHERE visitorPassNo='${appDataMap["visitorPassNo"]}';`

			con.query(query,(err,result)=>{

				console.log(query);


                const changeEvent = new Event('change');
				document.querySelector('.select-filter-sub').dispatchEvent(changeEvent);
                                                 


			})

		});


	}else if(action=="print-visitor-pass"){


		con.connect((err)=>{


			const query = `SELECT * FROM visitor_pass_data INNER JOIN visitor_data ON visitor_pass_data.visitorId=visitor_data.visitorId WHERE visitor_pass_data.visitorPassNo='${appDataMap["visitorPassNo"]}';`;

			con.query(query,(err,result)=>{

				console.log(query);

				const mMap = result[0];

				const mArray = [];
				mArray.push(mMap);


				ipcRenderer.send('open-window',{name:"card",
				data:{datas:mArray,type:"visitor"}});



			})

		});


	}else if(action=="download-excel"){

		//const workbook = new excel.Workbook();
		const workbook = new Workbook();

		const sheet = workbook.addWorksheet('Sample');

		sheet.columns = [{header:"ID",key:"id",width:10},{header:"Name",key:"name",width:50},{header:"DOB",key:"dob",width:20}];

		sheet.addRow({id:"1",name:"Nishanth D Salian",dob:"18-08-1989"});

		//row.values=[1,"Nishanth Salian","18-08-1989"];

		workbook.xlsx.writeFile('./reports/sample.xlsx').then((res)=>{
			console.log(res);
		}).catch((error)=>{
			console.log(error.message);
		});

/*
		saveFile();


		async function saveFile(){

			await workbook.xlsx.writeFile('sample');

		}

*/		



	}else if(action=="generate-report"){



		bodyContainer.innerHTML="";

		const cat = type;

		const mMap = {};

		mMap["filterDates"]=[];

		title.innerText = "Generate Contractor Reports";

		bottomContainer.innerHTML="";

        			const btnGenerate = document.createElement("button");
					btnGenerate.setAttribute("class","btn-std-2");
					btnGenerate.innerText="Generate";
					btnGenerate.style.display="none";

					bottomContainer.appendChild(btnGenerate);

					const btnBack = document.createElement("button");
					btnBack.setAttribute("class","btn-std-2");
					btnBack.setAttribute("onclick","displayDashboard()");
					btnBack.innerText="Back";

					bottomContainer.appendChild(btnBack);


		bodyContainer.setAttribute("class","select-cont");

                const colors = [prColor1,prColor3,prColor4];

        		const filterContainer = document.createElement("div");
        		filterContainer.setAttribute("class","filter-cont-b c-block c-flex");

        				const labels = ["CATEGORY", "SCOPE"];

		        		const optionsA = (type=="Contractor")?["Contract Personnel","Contractor"]:["Visitor","Visitor Pass"];
		        		const subOptions1 = (type=="Contractor")? ["All","Contractor Name","Card Expiry","Trade Name","Hold"]:["All","Company Name","Date Range","Hold"];//Options for first value of filter, in this case Contract Person
		        		const subOptions2 = (type=="Contractor")?["All","Department","Date Range","Hold"]:["All","Company Name","Date Range","Issued","Exit"]; //Options for second value of filter, in this case Contractor for 

		        		const tables = (type=="Contractor")? ["contractor_person_data","contractor_data"]:["visitor_data","visitor_pass_data"];
        				const dbKeys1 = (type=="Contractor")? ["*","contractorName","date","tradeName"]:["*","companyName","date"];
        				const dbKeys2 = (type=="Contractor")? ["*","department","date"]:["*","companyName","date","status"];
        				const holdStatus = (type=="Contractor")?"No":"Active"; //holdStatus are given values which mean their Active
        				const statusName1 = (type=="Contractor")?"isHeld":"status"; //For Contract Personnel and Visitor
        				const statusName2 = (type=="Contractor")?"status":"passStatus"; //For Contractor and Visitor Pass
        				//const dateName1 = (type=="Contractor")?"dateOfJoining":"creationDate";
        				const dateName1 = (type=="Contractor")?"dateOfCardExpiry":"creationDate";
        				const dateName2 = (type=="Contractor")?"dateOfRegistry":"inTime";

	        	for(w=0;w<2;w++){

		        		const subCont = document.createElement("div");
		        		subCont.setAttribute("class","grid-tile-2c");
		        		//subCont.setAttribute("id",(w==1)?"");



		        		for(x=0;x<2;x++){

		        			const child = document.createElement((x==0)?"div":"select");
		        			child.setAttribute("class",(x==0)?"c-flex filter-tile filter-label":"");
		                    child.style.backgroundColor = colors[x];
		        			//child.setAttribute("id",(x!=0)?)
		        			child.innerText=(x==0)?labels[w]:"";

		        			if(x==1){

		        				child.setAttribute("class",(w==0)?"select-filter filter-tile":"select-filter-sub filter-tile");
		        				child.setAttribute("data-filter_type","main");

		        				const options = (w==0)?optionsA:subOptions1;

		        				for(y=0;y<options.length;y++){
		        					const subChild = document.createElement("option");
		        					subChild.setAttribute("value",options[y]);
		        					subChild.innerText = options[y]; 

		        					child.appendChild(subChild);
		        				}
		        			}


		        			subCont.append(child);

		        		}
		        		    filterContainer.appendChild(subCont);

	        		 }

	        		const btnGo = document.createElement("button");
		        	btnGo.setAttribute("class","btn-std-2");
		        	btnGo.innerText="Go";

		        	filterContainer.appendChild(btnGo);


        		bodyContainer.appendChild(filterContainer);

        		const rangeContainer = document.createElement("div");
        		rangeContainer.setAttribute("class","c-flex-col range-cont");
        		rangeContainer.style.height="100%";

        		bodyContainer.appendChild(rangeContainer);


        		document.querySelector('.select-filter').addEventListener("change",(e)=>{

        			console.log("changed");

        			btnGo.style.backgroundColor = "";
        			btnGo.disabled = false;
        			btnGenerate.style.display="none";
        			rangeContainer.innerHTML="";

        			const elem = e.target;
        			const value = elem.value;

        			const ind = optionsA.indexOf(value);//d //Index of selection of first filter

        			const options=(ind==0)?subOptions1:subOptions2;

        			const child = document.querySelector('.select-filter-sub');

        			child.innerHTML="";

        			for(y=0;y<options.length;y++){
		        		const subChild = document.createElement("option");
		        		subChild.setAttribute("value",options[y]);
		        		subChild.innerText = options[y]; 

		        		child.appendChild(subChild);
		        	}



        		});

        		const changeEvent = new Event("change");

        		document.querySelector('.select-filter').dispatchEvent(changeEvent);


        			document.querySelector('.select-filter-sub').addEventListener("change",(e)=>{
        			btnGo.style.backgroundColor = "";
        			btnGo.disabled = false;
        			btnGenerate.style.display="none";
        			rangeContainer.innerHTML="";

        			});


        		btnGo.addEventListener("click",(e)=>{

        			btnGo.style.backgroundColor = "grey";
        			btnGo.disabled = true;
        			btnGenerate.style.display="block";

        			function hi(){
        				return false;
        			}

        			console.log("changed");

        			const elem = e.target;
        			const mainValue = document.querySelector(".select-filter").value;
        			const subValue = document.querySelector(".select-filter-sub").value;

        			console.log(mainValue+subValue);

        			const ind = optionsA.indexOf(mainValue);//d
        			const options=(ind==0)?subOptions1:subOptions2;
        			const dbKeys=(ind==0)?dbKeys1:dbKeys2;
        			const statusName = (ind==0)?statusName1:statusName2;
        			const dateName = (ind==0)?dateName1:dateName2;


/*
        			const mainLabels = ["Contract Personnel","Contractor"];
        			const subLabels = ["All","Department","Date Range","Contractor Name","Trade Name"];
*/
        			//const tables = ["contractor_person_data","contractor_data"];
        			//const dbKeys = ["*","department","date","contractorName","tradeName"];

        			const mainIndex = optionsA.indexOf(mainValue);
        			const subIndex = options.indexOf(subValue);

        			console.log(mainValue+subValue);
        			console.log(mainIndex+subIndex);

        			rangeContainer.innerHTML="";




        				rangeContainer.innerText = (subValue=="All" || subValue=="Hold")?"GENERATE REPORT":"SELECT "+subValue.toUpperCase();

        				if(subValue=="All" || subValue=="Hold"){

        				btnGenerate.setAttribute("data-final_value",subValue);
        				btnGenerate.setAttribute("data-main_value",mainValue);
        				btnGenerate.setAttribute("data-sub_value",subValue);
				    	btnGenerate.style.display="block";


        				}else if(subValue=="Date Range"){

        					btnGenerate.style.display="none";

        					const subCont = document.createElement("div");
        					subCont.setAttribute("class","c-flex");

        					for(x=0;x<2;x++){
        						const child = document.createElement("input");
        						child.setAttribute("class","select-date");
        						child.setAttribute("data-serial","date"+(x+1));	
        						child.setAttribute("type","date");
        						//child.value=(x==1)?getFormattedDate(new Date()):"";

        						subCont.appendChild(child);
        					}


        					rangeContainer.appendChild(subCont);

        					document.querySelectorAll(".select-date").forEach((elem)=>{

						        		elem.addEventListener("change",(e)=>{
						        			console.log("changed 3")

						        			const finalValue = e.target.value;
						        			const serial = e.target.dataset.serial;
						        			const date2Box = e.target.parentElement.children[1];

						        			if(serial=="date1"){
							        			mMap["filterDates"]=[];
							        			date2Box.value = "";

							        			mMap["filterDates"].push(finalValue);

							        			btnGenerate.style.display="none";
						        			}else if(serial=="date2"){
						   						if(finalValue>mMap["filterDates"][0]){
							        				mMap["filterDates"][1]=finalValue;
								        			btnGenerate.setAttribute("data-final_value",mMap["filterDates"]);
								        			btnGenerate.setAttribute("data-main_value",mainValue);
		        									btnGenerate.setAttribute("data-sub_value",subValue);
								        			btnGenerate.style.display="block";

							        			}else{
							        				btnGenerate.style.display="none";
							        			}
						        			}


						        		})

				        	})




        				}else if(subValue=="Card Expiry"){

        					btnGenerate.style.display="none";

        					const subCont = document.createElement("div");
        					subCont.setAttribute("class","c-flex");

        					for(x=0;x<2;x++){
        						const child = document.createElement("input");
        						child.setAttribute("class","select-date");
        						child.setAttribute("data-serial","date"+(x+1));	
        						child.setAttribute("type","date");
        						//child.value=(x==1)?getFormattedDate(new Date()):"";

        						subCont.appendChild(child);
        					}


        					rangeContainer.appendChild(subCont);

        					document.querySelectorAll(".select-date").forEach((elem)=>{

						        		elem.addEventListener("change",(e)=>{
						        			console.log("changed 3")

						        			const finalValue = e.target.value;
						        			const serial = e.target.dataset.serial;
						        			const date2Box = e.target.parentElement.children[1];

						        			if(serial=="date1"){
							        			mMap["filterDates"]=[];
							        			date2Box.value = "";

							        			mMap["filterDates"].push(finalValue);

							        			btnGenerate.style.display="none";
						        			}else if(serial=="date2"){
						   						if(finalValue>mMap["filterDates"][0]){
							        				mMap["filterDates"][1]=finalValue;
								        			btnGenerate.setAttribute("data-final_value",mMap["filterDates"]);
								        			btnGenerate.setAttribute("data-main_value",mainValue);
		        									btnGenerate.setAttribute("data-sub_value",subValue);
								        			btnGenerate.style.display="block";

							        			}else{
							        				btnGenerate.style.display="none";
							        			}
						        			}

				

						        		})

				        	})




        				}else{

				        		con.connect((err)=>{
				        			const query = `SELECT ${dbKeys[subIndex]} FROM ${tables[mainIndex]}`;

				        			con.query(query,(err,result)=>{

				        				console.log(query);

				        				console.log(result);
				        				const options = toUniqueArray(sqlToSimpleArray(result,dbKeys[subIndex]));

				        				console.log(options);

					        			const child = document.createElement("select");
					        			child.setAttribute("class","c-flex select-filter-final");
					                   // child.style.backgroundColor = colors[x];
					        			//child.setAttribute("id","");
				        				child.setAttribute("data-filter_type","final");

				        				for(y=0;y<options.length;y++){
				        					const subChild = document.createElement("option");
				        					subChild.setAttribute("value",options[y]);
				        					subChild.innerText = options[y]; 

				        					child.appendChild(subChild);
				        				}

				        				rangeContainer.appendChild(child);


									document.querySelectorAll(".select-filter-final").forEach((elem)=>{

						        		elem.addEventListener("change",(e)=>{
						        			console.log("changed 2")

						        			const finalValue = e.target.value;

						        			btnGenerate.setAttribute("data-final_value",finalValue);
						        			btnGenerate.setAttribute("data-main_value",mainValue);
        									btnGenerate.setAttribute("data-sub_value",subValue);
						        			btnGenerate.style.display="block";

						        		})

				        			})

				        			const changeEvent = new Event("change");

        							document.querySelector('.select-filter-final').dispatchEvent(changeEvent);

				        		});

				        		    

				        		});

				        	};//end of if else


					

					btnGenerate.addEventListener('click',(e)=>{

						const finalValue = e.target.dataset.final_value;
						const mainValue = e.target.dataset.main_value;
						const subValue = e.target.dataset.sub_value;

				        con.connect((err)=>{

				        	let query="";

				        	if(subValue=="Date Range"){

				        		let dateArray = finalValue.split(",");

				        		query = `SELECT * FROM ${tables[mainIndex]} WHERE ${dateName}>='${dateArray[0]}' AND  ${dateName}<='${dateArray[1]}' AND ${statusName}='${holdStatus}'`;

				        	}else if(subValue=="Card Expiry"){
										let dateArray = finalValue.split(",");
				        		query = `SELECT * FROM ${tables[mainIndex]} WHERE ${dateName}>='${dateArray[0]}' AND  ${dateName}<='${dateArray[1]}' AND ${statusName}='${holdStatus}'`;

				        	}else if(subValue=="Hold"){
				        		query =`SELECT * FROM ${tables[mainIndex]} WHERE ${statusName}='Yes'`;
				        	}else{
				        		//query =(finalValue!="All")?`SELECT * FROM ${tables[mainIndex]} WHERE ${dbKeys[subIndex]}='${finalValue}' AND ${statusName}='${activeStatus}';`:`SELECT * FROM ${tables[mainIndex]} WHERE ${statusName}='${activeStatus}'`;
				        		query =(finalValue!="All")?`SELECT * FROM ${tables[mainIndex]} WHERE ${dbKeys[subIndex]}='${getEscapedString(finalValue)}';`:`SELECT * FROM ${tables[mainIndex]}`;
				        	}

				        	

				        	con.query(query,(err,result)=>{
								console.log(query)
				        		console.log(result)

				        		generateXlsxFromResult(result,mainValue,subValue);
				        	})
				        })



					});


				 });
/*

				const changeEvent2 = new Event("change");

        		document.querySelector('.select-filter-sub').dispatchEvent(changeEvent2);
*/
/*
		const btnLabels = ["Back"];
		const btnIds2 = ["btn-back-dashboard"];


		for(w=0;w<btnLabels.length;w++){

			const button = document.createElement("button");
			button.setAttribute("class","btn-std-2");
			button.innerText=btnLabels[w];
			button.setAttribute("id",btnIds2[w]);

			bottomContainer.insertBefore(button,bottomContainer.children[0]);

			button.addEventListener('click',(e)=>{

				const idName = e.target.id;

				if(idName=="btn-back-dashboard"){
					displayDashboard();
				}else{
					main(idName.slice(4));
				}

			})
		}

*/

/*
		saveFile();


		async function saveFile(){

			await workbook.xlsx.writeFile('sample');

		}

*/		



	}else if(action=="add-attribute"){


		bodyContainer.innerHTML="";
		bodyContainer.setAttribute("class","select-cont");

		title.innerText="Add Attribute";

		const attrTypes = ["Employee","Trade Name","Department Name","Institute Name","Course Name","Class Name",];
		const tableNames = ["employee_data","trade_name_data","department_name_data","attribute_institute_name","attribute_course_name","attribute_class_name"]


		const colors = [prColor1,prColor3,prColor4];

        		const filterContainer = document.createElement("div");
        		filterContainer.setAttribute("class","filter-cont-b c-block c-flex");


		        		const subCont = document.createElement("div");
		        		subCont.setAttribute("class","grid-tile-2c");
		        		//subCont.setAttribute("id",(w==1)?"");

		        		const labels = ["SELECT ATTRIBUTE"];
		        		const optionsA = attrTypes;
		        		//const subOptions1 = ["All","Contractor Name","Date Range","Trade Name"];
		        		//const subOptions2 = ["All","Department","Date Range"];

		        		for(w=0;w<labels.length;w++){

			        		for(x=0;x<2;x++){

			        			const child = document.createElement((x==0)?"div":"select");
			        			child.setAttribute("class",(x==0)?"c-flex filter-tile filter-label":"");
			                    child.style.backgroundColor = colors[x];
			        			//child.setAttribute("id",(x!=0)?)
			        			child.innerText=(x==0)?labels[w]:"";

			        			if(x==1){

			        				child.setAttribute("class",(w==0)?"select-filter filter-tile":"select-filter-sub filter-tile");
			        				child.setAttribute("data-filter_type","main");

			        				const options = (w==0)?optionsA:"";

			        				for(y=0;y<options.length;y++){
			        					const subChild = document.createElement("option");
			        					subChild.setAttribute("value",options[y]);
			        					subChild.innerText = options[y]; 

			        					child.appendChild(subChild);
			        				}
			        			}


			        			subCont.append(child);

			        		}
			        		    filterContainer.appendChild(subCont);
		        	}

        		

        		bodyContainer.appendChild(filterContainer);

        		const rangeContainer = document.createElement("div");
        		rangeContainer.setAttribute("class","c-flex-col range-cont");
        		rangeContainer.style.height="100%";
        		rangeContainer.style.paddingTop="2rem";

        		bodyContainer.appendChild(rangeContainer);


        		document.querySelector('.select-filter').addEventListener("change",(e)=>{

        			rangeContainer.innerHTML="";

        			console.log("changed");

        			const attrType = e.target.value;
        			const refMap = {};



        			const index = attrTypes.indexOf(attrType);

        			attrTypes.forEach((it)=>{

        				refMap[it]={};
        				refMap[it]["options"]={};
        			});




        			refMap["Employee"]["labels"] = ["Employee Id","Name","Department","Contact No"];
        			refMap["Employee"]["dbKeys"] = ["employeeId","employeeName","department","contactNo"];
        			refMap["Employee"]["inputType"] = ["text","text","select","text"];
        			refMap["Employee"]["classType"] = "input-em";
        			refMap["Employee"]["options"]["department"] = sqlToSimpleArray(appDataMap["departmentNameData"],"departmentName");

        			refMap["Trade Name"]["labels"] = ["Trade Name"];
        			refMap["Trade Name"]["dbKeys"] = ["tradeName"];
        			refMap["Trade Name"]["inputType"] = ["text"];
        			refMap["Trade Name"]["classType"] = "input-tr";

        			refMap["Department Name"]["labels"] = ["Department Name"];
        			refMap["Department Name"]["dbKeys"] = ["departmentName"];
        			refMap["Department Name"]["inputType"] = ["text"];
        			refMap["Department Name"]["classType"] = "input-dp";

					refMap["Institute Name"]["labels"] = ["Institute Name"];
        			refMap["Institute Name"]["dbKeys"] = ["instituteName"];
        			refMap["Institute Name"]["inputType"] = ["text"];
        			refMap["Institute Name"]["classType"] = "input-in";

					refMap["Course Name"]["labels"] = ["Course Name"];
        			refMap["Course Name"]["dbKeys"] = ["courseName"];
        			refMap["Course Name"]["inputType"] = ["text"];
        			refMap["Course Name"]["classType"] = "input-cr";

					refMap["Class Name"]["labels"] = ["Class Name"];
        			refMap["Class Name"]["dbKeys"] = ["className"];
        			refMap["Class Name"]["inputType"] = ["text"];
        			refMap["Class Name"]["classType"] = "input-cl";


							const classType = refMap[attrType]["classType"];

							const labels = refMap[attrType]["labels"];
							const dbKeys = refMap[attrType]["dbKeys"];
							const inputType = refMap[attrType]["inputType"];
							//const gridRows=["1/2","2/3","3/4","4/5","5/6"];
							//const gridColumns=["1/2","1/2","1/2","1/2"];
						
							const ids = keyToIdArray(dbKeys,classType);

							const noOfRows = labels.length;

							rangeContainer.setAttribute("class","input-list-cont-1");
							rangeContainer.style.gridTemplateRows=`repeat(${noOfRows},2rem)`;

					//Hiding the tiles which have to be hidden
							for(x=0;x<labels.length;x++){

								const container = document.createElement("div");
								container.setAttribute("class","input-tile "+classType);
								

								//container.style.gridColumn = gridColumns[x];
								//container.style.gridRow = gridRows[x];

								for(y=0;y<2;y++){

									const child = document.createElement((y==0)?"div":(inputType[x]=="select" || inputType[x]=="textarea")?inputType[x]:"input");
									child.setAttribute("class",(y==0)?"input-tile-label c-flex":"input-tile-desc input-cp");
									child.setAttribute("type",(y==1)?inputType[x]:"");
									child.setAttribute("id",(y==1)?classType+"-"+dbKeys[x]:"");
									//child.setAttribute("id",(y==1)?ids[x]:"");
									child.innerText=(y==0)?labels[x]:"";

										if(y==1 && inputType[x]=="select"){

											let options=[];

											options = refMap[attrType]["options"][dbKeys[x]];

													for(t1=0;t1<options.length;t1++){

																	const option = options[t1];

																	const subChild = document.createElement("option");
																	subChild.setAttribute("value",option);
																	subChild.innerText = option;

																	child.appendChild(subChild);

													}
											
									

										
									}//if(select)

										container.appendChild(child);

						
								}

								rangeContainer.appendChild(container);
				        			
							}


					bottomContainer.innerHTML="";


					const btnLabels = ["Add Attribute","Back"];
					const btnIds2 = ["btn-add-attribute","btn-back-dashboard"];


						for(w=0;w<btnLabels.length;w++){

							const button = document.createElement("button");
							button.setAttribute("class","btn-std-2");
							button.setAttribute("data-attribute_type",(w==0)?attrType:"");
							button.innerText=btnLabels[w];
							button.setAttribute("id",btnIds2[w]);

							bottomContainer.appendChild(button);

							button.addEventListener('click',(e)=>{

								const idName = e.target.id;

								if(idName=="btn-back-dashboard"){
									displayDashboard();
								}else if(idName=="btn-add-attribute"){
										const attrType = e.target.dataset.attribute_type;
										const values = [];

										for(a1=0;a1<dbKeys.length;a1++){

											const value = document.getElementById(classType+"-"+dbKeys[a1]).value;
											console.log(value);
									
											values.push(`'${value}'`);
										}

										console.log(values);

								        con.connect((err)=>{


								        		const query = `INSERT into ${tableNames[index]} (${refMap[attrType]["dbKeys"]}) VALUES(${values})`
								        		//query = `SELECT * FROM ${tables[mainIndex]} WHERE dateOfJoining>='${dateArray[0]}' AND  dateOfJoining<='${dateArray[1]}'`;
								        	

								        	con.query(query,(err,result)=>{
												console.log(query)
								        		console.log(result)

												if(err!=null){
													console.log(err.message)
												}else{

												}

								        		showResult(result,err,"add");

								        		//generateXlsxFromResult(result,mainValue,subValue);
								        	})
								        })

								}

							})
						}
        			

        		});

        		const changeEvent = new Event("change");

        		document.querySelector('.select-filter').dispatchEvent(changeEvent);


	}else if(action=="edit-attribute"){



		bodyContainer.innerHTML="";
		bodyContainer.setAttribute("class","select-cont");

		title.innerText="Edit Attribute";

//Initializing and Configuring refMap
		let refMap = {};

		const attrTypes = ["Employee","Trade Name","Department Name","Institute Name","Course Name","Class Name",];
		const tableNames = ["employee_data","trade_name_data","department_name_data","attribute_institute_name","attribute_course_name","attribute_class_name"]


   		attrTypes.forEach((it)=>{

        				refMap[it]={};
        				refMap[it]["options"]={};
        			});



        			refMap["Employee"]["labels"] = ["Employee Id","Name","Department","Contact No"];
        			refMap["Employee"]["dbKeys"] = ["employeeId","employeeName","department","contactNo"];
        			refMap["Employee"]["inputType"] = ["text","text","select","text"];
        			refMap["Employee"]["classType"] = "input-em";
        			refMap["Employee"]["hidDbKeys"] = [];
        			refMap["Employee"]["options"]["department"] = sqlToSimpleArray(appDataMap["departmentNameData"],"departmentName");

        			refMap["Trade Name"]["labels"] = ["TradeName Serial","Trade Name"];
        			refMap["Trade Name"]["dbKeys"] = ["tradeNameSlNo","tradeName"];
        			refMap["Trade Name"]["inputType"] = ["number","text"];
        			refMap["Trade Name"]["hidDbKeys"] = ["tradeNameSlNo"];
        			refMap["Trade Name"]["classType"] = "input-tr";

        			refMap["Department Name"]["labels"] = ["Department Sl No","Department Name"];
        			refMap["Department Name"]["dbKeys"] = ["departmentNameSlNo","departmentName"];
        			refMap["Department Name"]["inputType"] = ["number","text"];
        			refMap["Department Name"]["classType"] = "input-dp";
        			refMap["Department Name"]["hidDbKeys"] = ["departmentNameSlNo"];

					refMap["Institute Name"]["labels"] = ["Institute Sl No","Institute Name"];
        			refMap["Institute Name"]["dbKeys"] = ["instituteNameSlNo","instituteName"];
        			refMap["Institute Name"]["inputType"] = ["number","text"];
        			refMap["Institute Name"]["classType"] = "input-in";
					refMap["Institute Name"]["hidDbKeys"] = ["instituteNameSlNo"];

					refMap["Course Name"]["labels"] = ["Course Sl No","Course Name"];
        			refMap["Course Name"]["dbKeys"] = ["courseNameSlNo","courseName"];
        			refMap["Course Name"]["inputType"] = ["number","text"];
        			refMap["Course Name"]["classType"] = "input-cr";
					refMap["Course Name"]["hidDbKeys"] = ["courseNameSlNo"];

					refMap["Class Name"]["labels"] = ["Class Sl No","Class Name"];
        			refMap["Class Name"]["dbKeys"] = ["classNameSlNo","className"];
        			refMap["Class Name"]["inputType"] = ["number","text"];
        			refMap["Class Name"]["classType"] = "input-cl";
					refMap["Class Name"]["hidDbKeys"] = ["classNameSlNo"];


        	
//]]


		const colors = [prColor1,prColor3,prColor4];

        		const filterContainer = document.createElement("div");
        		filterContainer.setAttribute("class","filter-cont-b c-block c-flex");


		        		const labels = ["SELECT ATTRIBUTE", "SELECT VALUE"];
		        		const optionsA = attrTypes;
		        		//const subOptions1 = ["All","Contractor Name","Date Range","Trade Name"];
		        		//const subOptions2 = ["All","Department","Date Range"];

		        		for(w=0;w<labels.length;w++){

			        		const subCont = document.createElement("div");
			        		subCont.setAttribute("class","grid-tile-2c");
			        		//subCont.setAttribute("id",(w==1)?"");

			        		for(x=0;x<2;x++){

			        			const child = document.createElement((x==0)?"div":"select");
			        			child.setAttribute("class",(x==0)?"c-flex filter-tile filter-label":"");
			                    child.style.backgroundColor = colors[x];
			        			//child.setAttribute("id",(x!=0)?)
			        			child.innerText=(x==0)?labels[w]:"";

			        			if(x==1){

			        				child.setAttribute("class",(w==0)?"select-filter filter-tile":"select-filter-sub filter-tile");
			        				child.setAttribute("data-filter_type","main");

			        				const options = (w==0)?optionsA:"";

			        				for(y=0;y<options.length;y++){
			        					const subChild = document.createElement("option");
			        					subChild.setAttribute("value",options[y]);
			        					subChild.innerText = options[y]; 

			        					child.appendChild(subChild);
			        				}
			        			}


			        			subCont.append(child);

			        		}
			        		    filterContainer.appendChild(subCont);
		        	}

		        	const btnGo = document.createElement("button");
		        	btnGo.setAttribute("class","btn-std-2");
		        	btnGo.innerText="Go";

		        	filterContainer.appendChild(btnGo);

        		

        		bodyContainer.appendChild(filterContainer);

        		const rangeContainer = document.createElement("div");
        		rangeContainer.setAttribute("class","c-flex-col range-cont");
        		rangeContainer.style.height="100%";
        		rangeContainer.style.paddingTop="2rem";

        		bodyContainer.appendChild(rangeContainer);


        		document.querySelector('.select-filter').addEventListener("change",(e)=>{

        			console.log("changed");

        			btnGo.style.backgroundColor="";
        			btnGo.disabled=false;

        			const elem = e.target;
        			const attrType = elem.value;

        			const index = attrTypes.indexOf(attrType);


        			const query =`SELECT ${refMap[attrType]["dbKeys"]} FROM ${tableNames[index]}`;

        			con.connect((err)=>{

        				con.query(query,(err,result)=>{

        					console.log(result);
        					console.log(query);

		        			const options=result;

		        			console.log(options);

		        			const child = document.querySelector('.select-filter-sub');
		        
		        			child.innerHTML="";

		        			for(y=0;y<options.length;y++){
		        				const reqDbKeys = refMap[attrType]["dbKeys"];
		        			

				        		const subChild = document.createElement("option");
				        		subChild.setAttribute("value",options[y][reqDbKeys[0]]);
				        		subChild.innerText = options[y][reqDbKeys[0]]+" - "+options[y][reqDbKeys[1]]; 

				        		child.appendChild(subChild);
				        	}



        				});
        			});

        		});//end of select-filter addEvent

        		const changeEvent = new Event("change");

        		document.querySelector('.select-filter').dispatchEvent(changeEvent);

        		document.querySelector('.select-filter-sub').addEventListener('change',(e)=>{

        			btnGo.style.backgroundColor="";
        			btnGo.disabled=false;
        		})


				btnGo.addEventListener("click",(e)=>{

					btnGo.style.backgroundColor="grey";
        			btnGo.disabled=true;

					const attrType = document.querySelector('.select-filter').value;
					const subValue = document.querySelector('.select-filter-sub').value;

					const index = attrTypes.indexOf(attrType);


        			const query = `SELECT * FROM ${tableNames[index]} WHERE ${refMap[attrType]["dbKeys"][0]}='${subValue}';`

        			con.connect((err)=>{

        				con.query(query,(err,result)=>{

        					console.log(result);
        					console.log(query);

        					const classType = refMap[attrType]["classType"];
							const labels = refMap[attrType]["labels"];
							const dbKeys = refMap[attrType]["dbKeys"];
							const hidDbKeys = refMap[attrType]["hidDbKeys"];
							const inputType = refMap[attrType]["inputType"];
							//const gridRows=["1/2","2/3","3/4","4/5","5/6"];
							//const gridColumns=["1/2","1/2","1/2","1/2"];
						
							const ids = keyToIdArray(dbKeys,classType);

							const noOfRows = labels.length;

							rangeContainer.innerHTML="";

							rangeContainer.setAttribute("class","input-list-cont-1");
							rangeContainer.style.gridTemplateRows=`repeat(${noOfRows},2rem)`;

					//Hiding the tiles which have to be hidden
							for(x=0;x<labels.length;x++){

							
								const container = document.createElement("div");
								container.setAttribute("class","input-tile "+classType);
								container.style.display=(hidDbKeys.includes(dbKeys[x]))?"none":"";

								//container.style.gridColumn = gridColumns[x];
								//container.style.gridRow = gridRows[x];

								for(y=0;y<2;y++){

									const child = document.createElement((y==0)?"div":(inputType[x]=="select" || inputType[x]=="textarea")?inputType[x]:"input");
									child.setAttribute("class",(y==0)?"input-tile-label c-flex":"input-tile-desc "+classType);
									child.setAttribute("type",(y==1)?inputType[x]:"");
									child.setAttribute("id",(y==1)?classType+"-"+dbKeys[x]:"");
									child.setAttribute("value",(y==1)?result[0][dbKeys[x]]:"");
									child.disabled=(y==1)?true:false;
									//child.setAttribute("id",(y==1)?ids[x]:"");
									child.innerText=(y==0)?labels[x]:(inputType[x]=="select")?result[0][dbKeys[x]]:"";

										if(y==1 && inputType[x]=="select"){

											let options=[];

											options = refMap[attrType]["options"][dbKeys[x]];

													for(t1=0;t1<options.length;t1++){

																	const option = options[t1];

																	const subChild = document.createElement("option");
																	subChild.setAttribute("value",option);
																	subChild.innerText = option;

																	child.appendChild(subChild);

													}
											
									
										child.value=result[0][dbKeys[x]];
										
									}//if(select)

									
										container.appendChild(child);
									

						
								}

								rangeContainer.appendChild(container);

							
				        			
							}//for(labels)

							bottomContainer.innerHTML="";


							const btnLabels = ["Edit Attribute","Delete Attribute","Back"];
							const btnIds2 = ["btn-edit-attribute","btn-delete-attribute","btn-back-dashboard"];


						for(w=0;w<btnLabels.length;w++){

							const button = document.createElement("button");
							button.setAttribute("class","btn-std-2");
							button.setAttribute("data-attribute_type",(w==0)?attrType:"");
							button.innerText=btnLabels[w];
							button.setAttribute("id",btnIds2[w]);

							bottomContainer.appendChild(button);


							button.addEventListener('click',(e)=>{

								const idName = e.target.id;

								if(idName=="btn-back-dashboard"){
									main("edit-attribute");
								}else if(idName=="btn-edit-attribute"){

									console.log("Edit entered")

									const attrType = e.target.dataset.attribute_type;
									const values = [];

									console.log(classType);
									document.querySelectorAll(`.${classType}`).forEach((item)=>{
										console.log(item);

										item.disabled=false;

									});

								bottomContainer.innerHTML="";

								const btnSave = document.createElement("button");
								btnSave.setAttribute("class","btn-std-2");
								btnSave.setAttribute("data-attribute_type",attrType);
								btnSave.innerText="Save";

								bottomContainer.appendChild(btnSave);

								const btnBack = document.createElement("button");
								btnBack.setAttribute("class","btn-std-2");
								btnBack.setAttribute("onclick",`main("edit-attribute")`)
								btnBack.innerText="Back";

								bottomContainer.appendChild(btnBack);



									btnSave.addEventListener('click',(e)=>{

										const index = attrTypes.indexOf(attrType);

										const inputMap = {};

										document.querySelectorAll(`.${classType}`).forEach((it,i)=>{

											const dbKey = it.id.split("-")[2];

											inputMap[dbKey] = it.value;

										});

										const tArray=[];

										const length = Object.keys(inputMap).length;

										for(z=0;z<dbKeys.length;z++){

											const key = dbKeys[z];

											if(z!=0){
												tArray.push(`${key}='${inputMap[key]}'`)
											}
										};


										console.log(tArray);

										const query2 = `UPDATE ${tableNames[index]} 
										SET ${tArray} 
										WHERE ${dbKeys[0]}='${inputMap[dbKeys[0]]}';`

											con.connect((err)=>{

													con.query(query2,(err,result)=>{

														console.log(query2);
														console.log(result);

														showResult(result,err,"edit");
													})

												})


										})//btnSave.addEvent

									}else if(idName=="btn-delete-attribute"){

										const inputMap = {};

										document.querySelectorAll(`.${classType}`).forEach((it,i)=>{

											const dbKey = it.id.split("-")[2];

											inputMap[dbKey] = it.value;

										});

										
												showNotification("Warning","This will delete all the records pertaining to this contractor, do you want to proceed?");

												notifBtn.addEventListener("click",deleteData);

												

													function deleteData(e){

													const parent = e.target.parentElement.parentElement.parentElement;
													parent.style.display="none";

													const query = `DELETE FROM ${tableNames[index]} WHERE ${dbKeys[0]}='${inputMap[dbKeys[0]]}'`;

																con.query(query,(err,result)=>{

																	console.log(result);
																	console.log(query);

																showResult(result,err,"delete");

																setTimeout(()=>{

																	displayDashboard();

																},2000);
															});
														 notifBtn.removeEventListener("click",deleteData);
													}


									}//ifelse(idName==)

								});//button.addEvent

							}//for loop (w<button.length)

        				})


				})

			});

				const changeEvent3 = new Event("change");

        		document.querySelector('.select-filter-sub').dispatchEvent(changeEvent3);

        		bottomContainer.innerHTML="";
								const btnBack = document.createElement("button");
								btnBack.setAttribute("class","btn-std-2");
								btnBack.setAttribute("onclick","displayDashboard()")
								btnBack.innerText="Back";

								bottomContainer.appendChild(btnBack);

	
	}//end of if(action=="")


}//end of function



//@-1




function functionClick(elem){

	const functionType = (elem.id=="btn-add-contractor")?"add":"other";

	if(functionType=="add"){

		const functionWindow = new BrowserWindow();

		functionWindow.loadURL(url.format({
			pathname:path.join(__dirname+'/page/','add.html'),
			protocol:'file',
			slashes:true
		}));

		functionWindow.on('closed',()=>{
			functionWindow = null;
		})


	}else{

	}

}




		function keyToIdArray(classType,dbKeyArray){

			const rArray=[];

			for(a1=0;a1<dbKeyArray.length;a1++){

				const key = dbKeyArray[a1];

				rArray.push(classType+"-"+key);

			}

			return rArray;

		}

function idToKeyArray(array){

	const rArray=[];

	for(a1=0;a1<array.length;a1++){

		const unit = array[a1];
		
		const key = unit.split(/\-/)[2];

		rArray.push(key);

	}


	return rArray;



}


function idToKeyArray2(array){

	const rArray=[];

	for(a1=0;a1<array.length;a1++){

		const unit = array[a1];
		
		const key = unit.split(/\-/)[1];

		rArray.push(key);

	}


	return rArray;



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

//Display the Dashboard

function displayDashboard(){


mainContainer.innerHTML="";
mainContainer.style.backgroundColor="";


if(appDataMap["camStream"]!=null){

	appDataMap["camStream"].stop();
}


notifBar.style.display = "none";




headContainer = document.createElement("div");
headContainer.setAttribute("class","head-cont c-flex");


title = document.createElement("div");
title.setAttribute("class","display-title");
title.innerText="Select Function";

headContainer.appendChild(title);

mainContainer.appendChild(headContainer);


bodyContainer = document.createElement("div");
bodyContainer.setAttribute("class","select-cont c-flex");
bodyContainer.style.height="70%";

mainContainer.appendChild(bodyContainer);


bottomContainer = document.createElement("div");
bottomContainer.setAttribute("class","bottom-cont c-flex");
bottomContainer.style.height="20%";

mainContainer.appendChild(bottomContainer);


bodyContainer.setAttribute("class","select-cont c-flex");


title.innerText="Select Function";
/*
const labels=["Add Contract Personnel", "Manage Contract Personnel", "Print Contract ID", "Add Contractor", "Manage Contractor"];
const images = ["logo--add-person", "logo--manage-person","logo--print-id", "logo--add-person", "logo--manage-person" ];
const ids=["add-contract-person-input","manage-contract-person","print-id-input","add-contractor","manage-contractor"];
*/

const all = ["admin","user"];

const access = userMap["userId"].split("_")[0];
const subAccess = userMap["role"].toLowerCase();

const labels=["Add Contract Personnel", "Manage Contract Personnel","Generate Reports (Contractor)", "Print Contract ID", "Add Contractor", "Manage Contractor","Enter Visitor Pass Details","Manage Visitor Pass","Generate Reports (Visitor)","Add Intern", "Manage Intern","Print Intern ID","Add Attributes","Edit Attributes"];
const images = ["logo--add-person","logo--manage-person","logo--reports","logo--print-id", "logo--add-person", "logo--manage-person", "logo--add-person", "logo--manage-person","logo--reports","logo--add-person","logo--manage-person","logo--print-id","logo--add-database","logo--edit-database"];
const fnNames=["add-contract-person-input","manage-contract-person","generate-report","print-contract-person-id-input","add-contractor-input","manage-contractor","add-visitor-pass-input","manage-visitor-pass","generate-report","add-student-person-input","manage-student-person","print-student-id-input","add-attribute","edit-attribute"];
const ids=["sel-1","sel-2","sel-3","sel-4","sel-5","sel-6","sel-7","sel-8","sel-9","sel-10","sel-11","sel-12","sel-13","sel-14"];
const accessIds = [["cc"],["cc"],["cc"],["cc"],["cc"],["cc"],["cc","sc"],["cc","sc"],["cc","sc"],["cc"],["cc"],["cc"],["cc"],["cc"]];
const subAccessIds = [all,["admin"],all,all,all,all,all,all,all,all,all,all,["admin"],["admin"]];
const props=["","","Contractor","","","","","","Visitor","Intern","Intern","Intern","",""];


for(x=0;x<labels.length;x++){

	if(accessIds[x].includes(access) && subAccessIds[x].includes(subAccess)){

			const container = document.createElement("div");
			container.setAttribute("class","selection-unit c-flex-col");
			//container.setAttribute("onclick",)
			container.setAttribute("id",ids[x]);

				for(y=0;y<2;y++){
					const child=document.createElement((y==0)?"img":"div");
					child.setAttribute("class",(y==0)?"sel-img c-block":"t-cent");
					child.src=(y==0)?`../source/${images[x]}.svg`:"";
					child.setAttribute("data-prop",props[x]);
					child.setAttribute("data-function_name",fnNames[x]);

					child.innerText=(y==1)?labels[x]:"";
					container.appendChild(child);
				}

	bodyContainer.appendChild(container);

		document.getElementById(ids[x]).addEventListener('click',(e)=>{

		let fnName = e.target.dataset.function_name;
		const type = e.target.dataset.prop;


		main(fnName,type);

	});


	}

};




//Get contractor Name Details

							con.connect((err)=>{

								con.on('error',(err)=>{
									console.log("Error ="+err.message);
									handleError();
								});

								//Fetching the Contractor Details So that it can be readily accessed
							
							let query= `SELECT contractorName,contractorId,isHeld,contractorStatus FROM contractor_data`;

								con.query(query,(err,res)=>{

										appDataMap["contrIdNameData"] = res;


							});


								query = `SELECT personId,personName FROM contractor_person_data`;

								con.query(query,(err,res)=>{


										appDataMap["contrPersIdNameData"] = res;


							});

						// 	query= `SELECT instituteName,instituteId,isHeld,instituteStatus FROM institute_data`;

						// 	con.query(query,(err,res)=>{

						// 			appDataMap["instituteIdNameData"] = res;

						// });


							query = `SELECT personId,personName FROM student_person_data`;

							con.query(query,(err,res)=>{


									appDataMap["studentIdNameData"] = res;


						});


								query = `SELECT visitorId,visitorName FROM visitor_data`;

								con.query(query,(err,res)=>{


										appDataMap["visitorIdNameData"] = res;


							});

				           query = `SELECT employeeId,employeeName,department,contactNo FROM employee_data`;

								con.query(query,(err,res)=>{

										appDataMap["employeeAppData"] = res;


							});

							query = `SELECT instituteName FROM attribute_institute_name`;

							con.query(query,(err,res)=>{

									appDataMap["instituteNameData"] = res;


						});


							query = `SELECT tradeName FROM trade_name_data`;

								con.query(query,(err,res)=>{

										appDataMap["tradeNameData"] = res;


							});

							query = `SELECT departmentName FROM department_name_data`;

								con.query(query,(err,res)=>{

										appDataMap["departmentNameData"] = res;


							});

							
							query = `SELECT courseName FROM attribute_course_name`;

								con.query(query,(err,res)=>{

										appDataMap["courseNameData"] = res;


							});

							query = `SELECT className FROM attribute_class_name`;

							con.query(query,(err,res)=>{

									appDataMap["classNameData"] = res;


						});

						});





//]]


}







 function to2Digits(number){

if(number<10){
  return "0"+number;
}else if(number>=10 && number <100){
  return number;
}

}

 function to3Digits(number){

if(number<10){
  return "00"+number;
}else if(number>=10 && number <100){
  return "0"+number;
}else{
  return ""+number;
}

}

function to4Digits(number){

	if(number<10){
	  return "000"+number;
	}else if(number>=10 && number <100){
	  return "00"+number;
	}else if(number>=100 && number <1000){
		return "0"+number;
	  }else{
	  return ""+number;
	}
	
	}


//Date Functions, Time Functions

function getDate(){

	const date = new Date();

	return date.getFullYear()+"-"+to2Digits((date.getMonth()+1))+"-"+to2Digits(date.getDate());

}


function getfutureDate(daysAdded){

	return new Date(new Date().getTime()+(daysAdded*24*60*60*1000));

}


function getFutureDateTime(daysAdded,hoursAdded,minutesAdded){

	return new Date(new Date().getTime()+(daysAdded*24*60*60*1000)+(hoursAdded*60*60*1000)+(minutesAdded*60*1000));

}

function getFutureDateTimeString(daysAdded,hoursAdded,minutesAdded){

	const tDate= new Date(new Date().getTime()+(daysAdded*24*60*60*1000)+(hoursAdded*60*60*1000)+(minutesAdded*60*1000));
	return getFormattedDateTime(tDate);

}


function getIndiaDate(date){

	const day = to2Digits(date.getDate());
	const month = to2Digits(date.getMonth()+1);
	const year= date.getFullYear();


	return day+"-"+month+"-"+year;

}


function getFormattedDate(date){

	const day = to2Digits(date.getDate());
	const month = to2Digits(date.getMonth()+1);
	const year= date.getFullYear();



	return year+"-"+month+"-"+day;


}


function getFormattedDateTime(date){

	const tDate = getFormattedDate(date);

	const hours = to2Digits(date.getHours());
	const mins = to2Digits(date.getMinutes());
	const secs = to2Digits(date.getSeconds());

	return tDate+" "+hours+":"+mins+":"+secs;

}

function getIndiaDateTime(date){

	const tDate = getIndiaDate(date);

	const hours = to2Digits(date.getHours());
	const mins = to2Digits(date.getMinutes());
	const secs = to2Digits(date.getSeconds());

	return tDate+" "+hours+":"+mins+":"+secs;

}


function getTime(date){

	return to2Digits(date.getHours())+":"+to2Digits(date.getMinutes());

}


       function getAge(dateOfBirth){

            	const d1= new Date(dateOfBirth);
            	const d2 = new Date();

            	return d2.getFullYear() - d1.getFullYear() -1;


       }

function getDateTimeNo(){

 let tString = getFormattedDateTime(new Date());

 const flags=[" ","-",":"];

 let tArray = tString.split("");


 const tArray2=tArray.filter(it=> !flags.includes(it)
 );


 return tArray2.join("");

 }


function jsonToLocalDate(jsonDateString){

	const offset = new Date().getTimezoneOffset();

	console.log(offset);

	const date = new Date(jsonDateString);

	const actualDateInMilli = date.getTime()-(offset*60*1000);


	return(new Date(actualDateInMilli));


}



//]]



function transmitDbData(event,reqKey){

			const string = event.target.value;
			const idName = event.target.id;
			const classType = idName.split(/\-/)[0]+"-"+idName.split(/\-/)[1];

			let  fetchData = "";

			if(reqKey=="visitorId"){
				fetchData = string;

				getAllDbData(reqKey,fetchData,classType);

			}else if(reqKey=="personSlNo"){

				fetchData = string.split("-")[0].trim();
				findDbData(reqKey,fetchData);
			}else if(reqKey=="tebmaContactDept"){
				//fetchData = string;
				//findDbData(reqKey,fetchData,classType);
			}


			

}



		function transmitSlNoAndStatus(event,idDbKeyName,dbTableName,inputClassInitial){


			const string = event.target.value;
			console.log(string);

			const contractorId = string.split("-")[0].trim();
			const contractorName = string.split("-")[1].trim();

			assignSlNoByAnalyzingDb(contractorId,idDbKeyName,dbTableName,inputClassInitial);
			maintainContractorStatus(contractorId,contractorName);

		}



		const reqDataMap={
				personSlNo:{
					keyName:"contractorId",
					classType:"input-cp",
					tableName:"contractor_person_data"
				},
				visitorId:{
					keyName:"contactNo",
					classType:"input-vi",
					tableName:"visitor_data",
					dbKeys:["contactNo","visitorId","visitorName","companyName","designation","dateOfBirth","address","bloodGroup","gender","emgContactNo","photoIdType","photoIdNo","purposeOfVisit","tebmaContactPerson","tebmaContactDept","tebmaContactPhoneNo","gadgetType","gadgetDesc","gadgetSlNo","vehicleType","vehicleName","vehicleRegNo","photo"]
				}

		}

			function findKeyValueInMap(map,compareKey,compareKeyValue,reqKey){

					console.log(map[compareKey]);
					console.log(compareKeyValue);

					const index = map[compareKey].indexOf(compareKeyValue);

					return map[reqKey][index];


			}


		function findDbData(reqKey,fetchData,classType){

				con.connect((error)=>{

					console.log(reqKey + fetchData + reqDataMap[reqKey]["keyName"])

						const query = `SELECT ${reqKey} FROM ${reqDataMap[reqKey]["tableName"]} WHERE ${reqDataMap[reqKey]["keyName"]}='${fetchData}'`;

							con.query(query,(err,result)=>{

							console.log(query);

							 console.log(result);

							 if(reqKey=="personSlNo"){

									 if(result.length==0){
									 	document.getElementById('input-cp-personSlNo').value = "001";
									 }else{

									 	const fArray = sqlToSimpleArray(result,"personSlNo");


									 	const newSlNo = parseInt(fArray[fArray.length-1])+1

									 	document.getElementById('input-cp-personSlNo').value = to3Digits(newSlNo);


									 }

							 }else if(reqKey=="visitorId"){

							 		if(result.length==0){
							 			document.getElementById("input-vi-"+reqKey).value="";
							 		}else{
							 			const fArray = sqlToSimpleArray(result,"visitorId");
							 			document.getElementById("input-vi-"+reqKey).value=result[0]["visitorId"];		

							 		}



							 }


						});

					})

			}


			function getAllDbData(reqKey,fetchData,classType){

				con.connect((error)=>{

					console.log(reqKey + fetchData + reqDataMap[reqKey]["tableName"]);


						const query = `SELECT * FROM ${reqDataMap[reqKey]["tableName"]} WHERE ${reqDataMap[reqKey]["keyName"]}='${fetchData}' LIMIT 1`;

							con.query(query,(err,result)=>{

							console.log(query);

							 console.log(result);

							 if(reqKey=="personSlNo"){


							 }else if(reqKey=="visitorId"){

							 		if(result.length==0){

							 			appDataMap["visDetailPresent"]=false;
							 			
							 		}else{

							 			appDataMap["visDetailPresent"]=true;

							 			const fMap = sqlToSimpleMap(result);
							 			const dbKeys = reqDataMap[reqKey]["dbKeys"];

							 			for(a1=0;a1<dbKeys.length;a1++){
							 				const key = dbKeys[a1];
							 				
							 				const elem = document.getElementById(classType+"-"+key);
							 				console.log(classType);
							 				console.log(elem);

							 				const type = elem.tagName;
							 				let dbValue = (result[0][key]==undefined)?"":result[0][key];

							 				if(type=="INPUT"){

							 					if(elem.type=="date"){
							 						dbValue = getFormattedDate(result[0][key]);
							 					}
							 				}

							 				console.log(type);
							 				console.log(result[0][key]);

							 				//document.getElementById("input-vi-"+key).value =(type!="TEXTAREA")?result[0][key]:"";
							 				//document.getElementById("input-vi-"+key).value = (type=="SELECT")?result[0][key]:"";
							 				//document.getElementById("input-vi-"+key).innerText =(type=="TEXTAREA")?result[0][key]:"";

							 				document.getElementById(classType+"-"+key).value =dbValue;
							 			}

							 				

							 		}



							 }


						});

					})



			}


		function getVisitorId(contactNo){

			con.connect((error)=>{

						const query = `SELECT visitorId FROM visitor_data WHERE contactNo='${contactNo}'`;

							con.query(query,(err,result)=>{

							console.log(query);

							 console.log(result);

							 if(result.length==0){
							 	document.getElementById('input-cp-personSlNo').value = "001";
							 }else{

							 	const fArray = sqlToSimpleArray(result,"personSlNo");


							 	const newSlNo = parseInt(fArray[fArray.length-1])+1

							 	document.getElementById('input-cp-personSlNo').value = to3Digits(newSlNo);


							 }


						});


					})





		}
					

		//To fetch the Sl No for the person based on the previous Sl nO for his contractor

			function assignSlNoByAnalyzingDb(personGroupId,idDbKeyName,dbTableName,inputClassInitial){

					con.connect((error)=>{

						const query = `SELECT personSlNo FROM ${dbTableName} WHERE ${idDbKeyName}='${personGroupId}'`;

							con.query(query,(err,result)=>{

							console.log(query);

							 console.log(result);

								const inputElement = document.getElementById(`input-${inputClassInitial}-personSlNo`)

							 if(result.length==0){
							 	inputElement.value = "001";
							 	console.log("End Result")
							 }else{

							 	const fArray = sqlToSimpleArray(result,"personSlNo");
							 	const newSlNo = parseInt(fArray[fArray.length-1])+1

							 	inputElement.value = to3Digits(newSlNo);



							 }


						});


					})




			}


			function assignSlNoByAnalyzingDbStudent(dbTableName,inputClassInitial){

				con.connect((error)=>{

					const query = `SELECT personSlNo FROM ${dbTableName}`;

						con.query(query,(err,result)=>{

						console.log(query);

						 console.log(result);

							const inputElement = document.getElementById(`input-${inputClassInitial}-personSlNo`)

						 if(result.length==0){
							 inputElement.value = "0001";
							 console.log("End Result")
						 }else{

							 const fArray = sqlToSimpleArray(result,"personSlNo");
							 const newSlNo = parseInt(fArray[fArray.length-1])+1

							 inputElement.value = to4Digits(newSlNo);



						 }


					});


				})




		}


			function maintainContractorStatus(contractorId,contractorName){

				console.log("contractor name=",contractorName)

				const personTypeInputBox = document.getElementById('input-cp-personType');
				const restrictedTypes = ["Apprentice","Temporary Contract"]

				if(contractorName=="Apprenticeship"){
					personTypeInputBox.value = "Apprentice";
					personTypeInputBox.disabled=true;
					return
				}

					con.connect((error)=>{

						const query = `SELECT contractorStatus FROM contractor_data WHERE contractorId='${contractorId}'`;

							con.query(query,(err,result)=>{

								console.log(query);

								console.log(result);

						

							 if(result[0]["contractorStatus"]=="Approved"){

							 	personTypeInputBox.disabled=false;
							 	personTypeInputBox.value = "Sub Contract Personnel";

							 	Array.from(personTypeInputBox.getElementsByTagName("option")).forEach((option)=>{
							 		option.disabled=(restrictedTypes.includes(option.innerText))?true:false;
							 	})

							 }else if(result[0]["contractorStatus"]=="Temporary"){

							 	personTypeInputBox.value = "Temporary Contract";
							 	personTypeInputBox.disabled=true;

							 }



							 });


						});

			}



		function sqlToSimpleArray(result,key){

			console.log("sqlToSimpleArray result",result)

			// if(result===null){
			// 	return []
			// }

			rArray=[];

			for(a1=0;a1<result.length;a1++){

				rArray.push(result[a1][key]);

			}

			return rArray;


		}



			function sqlToSimpleMap(sqlDataArray){

				console.log("sqlToSimpleMap result",sqlDataArray)

				const rMap={};

				if(!sqlDataArray){
					return rMap
				}

				if(sqlDataArray.length!=0){


								const keyArray = Object.keys(sqlDataArray[0]);

								for(a2=0;a2<keyArray.length;a2++){
									const key = keyArray[a2];
									rMap[key]=[];
								} 

								for(a2=0;a2<sqlDataArray.length;a2++){

									const uMap = sqlDataArray[a2];

									for(a3=0;a3<Object.keys(uMap).length;a3++){

										const key = Object.keys(uMap)[a3];

										rMap[key].push(uMap[key]);

									}


								}

					}

				return rMap;

			}


			function sqlToMapArray(result){

				const rArray=[];

				console.log(result.length);

				for(a1=0;a1<result.length;a1++){

					const map = result[a1];

					console.log(map);

					rArray.push(map);
				}

				return rArray;

			}






			function initiateGenerateId(dataMapArray,cardType,personType){

				ipcRenderer.send('open-window',{name:"card",
				data:{datas:dataMapArray,cardType:cardType,personType:personType}});

			};



            function toUniqueArray(array){

                const rArray=[];


                array.forEach((item)=>{

                    if(rArray.includes(item)){
                        console.log("Yes");
                    }else{
                        console.log("Pushed");
                        rArray.push(item); 
                    }

                })

                return rArray;


            }



            function numberToDateString(number){

                    return number.slice(0,4)+"-"+number.slice(4,6)+"-"+number.slice(6,8);


            }




function showNotification(type,text,moreInfo){

const container = document.createElement("div");
container.setAttribute("class","center-cont-box-3 c-flex");
document.body.appendChild(container);

document.body.appendChild(container);

const notifCont = document.getElementById("notification-bar");
container.appendChild(notifCont);


const notifHead = document.getElementById("notification-heading");
const notifBtn =document.getElementById("notification-btn");
const notifBtnClose =document.getElementById("notification-btn-close");
const notifBtnInfo =document.getElementById("notification-btn-info");
const notifImg= document.getElementById("notification-img");
const notifText = document.getElementById("notification-text");
const notifMoreInfo = document.getElementById("notification-more-info");
const notifErrorToggle = document.getElementById("notification-error-info-toggle");



const notificationTypes = ["Connection Issue", "Success", "Error", "Conflict", "Warning","Confirmation"];
const notifContColors = ["rgb(40,83,107)","rgb(127,183,72)","rgb(210,40,40)","rgb(210,80,80)","rgb(153, 31, 0)","rgb(40,83,107)"];
const notifHeadColors = ["rgb(151,181,190)","rgb(187,219,155)","rgb(219,155,155)","rgb(219,155,155)","rgba(255,255,255,0.3)","rgb(151,181,190)"];
const notifHeadFontColors = ["rgb(151,181,190)","rgb(30,30,30)","rgba(255,255,255)","rgb(219,155,155)","rgba(255,255,255)","rgb(255,255,255)"];
const notifBtnTexts = ["RELOAD","","OK","OK","CLOSE","CLOSE"];
const notifImgs=["conn-issue","update","error","conflict","warning","conflict"];


  const i = notificationTypes.indexOf(type);

  notifBar.style.display="grid";



  notifBar.style.backgroundColor=notifContColors[i];
  notifHead.style.backgroundColor=notifHeadColors[i];
  notifHead.style.color=notifHeadFontColors[i];
  notifBtnClose.style.visibility=(notificationTypes[i]=="Success")?"hidden":"visible";


  if(type=="Error"){
	notifErrorToggle.style.display="flex";
	notifMoreInfo.innerText = moreInfo;

	notifErrorToggle.addEventListener('click',(e)=>{

		const lessInfoCond = notifText.style.display != "none";
	
		notifMoreInfo.style.display = lessInfoCond ? "flex" : "none";
		notifText.style.display = lessInfoCond ? "none" : "flex";

		console.log(e.target)

		e.target.innerText = lessInfoCond ? "Less Info" : "More Info"

	})

  }


  notifHead.innerText=notificationTypes[i].toUpperCase();
  notifBtnClose.innerText=notifBtnTexts[i];
  notifBtnClose.setAttribute("onclick",`closeNotification(this,"${type}")`);
  notifBtn.innerText="PROCEED";


  notifBtn.style.display=(notificationTypes[i]!="Warning" && notificationTypes[i]!="Confirmation")?"none":"flex";

  

  notifBtn.style.backgroundColor="rgb(216, 216, 216)";
  notifBtnClose.style.backgroundColor="rgb(216, 216, 216)";

  notifImg.src=`../source/logo--${notifImgs[i]}.svg`;
  notifText.innerText=text;

    if(notificationTypes[i]=="Success"){
      setTimeout(()=>{
        closeNotification(notifBtnClose);
      },2000);
  }



}


function closeNotification(elem,type){

  const parentView = elem.parentElement.parentElement.parentElement;

  const parentClass = parentView.className.split(" ")[0];

  console.log(parentClass);

  console.log(document.getElementsByClassName(parentClass));

  const parentConts = document.getElementsByClassName(parentClass);

  for(x=0;x<parentConts.length;x++){

    parentConts[x].style.display="none";
  }



  //if(type=="Conflict" || type=="Error" || type=="Warning"){

    //parentView.innerHTML="";
    parentView.style.display="none";
    
 // }


}


function showResult(sqlResult,sqlError,action){

	const actions =["add","edit","update","delete","change","renew","block","unblock"];
	const verbs = ["Added","Edited","Updated","Deleted","Changed","Renewed","Blocked","Unblocked"];

	const index = actions.indexOf(action);

	const result = sqlResult;

				
					

						if(result!=undefined){

							if(result.affectedRows>=1){

								console.log("success");

								showNotification("Success","Succesfully "+verbs[index]);

							}else{
								console.log("success fail");
					
								showNotification("Error",toSentenceCase(actions[index])+" Failure");
							}


						}else{
							console.log("sql error : =",sqlError.message);
							console.log("failed");
							showNotification("Error",toSentenceCase(actions[index])+" Failure",sqlError.message);
						}

}




function generateXlsxFromResult(sqlResult,mainValue,subValue){

		const data = sqlToSimpleMap(sqlResult);


		if(Object.keys(data).length>0){

	
		const types = ["Contractor","Contract Personnel","Visitor","Visitor Pass"];

		const refMap = {};

		types.forEach((v)=>{

			refMap[v]={};

		})

		refMap["Contract Personnel"]["labes"] = "Yes";
		refMap["Contract Personnel"]["labels"] = ["Personnel ID","Name", "Contractor Name", "Trade Name","Date of Birth","Date Of Joining","Date of Card Expiry","BloodGroup","Contact No","Permanent Address","Aadhar No","ESI No","UAN","Insurance No","Status","Hold"];
		refMap["Contract Personnel"]["dbKeys"] = ["personId","personName","contractorName","tradeName","dateOfBirth","dateOfJoining","dateOfCardExpiry","bloodGroup","personContactNo","permanentAddress","aadharNo","esiNo","uan","insuranceNo","personStatus","isHeld"];
		refMap["Contract Personnel"]["dataType"] = ["personId","personName","contractorName","tradeName","date","date","date","bloodGroup","contactNo","permanentAddress","number", "esiNo","uan","text","text","text"];
		refMap["Contract Personnel"]["colWidths"] = [15,25,30,15,15,15,15,15,15,25,15,20,20,20,20,10,5];

		refMap["Contractor"]["labels"] = ["Contractor ID","Contractor Name", "Department", "Date of Establishment","Registered Address","Local Address","Contact No","Email","Local Representative","Local Rep Contact","Bank Account No","Bank Name","IFSC Code","Date of Joining"];
		refMap["Contractor"]["dbKeys"] = ["contractorId","contractorName","department","dateOfIncorporation","registeredAddress","localAddress","contractorContactNo","contractorEmail","localRepName","localRepContactNo","bankAccountNo","bankName","bankIfscCode","dateOfRegistry"];
		refMap["Contractor"]["dataType"] = ["contractorId","contractorName","department","date","registeredAddress","localAddress","contractorContactNo","contractorEmail","localRepName","localRepContactNo","bankAccountNo","bankName","bankIfscCode","date"];
		refMap["Contractor"]["colWidths"] = [15,30,15,15,30,30,15,25,15,15,20,20,15,10];


		refMap["Visitor"]["labels"] = ["Visitor ID","Visitor Name", "Company Name", "Designation","Date of Birth","Address","Contact No"];
		refMap["Visitor"]["dbKeys"] = ["visitorId","visitorName","companyName","designation","dateOfBirth","address","contactNo"];
		refMap["Visitor"]["dataType"] = ["Visitor ID","Visitor Name","Company Name","tradeName","date","",""];
		refMap["Visitor"]["colWidths"] = [15,25,30,15,15,30,15];

		refMap["Visitor Pass"]["labels"] = ["Visitor ID","Name","Photo ID Type","Photo ID No","Purpose of Visit","Person to Visit","Dept of Person","Contact Person Ph No"];
		refMap["Visitor Pass"]["dbKeys"] = ["visitorId","visitorName","photoIdType","photoIdNo","purposeOfVisit","tebmaContactPerson","tebmaContactDept","tebmaContactPhoneNo"];
		refMap["Visitor Pass"]["dataType"] = ["visitorId","visitorName","photoIdType","photoIdNo","purposeOfVisit","tebmaContactPerson","tebmaContactDept","tebmaContactPhoneNo"];
		refMap["Visitor Pass"]["colWidths"] = [15,30,20,15,20,20,10,20,20,10,15,15,10,10,20,20];


/*
		refMap["Visitor Pass"]["labels"] = ["Contact No","Visitor ID","Name","Company","Designation","Date of Birth","Address","Blood Group","Gender","Emg Contact No","Photo ID Type","Photo ID No","Purpose of Visit","Person to Visit","Dept of Person","Contact Person Ph No"];
		refMap["Visitor Pass"]["dbKeys"] = ["contactNo","visitorId","visitorName","companyName","designation","dateOfBirth","address","bloodGroup","gender","emgContactNo","photoIdType","photoIdNo","purposeOfVisit","tebmaContactPerson","tebmaContactDept","tebmaContactPhoneNo"];
		refMap["Visitor Pass"]["dataType"] = ["contactNo","visitorId","visitorName","companyName","designation","date","address","bloodGroup","gender","emgContactNo","photoIdType","photoIdNo","purposeOfVisit","tebmaContactPerson","tebmaContactDept","tebmaContactPhoneNo"];
		refMap["Visitor Pass"]["colWidths"] = [15,30,20,10,20,20,10,20,20,10,15,15,10,10,20,20];
*/  

		console.log(mainValue);

		const labels = refMap[mainValue]["labels"];
		const dbKeys = refMap[mainValue]["dbKeys"];
		const dataTypes = refMap[mainValue]["dataType"];
		const colWidths = refMap[mainValue]["colWidths"];



		const workbook = new excel.Workbook();

		const sheet = workbook.addWorksheet('Page 1');

		console.log(data);

		const colArray=[];

		const noOfCols = labels.length//Object.keys(data).length;

			for(a1=0;a1<noOfCols;a1++){

				const colName = labels[a1] ;

				console.log(colName);

				const index = labels.indexOf(colName);

				colArray.push({"header":labels[index],"key":dbKeys[index],"width":colWidths[index]});

			}

			sheet.columns = colArray;

			console.log(colArray);

			console.log(dbKeys[0]);

			console.log(data[dbKeys[0]]);

			const noOfRows = data[dbKeys[0]].length;

			console.log(noOfRows);

			for(a1=0;a1<noOfRows;a1++){

				const rowMap = {};

				for(a2=0;a2<dbKeys.length;a2++){

					const keyName = dbKeys[a2];

					console.log(keyName);
					console.log(dataTypes[a2]);

					rowMap[keyName] = (dataTypes[a2]=="date")?jsonToLocalDate(data[keyName][a1]):data[keyName][a1];

				}

				sheet.addRow(rowMap);

				console.log(rowMap);


			}

			sheet.eachRow((row,rowNo)=>{

				if(rowNo==1){
					row.eachCell((cell,cellNo)=>{
						cell.font={
							bold:true
						}

						cell.fill={
							 type: 'pattern',
							 pattern:'solid',
							 fgColor:{argb:'FFFFFF80'}
						}
						

					})

				}



				row.eachCell((cell,cellNo)=>{

				 cell.alignment={
					vertical:'middle',
					horizontal:'center',
					wrapText:true};

					cell.border={
							  top: {style:'thin'},
  							  left: {style:'thin'},
 							  bottom: {style:'thin'},
  							 right: {style:'thin'}
						}

				})

			})

			const dirPath = './Reports';

			if(!fs.existsSync(dirPath)){
				fs.mkdirSync(dirPath);
			}


			const fileName = `Report_${mainValue}_${getDateTimeNo()}.xlsx`

			workbook.xlsx.writeFile(dirPath+"/"+fileName).then((res)=>{

				showNotification("Success","Report Generated, please check the 'Reports' folder for the report.")

			}).catch((err)=>{

				console.log(err.message);
			})

		}else{
			showNotification("Error","Cannot Generate report as no records were found")
		}


		}












      function toSentenceCase(string){

        let rString = string.toLowerCase();

        rString = rString[0].toUpperCase()+rString.slice(1);

        return rString;


      }

      let photo = "";
      let canvas = "";
      let video="";
      let btnCapture="";
      let width="";
      let height = "";


	  function formatData(value){
		if(value===null){
			return value
		}else{
			return `'${value}'`
		}
	}




      function takePicture(elem,canvas,photo,video,btnCapture,width,height){

      	console.log(elem);

		var context = canvas.getContext('2d');

		if(width && height){
			canvas.width=width;
			canvas.height=height;
			context.drawImage(video,0,0,width,height);

			
		var data = canvas.toDataURL('image/jpeg');
		photo.setAttribute('src',data);
		appDataMap["photo"] = data;

		video.style.display="none";
		photo.style.display="block";

		btnCapture.innerText = "CAPTURE AGAIN";

			btnCapture.addEventListener('click',function(ev){

				video.style.display="block";
				photo.style.display="none";
				photo.src=dummyImgPath;

				//takePicture();
				ev.preventDefault();
				btnCapture.innerText = "CAPTURE IMAGE";

					btnCapture.addEventListener('click',function(ev){
						takePicture();
						//checkMandatoryInputs();
						ev.preventDefault();
					},false);

					//checkMandatoryInputs();
			},false);


			//checkMandatoryInputs();

		}else{
			//clearPhoto();
		}
	}

	function getEscapedString(str){

		return str.replace(/'/g,"\\'")
	
	}


	function showProgressLoader(){
		document.getElementById("progress-loader").style.display = "flex"
	}

	
	function hideProgressLoader(){
		document.getElementById("progress-loader").style.display = "none"
	}
