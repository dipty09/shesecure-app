const express = require('express');
const cors=require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const sosRoutes = require('./routes/sosRoutes');
const contactRoutes = require('./routes/contactRoutes');
const locationRoutes=require('./routes/locationRoutes');
dotenv.config();
connectDB();

const app = express();
app.use(express.json({limit:'5mb'}));
app.use(express.urlencoded({extended:true,limit:'5mb'}));
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/emergency-contacts', contactRoutes);
app.use('/api/location',locationRoutes);


app.get('/api/test',(_req,res)=>{
    res.send({message:'Women saftey app Backend is running'});
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
