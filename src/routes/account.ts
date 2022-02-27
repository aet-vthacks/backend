import { Request, Response } from "@tinyhttp/app";
import { getSession } from "middleware";
import { Exercise, Pet, User } from "models";
import { getRepository } from "typeorm";

export async function savePet(req: Request, res: Response) {
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

	try {
		const { name, colors, rarity, species } = req.body;

		const pet = new Pet();
		pet.name = name;
		pet.colors = colors;
		pet.rarity = rarity;
		pet.species = species;
		pet.user = user;
		await getRepository(Pet)
			.save(pet);

		const currentPets = user.pets ?? [];
		currentPets.push(pet);
		user.pets = currentPets;
		await getRepository(User)
			.save(user);

		res.status(200)
			.json({
				message: "Successful",
				date: new Date()
			});
	} catch {
		res.status(200)
			.json({
				message: "Internal Server Error",
				date: new Date()
			});
	}
}

export async function me(req: Request, res: Response) {
	const session = await getSession(req, res);
	const user = await getRepository(User)
		.findOne({
			where: {
				uuid: session.lookup
			},
			relations: ["pets"]
		});

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
			username: user.username,
			pets: user.pets,
			progress: user.codeSaves
		});
}

export async function exercise(req: Request, res: Response) {
	const number = req.params.id;
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

	const exercise = await getRepository(Exercise)
		.findOne({ number: number as any });

	if (!exercise) {
		return res.status(404)
			.json({
				message: "Not Found",
				date: new Date()
			});
	}

	res.status(200)
		.json({
			exercise: {
				number: exercise.number,
				title: exercise.title,
				objective: exercise.objective,
				markdown: exercise.markdown,
				shellCode: exercise.shellCode
			},
			user: {
				pets: user.pets,
				progress: user.codeSaves
			}
		});
}
