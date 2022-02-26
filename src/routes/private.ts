import { Request, Response } from "@tinyhttp/app";
import { Exercise } from "models";
import { ScriptCheck } from "python";
import { getRepository } from "typeorm";

export async function uploadExercise(req: Request, res: Response) {
	const body = req.body as Record<string, string | undefined>;
	if (!body) {
		return res.status(422)
			.json({
				message: "Missing Request Data",
				date: new Date()
			});
	}

	const number = req.body.number as number;
	const check = req.body.check as ScriptCheck;
	const { title, objective, markdown, shellCode } = body;
	if (!(number && title && objective && markdown && shellCode && check)) {
		return res.status(422)
			.json({
				message: "Missing Request Data",
				date: new Date()
			});
	}

	const exercise = new Exercise();
	exercise.number = number;
	exercise.title = title;
	exercise.objective = objective;
	exercise.markdown = markdown;
	exercise.shellCode = shellCode;
	exercise.check = check;

	try {
		await getRepository(Exercise)
			.save(exercise);
		return res.status(200)
			.json({
				message: "Successful",
				date: new Date()
			});
	} catch (error) {
		console.error(error);
		return res.status(500)
			.json({
				message: "Internal Server Error",
				date: new Date()
			});
	}
}
