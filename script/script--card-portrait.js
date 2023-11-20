const qrCode = require('qrcode');
const printer = require('print-js');

const canvas = document.getElementById('canvas-card');
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

const btnPrint = document.getElementById("btn-print");

const appDataMap={};


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
}];



const height = 850;
const width = 550;

const hFrameSpace = width+10;
const vFrameSpace = height+10;

const marginX =30;
const marginY = 30;

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

const fontColor = "rgb(16, 67, 89)";
const fontColorL = "rgb(255, 255, 255)";
const bandColor = "rgb(235,230,107)";
const bGroupColor = "rgb(176, 66, 66)";
const bandColor2 = "rgb(48,89,107)";
const bandColor3 = "rgb(27,127,170)";
const idColor = "rgb(61,66,169)";
const fSize1= 20;
const fSize2 = 30;
const fSize3 = 42;
const fSize4 = 24;
const fSize5 = 18;
const fSize6 = 16;
const fSize7 = 14;
const fSize8 = 48;
const fSize9 = 10;


const margin2 = 21;
const margin3 = 240;




ipcRenderer.on('data-input',(event,datas)=>{
	console.log("hello");
	console.log(datas);



let f = new FontFace('Roboto Regular', 'url(../source/fonts/Roboto-Regular.ttf)');


f.load().then(function(font){

document.fonts.add(font);



drawId();



});//end of font


/*

canvas.toDataURL('image/png');

//appDataMap["card"] = canvas.toDataURL('image/jpg');

canvas.toBlob((blob)=>{

	const img = document.createElement("img");

	url = URL.createObjectURL(blob);

	img.onload = function(){

		URL.revokeObjectURL(url);
	}

			img.src = url;

	document.body.appendChild(img);


},'img/png',1);

*/

//document.write('<img src="'+img+'"/>');
//canvas.download();



}); // end of ipcRendered



btnPrint.addEventListener('click',()=>{

	//console.log(appDataMap["card"]);

	appDataMap["card"] = canvas.toDataURL('image/png');

	//printer({printable:appDataMap["card"], type:'pdf', base64:true});
	//printer({printable:appDataMap["card"], type:'image',imageStyle:{width:"100%",height:"auto"}});
	//printer({printable:'canvas-card', type:'html'});

	//printer({printable:appDataMap["card"], type:'image'});
	//window.print();
	
	//printer({printable:'canvas-card', type:'html',style:['@page {page:A4;margin:0mm;} body{margin:0;} @media print{html,body{max-height:100%}}']});
	printer({printable:appDataMap["card"], type:'image',style:['@page {page:A4;margin:0mm;} body{margin:0;} @media print{html,body{max-height:100%}}']});

});




function drawId(){

const x=1.2;

for(i=0;i<datas.length;i++){

const data = datas[i];

const c1fx = marginX;
const c1fy= marginY+(height*i);
const c1bx= c1fx+(width*1)+10;
const c1by= c1fy;

console.log(i);
console.log(c1fy);
console.log(c1by);


let img = new Image();
img.src="../source/img--tebma.png"


img.addEventListener('load',()=>{

ctx.drawImage(img, (c1fx+150)*x,(c1fy+22)*x,240*x,75*x);

},false);


const ctx = canvas.getContext('2d');
ctx.textBaseline="top";

ctx.fillStyle=bandColor;
ctx.fillRect((c1fx+0)*x,(c1fy+117)*x,width*x,85*x);

ctx.font = `bold ${fSize8*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText('CONTRACTOR PASS',(c1fx+55)*x,(c1fy+137)*x);
//ctx.fillText('TEBMA SHIPYARDS LTD',418,134);

let img2 = new Image();
img2.src=data.photo

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


qrCode.toDataURL(data.personId,options,(err,url)=>{

let img3 = new Image();
img3.src=url;//"../source/img--qr.png"

img3.addEventListener('load',()=>{

ctx.drawImage(img3, (c1fx+320)*x,(c1fy+284)*x,163*x,163*x);

},false);

})




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

ctx.font=`${fSize3*x}px Roboto Regular`;
ctx.fillStyle=fontColorL;
ctx.fillText(data.bloodGroup,(c1fx+53)*x,(c1fy+797)*x);

ctx.fillStyle =idColor;
ctx.fillRect((c1fx+160)*x,(c1fy+767)*x,390*x,83*x);

ctx.font=`${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColorL;
ctx.fillText('ID NO',(c1fx+323)*x,(c1fy+772)*x);

ctx.font=`${fSize3*x}px Roboto Regular`;
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
ctx.fillText(data.dateOfBirthIndia,(c1bx+margin2)*x,(c1by+62)*x);

ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText('DATE OF JOINING',(c1bx+margin2)*x,(c1by+119)*x);

ctx.font = `bold ${fSize4*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(data.dateOfJoiningIndia,(c1bx+margin2)*x,(c1by+144)*x);

ctx.font = `${fSize1*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText('DATE OF EXPIRY',(c1bx+margin3)*x,(c1by+119)*x);

ctx.font = `bold ${fSize4*x}px Roboto Regular`;
ctx.fillStyle=fontColor;
ctx.fillText(data.dateOfCardExpiryIndia,(c1bx+margin3)*x,(c1by+144)*x);


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
ctx.fillText('2. THIS CARD SHOULD BE DISPLAYED AT TSL OFFICE/YARD PREMISES ONLY.',(c1bx+margin4)*x,(c1by+698)*x);
ctx.fillText('3. LOSS OF CARD SHOULD BE INFORMED TO THE ISSUING AUTHORITY.',(c1bx+margin4)*x,(c1by+725)*x);
ctx.fillText('4. NEW CARD CAN BE OBTAINED ON A FINE OF RS.500/-',(c1bx+margin4)*x,(c1by+750)*x);




ctx.fillStyle=bandColor3;
ctx.fillRect((c1bx+0)*x,(c1by+792)*x,550*x,58*x);


ctx.font = `${fSize7*x}px Roboto Regular`;
ctx.fillStyle=fontColorL;
ctx.fillText('IF FOUND PLEASE RETURN TO, SECURITY OFFICE, TEBMA SHIPYARDS LIMITED,',(c1bx+21)*x,(c1by+803)*x);
ctx.fillText('MALPE HARBOUR COMPLEX, MALPE, KARNATAKA, 576108',(c1bx+50)*x,(c1by+823)*x);

}//end of for(i of datas);


}