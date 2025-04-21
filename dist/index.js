"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const PORT = 8000;
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    res.send("Hello world");
});
app.use("/users", user_routes_1.default);
app.listen(PORT, () => {
    console.log(`server is running on port http://localhost:${PORT}`);
});
