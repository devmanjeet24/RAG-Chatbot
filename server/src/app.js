const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const errorMiddleware = require("./middleware/error.middleware");
const rateLimiter = require("./middleware/rateLimit.middleware");

const app = express();

app.use(cors({
  origin: "https://ragchatbo.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 Apply Rate Limiter
app.use(rateLimiter);

app.use("/api", routes);

app.use('/',(req,res)=>{
    res.send("Welcome to RAG Chatbot API");
})

app.use(errorMiddleware);

module.exports = app;