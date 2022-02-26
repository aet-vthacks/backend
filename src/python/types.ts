export type CheckType = "output" | "variable" | "function-output" | "function-return"

export interface ScriptCheck {
	exerciseNumber: number
	testingType: CheckType
	data: OutputData | VariableData | FunctionOutputData | FunctionReturnData
}

export type OutputData = string
export type VariableData = { name: string, value: unknown }[]
export type FunctionOutputData = { input: unknown, output: string }[]
export type FunctionReturnData = { input: unknown, output: unknown }[]

export type SuccessfulInterpret = {
	success: boolean,
	returns: string,
	variables: [string, string]
	stdout: string
}

export type FailedInterpret = {
	success: boolean,
	error: string,
	message: string,
	trace: string
}
