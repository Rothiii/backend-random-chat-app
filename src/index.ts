import server from "./app";

const port = process.env.PORT;
const url_server = process.env.API_URL? process.env.API_URL : `http://localhost:${port}`;

server.listen(process.env.PORT, () => {
  console.log(`Server running on ${url_server}`);
});