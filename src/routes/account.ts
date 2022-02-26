import { Response } from "@tinyhttp/app";
import { RichRequest } from "types";


export async function me(req: RichRequest, res: Response) {
	res.status(200)
		.json({
			name: {
				first: req.user.firstname,
				last: req.user.lastname
			},
			email: req.user.email,
			pets: req.user.pets,
			progress: req.user.codeSaves
		});
}
