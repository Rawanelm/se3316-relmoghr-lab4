const express = require('express');
const app = express();
const port = process.env.PORT || 3000; 
const router = express.Router();
const secure = express.Router();
const admin = express.Router();
const bodyParser = require('body-parser');
var stringSimilarity = require('string-similarity');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
 
const adapter = new FileSync('schedule1.json');
const reviewsAdapter = new FileSync('reviews.json');
const db = low(adapter);
const reviewsDB = low(reviewsAdapter);


app.use(express.static(process.cwd() +'/angularApp/dist/angularApp'));
app.use(express.json());

router.get('/', (req,res) => {
    res.sendFile(process.cwd() + '/angularApp/dist/angularApp/index.html');
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : true
}));

const read = require('fs');
const ScheduleFile = read.readFileSync('./schedule1.json', 'utf8');
const reviewsFile = read.readFileSync('./reviews.json', 'utf-8');
const scheduleReader = JSON.parse(ScheduleFile);
const reviewReader = JSON.parse(reviewsFile);

//policies database
const secPoliciesAdapter = new FileSync('secPolicies.json');
const secPoliciesDB = low(secPoliciesAdapter);
const dmcaPoliciesAdapter = new FileSync('dmcaPolicies.json');
const dmcaPoliciesDB = low(dmcaPoliciesAdapter);
const aupPoliciesAdapter = new FileSync('aupPolicies.json');
const aucPoliciesDB = low(aupPoliciesAdapter);
 
//database for email accs
const accountsAdapter = new FileSync('accounts.json');
const accountsDB = low(accountsAdapter);

//read provided JSON file
const fs = require('fs');
const e = require('express');
const accFileContent = fs.readFileSync('./accounts.json', 'utf8');

//read from files
const secPoliciesContent = fs.readFileSync('./secPolicies.json', 'utf8');
const dmcaPoliciesContent = fs.readFileSync('./dmcaPolicies.json', 'utf8');
const audPoliciesContent = fs.readFileSync('./aupPolicies.json', 'utf8');

//enable us to read and parse JSON file
const { stringify } = require('querystring');
const file = fs.readFileSync('./Lab3-timetable-data.json', 'utf8', function(err, data) {
});
const catalogue = JSON.parse(file);

//logs the request made to server
app.use((req, res ,next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

//keyword search but it does not work becuase there is an error
router.get('/search/:keyword', (req,res) => {
    const keyword = req.params.keyword;
    let result =[];
    
    for(var i =0; i < catalogue.length; i++){
        let foundCourse = new Object;

        var str = catalogue[i]["catalog_nbr"];
        var str2 = catalogue[i]["className"];
        console.log(str+str2);

        if(str.includes(keyword)|| str2.includes(keyword)){
            foundCourse["subject"] = catalogue[i]["subject"];
            foundCourse["class"] = catalogue[i]["catalog_nbr"];
            foundCourse["name"] = catalogue[i]["className"];
            foundCourse["description"] = catalogue[i]["catalog_description"]
                if(catalogue[i].course_info[0]){
                    foundCourse["component"] = catalogue[i].course_info[0]["ssr_component"];
                    foundCourse["startTime"] = catalogue[i].course_info[0]["start_time"];
                    foundCourse["endTime"] = catalogue[i].course_info[0]["end_time"];
                    foundCourse["days"] = catalogue[i].course_info[0]["days"];
                    foundCourse["class_nbr"] = catalogue[i].course_info[0]["class_nbr"];
                    foundCourse["descr"] = catalogue[i].course_info[0]["descr"];
                    foundCourse["facility_ID"] = catalogue[i].course_info[0]["facility_ID"];
                    foundCourse["campus"] = catalogue[i].course_info[0]["campus"];
                    foundCourse[" enrl_stat"] = catalogue[i].course_info[0][" enrl_stat"];
                    foundCourse["class_section"] = catalogue[i].course_info[0]["class_section"];
                }
            result.push(foundCourse);
        }
    }
    res.send(result);
});

//Implementaion of Course Search Functionality
//used to get timetable for a specific course based on search parameters
router.get('/:sCode/:cCode', (req,res) => {
    const sCode = req.params.sCode;
    const cCode = req.params.cCode;
    let times = [];

    for(var i = 0; i < catalogue.length; i++){
        let foundCourse = new Object();
        if(catalogue[i].subject === sCode) {
            foundCourse["subject"] = catalogue[i]["subject"];

            if(catalogue[i].catalog_nbr === cCode){
                foundCourse["class"] = catalogue[i]["catalog_nbr"];
                foundCourse["name"] = catalogue[i]["className"];
                foundCourse["description"] = catalogue[i]["catalog_description"]

                if(catalogue[i].course_info[0]){
                    foundCourse["component"] = catalogue[i].course_info[0]["ssr_component"];
                    foundCourse["startTime"] = catalogue[i].course_info[0]["start_time"];
                    foundCourse["endTime"] = catalogue[i].course_info[0]["end_time"];
                    foundCourse["days"] = catalogue[i].course_info[0]["days"];
                    foundCourse["class_nbr"] = catalogue[i].course_info[0]["class_nbr"];
                    foundCourse["descr"] = catalogue[i].course_info[0]["descr"];
                    foundCourse["facility_ID"] = catalogue[i].course_info[0]["facility_ID"];
                    foundCourse["campus"] = catalogue[i].course_info[0]["campus"];
                    foundCourse[" enrl_stat"] = catalogue[i].course_info[0][" enrl_stat"];
                    foundCourse["class_section"] = catalogue[i].course_info[0]["class_section"];
                }
                times.push(foundCourse);
            }
        }
    }
    console.log(times);
    if (times.length > 0){
        res.send(times);
    }
});

//puts the review in the database
secure.post('/review', (req,res)=>{
    const newReview = req.body;
        reviewsDB.get('reviews').push(newReview).write();
        res.send({status:1});
    
});

//This works
//gets the reviews for a specific course 
router.get("/reviews/find/:subject/:code", (req,res)=>{
    const code = req.params.code;
    const sub = req.params.subject;
    let revs = [], s =[];
    console.log(reviewReader.reviews.length);
    for(let i = 0; i<reviewReader.reviews.length; i++){
        s = reviewsDB.get('reviews').value();
        if(s[i].subject == sub && s[i].courseCode == code && s[i].visibility!= "hidden"){  
            revs.push(s[i]);
        }
    }
    console.log(revs);
    res.send(revs);
});

//delete a specific schedule from database
secure.get('/schedules/delete/:schd', (req,res)=>{
    const schd = req.params.schd;
        db.get('schedules').remove({name:schd}).write();
        res.send("Schedule deleted"); //sends alert when schedule is deleted
});

//this works
//gets the most recent 10 schedules to display them to user
router.get('/all', (req, res) => {
    let scheds = [], s =[];    
    for(let i = (scheduleReader.schedules.length-1); i>=0; i--){
        s = db.get('schedules').value();
        console.log(s[i])
        if(s[i].visibility == "public"){
            console.log(s[i].name);
            scheds.push(s[i]);
        }
    }

    for(let i = 0; i<(scheduleReader.schedules.length-10); i++){
        schds.shift();
    }
    res.send(scheds); //sends all public schedules to front end
});

//This works 
//gets schedules of a specific user
secure.get('/schd/:user', (req,res) => {
    const user = req.params.user;
    let scheds = [], s =[];
    
    for(let i = 0; i<scheduleReader.schedules.length; i++){
        s = db.get('schedules').value();
        console.log(s[i])
        if(s[i].user == user){
            console.log(s[i].name);
            scheds.push(s[i]);
        }
    }
    res.send(scheds);
})

//check if the schedule exits or not 
secure.get('/schedules/check/:schd',(req, res) => {
    const sch = req.params.schd;

    if(db.get('schedules').find({name:sch}).value() === undefined){
        res.send({status: 1});
    }
    else{
        res.send({status: 4});
    }
});

//save schedule with content added by user
secure.post('/schedule', (req,res) => {
    const foundSchedule = req.body;
    console.log(foundSchedule);
    db.get('schedules').push(foundSchedule).write();
    res.send(foundSchedule);
});

//writes new acc info to database
admin.post('/accounts', (req,res)=>{
    const newAccount = req.body;
    accountsDB.push(newAccount).write();
    res.send(newAccount);
});
 
//gets status of currently logged in email to see if they are an admin
admin.get('/status/:email', (req, res) => {
    const email = req.params.email;
    let adminExists = false;
 
    const allAccs = JSON.parse(accFileContent);
    for(var j = 0; j < allAccs.length; j++){
        if(allAccs[j]["account"]["email"] == email){
            if(allAccs[j]["account"]["access"] == "admin"){
                adminExists = true;
            }
        }
    }
    if(adminExists == true){
        res.send({status: 1});
    }
    else{
        res.send({status: 0});
    }
});
 
//takes an existing user and makes them an admin
admin.post('/new', (req,res)=>{
    const newAccount = req.body.email;
    const allAccs = JSON.parse(accFileContent);
    let dict = new Object();
    let accountObj = new Object();
    let counter = 0;
 
    for(var i = 0; i < allAccs.length; i++){
        if(allAccs[i]["account"]["email"] == newAccount){
            dict["name"] = allAccs[i]["account"]["name"];
            dict["email"] = allAccs[i]["account"]["email"];
            dict["status"] = allAccs[i]["account"]["status"];
            dict["access"] = "admin";
            counter++;
        }
    }
    accountObj = {account: dict};
            
    if(counter > 0){
        accountsDB.remove({account:{email:newAccount}}).write();  
        accountsDB.push(accountObj).write();
    }
    else{
        res.send({status: 0});
    }
});
 
//takes an existing user and deactivates/reactivates acc
admin.post('/activation', (req,res)=>{
    const emailAcc = req.body.email;
    const allAccs = JSON.parse(accFileContent);
    let dict = new Object();
    let counter = 0;
    
    for(var i = 0; i < allAccs.length; i++){
        if(allAccs[i]["account"]["email"] == emailAcc && allAccs[i]["account"]["status"] == "active"){
            dict["name"] = allAccs[i]["account"]["name"];
            dict["email"] = allAccs[i]["account"]["email"];
            dict["access"] = allAccs[i]["account"]["access"];
            dict["status"] = "deactive";
            counter++; counter++;
        }
        else if(allAccs[i]["account"]["email"] == emailAcc && allAccs[i]["account"]["status"] == "deactive"){
            dict["name"] = allAccs[i]["account"]["name"];
            dict["email"] = allAccs[i]["account"]["email"];
            dict["access"] = allAccs[i]["account"]["access"];
            dict["status"] = "active";
            counter++;
        }
    }
    accountObj = {account: dict};
 
    if(counter > 0){
        accountsDB.remove({account:{email:emailAcc}}).write();  
        accountsDB.push(accountObj).write();
        res.send({status: counter})
    }
    else{
        res.send({status: 0});
    }
});
 
//function to check if user is active before logging in 
admin.get('/activation/:email', (req,res)=>{
    const emailToLogin = req.params.email;
    const allAccs = JSON.parse(accFileContent);
    var login = false;
    for(var i = 0; i < allAccs.length; i++){
        if(allAccs[i]["account"]["email"] == emailToLogin && allAccs[i]["account"]["status"] == "active"){
            login = true;
            break;
        }
    }
    if(login == true){
        res.send({status: 1});
    }
    else{
        res.send({status: 0});
    }
}); 

//update security and privacy policy
admin.post('/security', (req,res)=>{
    const newSecPolicy = req.body;
    secPoliciesDB.push(newSecPolicy).write();
    res.send(newSecPolicy);
});
 
//update DMCA notice and takedown policy
admin.post('/DMCA', (req,res)=>{
    const newDMCAPolicy = req.body;
    dmcaPoliciesDB.push(newDMCAPolicy).write();
    res.send(newDMCAPolicy);
});
 
//update AUP 
admin.post('/AUP', (req,res)=>{
    const newAUPPolicy = req.body;
    aucPoliciesDB.push(newAUPPolicy).write();
    res.send(newAUPPolicy);
});
 
//read the policies from the db
admin.get('/update/:policy', (req,res)=>{
    const pol = req.params.policy;
 
    if(pol == "security"){
        const policies = JSON.parse(secPoliciesContent);
        res.send(policies);
        console.log(policies)
    }
    if(pol == "DMCA"){
        const policies = JSON.parse(dmcaPoliciesContent);
        res.send(policies);
    }
    if(pol == "AUP"){
        const policies = JSON.parse(audPoliciesContent);
        res.send(policies);
    }
});

secure.get('/name/:email', (req,res)=>{
    const email = req.params.email;
    const allAccs = JSON.parse(accFileContent);
    let name = "";
    
    for(var i = 0; i < allAccs.length; i++){
        if(allAccs[i]["account"]["email"] == email){
            name = allAccs[i]["account"]["name"];
            break;
        }
    }

    if(name == ""){
        res.send({status: 0});
    }
    else{
        res.send(name);
    }
});

//minimizes repitition
app.use('/api/open', router);
app.use('/api/admin', admin);
app.use('/api/secure', secure);
router.use(express.json());
admin.use(express.json());
secure.use(express.json());

//logs listening to console
app.listen(port, () => {console.log('Listening on port ' + port)});

module.exports = router;
module.exports = admin;
module.exports = secure;