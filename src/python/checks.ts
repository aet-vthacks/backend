import { ScriptCheck } from "python";

export const checks: ScriptCheck[] = [
	{
		exerciseNumber: 1,
		testingType: "output",
		data: "Hello World"
	},
	{
		exerciseNumber: 2,
		testingType: "output-variable",
		data: [
			{
				name: "firstVariable",
				value: 25,
				output: "25"
			}
		]
	},
	{
		exerciseNumber: 3,
		testingType: "function-output",
		data: [
			{
				input: 10,
				output: "I AM DEAD"
			},
			{
				input: 1,
				output: "I AM DEAD"
			},
			{
				input: 0,
				output: "I AM DEAD"
			},
			{
				input: -2,
				output: "I AM ALIVE"
			},
			{
				input: -1,
				output: "I AM ALIVE"
			}
		]
	},
	{
		exerciseNumber: 4,
		testingType: "output",
		data: "1\n2\n3\n4\n5\n6\n7\n8\n"
	},
	{
		exerciseNumber: 5,
		testingType: "function-output-variable",
		data: [
			{
				name: "xTimes",
				output: "3",
				value: [1, 2, 3, 4, 5],
				input: 1
			},
			{
				name: "xTimes",
				output: "-6",
				value: [-2, -4, -6, -8, -10],
				input: -2
			},
			{
				name: "xTimes",
				output: "0",
				value: [0, 0, 0, 0, 0],
				input: 0
			},
			{
				name: "xTimes",
				output: "36",
				value: [12, 24, 36, 48, 60],
				input: 12
			},
			{
				name: "xTimes",
				output: "-27",
				value: [-9, -18, -27, -36, -45],
				input: -9
			}
		]
	},
	{
		exerciseNumber: 6,
		testingType: "function-output",
		data: [
			{
				output: "4",
				input: [3, 1, "+"]
			},
			{
				output: "-1",
				input: [-2, 1, "+"]
			},
			{
				output: "3",
				input: [3, 0, "+"]
			},
			{
				output: "-2",
				input: [3, 5, "-"]
			},
			{
				output: "-1",
				input: [-2, -1, "-"]
			},
			{
				output: "8",
				input: [8, 0, "-"]
			},
			{
				output: "-15",
				input: [-3, 5, "*"]
			},
			{
				output: "8",
				input: [-2, -4, "*"]
			},
			{
				output: "0",
				input: [0, -3, "*"]
			},
			{
				output: "-10",
				input: [-20, 2, "/"]
			},
			{
				output: "0",
				input: [0, 9, "/"]
			},
			{
				output: "3",
				input: [120, 40, "/"]
			}
		]
	},
	{
		exerciseNumber: 7,
		testingType: "function-output",
		data: [
			{
				output: ["Hello", "this", "is", "a", "sentance"],
				input: "Hello this is a sentance."
			},
			{
				output: ["I", "am", "very", "tired", "and", "want", "to", "sleep"],
				input: "I am very tired and want to sleep!"
			}
		]
	}
];
