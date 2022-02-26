import { spawn } from "node:child_process";
import { checks, FailedInterpret, FunctionOutputData, FunctionReturnData, OutputData, ScriptCheck, SuccessfulInterpret, VariableData } from "python";

async function testExercise(code: string, exercise: number) {
	const check = checks.find(check => check.exerciseNumber === exercise)!;
	const tests: { status: boolean, values?: unknown }[] = [];

	if (check.testingType === "function-output" || check.testingType === "function-return") {
		for (let iter = 0; iter < check.data.length; iter++) {
			const data = check.data as FunctionOutputData;
			const output = await interpret(code, data[iter].input as string);

			if (output.success === true) {
				tests.push(validateCheck(check, output as SuccessfulInterpret, iter));
				continue;
			}

			tests.push({ status: false });
		}
	} else {
		const output = await interpret(code);
		tests.push(validateCheck(check, output as SuccessfulInterpret, 0));
	}

	return tests;
}

function validateCheck(check: ScriptCheck, data: SuccessfulInterpret, index: number): {
	status: boolean,
	values?: unknown
} {
	switch (check.testingType) {
		case "output": {
			const output = check.data as OutputData;
			const lines = data.stdout.split("\n");
			return {
				status: lines.includes(output)
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
				values
			};
		}

		case "function-output": {
			const output = check.data as FunctionOutputData;
			return {
				status: data.stdout.trim() === output[index].output.trim()
			};
		}

		case "function-return": {
			const output = check.data as FunctionReturnData;
			return {
				status: data.returns === output[index].output
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


let f = await testExercise("x = 3\ny = -5", 5);
// let f = await testExercise("print(\"Hello World!\")", 1);
console.log(f);

