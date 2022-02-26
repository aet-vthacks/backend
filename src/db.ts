import { Exercise, Pet, User } from "models";
import "reflect-metadata";
import { createConnection } from "typeorm";

await createConnection({
	type: "postgres",
	host: "learnpy_db",
	username: "learnpy",
	password: "learnpy",
	database: "learnpy",
	synchronize: true,
	entities: [User, Pet, Exercise]
});

console.log("Database Connected");
