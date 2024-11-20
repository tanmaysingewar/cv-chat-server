const express = require("express");
const bodyParser = require("body-parser");
const chatRoutes = require("./routes/chat");
const cors = require("cors"); // Import cors

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use("/cv", chatRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});


// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
