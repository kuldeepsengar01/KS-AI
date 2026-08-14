require('dotenv').config();
const app=require('./src/app');
const ConnectDb=require('./src/database/database');

const port=process.env.PORT;

ConnectDb();

app.listen(port,()=>{
    console.log(`Server start on port ${port}`);
})