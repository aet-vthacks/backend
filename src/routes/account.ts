import { Request, Response } from "@tinyhttp/app";
import { getSession } from "middleware";
import { User } from "models";
import { getRepository } from "typeorm";


export async function me(req: Request, res: Response) {
	const session = await getSession(req, res);
	const user = await getRepository(User)
		.findOne(session.lookup);

	if (!user) {
		return res.status(404)
			.json({
				message: "Not Found",
				date: new Date()
			});
	}

	res.status(200)
		.json({
			name: {
				first: user.firstname,
				last: user.lastname
			},
			email: user.email,
			pets: user.pets,
			progress: user.codeSaves
		});
}
