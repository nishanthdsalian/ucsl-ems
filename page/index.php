
<html>
<head>
	<link rel="stylesheet" type="text/css" href="../style/style--index.css">
</head>

<body>

<div id="selection" class="c-flex">

	<button id="btn-add" onclick="btnPress(this)">Enter Details</button>
	<button id="btn-view" onclick="btnPress(this)">View Details</button>

</div>



<div id="add" class="c-flex">

<div class="c-flex-col">
	Please Click on the button below to start your webcam.


<div>

<video id="video"> </video>
<button id="startBtn">Initiate</button>

</div>

<canvas id="canvas" style="display: none;">
</canvas>


<div class="img-box">

	<img id="img">

</div>

</div>
<!--
<form id="input-form" action='../php/upload.php' method='POST'> 
-->

<form id="input-form"> 

<label for="name">Name</label>
<input type="text" name="name">

<label for="dob">Date of Birth</label>
<input type="date" name="dob">

<label for="id">Contractor ID</label>
<input type="text" name="id">

<label for="contractor-name">Contractor Name</label>
<input type="text" name="contractor-name">

<input type="submit" name="submit1" value="submit">

</form>

<button id="form-btn"> Send</button>


</div>


<div id="view" class="view-grid">

<?php

include '../php/database.php';

$query="SELECT * FROM contractor_data WHERE id='232'";

$run = mysqli_query($conn,$query) or die(mysqli_error());

$data = mysqli_fetch_array($run);



echo '<div class="label c-flex">Name</div>
<div id="display-name" class="desc c-flex" >'.$data['name'].'</div>

<div class="label c-flex">Contractor Name</div>
<div id="display-contractor-name" class="desc c-flex" >'.$data['contractorName'].'</div>

<div class="label c-flex">Date of Birth</div>
<div id="display-dob" class="desc c-flex" >'.$data['dob'].'</div>

<div class="label c-flex">ID</div>
<div id="display-id" class="desc c-flex" >'.$data['id'].'</div>

<div class="label c-flex">Photo</div>
<img id="display-photo" src="'.$data['photo'].'" >'

?>

</div>



</body>
<script>

	//Display Control

	const buttonCont = document.getElementById("selection");

	const btnAdd = document.getElementById("btn-add");
	const btnView = document.getElementById("btn-view");

	const addCont = document.getElementById("add");
	const viewCont = document.getElementById("view");


	const hiddenConts=[addCont,viewCont];

	for(x=0;x<hiddenConts.length;x++){

		hiddenConts[x].style.display="none";

	}

/*
	const buttons = [btnAdd,btnView];

		for(x=0;x<buttons.length;x++){

			buttons[x].addEventListener('click',function(){

				const view = (buttons[x]==btnAdd)?addCont:viewCont;

				 view.style.display="block";

			})


		}
*/

function btnPress(elem){



				const view = (elem.id=="btn-add")?addCont:viewCont;
				const view2 = (elem.id=="btn-add")?viewCont:addCont;

				 view.style.display="block";
				 view2.style.display="none";


}


	const appDataMap={};



	var width = 320;
	var height=0;

	var streaming=false;

	var video= null;
	var canvas = null;
	var photo = null;
	var btn = null;


		video= document.getElementById("video");
		canvas = document.getElementById("canvas");
		photo = document.getElementById("img");
		btn = document.getElementById("startBtn");


		navigator.mediaDevices.getUserMedia({video:true, audio:false})
		.then(function(stream){
			video.srcObject = stream;

			video.play();

		}).catch((error)=>{
			console.log("Error = " + error.message);
		});



				video.addEventListener('canplay',function(ev){

				if(!streaming){

				height = video.videoHeight / (video.videoWidth/width);

				video.setAttribute('width', width);
				video.setAttribute('height',height);
				canvas.setAttribute('width',width);
				canvas.setAttribute('height',height);

				streaming=true;

				}
			},false);



			btn.addEventListener('click',function(ev){
				takePicture();
				ev.preventDefault();
			},false);






	function clearPhoto(){

		var context = canvas.getContext('2d');
		context.fillStyle="#AAA";
		context.fillRect(0, 0, canvas.width, canvas.height);

		var data = canvas.toDataURL('image/jpg',1);
		photo.setAttribute('src',data);
	}


	function takePicture(){

		console.log("hi");

		var context = canvas.getContext('2d');

		if(width && height){
			canvas.width=width;
			canvas.height=height;
			context.drawImage(video,0,0,width,height);

			

/*
			var data = canvas.toBlob(function(blob){
				const url= URL.createObjectURL(blob);

				photo.src = url;
				appDataMap["photo"] = url;

			});
*/
		var data = canvas.toDataURL('image/png');
		photo.setAttribute('src',data);
		appDataMap["photo"] = data;

		}else{
			clearPhoto();
		}
	}



const inputForm = document.getElementById("input-form");
const formBtn = document.getElementById("form-btn");

/*

formBtn.addEventListener('click',function(){

	const formData = new FormData(inputForm);

	console.log(formData);

})

*/



inputForm.addEventListener('submit',function(e){

	const imageInput = document.createElement('input');
	imageInput.type='hidden';
	imageInput.name='image';
	imageInput.value=appDataMap["photo"];

	inputForm.appendChild(imageInput);


	const submitInput = document.createElement('input');
	submitInput.type='hidden';
	submitInput.name='submitA';
	submitInput.value='done'; 

	inputForm.appendChild(submitInput);

	const inputFormData = new FormData(inputForm);

	//inputFormData.append('image','new');

	const formEntries = Object.fromEntries(inputFormData.entries());
	
	e.preventDefault();

	console.log(formEntries);

	inputForm.method='POST';
	inputForm.action='../php/upload.php'

	inputForm.submit();

});




</script>





</html>