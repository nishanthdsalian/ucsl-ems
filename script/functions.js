
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


 function to2Digits(number){

if(number<10){
  return "0"+number;
}else if(number>=10 && number <100){
  return number;
}

}




function getDate(){

	const date = new Date();

	return date.getFullYear()+"-"+to2Digits((date.getMonth()+1))+"-"+date.getDate();



}


function getfutureDate(daysAdded){

	return new Date(new Date().getTime()+(daysAdded*24*60*60*1000));

}