import express, { Request, Response } from 'express';
import cors from 'cors'
import cookieParser from "cookie-parser";
import connectDB from './utils/dbConnect';
import userRoute from './routes/userRoute'

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("Dlancer-FYP"))

connectDB();

app.use('/api/users', userRoute)

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
