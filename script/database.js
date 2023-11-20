

module.exports={
	dbConfig:{
		host:"127.0.0.1",
		user:"root",
		password:"",
		port:3306,
		database:"tebma_one_testing"
	},
	// 	dbConfig:{
	// 	host:"172.30.10.200",
	// 	user:"root",
	// 	password:"@Ucsl@1234",
	// 	port:3306,
	// 	database:"ems_app"
	// },
	handleError:function(con){

	con.connect(function(err){
		if(err){
			console.log('error connecting to db');
			setTimeout(handleError,2000);
		}
	});


	con.on('error',function(err){

		console.log("db Error");

		if(err.code==='PROTOCOL_CONNECTION_LOST'){
			handleError(con);
		}else if(err.code==='ECONNRESET'){
			handleError(con);
		}else{
			throw(err);
		}
	})

	}
};





//Hostinger Credentials

/*

		host:"localhost",
		user:"u659559513_ncode",
		password:"Password@1234",
		database:"u659559513_testing"
	


	*/