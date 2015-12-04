var helper = {};
var _ = require('underscore')._;
helper.apiData = [];
helper.getData = function(req,res,next){
	console.log('hello getData');
	var request = require('request');
	request('https://registration.gputechconf.com/cubehenge/json.php/GTC.MobileGuestServices.getSessions/GTC%202015/true', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	req.bodyResult = body;
	  	next();
	  }	  
	});
};

helper.getRefinedData = function(req,res,next){
	var request = require('request');
	request('https://registration.gputechconf.com/cubehenge/json.php/GTC.MobileGuestServices.getSessions/GTC%202015/true', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  console.log("got the data");	
	  	req.bodyResult = JSON.parse(body);
	  	var CollectSpeakerInfo = [];
	  	// console.log(typeof(req.bodyResult));	  	
	  	 for (var i = 0; i < req.bodyResult.length; i++) {	 	
	  	 	if(req.bodyResult[i].speakerInfo.length >= 1){	  	 		
	  	 		for (var j = 0; j < req.bodyResult[i].speakerInfo.length; j++) {	  	 			
	  	 			var obj ={};
	  	 			obj.name = req.bodyResult[i].speakerInfo[j].name;
	  	 			obj.organization = req.bodyResult[i].speakerInfo[j].organization;
	  	 			obj.email = req.bodyResult[i].speakerInfo[j].email;
	  	 			obj.jobTitle = req.bodyResult[i].speakerInfo[j].jobTitle;
	  	 			obj.sessionId = req.bodyResult[i].id;
	  	 			CollectSpeakerInfo.push(obj);
	  	 		};
	  	 	}else{
	  	 		var obj = {};
	  	 			obj.name = req.bodyResult[i].speakerInfo.name;
	  	 			obj.organization = req.bodyResult[i].speakerInfo.organization;
	  	 			obj.email = req.bodyResult[i].speakerInfo.email;
	  	 			obj.jobTitle = req.bodyResult[i].speakerInfo.jobTitle;
	  	 			obj.sessionId = req.bodyResult[i].id;
	  	 			CollectSpeakerInfo.push(obj);
	  	 	}
	  	 };
	  	 var ALLSpeakersgiven = CollectSpeakerInfo;
          //refining using underscore
          var names = _.groupBy(ALLSpeakersgiven,'name');
	  	  	//console.log(req.bodyResult.length);
	  	  	//res.send(CollectSpeakerInfo);
          req.names= names;
          req.ALLSpeakersgiven =ALLSpeakersgiven;
          next();
	  }
	});
};


helper.speakerDisplay = function(req,res,next){
    console.log("in speakerDisplay");
    console.log(typeof(req.bodyResult));
    var p =req.bodyResult;
    var speakerStructure =[]
   for (var key in (p)) {
  if (p.hasOwnProperty(key)) {
    //console.log(key + " -> " + p[key]);
      speakerStructure.push(key+'has spoken at '+p[key].length+' session(s)');
  }
}
    //console.log(req.bodyResult[31])
     req.speakerMe = speakerStructure;
    next();
}
helper.organizationInfo = function(req,res,next){
    var listOfOrg =[];
    
    
    var p =req.bodyResult;
    /* for (var key in (p)) {
  if (p.hasOwnProperty(key)) {
    
  }
}*/
   
    for(var i=0;i< req.bodyResult.length;i++){
        //console.log(listOfOrg.length);
        if(listOfOrg.length==0){
            console.log('Add first Organization in List');
            var orgStructure = {};
            orgStructure.organizationName =req.bodyResult[0].organization;
            orgStructure.employee = [];
            orgStructure.employee.push(req.bodyResult[0].name);
            orgStructure.sessions= [];
            orgStructure.sessions.push(req.bodyResult[0].sessionId);
        listOfOrg.push(orgStructure);
        }else{
                //console.log('in condition 2nd');
                //check if the list of Org already has the Organization
                for(var k=0;k<listOfOrg.length;k++){
                    //comparing organization name
                    console.log('comparing '+req.bodyResult[i].organization+' with '+listOfOrg[k].organizationName);
                    if(req.bodyResult[i].organization == listOfOrg[k].organizationName){
                        console.log('Organization Match found! Will now compare employee');
                        //now collect employees of the organization
                        for(var j=0;j<listOfOrg[k].employee.length;j++){
                            console.log('Employee being compared (new) '+req.bodyResult[i].name+' (existing) '+ listOfOrg[k].employee[j]);
                            if(req.bodyResult[i].name == listOfOrg[k].employee[j]){
                                console.log('employee matched! will now compare sessions');
                                //org match and employee match is done will next check the session
                                for(var s=0;s<listOfOrg[k].sessions.length;s++){
                                    console.log('comparing session '+req.bodyResult[i].sessionId+' with '+listOfOrg[k].sessions[s] )
                                    if(req.bodyResult[i].sessionId == listOfOrg[k].sessions[s]){
                                        //exact match do nothing
                                        // Add a console message for a duplicate record. //Saurabh
                                        //i++; //Saurabh
                                        break;//Saurabh
                                    }//else{
                                        //listOfOrg[k].sessions.push(req.bodyResult[i].sessionId);
                                    //}
                                }//end for for session//Saurabh
                                //session not found //Saurabh
                                if (s==listOfOrg[k].sessions.length)//Saurabh
                                    {
                                        listOfOrg[k].sessions.push(req.bodyResult[i].sessionId);
                                    }
                                break;
                            }//else{//Saurabh
                                //console.log(typeof(listOfOrg[k].employee);
                                //console.log('different employee found will push '+req.bodyResult[i].name);
                                //listOfOrg[k].employee.push(req.bodyResult[i].name);
                                //listOfOrg[k].sessions.push(req.bodyResult[i].sessionId);
                            //}// end if for employee
                        }//end for for employee
                        if(j==listOfOrg[k].employee.length)
                            {
                                console.log('different employee found will push '+req.bodyResult[i].name);
                                listOfOrg[k].employee.push(req.bodyResult[i].name);
                                listOfOrg[k].sessions.push(req.bodyResult[i].sessionId);
                            }
//                        for(var s=0;s<listOfOrg[k].sessions.length;s++){
//                                    console.log('comparing session '+req.bodyResult[i].sessionId+' with '+listOfOrg[k].sessions[s] )
//                                    if(req.bodyResult[i].sessionId == listOfOrg[k].sessions[s]){
//                                        //exact match do nothing
//                                        i++;
//                                    }else{
//                                        listOfOrg[k].sessions.push(req.bodyResult[i].sessionId);
//                                    }
//                                }
                    break;
                             }
//                    else{console.log('not a match creating new object');
//                        //if organization does not match then push it to the list of org
//                        var orgStructure = {};
//                        orgStructure.organizationName =req.bodyResult[i].organization;
//                        orgStructure.employee = [];
//                        orgStructure.employee.push(req.bodyResult[i].name);
//                        orgStructure.sessions =[];
//                        orgStructure.sessions.push(req.bodyResult[i].sessionId);
//                        listOfOrg.push(orgStructure);
//                          i++;
//                    }
                }//end org compare for
                if(k==listOfOrg.length)
                    {
                        var orgStructure = {};
                        orgStructure.organizationName =req.bodyResult[i].organization;
                        orgStructure.employee = [];
                        orgStructure.employee.push(req.bodyResult[i].name);
                        orgStructure.sessions =[];
                        orgStructure.sessions.push(req.bodyResult[i].sessionId);
                        listOfOrg.push(orgStructure);
                    }
            
        }
//       var orgStructure = {};
//    orgStructure.organizationName ='';
//    orgStructure.employee =[];
//    orgStructure.sessions=[];
//        listOfOrg.push(orgStructure);
    }
    //console.log(req.bodyResult.length);
    req.orgData = listOfOrg;
    console.log(listOfOrg.length);
    next();
}
helper.organizationInfo_old = function(req,res,next){
    console.log("in task 2");
    //console.log(req.bodyResult);
    var org = _.groupBy(req.bodyResult,'organization');
    //req.orgData=org; //req.names.length;
    var orgStructure =[];
    var p =org;
    for (var key in (p)) {
  if (p.hasOwnProperty(key)) {
     // p.organization = 'enter OrgInfo';
    //console.log(key + " -> " + p[key]);
      orgStructure.push(key);
       // orgStructure.push(p);
  }
}
    req.orgData = org;
    next();
};

helper.getSessions = function(req,res,next){
    console.log("in session task");
    req.bodyResult = "TASK # HERE";
    next();
}
module.exports = helper;
