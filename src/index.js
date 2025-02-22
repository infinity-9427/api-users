import { createApp } from "./app.js";
import { userRouter } from "./routes/user.route.js";
import { transactionRouter } from "./routes/transaction.route.js";

const PORT = process.env.PORT || 4000;

const { app, port } = createApp({ port: PORT });

app.use("/api/v1/users", userRouter);
app.use("/api/v1/transactions", transactionRouter);


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
