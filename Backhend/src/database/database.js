const mongoose=require('mongoose');

async function ConnectDb() {

    try{

       await mongoose.connect(process.env.MONGOURI);
       console.log('Database Connected');
    }catch(error){
        console.log(error.message)
    }
}

module.exports=ConnectDb;