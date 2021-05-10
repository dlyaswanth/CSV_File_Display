const express=require('express')
const path = require('path')
const router=express.Router() 
const mysql=require('mysql') 
const app=express()
const PORT=process.env.PORT ||9000;
app.use(express.json());
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
const fs = require("fs");
const csv = require("fast-csv");
var temp=0;
global.__basedir = __dirname + "/..";
var con = mysql.createConnection({  
  host: "localhost",  
  user: "root",  
  password: "password",
  database:"csvdb"
});  
con.connect(function(err) {  
  if (err) throw err;  
  console.log("Connected!");  
});  
router.post('/',function(req,res)
{
  if (req.body.file.length>=1){
    let path1 =  __dirname+"\\"+req.body.file.split('\\')[2];
    fs.createReadStream(path1)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      
      .on("data", (row) => {
        const keys = Object.keys(row);
        if (temp==0)
        {
          console.log(keys[0],keys[1]);
          var sql = "create table if not exists csv_datatable(Game_Number varchar(150),Game_Length varchar(150))";
          con.query(sql,function (err, result) {
            if (err) throw err;
            // console.log("Number of records inserted: " + result.affectedRows);
          });
          temp=1;
        }
        else
        {
          var sql="insert into csv_datatable values (?,?)"
          con.query(sql,[row[keys[0]],row[keys[1]]],function (err, result) {
            if (err) throw err;
            // console.log("Number of records inserted: " + result.affectedRows);
          });
        }
      })
      .on('end', () => {
        console.log("All data Updated in database")
        var sql="select * from csv_datatable"
        con.query(sql,function (err,result)
        {
          if (err) throw err
          console.log(result)
          res.json(result)
        })
      });      
}
})
app.use(router)

app.listen(PORT,()=>{
    console.log("Server on ",PORT); 
 })