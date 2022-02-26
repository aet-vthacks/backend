import io
import traceback
import json
import sys
import subprocess

def execute(exe_string):
	output = dict()

	loc = {}
	returnData = subprocess.run([sys.executable, "-c", exe_string, sys.argv[2], "exec(exe_string, inputs)"],
								capture_output=True,
								text=True)
	if returnData.stderr == "":
		output["success"] = True
		output["stdout"] = returnData.stdout

		sys.argv = ["exe.py", sys.argv[2]]
		exec(exe_string, {}, loc)
		output["variables"] = [(key, value.__repr__()) for key, value in loc.items()]

		for key, value in loc.items():
			if key == "returnVar":
				output["returns"] = value

	else:
		output["success"] = False
		errorOutput = returnData.stderr.split('\n')
		output["trace"] = errorOutput[0]
		output["error"] = errorOutput[1]
		output["message"] = errorOutput[2]

	print(json.dumps(output), file = sys.__stderr__)

if __name__ == '__main__':
	execute(sys.argv[1])
