import { Request, Response } from "@tinyhttp/app";
import { getSession } from "middleware";
import { Exercise, Pet, User } from "models";
import { getRepository } from "typeorm";

export async function getExercises(req: Request, res: Response) {
	try {
		const session = await getSession(req, res);
		const user = await getRepository(User)
			.findOne({
				where: { uuid: session.lookup },
				relations: ["pets"]
			});

		if (!user) {
			return res.status(404)
				.json({
					message: "Not Found",
					date: new Date()
				});
		}

		const exercises = await getRepository(Exercise)
			.find({ order: { number: "ASC" }});

		return res.status(200)
			.json({
				data: exercises,
				user: {
					pets: user.pets,
					progress: user.codeSaves
				}
			});
	} catch {
		return res.status(500)
			.json({
				message: "Internal Server Error",
				date: new Date()
			});
	}
}

export async function savePet(req: Request, res: Response) {
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
			preferredPet: user.preferredPet,
			progress: user.codeSaves
		});
}

export async function claimExercise(req: Request, res: Response) {
	const { number } = req.body;
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

	user.codeSaves = user.codeSaves.map(save => {
		if (save.exerciseUUID === number) {
			return {
				exerciseUUID: save.exerciseUUID,
				claimed: true,
				code: save.code,
				completed: save.completed,
				testStatus: save.testStatus
			};
		}
		return save;
	});

	console.log(user.codeSaves);

	try {
		await getRepository(User)
			.save(user);
		res.status(200)
			.json({
				message: "Successful",
				date: new Date()
			});
	} catch {
		res.status(500)
			.json({
				message: "Internal Server Error",
				date: new Date()
			});
	}
}

export async function saveExercise(req: Request, res: Response) {
	const number = req.params.id;
	const { completed, status, code } = req.body;
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

	const exercise = await getRepository(Exercise)
		.findOne({ number: number as any });

	if (!exercise) {
		return res.status(404)
			.json({
				message: "Not Found",
				date: new Date()
			});
	}

	const saves = user.codeSaves ?? [];
	const index = saves.findIndex(id => id.exerciseUUID === exercise.number);
	if (index === -1) {
		saves.push({
			exerciseUUID: exercise.number,
			claimed: false,
			code,
			completed,
			testStatus: status
		});
	} else {
		saves[index] = {
			exerciseUUID: exercise.number,
			claimed: saves[index].claimed,
			code,
			completed,
			testStatus: status
		};
	}

	user.codeSaves = saves;

	try {
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

export async function changePet(req: Request, res: Response) {
	const { position } = req.body;
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

	user.preferredPet = position;

	try {
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

export async function exercise(req: Request, res: Response) {
	const number = req.params.id;
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
				preferredPet: user.preferredPet,
				progress: user.codeSaves
			}
		});
}
