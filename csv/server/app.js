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
        var values=[];
        console.log(keys)
        keys.map(item=>values.push(""+`${item.toString().replace(/ /g,"_")}`+" varchar(150)"))
        value=[values.toString().replace(/['"]+/g, '')]
        console.log(values)
          var sql = `create table if not exists csvdb.csv_datatable(${[values]})`;
          con.query(sql,function (err, result) {
            if (err) throw err;
            // console.log("Number of records inserted: " + result.affectedRows);
          });
          const val=[];
          keys.forEach(element => {
            val.push(""+row[element].toString().trim()+"")
          });
          console.log(val)
          var sqlQ=`insert into csvdb.csv_datatable values(?);`
          con.query(sqlQ,[val],function (err, result) {
            if (err) throw err;
            // console.log("Number of records inserted: " + result.affectedRows);
          });
      })
      .on('end', () => {
        console.log("All data Updated in database")
        var sql="select * from csvdb.csv_datatable"
        con.query(sql,function (err,result)
        {
          if (err) throw err
          console.log(result)
          var sql1="drop table csvdb.csv_datatable"
        con.query(sql1,function(err,res)
        {
          if (err) throw err
          console.log(res)
        })
          res.json(result)
        })
        
      });      
}
})
app.use(router)

app.listen(PORT,()=>{
    console.log("Server on ",PORT); 
 })