require("dotenv").config();
let express = require("express");

let PORT = process.env.PORT || 8082

let app = express();
app.use(express.json());  //lets us parse json in the request body
app.use(express.static("public"))  //lets us use a static folder for html

app.use(require("./routes/authentication"))
app.get("/hello", function(req, res){

    res.send("Hello");
})

 app. listen(PORT, function(){
    console.log("Application has started on port ", PORT);

 })
