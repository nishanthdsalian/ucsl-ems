const qrCode = require('qrcode');
const printer = require('print-js');

const canvas = document.getElementById('canvas-landscape');
const canvasP = document.getElementById('canvas-portrait');
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

const btnPrint = document.getElementById("btn-print");
let labelPrintInstruction = document.getElementById("print-instruction-label");
let imgPrintInstruction = document.getElementById("logo-print-size");

const fs = require('fs');

const appDataMap={};

let datas=[];
let ctx="";


let cardType = "";

let x=0;



let c1fx = 0;
let c1fy= 0;
let c1bx= 0;
let c1by= 0; 

/*

const datas = [{
	personName:"ROHAN SHARMA",
	contractorName:"AEGIS TECHNITECH",
	tradeName:"SUPERVISOR",
	bloodGroup:"A+",
	personId:"AEG0001001",
	dateOfBirth:"17.04.1983",
	dateOfJoining:"24.03.2010",
	dateOfCardExpiry:"13.07.2021",
	permanentAddress:"SAGAR NIVAS, 10TH CROSS, KM MARG, NEAR CITY CENTRE, MANGALAORE - 575001",
	contactNo:"9892004561",
	emgContactNo:"9820282045",
	hInsuranceNo:"NA818U129",
	photo:"../source/img--man.jpg"
},
{
	personName:"ROHIT SHARMA",
	contractorName:"MANOM TECHNITECH",
	tradeName:"RIGGER",
	bloodGroup:"B+",
	personId:"MAN0001001",
	dateOfBirth:"17.04.1982",
	dateOfJoining:"24.03.2110",
	dateOfCardExpiry:"13.07.2121",
	permanentAddress:"SAGAR PLACE, 10TH CROSS, KM MARG, NEAR CITY CENTRE, MANGALAORE - 575001",
	contactNo:"9892002561",
	emgContactNo:"9810282045",
	hInsuranceNo:"NA118U129",
	photo:"../source/img--man.jpg"
},{
	personName:"ROHIT SHARMA",
	contractorName:"MANOM TECHNITECH",
	tradeName:"RIGGER",
	bloodGroup:"B+",
	personId:"MAN0001001",
	dateOfBirth:"17.04.1982",
	dateOfJoining:"24.03.2110",
	dateOfCardExpiry:"13.07.2121",
	permanentAddress:"SAGAR PLACE, 10TH CROSS, KM MARG, NEAR CITY CENTRE, MANGALAORE - 575001",
	contactNo:"9892002561",
	emgContactNo:"9810282045",
	hInsuranceNo:"NA118U129",
	photo:"../source/img--man.jpg"
},{
	personName:"ROHIT SHARMA",
	contractorName:"MANOM TECHNITECH",
	tradeName:"RIGGER",
	bloodGroup:"B+",
	personId:"MAN0001001",
	dateOfBirth:"17.04.1982",
	dateOfJoining:"24.03.2110",
	dateOfCardExpiry:"13.07.2121",
	permanentAddress:"SAGAR PLACE, 10TH CROSS, KM MARG, NEAR CITY CENTRE, MANGALAORE - 575001",
	contactNo:"9892002561",
	emgContactNo:"9810282045",
	hInsuranceNo:"NA118U129",
	photo:"../source/img--man.jpg"
}];

*/

let height = 0;
let width = 0;

const hFrameSpace = width+10;
const vFrameSpace = height+10;

let marginX =0;
let marginY =0;

/*
const c1fx = 30;
const c1fy= 30;
const c1bx= c1fx+(width*1)+10;
const c1by= c1fy+0;

const c2fx = c1fx;
const c2fy = c1fy+(height*i);
const c2bx = c2fx+(width*1)+10;
const c2by = c1by+(height*i);
*/

let fontColor = "rgb(16, 67, 89)";
let fontColorL = "rgb(255, 255, 255)";
let bandColor = "rgb(235,230,107)";
let bGroupColor = "rgb(176, 66, 66)";
let bandColor2 = "rgb(48,89,107)";
let bandColor3 = "rgb(27,127,170)";
let idColor = "rgb(61,66,169)";
let fSize1= 20;
let fSize2 = 30;
let fSize3 = 42;
let fSize4 = 24;
let fSize5 = 18;
let fSize6 = 16;
let fSize7 = 14;
let fSize8 = 48;
let fSize9 = 10;

let margin1=0;
let margin2 = 21;
let margin3 = 240;




ipcRenderer.on('data-input',(event,payload)=>{
	console.log("hello");
	console.log(payload);


	datas = payload.datas;
	cardType = payload.cardType;
	domain = payload.personType;

	height = (cardType=="A")?850:1400;
	width = (cardType=="A")?550:900;

	canvas.height = (cardType=="A") ? 4200 : 2970
	canvas.width = (cardType=="A") ? 5940 : 4200

	canvas.style.height = (cardType=="A") ? "2100px" : "1485px"
	canvas.style.width = (cardType=="A") ? "2970px" : "2100px"

	marginX =100;
	marginY = 15;


let f = new FontFace('Roboto Regular', 'url(../source/fonts/Roboto-Regular.ttf)');
let f1 = new FontFace('Roboto Bold', 'url(../source/fonts/Roboto-Bold.ttf)');


f.load().then(function(font){

document.fonts.add(font);

	f1.load().then(function(font){

		document.fonts.add(font);
	
		//contPrintInstruction.innerText =(cardType=="contractor")?"Please Print in A4 Portrait":"Please Print in A4 Landscape";
		labelPrintInstruction.innerText = (cardType=="A")?"Please Print in A4 Landscape":"Please Print in A5 Landscape";
		imgPrintInstruction.src =(cardType=="A")?"../source/logo--sheet-a4l.svg":"../source/logo--sheet-a5l.svg";


	if(cardType=="A"){
		canvasP.style.display="none";
		canvas.style.display="block";
		drawContractorId(datas,domain);
	}else{
		canvasP.style.display="none";
		canvas.style.display="block";
		drawVisitorPass(datas,"visitor_pass_no");
		// canvas.style.display="none";
		// canvasP.style.display="block";
		// drawVisitorPass(datas,"visitor_pass_no");
	}

		



	});//end of font1


});


}); // end of ipcRendered








function drawContractorId(datas,domain){

appDataMap["orientation"] = "landscape";


x=2.4;

for(i=0;i<datas.length;i++){

const data = datas[i];

data["hInsuranceNo"]=(data["esiApplicability"]=="Yes")?data["esiNo"]:data["insuranceNo"];

/*
const l=1;
const p=0;


const c1fx = marginX+(l*(width*i))+(10*i);
const c1fy= marginY+(p*(height*i));
const c1bx= c1fx+(p*width*i);
const c1by= c1fy+(l*(height));

*/

ty=6;

const row = Math.ceil((i+1)/2);

console.log(row);

const col=((i+1)%2!=0)?1:2;

const c1fx = marginX+(width*(col-1)*2)+(10*(col-1));
const c1fy= marginY+(height*(row-1));
const c1bx= c1fx+(width);
const c1by= c1fy; 

console.log(col);



console.log(i);
console.log(c1fy);
console.log(c1by);


let img = new Image();
img.src="../source/logo--ucsl-hor.png"


img.addEventListener('load',()=>{

	console.log(i);
	console.log(c1fx);
	console.log(c1fy);

ctx.drawImage(img,(c1fx+100)*x,(c1fy+30)*x,375*x,75*x);

},false);


const ctx = canvas.getContext('2d');
ctx.textBaseline="top";

const types = ["Sub Contract Personnel","Temporary Contract","Service Engineer","Owner Rep","Security","Intern","Apprentice"];
const key = ["sub_contract_personnel","temporary_contract","service_engineer","owner_rep","security","intern","apprentice"];
const labels = ["CONTRACTOR PASS","TEMPORARY","SERVICE ENGINEER","OWNER REP PASS","SECURITY","INTERNSHIP PASS","APPRENTICE PASS"]; // "TEMPORARY" is purposefully included with spaces so that spacing is unform in the Printed ID.
const bandColors = ["rgb(235, 230, 107)","rgb(0, 255, 255)","rgb(50, 56, 108)","rgb(151, 46, 46)","rgb(97, 10, 101)","rgb(97, 10, 41)","rgb(0, 102, 204)"];
const fontColors = [fontColor,fontColor,fontColorL,fontColorL,fontColorL,fontColorL,fontColorL];
const labelMargins=[55,55,55,55,150,75,75]

const index = types.indexOf(data.personType);


ctx.fillStyle=bandColors[index];
ctx.fillRect((c1fx+0)*x,(c1fy+117)*x,width*x,85*x);

ctx.font = `bold ${fSize8*x}px Roboto Bold`;
ctx.fillStyle=fontColors[index];
ctx.fillText(labels[index],(c1fx+labelMargins[index])*x,(c1fy+137+ty)*x);
//ctx.fillText('TEBMA SHIPYARDS LTD',418,134);

let img2 = new Image();
img2.src=data.personPhoto

// if(data.personPhotoPath==""){
// 	img2.src=data.personPhoto
// }else{
// 	img2.src=`../${data.personPhotoPath}`
// }




img2.addEventListener('load',()=>{

ctx.drawImage(img2, (c1fx+40)*x,(c1fy+218)*x,230*x,300*x);

},false);

//QR Code


const options = {
	"errorCorrectionLevel":"H",
	quality:1,
	color:{
		dark:"#000000FF",
		light:"#FFFFFF00"
	}
}

let personQrString = key[index]


// switch(domain){
// 	case "contractor":
// 		personQrString = "contractor_person_id"
// 		case "student":
// 		personQrString = "student_person_id"
// }

//qr code generation for contractor person

qrCode.toDataURL(`${data.personId}_${personQrString}`,options,(err,url)=>{

let img3 = new Image();
img3.src=url;//"../source/img--qr.png"

img3.addEventListener('load',()=>{

ctx.drawImage(img3,(c1fx+320)*x,(c1fy+284)*x,163*x,163*x);

},false);

})

const personGroupLabelName = domain=="contractor"?"CONTRACTOR":"INSTITUTE";
const personGroupName = domain=="contractor"?data.contractorName:data.instituteName;
const segmentGroupLabelName = domain=="contractor"?"TRADE":"COURSE";
const segmentGroupName = domain=="contractor"?data.tradeName:data.courseName;

const cardValidityStart = domain=="contractor"?data.dateOfJoining:data.dateOfPassValidityStart;
const cardValidityEnd = domain=="contractor"?data.dateOfCardExpiry:data.dateOfPassExpiry;
const cardValidityStartLabel = domain=="contractor"?"DATE OF JOINING":"START DATE";
const cardValidityEndLabel = domain=="contractor"?"DATE OF EXPIRY":"END DATE";
const idNoMarginFromLeft = domain=="contractor"?240:280;






console.log(personGroupName)


ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText('NAME',(c1fx+32)*x,(c1fy+542)*x);

ctx.font = `bold ${fSize2*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(data.personName.toUpperCase(),(c1fx+32)*x,(c1fy+567)*x);

ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(`${personGroupLabelName} NAME`,(c1fx+32)*x,(c1fy+623)*x);

ctx.font = `bold ${fSize4*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(personGroupName.toUpperCase(),(c1fx+32)*x,(c1fy+650)*x);

ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(`${segmentGroupLabelName} NAME`,(c1fx+32)*x,(c1fy+700)*x);

ctx.font = `bold ${fSize4*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(segmentGroupName.toUpperCase(),(c1fx+32)*x,(c1fy+722)*x);


if(domain=="student"){

ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(`CLASS`,(c1fx+332)*x,(c1fy+700)*x);

ctx.font = `bold ${fSize4*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(data.className.toUpperCase(),(c1fx+332)*x,(c1fy+722)*x);

}

ctx.fillStyle =bGroupColor;
ctx.fillRect((c1fx+0)*x,(c1fy+767)*x,160*x,83*x);

ctx.font=`${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColorL;
ctx.fillText('BLOOD GROUP',(c1fx+12)*x,(c1fy+772+ty)*x);

ctx.font=`${fSize3*x}px Roboto Bold`;
ctx.fillStyle=fontColorL;
ctx.fillText(data.bloodGroup,(c1fx+53)*x,(c1fy+797+ty)*x);

ctx.fillStyle =idColor;
ctx.fillRect((c1fx+160)*x,(c1fy+767)*x,390*x,83*x);

ctx.font=`${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColorL;
ctx.fillText('ID NO',(c1fx+323)*x,(c1fy+772+ty)*x);

ctx.font=`${fSize3*x}px Roboto Bold`;
ctx.fillStyle=fontColorL;
ctx.fillText(data.personId,(c1fx+idNoMarginFromLeft)*x,(c1fy+797+ty)*x);


const img3a = new Image();
img3a.src = "../source/img--vText.png"

img3a.addEventListener('load',()=>{

	ctx.drawImage(img3a,(c1fx+526)*x,(c1fy+439)*x,12*x,309*x);


},false);


ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText('DATE OF BIRTH',(c1bx+margin2)*x,(c1by+37)*x);
ctx.fillText('AADHAR NO',(c1bx+margin3)*x,(c1by+37)*x);

ctx.font = `bold ${fSize4*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(getIndiaDate(jsonToLocalDate(data.dateOfBirth)),(c1bx+margin2)*x,(c1by+62)*x);
ctx.fillText(data.aadharNo,(c1bx+margin3)*x,(c1by+62)*x);

ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(cardValidityStartLabel,(c1bx+margin2)*x,(c1by+119)*x);

ctx.font = `bold ${fSize4*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(getIndiaDate(jsonToLocalDate(cardValidityStart)),(c1bx+margin2)*x,(c1by+144)*x);

ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(cardValidityEndLabel,(c1bx+margin3)*x,(c1by+119)*x);

ctx.font = `bold ${fSize4*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(getIndiaDate(jsonToLocalDate(cardValidityEnd)),(c1bx+margin3)*x,(c1by+144)*x);


ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText('ADDRESS',(c1bx+margin2)*x,(c1by+199)*x);


drawMultiLine(data.permanentAddress.toUpperCase(),"Roboto Bold",fSize1,fontColor,45,margin2,224,ctx,c1bx,c1by);

ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText('CONTACT NO',(c1bx+margin2)*x,(c1by+334)*x);

ctx.font = `bold ${fSize4*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(data.personContactNo,(c1bx+margin2)*x,(c1by+359)*x);

ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText('EMG CONTACT NO',(c1bx+margin3)*x,(c1by+334)*x);

ctx.font = `bold ${fSize4*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(data.personEmgContactNo.toUpperCase(),(c1bx+margin3)*x,(c1by+359)*x);

if(domain=="contractor"){

ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText('ESI/INSURANCE NO',(c1bx+margin2)*x,(c1by+432)*x);
ctx.font = `bold ${fSize4*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(data.hInsuranceNo,(c1bx+margin2)*x,(c1by+457)*x);

}

/*
const img4 = new Image();
img4.src = "../source/img--sign.png"

img4.addEventListener('load',()=>{

	ctx.drawImage(img4,(c1bx+340)*x,(c1by+491)*x,120*x,97*x);


},false);

*/


ctx.font = `bold ${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText('AUTHORIZED SIGNATORY',(c1bx+281)*x,(c1by+588)*x);


ctx.fillStyle=bandColor2;
ctx.fillRect((c1bx+0)*x,(c1by+633)*x,550*x,159*x);

ctx.font = `bold ${fSize5*x}px Roboto Regular`;
ctx.fillStyle=fontColorL;
ctx.fillText('NOTES',(c1bx+245)*x,(c1by+641)*x);

const margin4 = 18;

ctx.font = `${fSize7*x}px Roboto Regular`;
ctx.fillStyle=fontColorL;
ctx.fillText('1. THIS CARD IS NOT TRANSFERRABLE.',(c1bx+margin4)*x,(c1by+672)*x);
ctx.fillText('2. THIS CARD SHOULD BE DISPLAYED AT UCSL OFFICE/YARD PREMISES ONLY.',(c1bx+margin4)*x,(c1by+698)*x);
ctx.fillText('3. LOSS OF CARD SHOULD BE INFORMED TO THE ISSUING AUTHORITY.',(c1bx+margin4)*x,(c1by+725)*x);
ctx.fillText('4. NEW CARD CAN BE OBTAINED ON A FINE OF RS.500/-',(c1bx+margin4)*x,(c1by+750)*x);




ctx.fillStyle=bandColor3;
ctx.fillRect((c1bx+0)*x,(c1by+792)*x,550*x,58*x);


ctx.font = `${fSize7*x}px Roboto Regular`;
ctx.fillStyle=fontColorL;
ctx.fillText('IF FOUND PLEASE RETURN TO,SECURITY OFFICE,UDUPI COCHIN SHIPYARD LIMITED,',(c1bx+15)*x,(c1by+803)*x);
ctx.fillText('MALPE HARBOUR COMPLEX, MALPE, KARNATAKA, 576108',(c1bx+50)*x,(c1by+823)*x);

}//end of for(i of datas);






}


//@3
function drawVisitorPass(datas,type){

appDataMap["orientation"] = "landscape";

x=2.3;

fontColor = "rgb(10, 10, 10)";
fontColorL = "rgb(255, 255, 255)";
bandColor = "rgb(215, 130, 52)";
bGroupColor = "rgb(0, 0, 0)";
bandColor2 = "rgb(48, 89, 107)";
bandColor3 = "rgb(27, 127, 170)";
const bColorPurpose = 'rgb(229,229,229)';
const bColorIssued = 'rgb(196,196,196)';
const bColorPass = 'rgb(58,58,58)';
const bColorPermit = 'rgb(41,41,41)';


fSize1= 20;
fSize2 = 32;
fSize3 = 42;
fSize4 = 26;
fSize5 = 18;
fSize6 = 16;
fSize7 = 14;
fSize8 = 60;
fSize9 = 10;
fSize10 = 36;
fSize11 = 28;
fSize12 = 30;
fSize13 = 22;
fSize14 = 24;


const fSBackLabel = 20;



margin2 = 21;
margin3 = 240;


const ty=5;


for(i=0;i<datas.length;i++){

const data = datas[i];


const l=0;
const p=1;

/*
const c1fx = marginX+(l*(width*i))+(10*i);
const c1fy= marginY+(p*(height*i));
const c1bx= c1fx+(p*width*i);
const c1by= c1fy+(l*(height));  
*/


width = 850
height = 200

marginX=50
marginY=50

const c1fx = marginX+(l*(width*i))+(10*i);
const c1fy= marginY+(p*(height*i));
const c1bx= c1fx+(p*width); //Back X Cordinates 
const c1by= c1fy+(l*(height)); //ID Back Y Cordinates

// const col=((i+1)%2!=0)?1:2;

// const c1fx = marginX+(width*(col-1)*2)+(10*(col-1));
// const c1fy= marginY+(height*(row-1));
// const c1bx= c1fx+(width);
// const c1by= c1fy; 


console.log(i);
console.log(c1fy);
console.log(c1by);

// canvas.style.height="1480px";
// canvas.style.height="2100px";

// canvas.height=2960;
// canvas.width=4200;

// canvas.style.height=`${148*2}px`;
// canvas.style.width=`${210*2}px`;

// canvas.height=148*10;
// canvas.width=210*10;

const ctx = canvas.getContext('2d');
ctx.textBaseline="top";

let img = new Image();
img.src="../source/logo--ucsl-hor.png"


img.addEventListener('load',()=>{

ctx.drawImage(img,(c1fx+200)*x,(c1fy+20)*x,425*x,85*x);

},false);

const passType = data.passType;

const keys = ["Visitor","Service Engineer","Owner Rep","Sub Contract Personnel"];
const labels = ["VISITOR PASS", "TEMPORARY PASS", "TEMPORARY PASS", "TEMPORARY PASS"];
const bandColors = ["rgb(215, 130, 52)", "rgb(45, 108, 135)", "rgb(45, 108, 135)", "rgb(0,0,0)"];

const index = keys.indexOf(passType);

ctx.fillStyle=bandColors[index];
ctx.fillRect((c1fx+0)*x,(c1fy+123)*x,width*x,85*x);

ctx.font = `bold ${fSize8*x}px Roboto Bold`;
ctx.fillStyle=fontColorL;
if(labels[index]=="TEMPORARY PASS"){
	ctx.fillText(labels[index],(c1fx+150)*x,(c1fy+137+ty)*x);
}else{
	ctx.fillText(labels[index],(c1fx+244)*x,(c1fy+137+ty)*x);
}

//ctx.fillText('TEBMA SHIPYARDS LTD',418,134);

margin1 = 21

let img2 = new Image();
img2.src=data.photo

img2.addEventListener('load',()=>{

ctx.drawImage(img2, (c1fx+margin1)*x,(c1fy+239)*x,214*x,274*x);

},false);

ctx.fillStyle='black';
ctx.fillRect((c1fx+margin1)*x,(c1fy+516)*x,214*x,27*x);

ctx.font = `${fSize5*x}px Roboto Regular`;
ctx.fillStyle=fontColorL;
ctx.fillText('VISITOR ID',(c1fx+42)*x,(c1fy+518+ty)*x);

ctx.font = `bold ${fSize5*x}px Roboto Bold`;
ctx.fillStyle=fontColorL;
ctx.fillText(data.visitorId,(c1fx+141)*x,(c1fy+518+ty)*x);


//QR Code


const options = {
	"errorCorrectionLevel":"H",
	quality:1,
	color:{
		dark:"#000000FF",
		light:"#FFFFFF00"
	}
}


qrCode.toDataURL(`${data.visitorPassNo}_${type}`,options,(err,url)=>{

let img3 = new Image();
img3.src=url;//"../source/img--qr.png"

img3.addEventListener('load',()=>{

ctx.drawImage(img3, (c1fx+666)*x,(c1fy+230)*x,165*x,165*x);

},false);

})

ctx.fillStyle=bGroupColor;
ctx.fillRect((c1fx+684)*x,(c1fy+481)*x,144*x,74*x);

ctx.fillStyle=bColorPurpose;
ctx.fillRect((c1fx+0)*x,(c1fy+779)*x,width*x,90*x);

// ctx.fillStyle=bColorIssued;
// ctx.fillRect((c1fx+0)*x,(c1fy+869)*x,317*x,63*x);

ctx.fillStyle=bColorIssued;
ctx.fillRect((c1fx+0)*x,(c1fy+869)*x,(width*0.4)*x,63*x);

ctx.fillStyle=bColorPass;
ctx.fillRect((c1fx+(width*0.4))*x,(c1fy+869)*x,(width*0.6)*x,63*x);

ctx.fillStyle=bColorPermit;
ctx.fillRect((c1fx+0)*x,(c1fy+932)*x,width*x,217*x);



margin2 = 260;

ctx.font = `${fSize5*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText('IN',(c1fx+margin2)*x,(c1fy+251)*x);
ctx.fillText('UPTO',(c1fx+margin2)*x,(c1fy+296)*x);
ctx.fillText('UCSL',(c1fx+margin2)*x,(c1fy+405)*x);
ctx.fillText('CONTACT',(c1fx+margin2)*x,(c1fy+427)*x);
ctx.fillText('DEPT',(c1fx+margin2)*x,(c1fy+461)*x);
ctx.fillText('CONTACT',(c1fx+margin2)*x,(c1fy+501)*x);
ctx.fillText('NO',(c1fx+margin2)*x,(c1fy+523)*x);

ctx.fillText('NAME',(c1fx+margin1)*x,(c1fy+582)*x);
ctx.fillText('COMPANY',(c1fx+margin1)*x,(c1fy+645)*x);
ctx.fillText('NAME',(c1fx+margin1)*x,(c1fy+667)*x);
ctx.fillText('PURPOSE',(c1fx+margin1)*x,(c1fy+802)*x);
ctx.fillText('OF VISIT',(c1fx+margin1)*x,(c1fy+824)*x);
ctx.fillText('ISSUED AT',(c1fx+margin1)*x,(c1fy+892+ty)*x);

ctx.font = `${fSize5*x}px Roboto Regular`;
ctx.fillStyle=fontColorL;
ctx.fillText('BLOOD GROUP',(c1fx+692)*x,(c1fy+487+ty)*x);
ctx.fillText('PASS NO',(c1fx+(width*0.4)+10)*x,(c1fy+892+ty)*x);





margin3 = 354;

ctx.font = `bold ${fSize11*x}px Roboto Bold`;
ctx.fillStyle=fontColor;
ctx.fillText(getPassDateTime(data.inTime),(c1fx+margin3)*x,(c1fy+247)*x);
ctx.fillText(getIndiaDate(jsonToLocalDate(data.validUpto)),(c1fx+margin3)*x,(c1fy+292)*x);

ctx.font = `bold ${fSize4*x}px Roboto Bold`;
ctx.fillStyle=fontColor;
ctx.fillText(data.tebmaContactPerson.toUpperCase(),(c1fx+margin3)*x,(c1fy+415)*x);
ctx.fillText(data.tebmaContactDept.toUpperCase(),(c1fx+margin3)*x,(c1fy+458)*x);
ctx.fillText(data.tebmaContactPhoneNo,(c1fx+margin3)*x,(c1fy+503)*x);


if(passType!="Visitor"){

	drawLine('TYPE',"Roboto Regular",fSize5,fontColor,margin2,341,ctx,c1fx,c1fy);
	//drawLine(data.passType.toUpperCase(),"Roboto Bold",fSize11,fontColor,margin3,337,ctx,c1fx,c1fy);
	drawMultiLine(data.passType.toUpperCase(),"Roboto Bold",fSize11,fontColor,18,margin3,337,ctx,c1fx,c1fy);
}



ctx.font = `bold ${fSize10*x}px Roboto Bold`;
ctx.fillStyle=fontColorL;
ctx.fillText(data.bloodGroup,(c1fx+730)*x,(c1fy+510+ty)*x);




margin4 = 130;

ctx.font = `bold ${fSize12*x}px Roboto Bold`;
ctx.fillStyle=fontColor;
ctx.fillText(data.visitorName.toUpperCase(),(c1fx+margin4)*x,(c1fy+577)*x);


ctx.font = `bold ${fSize14*x}px Roboto Bold`;
ctx.fillStyle=fontColor;
ctx.fillText(data.visitorPassIssuedAt.toUpperCase(),(c1fx+margin4)*x,(c1fy+890+ty)*x);



ctx.font = `bold ${fSize2*x}px Roboto Bold`;
ctx.fillStyle=fontColorL;
ctx.fillText(data.visitorPassNo,(c1fx+456)*x,(c1fy+883+ty)*x);


ctx.font = `bold ${fSize4*x}px Roboto Bold`;
ctx.fillStyle=fontColor;

const string = "SAGAR PLACE, 10TH CROSS, KM MARG, NEAR CITY CENTRE, MANGALORE - 575001";

drawMultiLine(data.companyName.toUpperCase(),"Roboto Bold",fSize14,fontColor,45,margin4,644,ctx,c1fx,c1fy);

drawMultiLine(data.purposeOfVisit.toUpperCase(),"Roboto Bold",fSize13,fontColor,50,margin4,792,ctx,c1fx,c1fy);

drawMultiLine(getNormalString(data.visitorPassPermittedAreas.toUpperCase()),"Roboto Regular",fSize13,fontColorL,55,margin4,946,ctx,c1fx,c1fy);

drawLine('PERMITTED',"Roboto Regular",fSize6,fontColorL,margin1,973,ctx,c1fx,c1fy);
ctx.fillText('AREAS',(c1fx+margin1)*x,(c1fy+993)*x);

const margin5=35;

const fSAddress = 22;
const fSBackLabel = 20;
const fSBackDesc = 28;


drawLine('ADDRESS',"Roboto Regular",fSBackLabel,fontColor,margin5,42,ctx,c1bx,c1by);
ctx.fillText('CONTACT NO',(c1bx+margin1)*x,(c1by+193)*x);
ctx.fillText('EMG CONTACT NO',(c1bx+328)*x,(c1by+193)*x);
ctx.fillText('AGE',(c1bx+609)*x,(c1by+193)*x);

ctx.fillText('DESIGNATION',(c1bx+margin1)*x,(c1by+293)*x);
ctx.fillText('ID DETAILS',(c1bx+margin1)*x,(c1by+393)*x);




drawMultiLine(data.address.toUpperCase(),"Roboto Bold",fSAddress,fontColor,60,margin5,78,ctx,c1bx,c1by);

drawLine(data.contactNo,"Roboto Bold",fSBackDesc,fontColor,margin5,224,ctx,c1bx,c1by);
ctx.fillText(data.emgContactNo,(c1bx+328)*x,(c1by+224)*x);
ctx.fillText(getAge(data.dateOfBirth),(c1bx+609)*x,(c1by+224)*x);
ctx.fillText(data.designation.toUpperCase(),(c1bx+margin5)*x,(c1by+324)*x);
ctx.fillText(data.photoIdType.toUpperCase()+" / "+data.photoIdNo,(c1bx+margin5)*x,(c1by+424)*x);

console.log(data.gadgetApplicability);

if(data.gadgetApplicability=="Yes"){
	drawLine('GADGET DETAILS',"Roboto Regular",fSBackLabel,fontColor,margin5,493,ctx,c1bx,c1by);
	drawLine(data.gadgetType.toUpperCase()+" / "+data.gadgetDesc.toUpperCase()+" / "+data.gadgetSlNo.toUpperCase(),"Roboto Bold",fSBackDesc,fontColor,margin5,524,ctx,c1bx,c1by);
}

if(data.vehicleApplicability=="Yes"){
	drawLine("VEHICLE DETAILS","Roboto Regular",fSBackLabel,fontColor,margin5,593,ctx,c1bx,c1by);
	drawLine(data.vehicleType.toUpperCase()+" / "+data.vehicleName.toUpperCase()+" / "+data.vehicleRegNo.toUpperCase(),"Roboto Bold",fSBackDesc,fontColor,margin5,624,ctx,c1bx,c1by);

}



const bColorSign = "rgb(235, 230, 230)";


ctx.fillStyle=bColorSign;
ctx.fillRect((c1bx+0)*x,(c1by+737)*x,width*x,198*x);

ctx.fillStyle=bColorPass;
ctx.fillRect((c1bx+0)*x,(c1by+935)*x,width*x,213*x);


drawLine('SIGNATURES:',"Roboto Regular",fSize5,fontColor,margin5,752,ctx,c1bx,c1by);


drawLine('VISITOR',"Roboto Bold",fSize5,fontColor,80,898,ctx,c1bx,c1by);
ctx.fillText('SECURITY',(c1bx+378)*x,(c1by+898)*x);
ctx.fillText('CONTACT',(c1bx+671)*x,(c1by+897)*x);

drawLine('IN CASE OF EMERGENCY PLEASE CONTACT',"Roboto Regular",fSize5,fontColorL,221,948+ty,ctx,c1bx,c1by);
drawLine('+91 8202538600',"Roboto Bold",fSize3,fontColorL,227,984+ty,ctx,c1bx,c1by);
/*

ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText('NAME',(c1fx+32)*x,(c1fy+542)*x);

ctx.font = `bold ${fSize2*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(data.personName.toUpperCase(),(c1fx+32)*x,(c1fy+567)*x);

ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText('CONTRACTOR NAME',(c1fx+32)*x,(c1fy+623)*x);

ctx.font = `bold ${fSize4*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(data.contractorName.toUpperCase(),(c1fx+32)*x,(c1fy+650)*x);

ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText('TRADE NAME',(c1fx+32)*x,(c1fy+700)*x);

ctx.font = `bold ${fSize4*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(data.tradeName.toUpperCase(),(c1fx+32)*x,(c1fy+722)*x);

ctx.fillStyle =bGroupColor;
ctx.fillRect((c1fx+0)*x,(c1fy+767)*x,160*x,83*x);

ctx.font=`${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColorL;
ctx.fillText('BLOOD GROUP',(c1fx+12)*x,(c1fy+772)*x);

ctx.font=`${fSize3*x}px Roboto Bold`;
ctx.fillStyle=fontColorL;
ctx.fillText(data.bloodGroup,(c1fx+53)*x,(c1fy+797)*x);

ctx.fillStyle =idColor;
ctx.fillRect((c1fx+160)*x,(c1fy+767)*x,390*x,83*x);

ctx.font=`${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColorL;
ctx.fillText('ID NO',(c1fx+323)*x,(c1fy+772)*x);

ctx.font=`${fSize3*x}px Roboto Bold`;
ctx.fillStyle=fontColorL;
ctx.fillText(data.personId,(c1fx+240)*x,(c1fy+797)*x);


const img3a = new Image();
img3a.src = "../source/img--vText.png"

img3a.addEventListener('load',()=>{

	ctx.drawImage(img3a,(c1fx+526)*x,(c1fy+439)*x,12*x,309*x);


},false);


ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText('DATE OF BIRTH',(c1bx+margin2)*x,(c1by+37)*x);

ctx.font = `bold ${fSize4*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(getIndiaDate(jsonToLocalDate(data.dateOfBirth)),(c1bx+margin2)*x,(c1by+62)*x);

ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText('DATE OF JOINING',(c1bx+margin2)*x,(c1by+119)*x);

ctx.font = `bold ${fSize4*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(getIndiaDate(jsonToLocalDate(data.dateOfJoining)),(c1bx+margin2)*x,(c1by+144)*x);

ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText('DATE OF EXPIRY',(c1bx+margin3)*x,(c1by+119)*x);

ctx.font = `bold ${fSize4*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(getIndiaDate(jsonToLocalDate(data.dateOfCardExpiry)),(c1bx+margin3)*x,(c1by+144)*x);


ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText('ADDRESS',(c1bx+margin2)*x,(c1by+199)*x);

//For Multiple Line

const address = data.permanentAddress;

ctx.font = `bold ${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;

const vGap = fSize1+4;
const d = 46;

const multiple = address.length/d;

let in1 = 0;
let in2 = d;

for(a1=0;a1<multiple;a1++){

	const line = address.slice(in1,in2);

	ctx.fillText(line.toUpperCase(),(c1bx+margin2)*x,(c1by+224+(vGap*a1))*x);

	in1+=d;
	in2+=d;

};

//

ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText('CONTACT NO',(c1bx+margin2)*x,(c1by+334)*x);

ctx.font = `bold ${fSize4*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(data.contactNo,(c1bx+margin2)*x,(c1by+359)*x);

ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText('EMG CONTACT NO',(c1bx+margin3)*x,(c1by+334)*x);

ctx.font = `bold ${fSize4*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(data.emgContactNo.toUpperCase(),(c1bx+margin3)*x,(c1by+359)*x);

ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText('ESI/INSURANCE NO',(c1bx+margin2)*x,(c1by+432)*x);
ctx.font = `bold ${fSize4*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(data.hInsuranceNo,(c1bx+margin2)*x,(c1by+457)*x);




ctx.font = `bold ${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText('AUTHORIZED SIGNATORY',(c1bx+281)*x,(c1by+588)*x);


ctx.fillStyle=bandColor2;
ctx.fillRect((c1bx+0)*x,(c1by+633)*x,550*x,159*x);

ctx.font = `bold ${fSize5*x}px Roboto Regular`;
ctx.fillStyle=fontColorL;
ctx.fillText('NOTES',(c1bx+245)*x,(c1by+641)*x);

const margin4 = 18;

ctx.font = `${fSize7*x}px Roboto Regular`;
ctx.fillStyle=fontColorL;
ctx.fillText('1. THIS CARD IS NOT TRANSFERRABLE.',(c1bx+margin4)*x,(c1by+672)*x);
ctx.fillText('2. THIS CARD SHOULD BE DISPLAYED AT TSL OFFICE/YARD PREMISES ONLY.',(c1bx+margin4)*x,(c1by+698)*x);
ctx.fillText('3. LOSS OF CARD SHOULD BE INFORMED TO THE ISSUING AUTHORITY.',(c1bx+margin4)*x,(c1by+725)*x);
ctx.fillText('4. NEW CARD CAN BE OBTAINED ON A FINE OF RS.500/-',(c1bx+margin4)*x,(c1by+750)*x);




ctx.fillStyle=bandColor3;
ctx.fillRect((c1bx+0)*x,(c1by+792)*x,550*x,58*x);


ctx.font = `${fSize7*x}px Roboto Regular`;
ctx.fillStyle=fontColorL;
ctx.fillText('IF FOUND PLEASE RETURN TO, SECURITY OFFICE, TEBMA SHIPYARDS LIMITED,',(c1bx+21)*x,(c1by+803)*x);
ctx.fillText('MALPE HARBOUR COMPLEX, MALPE, KARNATAKA, 576108',(c1bx+50)*x,(c1by+823)*x);
*/

}//end of for(i of datas);
}



btnPrint.addEventListener('click',()=>{
		console.log("here")

	//console.log(appDataMap["card"]);

	appDataMap["card"] =(appDataMap["orientation"]=="landscape")?canvas.toDataURL('image/png'):canvasP.toDataURL('image/png');

if(appDataMap["orientation"]=="landscape"){
	console.log("here")

	printer({printable:appDataMap["card"], type:'image',style:['@page {margin:0mm;size:A4 landscape;} body{margin:0;padding:0;} @media print{html,body{height:100%;overflow:hidden;}}']});

}else{
	printer({printable:appDataMap["card"], type:'image',style:['@page {page:A4;margin:0mm;size:portrait;} body{margin:0;} @media print{html,body{max-height:100%}}']});

}
	

	//printer({printable:appDataMap["card"], type:'pdf', base64:true});
	//printer({printable:appDataMap["card"], type:'image',imageStyle:{width:"100%",height:"auto"}});
	//printer({printable:'canvas-card', type:'html'});

	//printer({printable:appDataMap["card"], type:'image'});
	//window.print();
	
	//printer({printable:'canvas-card', type:'html',style:['@page {page:A4;margin:0mm;} body{margin:0;} @media print{html,body{max-height:100%}}']});
	
	//printer({printable:appDataMap["card"], type:'image'});


});









function jsonToLocalDate(jsonDateString){

	const offset = new Date().getTimezoneOffset();

	console.log(offset);

	const date = new Date(jsonDateString);

	const actualDateInMilli = date.getTime()-(offset*60*1000);


	return(new Date(actualDateInMilli));


}


function getPassDateTime(dateTime){

	const hours = to2Digits(dateTime.getHours());
	const minutes = to2Digits(dateTime.getMinutes());

	const date = getIndiaDate(dateTime);

	return hours+":"+minutes+"/"+date;

}


function getFormattedDate(date){

	const day = to2Digits(date.getDate());
	const month = to2Digits(date.getMonth()+1);
	const year= date.getFullYear();



	return year+"-"+month+"-"+day;


}


function getIndiaDate(date){

	const day = to2Digits(date.getDate());
	const month = to2Digits(date.getMonth()+1);
	const year= date.getFullYear();


	return day+"-"+month+"-"+year;

}


 function to2Digits(number){

	if(number<10){
	  return "0"+number;
	}else if(number>=10 && number <100){
	  return number;
	}

}


function drawLine(string,fontName,fontSize,fontColor,xMargin,yStart,ctx,xFactor,yFactor){

	ctx.font = `${fontSize*x}px ${fontName}`;
	ctx.fillStyle=fontColor;
	ctx.fillText(string,(xFactor+xMargin)*x,(yFactor+yStart)*x);

}




function drawMultiLine(string,fontName,fontSize,fontColor,maxLength,
	xMargin,yStart,ctx,xFactor,yFactor){

	//ctx = canvas.getContext('2d');
	//ctx.textBaseline="top";

	ctx.font = `${fontSize*x}px ${fontName}`;
	ctx.fillStyle=fontColor;

	const vGap = fontSize+4;

	let line = "";
	let count=0;

	let value = string;



	while(value.length!=0){

		const max = (value.length>maxLength)?maxLength:value.length;
		const tLine = value.slice(0,max);

		const tArray = getSpaceIndexArray(tLine.split(""));
		const index = tArray[tArray.length-1];

		console.log(index);

		if(index>(max-15) && max!=value.length){

			line = (tLine[index]!=" ")?tLine.slice(0,index+1):tLine.slice(0,index);
			value = value.substring(index+1);

		}else{

			line = tLine.slice(0,max);
			value = value.substring(max);

		}

		console.log(x);


		ctx.fillText(line.toUpperCase(),(xFactor+xMargin)*x,(yFactor+yStart+(vGap*count))*x);

		count++;

		console.log(value);
		console.log(c1bx);
		console.log(xMargin);


	}

}


		function getSpaceIndexArray(array){

			const rArray=[];
			const filters = [" ","-",","];

			for(a1=0;a1<array.length;a1++){

				if(filters.includes(array[a1])){

					rArray.push(a1);

				}

			}

			return rArray;


		}


		    function getAge(dateOfBirth){

            	const d1= new Date(dateOfBirth);
            	const d2 = new Date();


            	if(d2.getMonth()-d1.getMonth()>0){
            		return d2.getFullYear() - d1.getFullYear();
            	}else if(d2.getMonth()-d1.getMonth()==0){

            		if(d2.getDate()-d1.getDate()>=0){
						return d2.getFullYear() - d1.getFullYear()
            		}else{
            			return d2.getFullYear() - d1.getFullYear()-1
            		}

            	}else{
            		return d2.getFullYear() - d1.getFullYear()-1
            	}

            

            }




function getNormalString(string){

	return string.split(/\,/).join(", ");
}




/*
	while(index<value.length){

		d1=(d1<value.length)?d1:0;


		for(x=0;x<tArray.length;x++){

			const value= tArray[x];

			if(value==" "){

				if(x>d1 && x<d2){

					index = x;

					d1 = d1+dMin;
					d2 = d2+dMax;

					line = value.slice(d,index); 

					d=index;

					break;

				}else{

					line = value.slice(d,d2); 

					d1 = d1+dMin;
					d2 = d2+dMax;
					d=d2;


				}

			}

		}

	}


	const multiple = address.length/d;

	let in1 = 0;
	let in2 = d;

	for(a1=0;a1<multiple;a1++){

		const line = address.slice(in1,in2);

		ctx.fillText(line.toUpperCase(),(c1bx+margin2)*x,(c1by+224+(vGap*a1))*x);

		in1+=d;
		in2+=d;

}

*/

