import express from "express"
import {connectDB} from "./db.js";
const app = express();
const port = process.env.PORT || 3000;
import contactRoutes from "./routes/contactRoutes.js";

app.use(express.json())

app.get("/", (req, res) => {
    res.send("API is running!");
});


app.use('/',contactRoutes)



connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.error('Failed to connect to the database:', error.message);
});

