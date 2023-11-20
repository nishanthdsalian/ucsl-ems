<?php


include "database.php";

mysqli_select_db($conn,"contractor_data");

$qName = $_POST['qName'];

//$qName="Nishanth";

$qry = "SELECT * FROM `contractor_data` WHERE name = '".$qName."'";

//$qry = "SELECT * FROM `contractor_data`";

$raw = mysqli_query($conn,$qry);

$data=array();

while($res=mysqli_fetch_object($raw)){
	//$data[]=$res;
	array_push($data, $res);

}

print json_encode($data);


	?>