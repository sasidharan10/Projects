const express = require('express');
const app = express();
const host = "127.0.0.1";
const port = process.env.PORT || 5000;  // hosting step 1
var model = require("./static/js/model");

var fullData = model.find({});

// EXPRESS SPECIFIC STUFFS
app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: true }));
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
    res.render(__dirname + '/views/index.html');
});

app.get('/about', (req, res) => {
    res.render(__dirname + '/views/about.html');
});

app.get('/mentor', (req, res) => {
    res.render(__dirname + '/views/mentor.html');
});

app.get('/join', (req, res) => {
    res.render(__dirname + '/views/join.html', { message: '' });
});

// storing data in DB

// app.post('/join', (req, res) => {
//     var mydata = new model({
//         name: req.body.name,
//         phone: req.body.phone,
//         email: req.body.email,
//         address: req.body.address,
//         course: req.body.course,
//     });
//     mydata.save((err,data)=>{
//         if(err) throw err;
//         fullData.exec((err, data) => {
//             if(err) throw err;
//             res.render(__dirname + '/views/join.html', { message:'success' });
//         })
//     })
// });

app.post('/join', (req, res) => {
    var mydata = new model(req.body);
    mydata.save().then(() => {
        res.status(200).render(__dirname + '/views/join.html', { message: 'success' });
    }).catch(() => {
        res.status(404).render(__dirname + '/views/join.html', { message: 'failed' });
    })
});

// showing data

app.get('/student', (req, res) => {
    fullData.exec((err, data) => {
        if (err) throw err;
        res.render(__dirname + '/views/student.html', { record: data,message:''});
    })
});

// deleting data

app.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    var del = model.findByIdAndDelete(id);
    del.exec((err, data1) => {
        if (err) throw err;
        // console.log(data1);
        // console.log("data1 over");
        fullData.exec((err, data2) => {
            if (err) throw err;
            // console.log(data2);
            res.render(__dirname + '/views/student.html', { record: data2,message:'deleted' });
        })
    })
});

// updating data

app.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    let edit = model.findById(id);
    edit.exec((err, data) => {
        if (err) throw err;
        res.render(__dirname + '/views/edit.html', { record: data });
    })

});

app.post('/update', (req, res) => {
    let id = req.body.id;
    let update = model.findByIdAndUpdate(id, {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        course: req.body.course,
    });
    update.exec((err,data1) => {
        if (err) throw err;
        // console.log(data1);
        // console.log("data1 over");
        fullData.exec((err, data2) => {
            // console.log(data2);
            if (err) throw err;
            res.render(__dirname + '/views/student.html', { record: data2,message:'updated' });
        })
    })

});


app.listen(port, () => {
    console.log(`The application started successfully at : http://${host}:${port}`);
});