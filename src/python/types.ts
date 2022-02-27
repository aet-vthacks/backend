export type CheckType = "output" | "variable" | "function-output" | "function-return" | "output-variable" | "function-output-variable"

export interface ScriptCheck {
	exerciseNumber: number
	testingType: CheckType
	data: OutputData | VariableData | FunctionOutputData | FunctionReturnData | OutputVariableData | FunctionOutputVariableData
}

export type OutputData = string
export type VariableData = { name: string, value: unknown }[]
export type OutputVariableData = { name: string, value: unknown, output: string }[]
export type FunctionOutputData = { input: unknown, output: string }[]
export type FunctionReturnData = { input: unknown, output: unknown }[]
export type FunctionOutputVariableData = { output: string, name: string, value: unknown, input: unknown }[]

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
