import { serverHttp } from "./app";
import "./infra/socket/webSocket";

serverHttp.listen(3333, () => {
  console.log("server start on port 3333");
});
