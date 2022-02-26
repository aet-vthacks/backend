import { NextFunction, Request, Response } from "@tinyhttp/app";
import { User } from "models";
import nextSession from "next-session";
import { getRepository } from "typeorm";

export const getSession = nextSession({
	cookie: {
		secure: process.env.NODE_ENV !== "development",
		sameSite: false
	}
});

export async function account(req: Request, res: Response, next: NextFunction) {
	const session = await getSession(req, res);
	if (!session.lookup) {
		return res.status(401)
			.json({
				message: "Unauthorized",
				date: new Date()
			});
	}

	const user = await getRepository(User)
		.findOne(session.lookup);

	if (!user) {
		return res.status(500)
			.json({
				message: "Internal Server Error",
				date: new Date()
			});
	}

	next();
}
