const express = require('express');
const app = express();
const port = process.env.PORT || 3000; 
const router = express.Router();
const secure = express.Router();
const admin = express.Router();
const bodyParser = require('body-parser');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
 
const adapter = new FileSync('schedule.json');
const userAdapter= new FileSync('users.json');
const db = low(adapter);
const userDB = low(userAdapter);

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

//used for users that are not signed in to register
router.post('/registration/:info', (req,res)=>{
    const newUser = req.body;
    
    if(userDB.get('users').find({email:newUser.email}).value() === undefined){
    userDB.get('users').push(newUser).write();
    res.send(newUser);
    } else { res.send("This email already has an account"); }
});

//delete a specific schedule from database
secure.get('/schedules/delete/:schd', (req,res)=>{
    const schd = req.params.schd;
        db.get('schedules').remove({name:schd}).write();
        res.send("Schedule deleted"); //sends alert when schedule is deleted
});

//gets all the schedules to display them to user
router.get('/schedules/all', (req, res) => {
    res.send(db.get('schedules').value()); //sends all schedule to front end
});

//check if the schedule exits or not 
secure.get('/schedules/check/:schd',(req, res) => {
    const sch = req.params.schd;

    if(db.get('schedules').find({Schd:{}}).find({name:sch}).value() === undefined){
        res.send({status: 1});
    }
    else{
        res.send({status: 4});
    }
});


//save schedule with content added by user
secure.post('/schedules/find/:schdName', (req,res) => {
    const foundSchedule = req.body;
    console.log(foundSchedule);
    foundSchedule.stringify();
    console.log(foundSchedule);
    db.get('schedules').remove({name: foundSchedule.schdName.name }).write();
    db.get('schedules').push(foundSchedule).write();
    res.send(foundSchedule);
});

//Save Schedule Name
secure.post('/', (req,res) => {
    const schedule = req.body;
    console.log(schedule);
    db.get('schedules').push(schedule).write();
    res.send(schedule);
});

//enable us to read and parse JSON file
const fs = require('fs');
const { stringify } = require('querystring');
const file = fs.readFileSync('./Lab3-timetable-data.json', 'utf8', function(err, data) {
});
const catalogue = JSON.parse(file);

//logs the request made to server
app.use((req, res ,next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});


router.get('/:code', (req,res) => {
    const sCode = req.params.code;
    const courses = catalogue.filter( c => c.subject == sCode);
    
    console.log(`GET request for ${req.url}`);
      
        if (courses.length >0){
    
            for(var i = 0; i<courses.length;i++){
            courseCodes[i] = courses[i].catalog_nbr;
            }
    
        res.send(courseCodes);
        }
    
        if (courses.length == 0){
            res.status(404).send(`Course ${subject} was not found`)
        }
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
                foundCourse["name"] = catalogue[i]["className"]

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