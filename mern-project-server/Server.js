const express = require('express');
const authRoutes = require('./src/routes/authRoutes');
const cookieParser = require('cookie-parser');

const app = express();


app.use(express.json());
app.use(cookieParser());


app.use('/auth', authRoutes);  

const PORT = 5001;
app.listen(PORT, (error) => {
    if (error) {
        console.log('Error starting the server', error);
    } else {
        console.log(`Server is running at http://localhost:${PORT}`);
    }
});
