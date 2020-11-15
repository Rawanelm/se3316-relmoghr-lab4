const express = require('express');
const app = express();
const port = process.env.PORT || 3000; 
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
let courseArray = [];
let courseCodes= [];

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
 
const adapter = new FileSync('schedule.json');
const db = low(adapter);

db.defaults({schedules: []})

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
const ScheduleFile = read.readFileSync('./schedule.json', 'utf8');

//deletes all schedules
router.get('/schedules/del/all', (req,res)=>{
    if (db.has('schedules').value()){
        db.get('schedules').remove({}).write() //remove found schedule from database
    }
    res.send("Schedules deleted.")//send alert to front end
});

//send course and subject codes list given the schedule name
router.get('/schedules/print/:schd', (req, res) => {
    const s = req.params.schd;
    res.send(db.get('schedules').find({name: s}).value());//sends requested schedules to front end
});

//gets all the schedules to display them to user
router.get('/schedules/all', (req, res) => {
    res.send(db.get('schedules').value()); //sends all schedule to front end
});

//check if the schedule exits or not 
router.get('/schedules/check/:schd',(req, res) => {
    const sch = req.params.schd;

    if(db.get('schedules').find({name:sch}).value() === undefined){
       res.send("Proceed"); //sends proceed when the schedule name doesn't exist in database
    }
    else{
        res.send("Stop"); //sends stop when the schedule name doesn't exist in database
    }
});

//delete a specific schedule from database
router.get('/schedules/delete/:schd', (req,res)=>{
    const schd = req.params.schd;

    if(db.get('schedules').find({name:schd}).value() === undefined){
        res.send("Schedule doesn't exist"); //sends alert when requestedschedule doesn't exist
    }
    else{
        db.get('schedules').remove({name:schd}).write();
        res.send("Schedule deleted"); //sends alert when schedule is deleted
    }
});

//check if the schedule exits or not 
router.get('/schedules/find/:schd',(req, res) => {
    const sch = req.params.schd;

    if(db.get('schedules').find({name:sch}).value() === undefined){
       res.send("Shchedule does not exist");
    }
    else{
        db.get('schedules').find({name:sch}).value();
       res.send(db.get('schedules').find({name:sch}).value());
    }
});

//save schedule with content added by user
router.post('/schedules/find/:schdName', (req,res) => {
    const foundSchedule = req.body;
    console.log(foundSchedule);
    db.get('schedules').remove({name: foundSchedule.name }).write();
    db.get('schedules').push(foundSchedule).write();
    res.send(foundSchedule);
});


//Save Schedule Name
router.post('/', (req,res) => {
    const schedule = req.body;
    console.log(schedule);
    db.get('schedules').push(schedule).write();
    res.send(schedule);

});

//enable us to read and parse JSON file
const fs = require('fs');
const file = fs.readFileSync('./Lab3-timetable-data.json', 'utf8', function(err, data) {
});
const catalogue = JSON.parse(file);

//logs the request made to server
app.use((req, res ,next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

//get all subject codes and course names and place them into an array
router.get('/subject', (req, res) => {

 for(var i = 0; i < catalogue.length; i++){
    let courseObjects = new Object();
    for(var j = 0; j < catalogue.length; j++){
        //set new object's properties
        courseObjects.subject = catalogue[i].subject;
        courseObjects.class = catalogue[i].className;
        if(catalogue[i].course_info[0]){
            courseObjects["component"] = catalogue[i].course_info[0]["ssr_component"];
            courseObjects["startTime"] = catalogue[i].course_info[0]["start_time"];
            courseObjects["endTime"] = catalogue[i].course_info[0]["end_time"];
            courseObjects["days"] = catalogue[i].course_info[0]["days"];
        }
    }
    courseArray.push(courseObjects); //add object to array
    } 
    console.log("Request Recieved"); 
    res.send(courseArray); //send the array
});

// used to get course Codes for a specific subject code
router.get('/subject/:code', (req,res) => {
const sCode = req.params.code;
const courses = catalogue.filter( c => c.subject == sCode);

console.log(`GET request for ${req.url}`);
    
    if (courses.length > 0){
        for(var i = 0; i < catalogue.length; i++){
            let foundCourse = new Object();
            if(catalogue[i].subject === sCode) {
                foundCourse["subject"] = catalogue[i]["subject"];
    
                if(catalogue[i].catalog_nbr){
                    foundCourse["class"] = catalogue[i]["catalog_nbr"];
    
                    if(catalogue[i].course_info[0].ssr_component){
                        foundCourse["component"] = catalogue[i].course_info[0]["ssr_component"];
                        foundCourse["startTime"] = catalogue[i].course_info[0]["start_time"];
                        foundCourse["endTime"] = catalogue[i].course_info[0]["end_time"];
                        foundCourse["days"] = catalogue[i].course_info[0]["days"];
                    }
                    courseCodes.push(foundCourse);
                }
            }
        }
    res.send(courseCodes);
    }

    if (courses.length == 0){
        res.status(404).send(`Course ${subject} was not found`)
    }
});

//used to get timetable for a specific course
router.get('/subject/:sCode/:cCode/:comp', (req,res) => {
    const sCode = req.params.sCode;
    const cCode = req.params.cCode;
    const comp = req.params.comp;
    let times = [];

    for(var i = 0; i < catalogue.length; i++){

        let foundCourse = new Object();
        if(catalogue[i].subject === sCode) {
            foundCourse["subject"] = catalogue[i]["subject"];

            if(catalogue[i].catalog_nbr === cCode){
                foundCourse["class"] = catalogue[i]["catalog_nbr"];

                if(catalogue[i].course_info[0].ssr_component === comp){
                    foundCourse["component"] = catalogue[i].course_info[0]["ssr_component"];
                    foundCourse["startTime"] = catalogue[i].course_info[0]["start_time"];
                    foundCourse["endTime"] = catalogue[i].course_info[0]["end_time"];
                    foundCourse["days"] = catalogue[i].course_info[0]["days"];
                }
                times.push(foundCourse);
            }
        }
    }

    if (times.length > 0){
        res.send(times);
    }

    if(times.length === 0){
        res.status(404).send(`Error: course not found.`)
    }
});

//used to get timetable for a specific course
router.get('/subject/:sCode/:cCode', (req,res) => {
    const sCode = req.params.sCode;
    const cCode = req.params.cCode;
    let times = [];

    for(var i = 0; i < catalogue.length; i++){

        let foundCourse = new Object();
        if(catalogue[i].subject === sCode) {
            foundCourse["subject"] = catalogue[i]["subject"];

            if(catalogue[i].catalog_nbr === cCode){
                foundCourse["class"] = catalogue[i]["catalog_nbr"];

                if(catalogue[i].course_info[0]){
                    foundCourse["component"] = catalogue[i].course_info[0]["ssr_component"];
                    foundCourse["startTime"] = catalogue[i].course_info[0]["start_time"];
                    foundCourse["endTime"] = catalogue[i].course_info[0]["end_time"];
                    foundCourse["days"] = catalogue[i].course_info[0]["days"];
                }
                times.push(foundCourse);
            }
        }
    }

    if (times.length > 0){
        res.send(times);
    }

    if(times.length === 0){
        res.status(404).send(`${comp} not found.`)
    }
});

//minimizes repition
app.use('/api/catalog', router);
router.use(express.json());
//logs listening to console
app.listen(port, () => {console.log('Listening on port ' + port)});

module.exports = router;