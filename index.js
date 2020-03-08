const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
admin.initializeApp();

const config={
  apiKey: "AIzaSyBoZXP8RUjFmk7AaK6ErHmsYQcwIOm6Mnc",
  authDomain: "social-ape-8e0a2.firebaseapp.com",
  databaseURL: "https://social-ape-8e0a2.firebaseio.com",
  projectId: "social-ape-8e0a2",
  storageBucket: "social-ape-8e0a2.appspot.com",
  messagingSenderId: "11755231689",
  appId: "1:11755231689:web:d88de36797d81eaeafb018",
  measurementId: "G-3C0S2WW5RW"
};



const firebase = require('firebase');
firebase.initializeApp(config);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//


app.get('/screams',(req,res)=>{
    admin.firestore().collection('screams').
    orderBy('createdAt','desc').get().then(
        data=>{
            let screams=[];
            data.forEach(doc=>{
                screams.push(
                    {
                        screamId:doc.id,
                        body:doc.data().body,
                        userHandlr:doc.data().userHandlr,
                        createdAt:new Date().toISOString()
                    }
                );
            });
            return res.json(screams);
        }
    ).catch(err=>console.log(err))
})
app.post('/scream',(req,res)=>{
    
    const newScream={
        body:req.body.body,
        userHandlr:req.body.userHandlr,
        createdAt:new Date().toISOString()
    };
    
    admin.firestore()
    .collection('screams')
    .add(newScream)
    .then(doc=>{
        res.json({
            message:`document ${doc.id} created successfully`
        })}).catch(err=>{
            res.status(500).json({
                error:'something went wrong'
            });
            console.log(err);
        })
    })

//Sign-up route
app.post('/signup',(req,res)=>{
    const newUser ={
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword,
        handlr:req.body.handlr
    };
    firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email,newUser.password)
    .then((data)=>{
        return res
        .status(201)
        .json({message:`user ${data.user.uid} created successfully`});

    })
    .catch((err)=>{
        console.log(err);
        return res.status(500).json({error:err.code});
    })

});

exports.api=functions.region('europe-west1').https.onRequest(app);

