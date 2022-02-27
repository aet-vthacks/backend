import { Exercise } from "models";
import { spawn } from "node:child_process";
import { FailedInterpret, FunctionOutputData, FunctionReturnData, OutputData, ScriptCheck, SuccessfulInterpret, VariableData } from "python";
import { getRepository } from "typeorm";
import { FunctionOutputVariableData, OutputVariableData } from "./types";

export async function testExercise(code: string, exercise: number) {
	const exercise2 = await getRepository(Exercise)
		.findOne({ number: exercise });

	const check = exercise2!.check;

	// const check = checks.find(id => id.exerciseNumber === exercise)!;
	const tests: { status: boolean, values?: unknown, raw: SuccessfulInterpret | FailedInterpret }[] = [];

	if (check.testingType === "function-output" ||
	check.testingType === "function-return" ||
	check.testingType === "function-output-variable") {

		for (let iter = 0; iter < check.data.length; iter++) {
			const data = check.data as FunctionOutputData;
			const output = await interpret(code, data[iter].input as string);
			tests.push(validateCheck(check, output as SuccessfulInterpret, iter));
		}
	} else {
		const output = await interpret(code);
		tests.push(validateCheck(check, output as SuccessfulInterpret, 0));
	}

	return tests;
}

function validateCheck(check: ScriptCheck, data: SuccessfulInterpret, index: number): {
	status: boolean,
	values?: unknown,
	reason?: string,
	raw: SuccessfulInterpret | FailedInterpret
} {
	if (data.success === false) {
		return {
			status: false,
			reason: "The script failed to execute successfully",
			raw: data
		};
	}

	switch (check.testingType) {
		case "output": {
			const output = check.data as OutputData;
			const lines = data.stdout.split("\n")
				.filter(v => v.length > 0);
			return {
				status: lines.includes(output),
				reason: `Expected ${output}, but recieved ${lines[0]} instead`,
				raw: data
			};
		}

		case "variable": {
			const checkData = check.data as VariableData;
			const variables = data.variables.map(([name, value]) => ({ name, value }));
			let truthy = true;
			let vReason = "";

			// eslint-disable-next-line array-callback-return
			const values = checkData.map(validationData => {
				const search = variables.find(actualData => actualData.name === validationData.name);
				if (vReason === "" && search === undefined) {
					vReason = `${validationData.name} was not found`;
				}
				if (String(validationData.value) !== String(search?.value)) {
					if (vReason === "") {
						vReason = `${validationData.name} did not have the correct value`;
					}
					truthy = false;
					return search;
				}
			})
				.filter(Boolean);

			return {
				status: truthy,
				values,
				reason: vReason,
				raw: data
			};
		}
		case "output-variable": {
			const output = check.data as OutputVariableData;
			const lines = data.stdout.split("\n");

			const checkData = check.data as VariableData;
			const variables = data.variables.map(([name, value]) => ({ name, value }));
			let truthy = true;
			let vReason = "";

			// eslint-disable-next-line array-callback-return
			const values = checkData.map(validationData => {
				const search = variables.find(actualData => actualData.name === validationData.name);
				if (vReason === "" && search === undefined) {
					vReason = `${validationData.name} was not found`;
				}
				if (String(validationData.value) !== String(search?.value)) {
					if (vReason === "") {
						vReason = `${validationData.name} did not have the correct value`;
					}
					truthy = false;
					return search;
				}
			})
				.filter(Boolean);

			return {
				status: truthy && lines.includes(output[0].output),
				values,
				reason: vReason,
				raw: data
			};
		}
		case "function-output-variable": {
			const output = check.data as FunctionOutputVariableData;
			const lines = data.stdout.split("\n");

			const fOutput = check.data as FunctionOutputData;

			const checkData = check.data as VariableData;
			const variables = data.variables.map(([name, value]) => ({ name, value }));
			let truthy = true;
			let vReason = "";

			// eslint-disable-next-line array-callback-return
			const values = checkData.map(validationData => {
				const search = variables.find(actualData => actualData.name === validationData.name);
				if (vReason === "" && search === undefined) {
					vReason = `${validationData.name} was not found`;
				}

				if (String(validationData.value) !== String(search?.value)) {
					if (vReason === "") {
						vReason = `${validationData.name} did not have the correct value`;
					}
					truthy = false;
					return search;
				}
			})
				.filter(Boolean);

			return {
				status: truthy && lines.includes(output[0].output) && data.returns === fOutput[index].output,
				values,
				reason: vReason,
				raw: data
			};
		}
		case "function-output": {
			const output = check.data as FunctionOutputData;
			return {
				status: data.stdout.trim() === output[index].output.trim(),
				reason: `Expected ${output[index].output.trim()}, but recieved ${data.stdout.trim()} instead`,
				raw: data
			};
		}

		case "function-return": {
			const output = check.data as FunctionReturnData;
			return {
				status: data.returns === output[index].output,
				reason: `Expected ${output[index].output}, but recieved ${data.returns} instead`,
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
			try {
				const data = buffer.toString();
				const object = JSON.parse(data);

				if (object.success === true) {
					resolve(object as SuccessfulInterpret);
				}

				resolve(object as FailedInterpret);
			} catch {
				reject();
			}
		});
	});
	return result;
}


