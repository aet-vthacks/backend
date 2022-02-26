import { ScriptCheck } from "python";

export const checks: ScriptCheck[] = [
	{
		exerciseNumber: 1,
		testingType: "output",
		data: "Hello World"
	},
	{
		exerciseNumber: 2,
		testingType: "output",
		data: "78"
	},
	{
		exerciseNumber: 3,
		testingType: "function-output",
		data: [
			{
				input: 10,
				output: "I am ALIVE"
			},
			{
				input: 1,
				output: "I am ALIVE"
			},
			{
				input: 0,
				output: "I am DEAD"
			}
		]
	},
	{
		exerciseNumber: 4,
		testingType: "function-return",
		data: [
			{
				input: 10,
				output: 20
			},
			{
				input: 1,
				output: 2
			},
			{
				input: 0,
				output: 0
			}
		]
	},
	{
		exerciseNumber: 5,
		testingType: "variable",
		data: [
			{
				name: "x",
				value: 3
			},
			{
				name: "y",
				value: 5
			}
		]
	}
];
