CREATE TABLE contractor_data(
	contractorId VARCHAR(10) PRIMARY KEY,
	contractorName	VARCHAR(50) NOT NULL,
	department	VARCHAR(100),
	dateOfIncorporation	DATE,
	bankAccountNo	VARCHAR(25),
	bankName	VARCHAR(50),
	bankIfscCode	VARCHAR(11),
	registeredAddress	VARCHAR(150),
	localAddress	VARCHAR(150),
	localRepName	VARCHAR(50),
	localRepContactNo	VARCHAR(15),
	contractorEmail	VARCHAR(30),
	contractorContactNo	VARCHAR(15),
	logo	MEDIUMTEXT,
	contractorStatus ENUM('Temporary','Approved'),
	isHeld ENUM ('Yes','No'),
	creationDate	DATE,
	modificationDate	DATE

)ENGINE=INNODB;


CREATE TABLE contractor_person_data(

personId	VARCHAR(10) PRIMARY KEY,
personName	VARCHAR(50) NOT NULL,
personSlNo	VARCHAR(10) NOT NULL,
contractorName	VARCHAR(50),
contractorId	VARCHAR(10) NOT NULL,
tradeName	VARCHAR(20),
dateOfBirth	DATE,
dateOfJoining	DATE,
dateOfCardRenewal DATE,
dateOfCardExpiry DATE,
localAddress	VARCHAR(200),
permanentAddress	VARCHAR(200),
bloodGroup	ENUM ('A+','A-','B+','B-','AB+','AB-','O+','O-'),
gender	ENUM('Male','Female','Transgender'),
fathersName	VARCHAR(50),
mothersName	VARCHAR(50),
nomineeName	VARCHAR(50),
maritalStatus	ENUM ('Single','Married'),
identificationMarks	VARCHAR(30),
contactNo	VARCHAR(15),
emgContactNo	VARCHAR(15),
wageRate	VARCHAR(20),
personType	ENUM ('Sub Contract Personnel','Service Engineer','Owner Rep','Foreign National'),
esiApplicability	ENUM ('Yes','No'),
epfApplicability	ENUM ('Yes','No'),
insuranceNo	VARCHAR(20),
esiNo	VARCHAR(20),
uan	VARCHAR(20),
passportDate DATE,
aadharNo VARCHAR(20),
gatePassFormSubmitted	ENUM ('Yes','No'),
workmenBioSubmitted	ENUM ('Yes','No'),
esiDeclSubmitted	ENUM ('Yes','No'),
epfDeclSubmitted	ENUM ('Yes','No'),
epfNomSubmitted		ENUM ('Yes','No'),
contractIntvwSubmitted	ENUM ('Yes','No'),
esiEpfUndSubmitted	ENUM ('Yes','No'),
empCompPackSubmitted	ENUM ('Yes','No'),
aadharCardSubmitted  ENUM ('Yes','No'),
polVerSubmitted	ENUM ('Yes','No'),
passportSubmitted	ENUM ('Yes','No'),
mediCertSubmitted	ENUM ('Yes','No'),
ageProofCertSubmitted	ENUM ('Yes','No'),
savBankSubmitted	ENUM ('Yes','No'),
dateOfTermination	DATE,
hseTrainingAttended	ENUM ('Yes','No'),
photo	MEDIUMTEXT,
isHeld ENUM('Yes','No'),
status	ENUM ('Active','Draft','Expired') NOT NULL,
creationDate	DATE,
modificationDate	DATE,
CONSTRAINT Fk_contractor_id
FOREIGN KEY(contractorId) REFERENCES contractor_data(contractorId) 
ON DELETE NO ACTION
ON UPDATE CASCADE

)ENGINE=INNODB;



CREATE TABLE user_data(
	userId VARCHAR(15) PRIMARY KEY,
	password VARCHAR(50) NOT NULL,
	department	VARCHAR(50),
	role VARCHAR(20),
	location ENUM ('Malpe','Babuthota','Hangarkatte'),
	logStatus ENUM ('loggedIn','loggedOut'),
	status	ENUM ('Active','Disabled'),
	creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	modificationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

)ENGINE=INNODB;


INSERT INTO user_data (userId,password,department,role,location,logStatus,status) VALUES('sc_user_2','password','Security','User','Hangarkatte','loggedOut','Active');



CREATE TABLE visitor_data(
visitorSlNo INT AUTO_INCREMENT UNIQUE,
visitorId VARCHAR(10) PRIMARY KEY,
visitorName	VARCHAR(50) NOT NULL,
companyName	VARCHAR(100),
designation	VARCHAR(50),
email VARCHAR(35),
dateOfBirth	DATE,
address	VARCHAR(100),
bloodGroup	ENUM ('A+','A-','B+','B-','AB+','AB-','O+','O-','NA'),
gender	ENUM('Male','Female','Transgender'),
nationality ENUM('Indian','Foreigner'),
contactNo	VARCHAR(15) NOT NULL,
emgContactNo	VARCHAR(15),
photo	MEDIUMTEXT,
status	ENUM ('Active','Hold','Draft'),
creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
modificationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)ENGINE=INNODB;


DELIMITER $$
CREATE TRIGGER `visitor_id_generate` BEFORE INSERT ON `visitor_data`
 FOR EACH ROW BEGIN

SET @tId = (SELECT visitorId FROM visitor_data WHERE visitorId=NEW.visitorId);

SET @lastId = (SELECT visitorId FROM visitor_data ORDER BY visitorId DESC LIMIT 1);
IF @lastId IS NULL OR @lastId="" THEN SET @lastId = 0;
END IF;

IF @tId IS NULL THEN
SET NEW.visitorId = CONCAT(LPAD(@lastId+1,6,0));
END IF;

END

$$
DELIMITER ;



CREATE TABLE visitor_pass_data(
visitorPassSlNo INT AUTO_INCREMENT UNIQUE,
visitorPassNo	VARCHAR(15) PRIMARY KEY,
visitorId VARCHAR(10) NOT NULL,
visitorName	VARCHAR(50) NOT NULL,
companyName	VARCHAR(100),
designation	VARCHAR(50),
purposeOfVisit	VARCHAR(50),
tebmaContactPerson VARCHAR(50),
tebmaContactDept VARCHAR(25),
tebmaContactPhoneNo VARCHAR(15),
passType ENUM ('Visitor','Service Engineer','Owner Rep'),
nationality ENUM('Indian','Foreigner'),
validUpto DATETIME,
visitorPassIssuedAt ENUM ('Malpe','Hangarkatte','Babuthota','Santhakatte'),  
visitorPassPermittedAreas VARCHAR(250),
photoIdType VARCHAR(20),
photoIdNo VARCHAR(30),
gadgetApplicability ENUM ('Yes','No'),  
vehicleApplicability ENUM ('Yes','No'),
visaApplicability ENUM ('Yes','No'),
emailDeptSubmitted ENUM ('Yes','No'),
safetyAwarenessAttended ENUM ('Yes','No'),
gadgetType VARCHAR(20),
gadgetDesc VARCHAR(30),
gadgetSlNo VARCHAR(30),
vehicleType VARCHAR(20),
vehicleName VARCHAR(20),
vehicleRegNo VARCHAR(15),
visaType VARCHAR(20),
visaNo VARCHAR(25),
visaValidity DATE,
dateOfIssue DATE,
passStatus	ENUM ('Active','Exit','Hold','Expired') NOT NULL,
inTime DATETIME,
outTime DATETIME, 
creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
modificationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT Fk_visitor_id FOREIGN KEY(visitorId) REFERENCES visitor_data(visitorId)  ON DELETE NO ACTION
)ENGINE=INNODB;


DELIMITER $$
CREATE TRIGGER `visitor_pass_no_generate` BEFORE INSERT ON `visitor_pass_data`
 FOR EACH ROW BEGIN

SET @visitorIdA = (SELECT visitorId FROM visitor_data WHERE visitorId=NEW.visitorId);

SET @visitorId = (SELECT visitorId FROM visitor_data ORDER BY visitorId DESC LIMIT 1);

SET @lastId = (SELECT visitorPassSlNo FROM visitor_pass_data ORDER BY visitorPassSlNo DESC LIMIT 1);

IF @lastId IS NULL OR @lastId="" THEN SET @lastId = 0;
END IF;

IF NEW.visitorPassNo IS NULL OR NEW.visitorPassNo="" THEN

SET NEW.visitorPassNo = CONCAT(CURDATE()+0,LPAD(@lastId+1,4,0));

END IF;


IF @visitorIdA IS NULL THEN
SET NEW.visitorId = @visitorId;

END IF;
END

$$
DELIMITER ;



CREATE TABLE employee_data(
employeeId VARCHAR(10) PRIMARY KEY,
employeeName	VARCHAR(50) NOT NULL,
department	VARCHAR(100),
designation	VARCHAR(50),
dateOfBirth	DATE,
address	VARCHAR(100),
bloodGroup	ENUM ('A+','A-','B+','B-','AB+','AB-','O+','O-','NA'),
gender	ENUM('Male','Female','Transgender'),
contactNo	VARCHAR(15) NOT NULL,
emgContactNo	VARCHAR(15),
photo	MEDIUMTEXT,
status	ENUM ('Active','Hold','Draft'),
creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
modificationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)ENGINE=INNODB;


CREATE TABLE trade_name_data(
tradeNameSlNo INT AUTO_INCREMENT UNIQUE,
tradeName VARCHAR(30) UNIQUE,
creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
modificationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)ENGINE=INNODB;


CREATE TABLE department_name_data(
departmentNameSlNo INT AUTO_INCREMENT UNIQUE,
departmentName VARCHAR(30) UNIQUE,
creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
modificationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)ENGINE=INNODB;

ALTER TABLE visitor_pass_data MODIFY passStatus ENUM('Active','Exit','Hold','Expired') NOT NULL;


`INSERT INTO employee_data (employeeId,employeeName,designation,department,dateOfBirth,address,bloodGroup,gender,contactNo,emgContactNo,status)
VALUES(
'${mMap["employeeId"]}',
'${mMap["employeeName"]}',
'${mMap["designation"]}',
'${mMap["department"]}',
'${mMap["dateOfBirth"]}',
'${mMap["address"]}',
'${mMap["bloodGroup"]}',
'${mMap["gender"]}',
'${mMap["contactNo"]}',
'${mMap["emgContactNo"]}',
'${mMap["status"]}'
)`

INSERT INTO employee_data (employeeId,employeeName,designation,department,contactNo,status)
VALUES(
'434',
'Bharti Raju',
'Engineer',
'Securtiy',
'9882556718',
'Active'
)












INSERT INTO user_data (userId,password,department,role,status,creationDate)
VALUES ('cc_admin_1', 'password', 'Contract Cell', 'Admin', 'Active', '2021-08-02');


BEGIN

SET @lastId = (SELECT visitorPassSlNo FROM visitor_pass_data ORDER BY visitorPassSlNo DESC LIMIT 1);
SET @visitorId = (SELECT visitorId FROM visitor_data ORDER BY visitorId DESC LIMIT 1);
IF @lastId IS NULL OR @lastId="" THEN SET @lastId = 0;
END IF;


SET NEW.visitorPassNo = 3;

IF NEW.visitorId="" THEN
SET NEW.visitorId = @visitorId;
END IF;

END


/*Statement to Update all values in a column */
UPDATE contractor_data
SET isHeld = 'No'
/* */


DELETE FROM TABLE WHERE key='value';






const query= `INSERT INTO contractor_person_data (${dbKeys},${adlDbKeys},${submDbKeys},${docDbKeys},${attDbKeys},${otherDbKeys},creationDate) 
				VALUES('${mMap["personName"]}',
				'${mMap["contractorName"]}',
				'${mMap["personSlNo"]}',
				'${mMap["dateOfBirth"]}',
				'${mMap["tradeName"]}',
				'${mMap["localAddress"]}',
				'${mMap["permanentAddress"]}',
				'${mMap["dateOfJoining"]}',
				'${mMap["fathersName"]}',
				'${mMap["mothersName"]}',
				'${mMap["nomineeName"]}',
				'${mMap["bloodGroup"]}',
				'${mMap["gender"]}',
				'${mMap["maritalStatus"]}',
				'${mMap["identificationMarks"]}',
				'${mMap["contactNo"]}',
				'${mMap["emgContactNo"]}',
				'${mMap["wageRate"]}',
				'${mMap["personType"]}',
				'${mMap["esiNo"]}',
				'${mMap["insuranceNo"]}',
				'${mMap["uan"]}',
				'${mMap["passportDate"]}',
				'${mMap["aadharNo"]}',
				'${mMap["personId"]}',
				'${mMap["contractorId"]}',
				'${mMap["dateOfCardExpiry"]}',
				'${mMap["photo"]}',
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



`UPDATE contractor_person_data
SET 
dateOfBirth = '${mMap["dateOfBirth"]}',
tradeName = '${mMap["tradeName"]}',
localAddress = '${mMap["tradeName"]}'
WHERE personId=` 



const query= `INSERT INTO contractor_person_data (${dbKeys},${adlDbKeys},${submDbKeys},${docDbKeys},${attDbKeys},${otherDbKeys},creationDate) 
				VALUES('${mMap["personName"]}',
				'${mMap["contractorName"]}',
				'${mMap["personSlNo"]}',
				'${mMap["dateOfBirth"]}',
				'${mMap["tradeName"]}',
				'${mMap["localAddress"]}',
				'${mMap["permanentAddress"]}',
				'${mMap["dateOfJoining"]}',
				'${mMap["fathersName"]}',
				'${mMap["mothersName"]}',
				'${mMap["nomineeName"]}',
				'${mMap["bloodGroup"]}',
				'${mMap["gender"]}',
				'${mMap["maritalStatus"]}',
				'${mMap["identificationMarks"]}',
				'${mMap["contactNo"]}',
				'${mMap["emgContactNo"]}',
				'${mMap["wageRate"]}',
				'${mMap["personType"]}',
				'${mMap["esiNo"]}',
				'${mMap["insuranceNo"]}',
				'${mMap["uan"]}',
				'${mMap["passportDate"]}',
				'${mMap["aadharNo"]}',
				'${mMap["personId"]}',
				'${mMap["contractorId"]}',
				'${mMap["dateOfCardExpiry"]}',
				'${mMap["photo"]}',
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




CREATE TABLE visitor_pass_data_old(
visitorPassSlNo INT AUTO_INCREMENT,
visitorPassNo	VARCHAR(15) PRIMARY KEY,
visitorId VARCHAR(10) NOT NULL,
visitorName	VARCHAR(50) NOT NULL,
companyName	VARCHAR(50),
designation	VARCHAR(50),
dateOfBirth	DATE,
address	VARCHAR(100),
bloodGroup	ENUM ('A+','A-','B+','B-','AB+','AB-','O+','O-','NA'),
gender	ENUM('Male','Female','Transgender'),
contactNo	VARCHAR(15) NOT NULL,
emgContactNo	VARCHAR(15),
purposeOfVisit	VARCHAR(50),
tebmaContactPerson VARCHAR(50),
tebmaContactDept VARCHAR(25),
tebmaContactPhoneNo VARCHAR(15),
validUpto DATETIME,
visitorPassIssuedAt ENUM ('Malpe','Hangarkatte','Babuthota','Santhakatte'),  
visitorPassPermittedAreas ENUM ('Malpe','Hangarkatte','Babuthota','Santhakatte'),
photoIdType VARCHAR(20),
photoIdNo VARCHAR(30),
gadgetType VARCHAR(20),
gadgetDesc VARCHAR(30),
gadgetSlNo VARCHAR(30),
vehicleType VARCHAR(20),
vehicleName VARCHAR(20),
vehicleRegNo VARCHAR(15),
status	ENUM ('In','Out','Hold'),
inTime DATETIME,
outTime DATETIME, 
creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
modificationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT Fk_visitor_id FOREIGN KEY(visitorId) REFERENCES visitor_data(visitorId)  ON DELETE NO ACTION ON UPDATE CASCADE
)ENGINE=INNODB;




INSERT INTO `trade_name_data` (`tradeNameSlNo`, `tradeName`) VALUES
(1, 'Site Incharge'),
(2, 'Engineer'),
(3, 'Supervisor'),
(4, 'Marker'),
(5, 'Welder'),
(6, 'Tack Welder'),
(7, 'Fitter'),
(8, 'Grinder'),
(9, 'Painter'),
(10, 'Blaster'),
(11, 'Power Tooler'),
(12, 'Store Keeper'),
(13, 'Rigger'),
(14, 'Helper');



INSERT INTO `department_name_data` (`departmentNameSlNo`, `departmentName`) VALUES
(1, 'Hull'),
(2, 'Piping'),
(3, 'Machinery'),
(4, 'Outfit'),
(5, 'Accomodation'),
(6, 'Electrical'),
(7, 'Utility'),
(8, 'Store'),
(9, 'Painting'),
(10, 'IT')


 


 /*Updating a specific column of all rows of a table with a common value */
 UPDATE table_name
 SET table_column='value'; 
/* */


 /* Event Command for checking id expiry */
 UPDATE contractor_person_data 
 SET status = 'Expired' 
 WHERE dateOfCardExpiry<CURDATE()
/* */



/*Statement to Add a Column */
ALTER TABLE contractor_person_data
ADD COLUMN personSlNo VARCHAR(10) NOT NULL
AFTER personName 
/* */

/*Statement to Add two Column */
ALTER TABLE contractor_data
ADD COLUMN isHeld ENUM('No','Yes') NOT NULL AFTER logo,
ADD COLUMN contractorStatus ENUM('Approved','Temporary') NOT NULL AFTER isHeld


/*Statement to Delete a Column */
ALTER TABLE contractor_data
DROP COLUMN status;

/* */


CREATE EVENT `contract_person_expiry_watcher` ON SCHEDULE EVERY 1 DAY STARTS '2023-08-24 20:35:29.000000' ON COMPLETION NOT PRESERVE ENABLE DO UPDATE contractor_person_data SET status = 'Expired' WHERE dateOfCardExpiry<CURDATE()


CREATE TABLE `student_person_data` (
  `personId` varchar(10) NOT NULL,
  `personName` varchar(50) NOT NULL,
  `personSlNo` varchar(10) NOT NULL,
  `instituteName` varchar(100) NOT NULL,
  `courseName` varchar(20) DEFAULT NULL,
  `className` varchar(15) DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `dateOfPassValidityStart` date DEFAULT NULL,
  `dateOfPassExpiry` date DEFAULT NULL,
  `localAddress` varchar(200) DEFAULT NULL,
  `permanentAddress` varchar(200) DEFAULT NULL,
  `bloodGroup` enum('A+','A-','B+','B-','AB+','AB-','O+','O-','A1+','A1-') DEFAULT NULL,
  `gender` enum('Male','Female','Other','') DEFAULT NULL,
  `fathersName` varchar(50) DEFAULT NULL,
  `mothersName` varchar(50) DEFAULT NULL,
  `identificationMarks` varchar(30) DEFAULT NULL,
  `personContactNo` varchar(15) DEFAULT NULL,
  `personType` enum('Intern') DEFAULT NULL,
  `personEmgContactNo` varchar(15) DEFAULT NULL,
  `aadharNo` varchar(20) DEFAULT NULL,
  `aadharCardSubmitted` enum('Yes','No') DEFAULT 'No',
  `instituteIdSubmitted` enum('Yes','No') DEFAULT 'No',
  `hseTrainingAttended` enum('Yes','No') DEFAULT 'No',
  `personPhoto` mediumtext DEFAULT NULL,
  `personPhotoPath` varchar(300) DEFAULT '',
  `isHeld` enum('No','Yes') DEFAULT NULL,
  `personStatus` enum('Active','Draft','Hold','Expired') DEFAULT NULL,
  `creationDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `modificationDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `student_person_data`
  ADD PRIMARY KEY (`personId`);




  CREATE TABLE `attribute_class_name` (
  `classNameSlNo` int(11) NOT NULL,
  `className` varchar(40) NOT NULL,
  `creationDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `modificationDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



CREATE TABLE `attribute_course_name` (
  `courseNameSlNo` int(11) NOT NULL,
  `courseName` varchar(40) NOT NULL,
  `creationDate` timestamp NULL DEFAULT current_timestamp(),
  `modificationDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



CREATE TABLE `attribute_institute_name` (
  `instituteNameSlNo` int(11) NOT NULL,
  `instituteName` varchar(200) NOT NULL,
  `creationDate` timestamp NULL DEFAULT current_timestamp(),
  `modificationDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Indexes for table `attribute_class_name`
--
ALTER TABLE `attribute_class_name`
  ADD UNIQUE KEY `classNameSlNo` (`classNameSlNo`),
  ADD UNIQUE KEY `className` (`className`);

--
-- Indexes for table `attribute_course_name`
--
ALTER TABLE `attribute_course_name`
  ADD UNIQUE KEY `courseNameSlNo` (`courseNameSlNo`),
  ADD UNIQUE KEY `courseName` (`courseName`);

--
-- Indexes for table `attribute_institute_name`
--
ALTER TABLE `attribute_institute_name`
  ADD UNIQUE KEY `instituteNameSlNo` (`instituteNameSlNo`);



