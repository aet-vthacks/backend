import { Response } from "@tinyhttp/app";
import { User } from "models";
import { getConnection, getRepository } from "typeorm";
import { RichRequest } from "types";

export async function signup(req: RichRequest, res: Response) {
	const body = req.body as Record<string, string | undefined>;
	if (!body) {
		res.status(422)
			.json({
				message: "Missing Request Data",
				date: new Date()
			});
	}

	const { firstname, lastname, email, password } = body;
	if (!firstname || !lastname || !email || !password) {
		res.status(422)
			.json({
				message: "Missing Request Data",
				date: new Date()
			});
	}

	const lookup = await getRepository(User)
		.findOne({ email });

	if (lookup) {
		return res.status(409)
			.json({
				message: "User Already Exists",
				date: new Date()
			});
	}

	const user = new User();
	user.firstname = firstname!;
	user.lastname = lastname!;
	user.email = email!;
	user.generatePassword(password!);

	try {
		await getConnection().manager.save(user);
		req.session.lookup = user.uuid;

		return res.status(200)
			.json({
				message: "Success",
				date: new Date()
			});
	} catch (error) {
		console.log(error);
		return res.status(500)
			.json({
				message: "Internal Server Error",
				date: new Date()
			});
	}
}

export async function login(req: RichRequest, res: Response) {
	const body = req.body as Record<string, string | undefined>;
	if (!body) {
		res.status(422)
			.json({
				message: "Missing Request Data",
				date: new Date()
			});
	}

	const { email, password } = body;
	if (!email || !password) {
		res.status(422)
			.json({
				message: "Missing Request Data",
				date: new Date()
			});
	}

	const lookup = await getRepository(User)
		.findOne({ email });

	if (!lookup) {
		return res.status(404)
			.json({
				message: "User Not Found",
				date: new Date()
			});
	}

	if (!lookup.validatePassword(password!)) {
		return res.status(403)
			.json({
				message: "Incorrect Password",
				date: new Date()
			});
	}

	req.session.lookup = lookup.uuid;

	return res.status(200)
		.json({
			message: "Success",
			date: new Date()
		});
}

export async function logout(req: RichRequest, res: Response) {
	if (!req.session.lookup) {
		return res.status(401)
			.json({
				message: "Not Authorized",
				date: new Date()
			});
	}

	await req.session.destroy();
	return res.status(200)
		.json({
			message: "Success",
			date: new Date()
		});
}
