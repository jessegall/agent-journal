import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from features.statusline.feature import CLOCK_AFTER, HOLD, LINGERS, MOST_STEPS, ROLL_EVERY, line  # noqa: E402
from tests.kit import check, done  # noqa: E402

features.unload()
features.load()

NOW = 1_000_000.0


def running(**more):
    return {"what": "cat x.py", "tool": "Bash", "at": NOW, **more}


# THE JOURNAL SAYS THE WORDS, so the viewer has nothing to decide
check("with nothing to flip through, a kind falls back to its plural",
      [line(running(effect=e), [], NOW)["key"] for e in ("writes", "tests", "deletes", "reads", "installs", "builds")],
      ["editing files", "running tests", "deleting files", "reading files", "installing dependencies", "building"])
check("a command with no kind of its own is said in a few words", line(running(what="git status"), [], NOW)["key"], "git status")
check("and nothing running is no line", (line({}, [], NOW), line({"tool": "Bash"}, [], NOW)), ({}, {}))

# THE FILES THEMSELVES flip beside the verb, and the plural disappears
edits = [{"what": "editing one.py", "tool": "Edit", "at": 1, "effect": "writes"}, {"what": "writing two.py", "tool": "Write", "at": 2, "effect": "writes"}]
editing = line({"what": "editing three.py", "tool": "Edit", "at": 3, "effect": "writes"}, edits, NOW)
check("editing names the files it is editing, not the word files",
      ([p["value"] for p in editing["parts"]], editing["parts"][0]["color"]),
      (["editing", ["one.py", "two.py", "three.py"]], "gray"))
check("a command of another kind is not one of them", line({"what": "editing x.py", "tool": "Edit", "at": 3, "effect": "writes"},
      [*edits, {"what": "cat y", "tool": "Bash", "at": 2.5, "effect": "reads"}], NOW)["parts"][1]["value"], ["one.py", "two.py", "x.py"])
check("a name too long to show is cut with an ellipsis, and the flipping part hugs the right",
      [line({"what": "writing x.py", "tool": "Write", "at": 3, "effect": "writes"},
            [{"what": "editing a-name-far-longer-than-any-status-bar-would-ever-show.py", "tool": "Edit", "at": 2, "effect": "writes"}], NOW)["parts"][1][k]
       for k in ("value", "align")],
      [["a-name-far-longer-than-any-status-bar-wou…", "x.py"], "right"])
check("a shell command is never one of the files, however it was classed",
      [p["value"] for p in line({"what": "writing x.py", "tool": "Write", "at": 3, "effect": "writes"},
                                [{"what": "git add -A && git commit -m x", "tool": "Bash", "at": 2, "effect": "writes"}], NOW)["parts"]],
      ["editing", "files"])

# WHAT IT FLIPS THROUGH comes with how often, and only while the line stands for several steps
def read(*what):
    return [{"what": w, "effect": "reads"} for w in what]


rolled = line({"what": "reading a.py", "tool": "Read", "at": NOW, "effect": "reads"},
              [{"what": "reading b.py", "tool": "Read", "at": NOW - 1, "effect": "reads"}], NOW)["parts"][1]
check("a scoped line hands over the names and how often to flip", (rolled["duration"], rolled["value"]), (ROLL_EVERY, ["b.py", "a.py"]))
check("one name alone is nothing to flip through", len(line(running(effect="reads"), [], NOW)["parts"]), 2)
check("a run of shell reads has no files to name", [p["value"] for p in line(running(effect="reads", steps=read("cat a.py", "cat b.py")), [], NOW)["parts"]], ["reading", "files"])
check("a command that has finished stops flipping", line({"what": "reading a.py", "tool": "Read", "at": NOW, "effect": "reads", "done": NOW + 1},
      [{"what": "reading b.py", "tool": "Read", "at": NOW - 1, "effect": "reads"}], NOW)["parts"][-1]["value"], "files")
check("only the last names are kept", len(line(running(effect="writes"),
      [{"what": f"editing s{i}.py", "tool": "Edit", "at": i, "effect": "writes"} for i in range(40)], NOW)["parts"][1]["value"]), MOST_STEPS)
mixed = [{"what": "reading a.py", "tool": "Read", "at": 1, "effect": "reads"}, {"what": "editing z.py", "tool": "Edit", "at": 2, "effect": "writes"},
         {"what": "reading a.py", "tool": "Read", "at": 3, "effect": "reads"}, {"what": "reading b.py", "tool": "Read", "at": 4, "effect": "reads"}]
check("what the line is not about is left out, and the same name twice over is one",
      line({"what": "reading b.py", "tool": "Read", "at": 5, "effect": "reads"}, mixed, NOW)["parts"][1]["value"], ["a.py", "b.py"])

# HOW LONG IT LINGERS and when a clock appears are the journal's call too
check("editing, deleting and a test run hold their line; nothing else does",
      [line(running(effect=e), [], NOW)["hold"] for e in ("writes", "deletes", "tests", "reads", "builds")], [HOLD, HOLD, HOLD, 0.0, 0.0])
check("a line with nothing to replace it may stay a while", line(running(effect="tests"), [], NOW)["lingers"], LINGERS)
check("a clock appears once it has run long enough",
      [line(running(effect="tests"), [], NOW + s)["clock"] for s in (1, CLOCK_AFTER + 1)], [False, True])
check("a finished run is timed by when it finished, not by now",
      line(running(effect="tests", done=NOW + 1), [], NOW + 600)["clock"], False)

# A TEST RUN SAYS HOW IT WENT once it is done
check("a passing run says passed", line(running(effect="tests", done=NOW + 2, result={"passed": 9}), [], NOW)["parts"][-1],
      {"value": "passed", "color": "green"})
check("a failing run says how many failed", line(running(effect="tests", done=NOW + 2, result={"failed": 3}), [], NOW)["parts"][-1],
      {"value": "3 failed", "color": "red"})
check("while it is still running it says nothing about the outcome",
      [p["color"] for p in line(running(effect="tests", result={"failed": 3}), [], NOW)["parts"]], ["gray", "muted"])

done()
