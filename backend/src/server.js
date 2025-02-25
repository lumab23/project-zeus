import app from "./app.js";
import "./database/connection.js";

const PORT = process.env.PORT;

// inicia o server
app.listen(PORT, () => {
    console.log(`Server started in port ${PORT}`);
});

