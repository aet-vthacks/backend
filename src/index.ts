import { App } from "@tinyhttp/app";
import { cors } from "@tinyhttp/cors";
import { logger } from "@tinyhttp/logger";
import { account } from "middleware";
import { json } from "milliparsec";
// import "python";
import { login, logout, me, signup } from "routes";
import "./db";

// Unknown is used for templating engines
const server = new App({
	settings: {
		xPoweredBy: false
	},

	noMatchHandler: (_req, res) => {
		return res.status(404)
			.send("404 Not Found");
	},

	onError: (err, _req, res) => {
		console.error("http error: %s", err);
		return res.status(500)
			.send("500 Internal Server Error");
	}
});

server.set("trust proxy", 1);

const dev = process.env.NODE_ENV === "development";
const origin = dev ? "http://learnpy.tale.me:3000" : "https://learnpy.tale.me";

server.use(logger());
server.use(json());
server.use(cors({
	origin,
	credentials: true,
	methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
	exposedHeaders: ["set-cookie"]
}));

server.post("/v1/signup", signup);
server.post("/v1/login", login);
server.post("/v1/logout", logout);
server.get("/v1/me", account, me);

server.listen(8080);
