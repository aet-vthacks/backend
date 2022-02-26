import { execFile } from "node:child_process";
import { checks, FailedInterpret, FunctionOutputData, FunctionReturnData, OutputData, ScriptCheck, SuccessfulInterpret, VariableData } from "python";

async function testExercise(code: string, exercise: number) {
	const check = checks.find(check => check.exerciseNumber === exercise)!;
	const tests: { status: boolean, values?: unknown }[] = [];

	if (check.testingType === "function-output" || check.testingType === "function-return") {
		for (let iter = 0; iter < check.data.length; iter++) {
			const output = await interpret(code);

			if (output.success === true) {
				tests.push(validateCheck(check, output as SuccessfulInterpret, iter));
				continue;
			}

			tests.push({ status: false });
		}
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
			const variables = data.variables;
			let truthy = true;

			const values = variables.map(([name, value]) => {
				return checkData.includes({ name, value });
			});

			return {
				status: truthy,
				values
			};
		}

		case "function-output": {
			const output = check.data as FunctionOutputData;
			console.log(data.stdout);
			return {
				status: data.stdout === output[index].output
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

async function interpret(code: string) {
	const result = await new Promise<SuccessfulInterpret | FailedInterpret>((resolve, reject) => {
		execFile("/usr/bin/python3", ["-u", "/app/src/python/interpreter.py", code], (err, stdout, stderr) => {
			console.log(err, stdout, stderr);
		});
		// const child = spawn("/usr/bin/python3", ["/app/src/python/interpreter.py", code]);

		// const buffers = new Array<Buffer>();
		// child.on("error", err => reject(err));

		// child.stdout.on("data", (chunk) => {
		// 	buffers.push(chunk);
		// });

		// child.stdout.on("end", () => {
		// 	const buffer = Buffer.concat(buffers);
		// 	const data = buffer.toString();
		// 	const object = JSON.parse(data);

		// 	if (object.success === true) {
		// 		resolve(object as SuccessfulInterpret);
		// 	}

		// 	resolve(object as FailedInterpret);
		// });
	});
	return result;
}


let f = await testExercise("import sys\ndef printinp(input):\n	print(input)\nprintinp(sys.argv[1])", 2);
console.log(f);
