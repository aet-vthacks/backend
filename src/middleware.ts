import { NextFunction, Request, Response } from "@tinyhttp/app";
import { Session, User } from "models";
import nextSession from "next-session";
import { getRepository } from "typeorm";

export const getSession = nextSession({
	store: {
		get: async (sessionId) => {
			const session = await getRepository(Session)
				.findOne({ sessionId });
			return session?.sessionData;
		},
		set: async (sessionId, sessionData) => {
			const session = await getRepository(Session)
				.findOne({ sessionId });
			if (session) {
				session.sessionData = sessionData;
				await getRepository(Session)
					.save(session);
			} else {
				const session = new Session();
				session.sessionId = sessionId;
				session.sessionData = sessionData;

				await getRepository(Session)
					.save(session);
			}
		},
		destroy: async (sessionId) => {
			await getRepository(Session)
				.delete({ sessionId });
		}
	},
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
