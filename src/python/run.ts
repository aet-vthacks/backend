import { Exercise } from "models";
import { spawn } from "node:child_process";
import { FailedInterpret, FunctionOutputData, FunctionReturnData, OutputData, ScriptCheck, SuccessfulInterpret, VariableData } from "python";
import { getRepository } from "typeorm";

export async function testExercise(code: string, exercise: number) {
	const exercise2 = await getRepository(Exercise)
		.findOne({ number: exercise });

	const check = exercise2!.check;
	const tests: { status: boolean, values?: unknown, raw: SuccessfulInterpret | FailedInterpret }[] = [];

	if (check.testingType === "function-output" || check.testingType === "function-return") {

		for (let iter = 0; iter < check.data.length; iter++) {
			const data = check.data as FunctionOutputData;
			const output = await interpret(code, data[iter].input as string);
			tests.push(validateCheck(check, output as SuccessfulInterpret, iter));
		}
	}

	const output = await interpret(code);
	tests.push(validateCheck(check, output as SuccessfulInterpret, 0));

	return tests;
}

function validateCheck(check: ScriptCheck, data: SuccessfulInterpret, index: number): {
	status: boolean,
	values?: unknown,
	raw: SuccessfulInterpret | FailedInterpret
} {
	if (data.success === false) {
		return {
			status: false,
			raw: data
		};
	}

	switch (check.testingType) {
		case "output": {
			const output = check.data as OutputData;
			const lines = data.stdout.split("\n");
			return {
				status: lines.includes(output),
				raw: data
			};
		}

		case "variable": {
			const checkData = check.data as VariableData;
			const variables = data.variables.map(([name, value]) => ({ name, value }));
			let truthy = true;

			// eslint-disable-next-line array-callback-return
			const values = checkData.map(validationData => {
				const search = variables.find(actualData => actualData.name === validationData.name);

				if (String(validationData.value) !== String(search?.value)) {
					truthy = false;
					return search;
				}
			})
				.filter(Boolean);

			return {
				status: truthy,
				values,
				raw: data
			};
		}

		case "function-output": {
			const output = check.data as FunctionOutputData;
			return {
				status: data.stdout.trim() === output[index].output.trim(),
				raw: data
			};
		}

		case "function-return": {
			const output = check.data as FunctionReturnData;
			return {
				status: data.returns === output[index].output,
				raw: data
			};
		}
	}
}

async function interpret(code: string, input?: string) {
	const result = await new Promise<SuccessfulInterpret | FailedInterpret>((resolve, reject) => {
		const child = spawn("/usr/bin/python3", ["/app/src/python/interpreter.py", code, input ?? ""]);

		let buffer = Buffer.alloc(0);
		child.on("error", err => reject(err));

		child.stderr.on("data", (chunk) => {
			buffer = chunk;
		});

		child.stderr.on("end", () => {
			const data = buffer.toString();
			const object = JSON.parse(data);

			if (object.success === true) {
				resolve(object as SuccessfulInterpret);
			}

			resolve(object as FailedInterpret);
		});
	});
	return result;
}

// // Lesson 1
// let f = await testExercise("print(\"Hello World\")", 1);
// console.log(f);

// // Lesson 2
// let b = await testExercise("wtvrvariablenameis = 78\nprint(wtvrvariablenameis)" , 2);
// console.log(b);

// // Lesson 2.5

