import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from features.statusline.feature import CLOCK_AFTER, HOLD, MOST_STEPS, ROLL_EVERY, line  # noqa: E402
from tests.kit import check, done  # noqa: E402

features.unload()
features.load()

NOW = 1_000_000.0


def running(**more):
    return {"what": "python3 tests/x.py", "tool": "Bash", "at": NOW, **more}


# THE JOURNAL SAYS THE WORDS, so the viewer has nothing to decide
check("a command that changes files is named as editing files",
      [t["value"] for t in line(running(effect="writes"), NOW)["tokens"]], ["editing", "files"])
check("every kind worth naming has its words",
      [line(running(effect=e), NOW)["key"] for e in ("tests", "deletes", "reads", "installs", "builds")],
      ["running tests", "deleting files", "reading files", "installing dependencies", "building"])
check("a command it has no words for is left to the viewer", line(running(), NOW), {})
check("and nothing running is no line", (line({}, NOW), line({"tool": "Bash"}, NOW)), ({}, {}))

# WHAT IT FLIPS THROUGH comes with how often, and only while the line stands for several steps
rolled = line(running(effect="reads", steps=["cat a.py", "cat b.py"]), NOW)["roll"]
check("a scoped line hands over its steps and how often to flip", (rolled["every"], rolled["items"]), (ROLL_EVERY, ["cat a.py", "cat b.py"]))
check("one step alone is nothing to flip through", line(running(effect="reads", steps=["cat a.py"]), NOW)["roll"], {})
check("a command that has finished stops flipping", line(running(effect="reads", steps=["a", "b"], done=NOW + 1), NOW)["roll"], {})
check("only the last steps are kept", len(line(running(effect="writes", steps=[f"s{i}" for i in range(40)]), NOW)["roll"]["items"]), MOST_STEPS)

# HOW LONG IT LINGERS and when a clock appears are the journal's call too
check("editing and deleting hold their line; nothing else does",
      [line(running(effect=e), NOW)["hold"] for e in ("writes", "deletes", "tests", "reads")], [HOLD, HOLD, 0.0, 0.0])
check("a clock appears once it has run long enough",
      [line(running(effect="tests"), NOW + s)["clock"] for s in (1, CLOCK_AFTER + 1)], [False, True])
check("a finished run is timed by when it finished, not by now",
      line(running(effect="tests", done=NOW + 1), NOW + 600)["clock"], False)

# A TEST RUN SAYS HOW IT WENT once it is done
check("a passing run says passed", line(running(effect="tests", done=NOW + 2, result={"passed": 9}), NOW)["tokens"][-1],
      {"value": "passed", "kind": "passed"})
check("a failing run says how many failed", line(running(effect="tests", done=NOW + 2, result={"failed": 3}), NOW)["tokens"][-1],
      {"value": "3 failed", "kind": "failed"})
check("while it is still running it says nothing about the outcome",
      [t["kind"] for t in line(running(effect="tests", result={"failed": 3}), NOW)["tokens"]], ["command", "argument"])

done()
