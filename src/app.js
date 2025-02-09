import express from "express";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 3300;

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
