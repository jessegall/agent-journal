import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from features.statusline.feature import CLOCK_AFTER, HOLD, LINGERS, MOST, ROLL_EVERY, bar, line  # noqa: E402
from tests.kit import check, done  # noqa: E402

features.unload()
features.load()

NOW = 1_000_000.0


def shell(what, at=NOW, **more):
    return {"what": what, "tool": "Bash", "at": at, **more}


def read(name, at=NOW):
    return {"what": f"reading {name}", "tool": "Read", "at": at, "effect": "reads"}


def edit(name, at=NOW):
    return {"what": f"editing {name}", "tool": "Edit", "at": at, "effect": "writes"}


def said(run, commands=(), now=NOW):
    return [p["value"] for p in line(run, list(commands), now)["parts"]]


def coloured(run, commands=(), now=NOW):
    return [(p["value"], p["color"]) for p in line(run, list(commands), now)["parts"]]


# EVERY LINE SAYS WHAT IS BEING DONE, and names what it is doing it to
check("a shell command is running, named by its root and subcommand", said(shell("git commit -m 'a long message'")), ["running", "git", "commit"])
check("no flags, no arguments, no quoted strings", said(shell("npx prettier --write src/a.vue >/dev/null 2>&1")), ["running", "npx", "prettier"])
check("editing names the files that actually changed, never the command that changed them",
      said(shell("python3 - <<'EOF'\nopen('x','w')\nEOF", effect="writes", files=["web/src/a.vue", "tests/t.py"])), ["editing", ["a.vue", "t.py"]])
check("a shell edit that changed nothing nameable falls back to the plural",
      said(shell("python3 - <<'EOF'\nopen('x','w')\nEOF", effect="writes")), ["editing", "files"])
check("reading a file is reading, and names the file", said(read("VERSION")), ["reading", "VERSION"])
check("editing a file is editing, and names the file", said(edit("feature.py")), ["editing", "feature.py"])
check("a test run names what it is testing", said(shell("python3 tests/test_serve.py 2>&1|tail -2", effect="tests")),
      ["testing", "python3", "test_serve.py"])
check("every other kind has its own word",
      [said(shell("rm x", effect=e))[0] for e in ("deletes", "installs", "builds")], ["deleting", "installing", "building"])
check("a journal command is rooted under journal and says what it did there", said(shell("journal message read 7")), ["journal", "reading", "message", "7"])
check("journal commands group with each other, and a shell command is not one of them",
      (said(shell("journal todo add x"), [shell("journal message unread", NOW - 1), shell("curl http://x", NOW - 2)]),
       said(shell("curl http://x"), [shell("journal message unread", NOW - 1)])),
      (["journal", ["checking for unread messages", "adding a to-do"]], ["running", "curl"]))
check("a tool that is neither a file nor a shell is being used, and every word of it is a part of its own",
      said({"what": "playwright · browser evaluate", "tool": "mcp__playwright__browser_evaluate", "at": NOW}),
      ["using", "playwright", "·", "browser", "evaluate"])
check("the verb is the root and the only unmuted part",
      coloured({"what": "playwright · browser evaluate", "tool": "mcp__x", "at": NOW})[:2], [("using", "gray"), ("playwright", "muted")])
check("a journal command's root is journal, and what it did there is muted",
      coloured(shell("journal message read 601"))[:2], [("journal", "gray"), ("reading", "muted")])
check("nothing running is no line", (line({}, [], NOW), line({"tool": "Bash"}, [], NOW)), ({}, {}))

# A RUN OF THE SAME KIND is one line, flipping through what it worked on
run = line(read("three.py"), [read("one.py", NOW - 2), read("two.py", NOW - 1)], NOW)
check("three reads are one reading line, in the order they happened", [p["value"] for p in run["parts"]],
      ["reading", ["one.py", "two.py", "three.py"]])
check("the flipping part says how often and hugs the right", (run["parts"][1]["duration"], run["parts"][1]["align"]), (ROLL_EVERY, "right"))
check("a command of another kind is left out of the names",
      said(edit("x.py"), [edit("one.py", NOW - 2), read("y.py", NOW - 1)]), ["editing", ["one.py", "x.py"]])
check("a one-liner of several commands is named once, by the first of them", said(shell("git add -A && git commit -m x && git push")),
      ["running", "git", "add"])
check("what two names share stays still and only the word that differs flips",
      said(shell("git commit -m x"), [shell("git add -A", NOW - 1)]), ["running", "git", ["add", "commit"]])

check("only the last names are kept", len(line(edit("last.py"), [edit(f"f{i}.py", NOW - 40 + i) for i in range(40)], NOW)["parts"][1]["value"]), MOST)
check("a name too long to show is cut with an ellipsis",
      said(edit("a-name-far-longer-than-any-status-bar-would-ever-show.py"))[1], "a-name-far-longer-than-any-status-bar-wou…")
check("with no name at all it falls back to the plural", said(shell("cd /x", effect="writes")), ["editing", "files"])
check("the same name twice in a run is named once", said(edit("x.py"), [edit("x.py", NOW - 1)]), ["editing", "x.py"])

# HOW LONG IT STAYS and what it reports when it ends
check("editing, deleting and a test run hold their line; nothing else does",
      [line(shell("rm x", effect=e), [], NOW)["hold"] for e in ("writes", "deletes", "tests", "reads", "builds")], [HOLD, HOLD, HOLD, 0.0, 0.0])
check("a line with nothing to replace it stays a while", line(shell("ls"), [], NOW)["lingers"], LINGERS)
check("a clock appears once it has run long enough, and says how long",
      [(line(shell("ls"), [], NOW + s)["clock"], line(shell("ls"), [], NOW + s)["for"]) for s in (1, CLOCK_AFTER + 1)],
      [(False, 1), (True, 11)])
check("a finished run is timed by when it finished, not by now", line(shell("ls", done=NOW + 2), [], NOW + 600)["for"], 2)
check("a passing run says passed", line(shell("pytest", effect="tests", done=NOW + 2, result={"passed": 9}), [], NOW)["parts"][-1],
      {"value": "passed", "color": "green"})
check("a failing run says how many failed", line(shell("pytest", effect="tests", done=NOW + 2, result={"failed": 3}), [], NOW)["parts"][-1],
      {"value": "3 failed", "color": "red"})
check("while it is still running it says nothing about the outcome",
      [p["color"] for p in line(shell("pytest", effect="tests", result={"failed": 3}), [], NOW)["parts"]], ["gray", "muted"])


# THE WHOLE BAR is the line, and the recent commands the viewer has not shown yet
class Row:
    running = edit("now.py")
    commands = [read("before.py", NOW - 1), edit("now.py")]


shown = bar(Row(), NOW)
check("the bar carries the line and every recent command in its own words",
      (shown["line"]["key"], [c["key"] for c in shown["commands"]]), ("editing now.py", ["reading before.py", "editing now.py"]))

done()
