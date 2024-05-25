import { app } from "./app";
import dbconnection from "./db/config";
const port = process.env.PORT || 3001;

(async()=>{
  try{
    await dbconnection.sync()
    console.log("Database successfully connected");
  }catch(err){
    console.log("Error", err);
  }
})();

const server = app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}/api`);
});
server.on("error", console.error);
app.listen(3001);
