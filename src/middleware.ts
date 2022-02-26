import { NextFunction, Response } from "@tinyhttp/app";
import { User } from "models";
import nextSession from "next-session";
import { getRepository } from "typeorm";
import { RichRequest } from "types";

export async function session(req: RichRequest, res: Response, next: NextFunction) {
	const getSession = nextSession({
		cookie: {
			secure: process.env.NODE_ENV !== "development",
			sameSite: false
		}
	});

	req.session = await getSession(req, res);
	next();
}


export async function account(req: RichRequest, res: Response, next: NextFunction) {
	if (!req.session.lookup) {
		return res.status(401)
			.json({
				message: "Unauthorized",
				date: new Date()
			});
	}

	const user = await getRepository(User)
		.findOne(req.session.lookup);

	if (!user) {
		return res.status(500)
			.json({
				message: "Internal Server Error",
				date: new Date()
			});
	}

	req.user = user;
	next();
}
