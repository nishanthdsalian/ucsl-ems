<?php



include 'database.php';


if(isset($_POST['submitA'])){

	if(!empty($_POST['id']) && !empty($_POST['name']) && !empty($_POST['contractor-name']) && !empty($_POST['dob']) && !empty($_POST['image'])){

		$id = $_POST['id'];
		$name = $_POST['name'];
		$contractorName = $_POST['contractor-name'];
		$dob = $_POST['dob'];
		$photo = $_POST['image'];

		$query = "insert into contractor_data(id,name,contractorName,dob,photo) values('$id','$name','$contractorName','$dob','$photo')";

		$run= mysqli_query($conn,$query) or die(mysqli_error());

		if($run){
			echo 'Data inserted succesfully';
		}else{
			echo 'Data not inserted';
		}


	}else{
		echo 'Please input all fields';
	}

}else{
	echo 'non standard';
}

	?>