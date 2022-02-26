import io
import traceback
import json
import sys

def execute(exe_string):
	output = dict()

	printOut = sys.stdout
	new_stdout = io.StringIO()
	sys.stdout = new_stdout

	try:
		loc = {}
		exec(exe_string, {}, loc)
		if "returnVariable" in loc:
			output["returns"] = loc["returnVariable"]

		output["variables"] = [(key, value.__repr__()) for key, value in loc.items()]
		output["success"] = True

	except Exception as exc:
		output["success"] = False
		output["error"] = str(type(exc))[8:-2]
		output["message"] = exc.args
		output["trace"] = traceback.format_tb(exc.__traceback__)

	output["stdout"] = new_stdout.getvalue()

	sys.stdout = printOut
	print(json.dumps(output, indent=4))


if __name__ == '__main__':
	execute(sys.argv[1])
