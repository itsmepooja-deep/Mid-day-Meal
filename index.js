//IMPORTS AND HEADER FILES
var express = require('express');
const ethers = require('ethers');
var sha256 = require('js-sha256');
// var provider = ethers.getDefaultProvider('ropsten');
var app = express()
var router = express.Router()
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
var mysql = require('mysql');
var provider =ethers.getDefaultProvider('ropsten');
app.use(express.static('public'));
app.use(bodyParser());
var privateKey='5DC7E856E2C05D5D80C4B259EB8401382A322C271E941617D5BE174252FDF016';
var wallet = new ethers.Wallet(privateKey,provider);
var conn = mysql.createConnection({
host: "localhost",
user: "root",
password: "root",
database: "middaymeals"
});


conn.connect(function(err) {
if (err)
	console.log(err);
else
	console.log("Database connected!");
}); 


const address='0x04e607EEC737d858948056e00676c2256F6F2d5a';//Address of deployed contract
const abi=[
	{
		"constant": false,
		"inputs": [
			{
				"name": "_data",
				"type": "string"
			}
		],
		"name": "setData",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "data",
				"type": "string"
			}
		],
		"name": "Meal",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getData",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];
const contract = new ethers.Contract(address,abi,wallet);


app.get('/',function(req,res)
{
    res.render(__dirname + '/views/index',{Error:" ",link:" "});
});


app.post('/logout',function(req,res)
{
    res.render(__dirname + '/views/index',{Error:' ',Link:" "});
});


app.get("/logout",function(req,res){
    res.render(__dirname+'/views/index.ejs',{Error:' ',link:" ",data:" ",i:' '})
})


app.get("/changePass",function(req,res){
    res.render(__dirname+'/views/changePwd.ejs',{records:"", Error:""})
})


app.get("/changePassStud",function(req,res){
    res.render(__dirname+'/views/changePwdStud.ejs',{records:"", Error:""})
})


//LOGIN AND RE-DIRECT
app.post('/login',function(req,res)
{
     var Loginid=req.body.Loginid;
     var Password=sha256(req.body.Password);
     if(req.body.Role=="Supervisor")
	 {
		var sql='SELECT * FROM supervisorlogin  where supervisorID= ("'+req.body.Loginid+'")'
		conn.query(sql,(err,result)=>
		{
			if(err)
			{
				return res.render('index.ejs',{Error:"Error : Server Error",link:"Click Here"});
			}
			else if(result.length==0)
			{
				return res.render('index.ejs',{Error:"Error : User doesn't exists",link:"Click Here"});
			}
			else
			{
				var passkey=result[0].passkey;
				hashPasskey=sha256(passkey);
				if(Password==hashPasskey)
				{
					return res.render(__dirname+'/views/supervisorLogin.ejs',{Error:' ',link:" "})
				}
				else
				{
					return res.render('index.ejs',{Error:"Error : Wrong Credentials",link:"Click Here"});
				}
			}
		})
	 }
     if(req.body.Role=="School")
	 {
		var sql='SELECT * FROM schoollogin  where schoolID= ("'+req.body.Loginid+'")'
		conn.query(sql,(err,result)=>
		{
			if(err)
			{
				return res.render('index.ejs',{Error:"Error : Server Error",link:"Click Here"});
			}
			else if(result.length==0)
			{
				return res.render('index.ejs',{Error:"Error : User doesn't exists",link:"Click Here"});
			}
			else
			{
				var passkey=result[0].passkey;
				hashPasskey=sha256(passkey);
				if(Password==hashPasskey)
				{
					return res.render(__dirname+'/views/schoolLogin.ejs',{Error:' ',link:" ",school:req.body.Loginid})
				}
				else
				{
					return res.render('index.ejs',{Error:"Error : Wrong Credentials",link:"Click Here"});
				}
			}
		})
	 }
     if(req.body.Role=="Transporter")
	 {
		var sql='SELECT * FROM Transporterlogin  where TransporterID= ("'+req.body.Loginid+'")'
		conn.query(sql,(err,result)=>
		{
			if(err)
			{
				return res.render('index.ejs',{Error:"Error : Server Error",link:"Click Here"});
			}
			else if(result.length==0)
			{
				return res.render('index.ejs',{Error:"Error : User doesn't exists",link:"Click Here"});
			}
			else
			{
				var passkey=result[0].passkey;
				hashPasskey=sha256(passkey);
				if(Password==hashPasskey)
				{
					return res.render(__dirname+'/views/transporterLogin.ejs',{Error:' ',link:" ",transporter:req.body.Loginid})
				}
				else
				{
					return res.render('index.ejs',{Error:"Error : Wrong Credentials",link:"Click Here"});
				}
			}
		})
	 }
     if(req.body.Role=="Caterer")
	 {
		var sql='SELECT * FROM catererlogin  where catererID= ("'+req.body.Loginid+'")'
		conn.query(sql,(err,result)=>
		{
			if(err)
			{
				return res.render('index.ejs',{Error:"Error : Server Error",link:"Click Here"});
			}
			else if(result.length==0)
			{
				return res.render('index.ejs',{Error:"Error : User doesn't exists",link:"Click Here"});
			}
			else
			{
				var passkey=result[0].passkey;
				hashPasskey=sha256(passkey);
				if(Password==hashPasskey)
				{
					return res.render(__dirname+'/views/catererLogin.ejs',{Error:' ',link:" ",caterer:req.body.Loginid})
				}
				else
				{
					return res.render('index.ejs',{Error:"Error : Wrong Credentials",link:"Click Here"});
				}
			}
		})
	 }
});


app.post('/changePasswordStudent',function(req,res)
{
     var Loginid=req.body.Loginid;
	 var Schoolid=req.body.Schoolid;
     var Password=sha256(req.body.Password);
	 var newPassword=req.body.NewPassword;
		var sql='SELECT * FROM studentlogin  where schoolID= ("'+req.body.Schoolid+'") and studentID= ("'+req.body.Loginid+'")'
		conn.query(sql,(err,result)=>
		{
			if(err)
			{
				return res.render('changePwdStud.ejs',{Error:"Error : Server Error",link:"Click Here"});
			}
			else if(result.length==0)
			{
				return res.render('changePwdStud.ejs',{Error:"Error : User doesn't exists",link:"Click Here"});
			}
			else
			{
				var passkey=result[0].passkey;
				hashPasskey=sha256(passkey);
				if(Password==hashPasskey)
				{
					var sql11='update studentlogin set passkey="'+newPassword+'" where schoolID= ("'+req.body.Schoolid+'") and studentID= ("'+req.body.Loginid+'");'
					conn.query(sql11,function(err,res)
					{
						if (err)
							return res.render('changePwdStud.ejs',{Error:"Server Error. Try again.",link:"Click Here"});
					})
					return res.render('changePwdStud.ejs',{Error:"Success. Login credentials changed.",link:"Click Here"});
				}
				else
				{
					return res.render('changePwdStud.ejs',{Error:"Error : Wrong Credentials",link:"Click Here"});
				}
			}
		})
});


app.post('/changePassword',function(req,res)
{
     var Loginid=req.body.Loginid;
     var Password=sha256(req.body.Password);
	 var newPassword=req.body.NewPassword;
     if(req.body.Role=="School")
	 {
		var sql='SELECT * FROM schoollogin  where schoolID= ("'+req.body.Loginid+'")'
		conn.query(sql,(err,result)=>
		{
			if(err)
			{
				console.log('1');
				return res.render('changePwd.ejs',{Error:"Error : Server Error",link:"Click Here"});
			}
			else if(result.length==0)
			{
				return res.render('changePwd.ejs',{Error:"Error : User doesn't exists",link:"Click Here"});
			}
			else
			{
				var passkey=result[0].passkey;
				hashPasskey=sha256(passkey);
				if(Password==hashPasskey)
				{
					var sql11='update schoollogin set passkey="'+newPassword+'" where schoolID= ("'+req.body.Loginid+'")'
					conn.query(sql11,function(err,res)
					{
						if (err)
							return res.render('changePwd.ejs',{Error:"Server Error. Try again.",link:"Click Here"});
					})
					return res.render('changePwd.ejs',{Error:"Success. Login credentials changed.",link:"Click Here"});
				}
				else
				{
					return res.render('changePwd.ejs',{Error:"Error : Wrong Credentials",link:"Click Here"});
				}
			}
		})
	 }
	 if(req.body.Role=="Transporter")
	 {
		var sql='SELECT * FROM transporterlogin  where transporterID= ("'+req.body.Loginid+'")'
		conn.query(sql,(err,result)=>
		{
			if(err)
			{
				return res.render('changePwd.ejs',{Error:"Error : Server Error",link:"Click Here"});
			}
			else if(result.length==0)
			{
				return res.render('changePwd.ejs',{Error:"Error : User doesn't exists",link:"Click Here"});
			}
			else
			{
				var passkey=result[0].passkey;
				hashPasskey=sha256(passkey);
				if(Password==hashPasskey)
				{
					var sql11='update transporterlogin set passkey="'+newPassword+'" where transporterID= ("'+req.body.Loginid+'")'
					conn.query(sql11,function(err,res)
					{
						if (err)
							return res.render('changePwd.ejs',{Error:"Server Error. Try again.",link:"Click Here"});
					})
					return res.render('changePwd.ejs',{Error:"Success. Login credentials changed.",link:"Click Here"});
				}
				else
				{
					return res.render('changePwd.ejs',{Error:"Error : Wrong Credentials",link:"Click Here"});
				}
			}
		})
	 }
     if(req.body.Role=="Caterer")
	 {
		var sql='SELECT * FROM catererlogin  where catererID= ("'+req.body.Loginid+'")'
		conn.query(sql,(err,result)=>
		{
			if(err)
			{
				return res.render('changePwd.ejs',{Error:"Error : Server Error",link:"Click Here"});
			}
			else if(result.length==0)
			{
				return res.render('changePwd.ejs',{Error:"Error : User doesn't exists",link:"Click Here"});
			}
			else
			{
				var passkey=result[0].passkey;
				hashPasskey=sha256(passkey);
				if(Password==hashPasskey)
				{
					var sql11='update catererlogin set passkey="'+newPassword+'" where catererID= ("'+req.body.Loginid+'")'
					conn.query(sql11,function(err,res)
					{
						if (err)
							return res.render('changePwd.ejs',{Error:"Server Error. Try again.",link:"Click Here"});
					})
					return res.render('changePwd.ejs',{Error:"Success. Login credentials changed.",link:"Click Here"});
				}
				else
				{
					return res.render('changePwd.ejs',{Error:"Error : Wrong Credentials",link:"Click Here"});
				}
			}
		})
	 }
});


//Supervisor Portal
app.post('/AddSchool',function(req,res)
{
    res.render(__dirname + '/views/addschool',{Error:' ',Link:" "});
});


app.get('/addSchoolNotify',function(req,res)
{
    res.render(__dirname + '/views/addschool',{Error:' ',Link:" "});
});


app.post('/AddCaterer',function(req,res)
{
    res.render(__dirname + '/views/addcaterer',{Error:' ',Link:" "});
});


app.post('/AddTransporter',function(req,res)
{
    res.render(__dirname + '/views/addtransporter',{Error:' ',Link:" "});
});


app.post('/AddDailyAssignedMealsCode',function(req,res)
{
    res.render(__dirname + '/views/assignMeals',{Error:' ',Link:" "});
});


app.post('/MealCode',function(req,res)
{
    res.render(__dirname + '/views/addMealCode',{Error:' ',Link:" "});
});


app.post('/backSupervisor',function(req,res)
{
    res.render(__dirname + '/views/supervisorLogin',{Error:' ',Link:" "});
});


app.get('/addCatererNotify',function(req,res)
{
    res.render(__dirname + '/views/addcaterer',{Error:' ',Link:" "});
});


app.get('/assignMealsNotify',function(req,res)
{
    res.render(__dirname + '/views/assignMeals',{Error:' ',Link:" "});
});


app.get('/addMealCodeNotify',function(req,res)
{
    res.render(__dirname + '/views/addMealCode',{Error:' ',Link:" "});
});


app.post('/addNewSchool',function(req,res)
{
    var id=req.body.schoolID;
	var name=req.body.schoolName;
	var email=req.body.schoolEmail;
	var mobile=req.body.schoolMobile;
	var pin=req.body.schoolPIN;
	var sid=req.body.schoolSID;
	var passkey=req.body.schoolPassword;
	var sql='INSERT INTO schoolDetails VALUES ("'+id+'","'+name+'","'+pin+'","'+email+'","'+mobile+'","'+sid+'")';
	console.log(sql);
	conn.query(sql,function(err,request)
	{
		if(err)
		{
			var msg='Some error occured. Check entries properly and try again';
			res.render(__dirname + '/views/addschool',{Error:msg,Link:""});
		}
		else
		{
			var sql='INSERT INTO schoollogin VALUES ("'+id+'","'+passkey+'")';
			conn.query(sql,function(err,request)
			{
				if(err)
				{
					var msg='Some error occured. Check entries properly and try again';
					res.render(__dirname + '/views/addschool',{Error:msg,Link:""});
				}
				else
				{
					var msg='SUCCESS! School added with ID '+id;
					res.render(__dirname + '/views/addschool',{Error:msg,Link:""});
				}
			})
		}
	})
});


app.post('/addAssignedMeals',function(req,res)
{
    var cid=req.body.catererID;
	var tid=req.body.transporterID;
	var mc=req.body.mealCode;
	var count=req.body.studentCount;
	var ec=parseInt(count)/20;
	ec=parseInt(ec);
	var sid=req.body.schoolID;
	var sql='INSERT INTO assignedmeals (catererID, schoolID, transporterID, mealCode, catererStatus, schoolStatus, transporterStatus, studentCount,status,feedbackstatus) VALUES ("'+cid+'","'+sid+'","'+tid+'","'+mc+'",0,0,0,"'+count+'",1,0)';
	console.log(sql);
	conn.query(sql,function(err,request)
	{
		if(err)
		{
			var msg='Fail to assign meal. Try again or contact Adminstrator.';
			res.render(__dirname + '/views/assignMeals',{Error:msg,Link:""});
		}
		else
		{
			var sqll='select max(mealid) as mealid from assignedmeals;';
			conn.query(sqll,function(err,result)
			{
				if (err)
				{
					var msg='Fail to assign meal. Try again or contact Adminstrator.';
					res.render(__dirname + '/views/assignMeals',{Error:msg,Link:""});
				}
				else
				{
					console.log(result);
					mealid=result[0].mealid;
					console.log(mealid);
					var sql1='insert into blockchainhash values ('+mealid+',null,null,null)';
					conn.query(sql1,function(err,request)
					{
						if (err)
						{
							var msg='Fail to assign meal. Try again or contact Adminstrator.';
							res.render(__dirname + '/views/assignMeals',{Error:msg,Link:""});
						}
						else
						{
							var sql1='insert into feedbackbuffer values ('+mealid+','+ec+',0,0)';
							conn.query(sql1,function(err,request)
							{
								if (err)
								{
									var msg='Fail to assign meal. Try again or contact Adminstrator.';
									res.render(__dirname + '/views/assignMeals',{Error:msg,Link:""});
								}
								else
								{
									var msg='SUCCESS! Meal assigned with school ID :'+sid+' and caterer ID :'+cid;
									res.render(__dirname + '/views/assignMeals',{Error:msg,Link:""});
								}
							})
						}
					})
				}
			})
		}
	})
});


app.post('/addDailyMealCode',function(req,res)
{
    var mc=req.body.mealCode;
	var mn=req.body.mealName;
	var weight=req.body.mealWeightPerServing;
	var sql='INSERT INTO mealcode VALUES ("'+mc+'","'+mn+'","'+weight+'")';
	console.log(sql);
	conn.query(sql,function(err,request)
	{
		if(err)
		{
			var msg='Error Occured. Try again.';
			res.render(__dirname + '/views/addMealCode',{Error:msg,Link:""});
		}
		else
		{
			var msg='SUCCESS! Meal added with code '+mc;
			res.render(__dirname + '/views/addMealCode',{Error:msg,Link:""});
		}
	})
});


app.post('/addNewCaterer',function(req,res)
{
    var id=req.body.catererID;
	var name=req.body.catererName;
	var email=req.body.catererEmail;
	var mobile=req.body.catererMobile;
	var pin=req.body.catererPIN;
	var sid=req.body.catererSID;
	var passkey=req.body.catererPassword;
	var sql='INSERT INTO catererDetails VALUES ("'+id+'","'+name+'","'+pin+'","'+email+'","'+mobile+'","'+sid+'")';
	console.log(sql);
	conn.query(sql,function(err,request)
	{
		if(err)
		{
			var msg='Failed to add. Check entries and try again.';
			res.render(__dirname + '/views/addcaterer',{Error:msg,Link:""});
		}
		else
		{
			var sql='INSERT INTO catererlogin VALUES ("'+id+'","'+passkey+'")';
			conn.query(sql,function(err,request)
			{
				if(err)
				{
					var msg='Failed to add. Check entries and try again.';
					res.render(__dirname + '/views/addcaterer',{Error:msg,Link:""});
				}
				else
				{
					var msg='SUCCESS! Caterer added with ID '+id;
					res.render(__dirname + '/views/addcaterer',{Error:msg,Link:""});
				}
			})
		}
	})
});


app.post('/addNewTransporter',function(req,res)
{
    var id=req.body.transporterID;
	var name=req.body.transporterName;
	var email=req.body.transporterEmail;
	var mobile=req.body.transporterMobile;
	var pin=req.body.transporterPIN;
	var sid=req.body.transporterSID;
	var passkey=req.body.transporterPassword;s
	var sql='INSERT INTO transporterDetails VALUES ("'+id+'","'+name+'","'+pin+'","'+email+'","'+mobile+'","'+sid+'")';
	console.log(sql);
	conn.query(sql,function(err,request)
	{
		if(err)
		{
			var msg='Failed to add. Check entries and try again.';
			res.render(__dirname + '/views/addtransporter',{Error:msg,Link:""});
		}
		else
		{
			var sql='INSERT INTO transporterlogin VALUES ("'+id+'","'+passkey+'")';
			conn.query(sql,function(err,request)
			{
				if(err)
				{
					var msg='Failed to add. Check entries and try again.';
					res.render(__dirname + '/views/addtransporter',{Error:msg,Link:""});
				}
				else
				{
					var msg='SUCCESS! Transporter added with ID '+id;
					res.render(__dirname + '/views/addtransporter',{Error:msg,Link:""});
				}
			})
		}
	})
});



//CATERER
app.post('/backCatererLogin',function(req,res)
{    
    res.render(__dirname + '/views/catererLogin',{records:"",caterer:req.body.Catererid, Error:''});
})


app.post("/catererAssignedMeal",function(req,res){
    res.render(__dirname+'/views/catererAssignedMeal.ejs',{records:"",caterer:req.body.Catererid})
})


app.post('/addMealByCaterer',function(req,res)
{
    
    var cid=req.body.Catererid;
    var sid=req.body.Schoolid;
    var tid=req.body.Transportid;
    var mid=req.body.Mealid;
    var count=req.body.NumberofStudent;
    var iot=req.body.IotMetrics;
    var mc=req.body.MealCode;
	var sql='INSERT INTO caterermealDetails VALUES ('+mid+','+cid+','+sid+','+tid+','+iot+','+mc+','+count+',now());';
	console.log(sql);
	conn.query(sql,function(err,request)
	{
		if(err)
		{
			var msg='Failed to add. Check entries and try again.';
			res.render(__dirname + '/views/catererLogin',{Error:msg,Link:"",caterer:req.body.Catererid});
		}
		else
		{
			var sql='update assignedmeals set catererstatus=1 where mealID='+mid+';';
			conn.query(sql,function(err,request)
			{
				if(err)
				{
					var msg='Failed to add. Check entries and try again.';
					res.render(__dirname + '/views/catererLogin',{Error:msg,Link:"",caterer:req.body.Catererid});
				}
				else
				{
					var msg='SUCCESS! Meal added with meal ID '+mid;
					res.render(__dirname + '/views/catererLogin',{Error:msg,Link:"",caterer:req.body.Catererid});
				}
			})
		}
	})
})


app.post("/mealdetail",function(req,res)
{
	var cid=req.body.Catererid;
	var sql='select * from assignedmeals where catererid="'+cid+'" and status=1 and catererStatus=0';
	conn.query(sql,(error,result)=>
	{
		if(error)
		{
			var msg='Failed to load. Try again or contact Adminstrator.';
			res.render(__dirname + '/views/catererAssignedMeal',{Error:msg,Link:"",caterer:req.body.Catererid});
		}
		else
		{			        
			res.render('catererAssignedMeal',{records:result, Error:"", caterer:req.body.Catererid});
		}
	});
}) 


//TRANSPORTER
app.post('/backTransporterLogin',function(req,res)
{    
    res.render(__dirname + '/views/transporterLogin',{records:"",transporter:req.body.Transporterid, Error:''});
})


app.post("/transporterAssignedMeal",function(req,res){
    res.render(__dirname+'/views/transporterAssignedMeal.ejs',{records:"",transporter:req.body.Transporterid})
})


app.post("/mealdetailtransporter",function(req,res)
{
	var tid=req.body.Transporterid;
	var sql='select * from assignedmeals where transporterid="'+tid+'" and status=1 and transporterStatus=0';
	conn.query(sql,(error,result)=>
	{
		if(error)
		{
			res.render('transporterAssignedMeal',{records:result, transporter:req.body.Transporterid, Error:"Some error occured, Try again."});
		}
		else
		{			        
			res.render('transporterAssignedMeal',{records:result, transporter:req.body.Transporterid});
		}
	});
})

app.post('/acceptMealByTransporter',function(req,res)
{
    var sid=req.body.Schoolid;
    var tid=req.body.Transporterid;
    var mid=req.body.Mealid;
	var sql='select * from caterermealdetails where mealid='+mid+';';
	console.log(sql);
	var txHash="hash";
	conn.query(sql,(err,result)=>
		{
			if(err)
			{
				return res.render('transporterLogin.ejs',{Error:"Error : Server Error. Contact Adminstrator",transporter:req.body.Transporterid});
			}
			else if(result.length==0)
			{
				return res.render('transporterLogin.ejs',{Error:"Error : Entered meal doesn't exists. Try again.",transporter:req.body.Transporterid});
			}
			else
			{
				var mid=result[0].mealID;
				var cid=result[0].catererID;
				var sid=result[0].schoolID;
				var tid=result[0].transporterID;
				var iot=result[0].IoTMetricsScore;
				var mc=result[0].mealcode;
				var sc=result[0].studentCount;
				var time=result[0].preparationTime;
				var buffer=mid+'|'+cid+'|'+sid+'|'+tid+'|'+iot+'|'+mc+'|'+sc+'|'+time;
				console.log("Before hashing: "+buffer);
				var hash=sha256(buffer);
				console.log("To store in Blockchain: "+hash);
				contract.setData(hash).then(function(transaction)
				{
					console.log("Transaction hash is "+transaction.hash);
					txHash=transaction.hash;
					var sql1='update assignedmeals set transporterstatus=1 where mealID='+mid+';';
					conn.query(sql1,(error,result)=>
					{
						if(error)
						{
							return res.render('transporterLogin.ejs',{Error:"Error occured. Try again.",link:"Click Here",transporter:req.body.Transporterid});
						}
						else
						{			        
							var sql2='update blockchainhash set catererHash="'+txHash+'" where mealid='+mid+';';
							console.log(sql2)
							conn.query(sql2,(error,result)=>
							{
								if(error)
								{
									return res.render('transporterLogin.ejs',{Error:"Error occured. Try again.",link:"Click Here",transporter:req.body.Transporterid});
								}
								else
									return res.render('transporterLogin.ejs',{Error:"Success",link:"Click Here",transporter:req.body.Transporterid});
							})
						}
					});
				})
			}
		})
})


//SCHOOL


app.post('/backSchoolLogin',function(req,res)
{    
    res.render(__dirname + '/views/SchoolLogin',{records:"",school:req.body.Schoolid, Error:''});
})


app.post("/schoolAssignedMeal",function(req,res){
    res.render(__dirname+'/views/schoolAssignedMeal.ejs',{records:"",school:req.body.Schoolid})
})


app.post("/schoolAddStudent",function(req,res){
    res.render(__dirname+'/views/schoolAddStudent.ejs',{records:"",school:req.body.Schoolid,Error:""})
})


app.post("/mealdetailschool",function(req,res)
{
	var sid=req.body.Schoolid;
	var sql='select * from assignedmeals where schoolid="'+sid+'" and status=1 and schoolStatus=0';
	conn.query(sql,(error,result)=>
	{
		if(error)
		{
			res.render('schoolAssignedMeal',{Error:"Some error occured. Try again", school:req.body.Schoolid});

		}
		else
		{			        
			res.render('schoolAssignedMeal',{records:result, school:req.body.Schoolid});
		}
	});
})


app.post('/addMealBySchool',function(req,res)
{
    
    var cid=req.body.Catererid;
    var sid=req.body.Schoolid;
    var tid=req.body.Transportid;
    var mid=req.body.Mealid;
    var count=req.body.NumberofStudent;
    var iot=req.body.IotMetrics;
    var mc=req.body.MealCode;
	var sql='INSERT INTO schoolmealDetails VALUES ('+mid+','+cid+','+sid+','+tid+','+iot+','+mc+','+count+',now());';
	console.log(sql);
	conn.query(sql,function(err,request)
	{
		if(err)
		{
			return res.render('schoolLogin.ejs',{Error:"Error : Server Error. Contact Adminstrator",school:req.body.Schoolid});
		}
		else
		{
			var sql='update assignedmeals set schoolstatus=1 where mealID='+mid+';';
			conn.query(sql,function(err,request)
			{
				if(err)
				{
					return res.render('schoolLogin.ejs',{Error:"Error : Server Error. Contact Adminstrator",school:req.body.Schoolid});
				}
				else
				{
					var sql='select * from schoolmealdetails where mealid='+mid+';';
					console.log(sql);
					var txHash="hash";
					conn.query(sql,(err,result)=>
					{
						if(err)
						{
							return res.render('schoolLogin.ejs',{Error:"Error : Server Error. Contact Adminstrator",school:req.body.Schoolid});
						}
						else if(result.length==0)
						{
							return res.render('schoolLogin.ejs',{Error:"Error : Entered meal doesn't exists. Try again.",school:req.body.Schoolid});
						}
						else
						{
							var mid=result[0].mealID;
							var cid=result[0].catererID;
							var sid=result[0].schoolID;
							var tid=result[0].transporterID;
							var iot=result[0].IoTMetricsScore;
							var mc=result[0].mealcode;
							var sc=result[0].studentCount;
							var time=result[0].acceptanceTime;
							var buffer=mid+'|'+cid+'|'+sid+'|'+tid+'|'+iot+'|'+mc+'|'+sc+'|'+time;
							console.log("Before hashing: "+buffer);
							var hash=sha256(buffer);
							console.log("To store in Blockchain: "+hash);
							contract.setData(hash).then(function(transaction)
							{
								console.log("Transaction hash is "+transaction.hash);
								txHash=transaction.hash;			        
								var sql2='update blockchainhash set schoolhash="'+txHash+'" where mealID='+mid+';';
								conn.query(sql2,(error,result)=>
								{
									if(error)
										return res.render('schoolLogin.ejs',{Error:"Error : Server Error. Contact Adminstrator",school:req.body.Schoolid});
									else
									{
										var msg='SUCCESS! Meal accepted with meal ID '+mid;
										res.render(__dirname + '/views/schoolLogin',{Error:msg,Link:"",school:req.body.Schoolid});
									}
								})
							})
						}
					})
				}
			})
		}
	})
})

app.post('/addStudent',function(req,res)
{
    var sid=req.body.Schoolid;
	var stid=req.body.Studentid;
	var hash=sha256(stid);
	var sql='INSERT INTO studentlogin VALUES ("'+stid+'","'+sid+'","'+hash+'");';
	console.log(sql);
	conn.query(sql,function(err,request)
	{
		if(err)
		{
			var msg='Error occured. Try again.';
			res.render(__dirname + '/views/schoolAddStudent',{Error:msg,Link:"",school:req.body.Schoolid});
		}
		else
		{
			var msg='SUCCESS! Student added with ID '+stid;
			res.render(__dirname + '/views/schoolAddStudent',{Error:msg,Link:"",school:req.body.Schoolid});
		}
	})
});


//FEEDBACK
app.post("/submitFeedback",function(req,res){
    res.render(__dirname+'/views/feedback.ejs',{Error:""})
});


app.post('/feedbackLogin',function(req,res)
{
     var sid=req.body.Studentid;
     var pass=sha256(req.body.Password);
	 var schid=req.body.Schoolid;
     var sql='SELECT * FROM studentlogin where studentID= '+sid+' and schoolID= '+schid+';';
	conn.query(sql,(err,result)=>
	{
		if(err)
		{
			return res.render('feedback.ejs',{Error:"Error : Server Error",link:"Click Here"});
		}
		else if(result.length==0)
		{
				return res.render('feedback.ejs',{Error:"Error : User doesn't exists",link:"Click Here"});
		}
		else
		{
			var passkey=result[0].passkey;
			hashPasskey=sha256(passkey);
			if(pass==hashPasskey)
			{
				var sql='SELECT mealID,mealcode FROM assignedmeals where schoolID= '+schid+' and status=1 and feedbackstatus=0;';
				conn.query(sql,(err,result1)=>
				{
					if (err)
						return res.render('feedback.ejs',{Error:"Error : Server Error",link:"Click Here"});
					else if(result1.length==0)
					{
						return res.render('feedback.ejs',{Error:"Cannot submit. Adequate Feedback received already.",link:"Click Here"});
					}
					else
					{
						console.log(result1);
						var sql='SELECT mealName FROM mealcode where mealcode= '+result1[0].mealcode+';';
						conn.query(sql,(err,result2)=>
						{
							if (err)
								return res.render('feedback.ejs',{Error:"Error : Server Error",link:"Click Here"});
							else
							{
								console.log(result2[0].mealName);
								return res.render(__dirname+'/views/startFeedback.ejs',{Error:' ',link:" ",student:req.body.Studentid,school:req.body.Schoolid,mn:result2[0].mealName,mid:result1[0].mealID})
							}
						})
					}
				})
			}
			else
			{
				return res.render('feedback.ejs',{Error:"Error : Wrong Credentials",link:"Click Here"});
			}
			
		}
	 })
})


app.post('/addFeedback',function(req,res)
{
    var mid=req.body.Mealid;
	var rating=parseInt(req.body.Rating);
	var sql='select * from feedbackbuffer where mealid='+mid;
	console.log(sql);
	conn.query(sql,function(err,result)
	{
		if(err)
		{
			return res.render('feedback.ejs',{Error:"Server Error, Try again.",link:"Click Here"});
		}
		else
		{
			var ec=result[0].expectedCount;
			var ac=result[0].actualCount;
			var agg=parseInt(result[0].aggregate);
			if(ac<ec)
			{
				var nac=ac+1;
				var nagg=agg+rating;
				var sql='update feedbackbuffer set actualCount= '+nac+', aggregate= '+nagg+' where mealid='+mid+';';
				conn.query(sql,function(err,request)
				{
					if (err)
						return res.render('feedback.ejs',{Error:"Error, Try again.",link:"Click Here"});
					else
					{
						if(nac==ec)
						{
							var score=parseInt(nagg)/parseInt(ec);
							score=parseInt(score);
							var hash=mid+'|'+score;
							console.log("To store in Blockchain: "+hash);
							contract.setData(hash).then(function(transaction)
							{
								console.log("Transaction hash is "+transaction.hash);
								txHash=transaction.hash;			        
								var sql2='update blockchainhash set feedbackhash="'+txHash+'" where mealID='+mid+';';
								conn.query(sql2,(error,result)=>
								{
									if(error)
										return res.render('feedback.ejs',{Error:"Error, Try again.",link:"Click Here"});
									else
									{
										var sql3='update assignedmeals set status=0 where mealID='+mid+';';
										conn.query(sql3,(error,result)=>
										{
											if(error)
												return res.render('feedback.ejs',{Error:"Error, Try again.",link:"Click Here"});
											else
											{
												console.log('Feedback stored in Blockchain successfully.');
												return res.render('feedback.ejs',{Error:"Success. Thanks for submitting your valuable feedback.",link:"Click Here"});
											}
										})
									}
								})
							})
						}
						else
							return res.render('feedback.ejs',{Error:"Success. Thanks for submitting your valuable feedback.",link:"Click Here"});
					}
				})
			}
			else
			{
				return res.render('feedback.ejs',{Error:"Cannot submit. Adequate Feedback received already.",link:"Click Here"});
			}
		}
	})
})


//VERIFICATION
app.get("/searchMeals",function(req,res){
    res.render(__dirname+'/views/searchMeals.ejs',{records:""})
})


app.get("/verifyMeals",function(req,res){
    res.render(__dirname+'/views/verifyMeals.ejs',{records:""})
})


app.post("/mealDetailBySchool",function(req,res)
{
    var schoolid=req.body.Schoolid;
    var sql="select * from assignedmeals where schoolid="+schoolid+";";
	conn.query(sql,function(err,result)
	{
		if (err)
		{
			res.render('searchMeals',{records:result});

		}
		else
		{
			console.log(result);
			res.render('searchMeals',{records:result});
		}
	})
});


app.post("/mealDetailByCaterer",function(req,res){
    var catererid=req.body.Catererid;
	var sql="select * from assignedmeals where catererid="+catererid+";";
	conn.query(sql,function(err,result)
	{
		if (err)
		{	
			res.render('searchMeals',{records:result});
		}
		else
		{
			console.log(result);
			res.render('searchMeals',{records:result});
		}
	})

})
app.post("/mealDetailByBlockchain",function(req,res)
{
	console.log("-------------------------------VERIFICATION-------------------------------");
    var mid=req.body.mealid;
	console.log("Meal ID is "+mid)
	var sql="select catererHash, schoolHash, feedbackHash from blockchainHash where mealID= "+mid+";";
    conn.query(sql,function(err,res3)
	{
		if(err)
			return res.render('verifyMeals',{records:''});
		else if(res3.length==0)
			return res.render('verifyMeals',{records:''});
		else
		{
			var catererTxHash=res3[0].catererHash;
			var schoolTxHash=res3[0].schoolHash;
			var feedbackTxHash=res3[0].feedbackHash;
			var sql1='select * from catererMealDetails where mealID='+mid+';';
			var catererHash1="hash";
			conn.query(sql1,(err,result1)=>
			{
				if(err)
				{
					return res.render('verifyMeals',{records:''});
				}
				else if(result1.length==0)
				{
					return res.render('verifyMeals',{records:''});
				}
				else
				{
					var mid=result1[0].mealID;
					var cid=result1[0].catererID;
					var sid=result1[0].schoolID;
					var tid=result1[0].transporterID;
					var ciot=result1[0].IoTMetricsScore;
					var cmc=result1[0].mealcode;
					var csc=result1[0].studentCount;
					var ctime=result1[0].preparationTime;
					var buffer=mid+'|'+cid+'|'+sid+'|'+tid+'|'+ciot+'|'+cmc+'|'+csc+'|'+ctime;
					var hash=sha256(buffer);
					catererHash1=hash;
					var sql2='select * from schoolmealdetails where mealid='+mid+';';
					var schoolHash1="hash";
					conn.query(sql2,(err,result2)=>
					{
						if(err)
						{
							return res.render('verifyMeals',{records:''});
						}
						else if(result2.length==0)
						{
							return res.render('verifyMeals',{records:''});
						}
						else
						{
							var mid=result2[0].mealID;
							var cid=result2[0].catererID;
							var sid=result2[0].schoolID;
							var tid=result2[0].transporterID;
							var siot=result2[0].IoTMetricsScore;
							var smc=result2[0].mealcode;
							var ssc=result2[0].studentCount;
							var stime=result2[0].acceptanceTime;
							var buffer2=mid+'|'+cid+'|'+sid+'|'+tid+'|'+siot+'|'+smc+'|'+ssc+'|'+stime;
							var hash2=sha256(buffer2);
							var schoolHash1=hash2;
							provider.getTransaction(catererTxHash).then((transactionCount) => 
							{
								const bcdata= transactionCount.data;
								var string = '';
								for (var i = 0; i < bcdata.length; i += 2)
								{
									string += String.fromCharCode(parseInt(bcdata.substr(i, 2), 16));
								}
								len=69+catererHash1.length;
								var catererHash2=string.substring(69,len);
								console.log('Caterer hash database '+catererHash1);
								console.log('Caterer hash blockchain '+catererHash2);
								provider.getTransaction(schoolTxHash).then((transactionCount) => 
								{
									const bcdata= transactionCount.data;
									var string = '';
									for (var i = 0; i < bcdata.length; i += 2)
									{
										string += String.fromCharCode(parseInt(bcdata.substr(i, 2), 16));
									}
									len=69+schoolHash1.length;
									var schoolHash2=string.substring(69,len);
									console.log('School hash database '+schoolHash1);
									console.log('School hash blockchain '+schoolHash2);
									provider.getTransaction(feedbackTxHash).then((transactionCount) => 
									{
										const bcdata= transactionCount.data;
										var string = '';
										for (var i = 0; i < bcdata.length; i += 2)
										{
											string += String.fromCharCode(parseInt(bcdata.substr(i, 2), 16));
										}
										var l=mid.toString().length+ 70;
										console.log(l);
										var feedbackBlockchain=string.substring(l);
										if(catererHash1==catererHash2)
										{
											if(schoolHash1==schoolHash2)
											{
												result1.tampered='False. Records are unaltered.'
												console.log("Information is unaltered!");
												result1.iotSchool=siot;
												result1.studentPresent=ssc;
												result1.deliveryTime=stime;
												result1.mealReceivedBySchool=smc;
												result1.catererTxHash=catererTxHash;
												result1.schoolTxHash=schoolTxHash;
												result1.feedbackTxHash=feedbackTxHash;
												result1.feedbackRating=feedbackBlockchain;
												result1.schoolMealCode=smc;
												console.log(result1);
												return res.render('verifyMeals',{records:result1});
											}
											else
											{
												result1.tampered='True. Records are altered. Contact Ministry of Education for help.';
												return res.render('verifyMeals',{records:null});
											}
										}
									});
								});
							});
						}
					})
				}
			})
		}
	})
})
app.listen('3001',()=>
{
    console.log("listning at port 3001")
});