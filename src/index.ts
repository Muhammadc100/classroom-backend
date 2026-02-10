import AgentAPI from "apminsight";
AgentAPI.config();
import express from "express";
import cors from "cors";
import { toNodeHandler } from 'better-auth/node'
import subjectRoutes from "./routes/subjects.js";
import userRoutes from "./routes/users.js";
import classesRoutes from "./routes/classes.js"
import securityMiddleware from "./middleware/security.js";
import { auth } from "./lib/auth.js";

const app = express();
const PORT = 8000;

if(!process.env.FRONTEND_URL){
    throw new Error('FRONTEND_URL is not set in .env file');
}

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.set("trust proxy", true);
app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());
app.use("/api", securityMiddleware);



app.use('/api/subjects', subjectRoutes)
app.use('/api/users', userRoutes)
app.use('/api/classes', classesRoutes)

app.get("/", (req, res) => {
  res.send("Hello, Welcome to the Classroom API!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});