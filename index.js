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
 
const adapter = new FileSync('schedule.json');
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
const ScheduleFile = read.readFileSync('./schedule.json', 'utf8');
const reviewsFile = read.readFileSync('./reviews.json', 'utf-8');
const schedules = JSON.parse(ScheduleFile);
const reviews = JSON.parse(reviewsFile);

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

//keyword search but it does not work becuase there is an error
router.get('/search/:keyword', (req,res) => {
    const keyword = req.params.keyword;
    console.log(keyword);
    let difference = (2/(keyword.length));
    console.log(difference);
    let result =[];
    
    for(var i =0; i < catalogue.length; i++){
        if(stringSimilarity.compareTwoStrings(keyword, catalogue[i]["catalog_nbr"]) >= difference){
            console.log("similar");
            result.push(catalogue[i]);
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


//this works but is not connected to front end yet 
//puts the review in the database
secure.post('/reviews', (req,res)=>{
    const newReview = req.body;
    let go = false;

    //this makes sure that chosen course exists
    for(var i = 0; i < catalogue.length; i++){
        if(catalogue[i].subject === newReview.subject) {
            if(catalogue[i].catalog_nbr === newReview.courseCode){
                go = true; 
            }
        }
    }
    if(go){
        reviewsDB.get('reviews').push(newReview).write();
        res.send({status:1});
    } else {
        res.send({status:4});
    }
});


//gets the reviews for a specific course 
router.get("/reviews/find/:subject/:code", (req,res)=>{
    const courseReviews = req.params.code;
    console.log(courseReviews)
    res.send(reviewsDB.get('reviews').find({courseCode:courseReviews}).value());
});


//delete a specific schedule from database
secure.get('/schedules/delete/:schd', (req,res)=>{
    const schd = req.params.schd;
        db.get('schedules').remove({name:schd}).write();
        res.send("Schedule deleted"); //sends alert when schedule is deleted
});

//gets the most recent 10 schedules to display them to user
//this doesn't work like at all 
router.get('/schedules/all', (req, res) => {
    const v = "public";
    res.send( db.get('schedules').find({visibility:v}).value()); //sends all public schedules to front end
});

//This works but it only gives one result and we need all of them 
//gets schedules of a specific user
secure.get('/schd/:user', (req,res) => {
    const user = req.params.user;
    res.send(db.get('schedules').find({user:user}).value());
})

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
secure.post('/schedules/:schdName', (req,res) => {
    const foundSchedule = req.body;
    console.log(foundSchedule);
    //there is something wrong with this set up
    db.get('schedules').remove({name: foundSchedule.name }).write();
    db.get('schedules').push(foundSchedule).write();
    res.send(foundSchedule);
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