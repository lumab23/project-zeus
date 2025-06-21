import app from "./app.js";
import "./database/connection.js";

const PORT = process.env.PORT || 3001;

// inicia o server
app.listen(PORT, () => {
    console.log(`Server started in port ${PORT}`);
});

