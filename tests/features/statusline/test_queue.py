import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from features.statusline.feature import bar  # noqa: E402
from features.statusline.group import grouped, ran  # noqa: E402
from features.statusline.queue import CLOCK_AFTER, DRAINING, FLIP_EVERY, HOLD, LINGERS, MOST  # noqa: E402
from features.statusline.queue import queue as messages  # noqa: E402
from tests.kit import check, done  # noqa: E402

features.unload()
features.load()

NOW = 1_000_000.0


def shell(what, at=NOW, **more):
    return {"what": what, "tool": "Bash", "at": at, **more}


def used(tool, subject, at=NOW, **more):
    return {"what": f"using {subject}", "tool": tool, "subject": subject, "at": at, **more}


def read(name, at=NOW, **more):
    return {"what": f"reading {name}", "tool": "Read", "files": [name], "at": at, "effect": "reads", **more}


def edit(name, at=NOW, **more):
    return {"what": f"editing {name}", "tool": "Edit", "files": [name], "at": at, "effect": "writes", **more}


def queue(commands, now=NOW):
    return messages(grouped(ran(list(commands))), now)


def said(commands, now=NOW):
    return [[p["value"] for p in one["parts"]] for one in queue(list(commands), now)]


def coloured(commands, now=NOW):
    return [[(p["value"], p["color"]) for p in one["parts"]] for one in queue(list(commands), now)]


# ONE MESSAGE PER RUN of consecutive commands of the same kind
check("a run of the same kind is one message, naming everything it worked on in order",
      said([edit("a.vue"), edit("b.py"), edit("c.md")]), [["editing", ["a.vue", "b.py", "c.md"]]])
check("a command of another kind closes the message and opens the next",
      said([edit("a.vue"), shell("git commit -m x"), edit("c.md")]),
      [["editing", "a.vue"], ["git", "committing", "changes"], ["editing", "c.md"]])
check("the user's case: two writes, a journal command, a commit, a write",
      said([edit("one.py"), edit("two.py"), shell("journal todo add x", NOW + 1), shell("git commit -m x", NOW + 2), edit("three.py", NOW + 3)]),
      [["editing", ["one.py", "two.py"]], ["journalling", "adding", "todo"], ["git", "committing", "changes"], ["editing", "three.py"]])
check("nothing that has not run is in the queue: an empty ring is an empty queue", queue([], NOW), [])
check("a command with nothing to say is left out", said([shell("")]), [])

# EVERY SPACE IS A PART, and only the part that differs rolls
check("a file name stays one part however many spaces it has",
      said([read("Screenshot 2026-09-20 at 15.40.08.png")]), [["viewing", "Screenshot 2026-09-20 at 15.40.08.png"]])
check("a read names a path, never a flag's value",
      said([shell("sed -n 88,94p providers/base.py", effect="reads")]), [["reading", "base.py"]])
check("every word of a name is a part of its own",
      said([used("mcp__playwright__browser_evaluate", "playwright · browser evaluate")]),
      [["using", "playwright", "·", "browser", "evaluate"]])
check("what two names share stands still and only the word that differs rolls",
      said([shell("journal message read 109"), shell("journal message read 110", NOW + 1)]),
      [["journalling", "reading", "message", ["109", "110"]]])
check("a quoted string stays one part", said([shell("npx prettier --write 'a b.vue'")]), [["running", "npx", "prettier"]])
check("the rolling part says how often",
      queue([shell("git add -A"), shell("git commit -m x", NOW + 1)], NOW)[0]["parts"][-1]["duration"], FLIP_EVERY)

# THE VERB IS THE ROOT, and the only unmuted part
check("the verb is gray and everything else muted",
      coloured([used("mcp__x__y", "playwright · browser evaluate")])[0][:2], [("using", "gray"), ("playwright", "muted")])
check("a run of git commands is one message, rooted under git",
      said([shell("git add -A"), shell("git commit -m x", NOW + 1, effect="writes", done=NOW + 2), shell("git push", NOW + 3)]),
      [["git", ["tracking", "committing", "pushing"], ["files", "changes", "changes"]]])
check("a picture and a film have their own words",
      [said([{"what": f"reading {f}", "tool": "Read", "at": NOW, "effect": "reads", "files": [f]}])[0][0] for f in ("a.png", "b.mp4")],
      ["viewing", "watching"])
check("every kind has its own verb",
      [said([shell("x", effect=e, files=["a.py"])])[0][0] for e in ("writes", "reads", "deletes", "tests", "installs", "builds", "")],
      ["editing", "reading", "deleting", "testing", "installing", "building", "running"])
check("a run of journal commands is one message whose every column rolls on its own",
      said([shell("journal question answer 10"), shell("journal todo add 12", NOW + 1), shell("journal work log 12 x", NOW + 2)]),
      [["journalling", ["answering", "adding", "logging"], ["question", "todo", "work"], ["10", "12", "12"]]])
check("a journal command is rooted under journalling and what it did there is muted",
      coloured([shell("journal message read 601")])[0][:2], [("journalling", "gray"), ("reading", "muted")])

# WHAT A MESSAGE NAMES depends on what it is doing
check("a shell command is named by its root and subcommand, with no flags or arguments",
      said([shell("npx prettier --write src/a.vue >/dev/null 2>&1")]), [["running", "npx", "prettier"]])
check("a one-liner of several commands is named once, by the first of them",
      said([shell("git add -A && git commit -m x && git push")]), [["git", "tracking", "files"]])
check("editing names the files that actually changed, never the command that changed them",
      said([shell("python3 - <<'EOF'\nopen('x','w')\nEOF", effect="writes", files=["web/src/a.vue", "tests/t.py"])]),
      [["editing", ["a.vue", "t.py"]]])
check("a write that does not know its files yet says nothing at all, rather than half of it",
      queue([shell("git mv a b", effect="writes")], NOW), [])
check("a write still running does not add a name it does not have",
      [[q["value"] for q in one["parts"]] for one in queue([edit("a.py", done=NOW + 1), shell("sed -i x", NOW + 2, effect="writes")], NOW + 3)],
      [["editing", "a.py"]])
check("once it knows them it says so",
      [[p["value"] for p in one["parts"]] for one in queue([shell("git mv a b", effect="writes", done=NOW + 1, files=["b"])], NOW + 2)],
      [["editing", "b"]])
check("every message carries an id, which is when its run began",
      [one["id"] for one in queue([edit("a.py"), shell("ls", NOW + 1, effect="reads")], NOW + 2)], [NOW, NOW + 1])
check("an edit that named no file is not editing anything: it is the command, running",
      (said([shell("python3 - <<'EOF'\nopen('x','w')\nEOF", effect="writes", done=NOW + 1)]),
       said([shell("cd /x && touch a", effect="writes", done=NOW + 1)])),
      ([["running", "python3", "script"]], [["running", "touch", "a"]]))
check("only editing and deleting count lines; a read that was stamped with them says nothing",
      said([read("t.py", changed={"added": 8, "removed": 1})]), [["reading", "t.py"]])
check("reading never names the command, only what it read",
      (said([read("VERSION")]), said([shell("cat features/statusline/feature.py", effect="reads")]), said([shell("ls", effect="reads")])),
      ([["reading", "VERSION"]], [["reading", "feature.py"]], [["reading", "files"]]))
check("a test run names its subject, never its runner",
      said([shell("python3 tests/test_serve.py 2>&1|tail -2", effect="tests")]), [["testing", "test_serve.py"]])
check("the same name twice in a run is named once", said([edit("x.py"), edit("x.py", NOW + 1)]), [["editing", "x.py"]])
check("only the last names are kept", len(queue([edit(f"f{i}.py", NOW + i) for i in range(40)], NOW)[0]["parts"][1]["value"]), MOST)
check("a name too long to show is cut with an ellipsis",
      said([edit("a-name-far-longer-than-any-status-bar-would-ever-show.py")])[0][1],
      "a-name-far-longer-than-any-status-bar-wou…")

# LINES CHANGED count up, they do not roll
check("what a run added and removed are two parts of their own, which increment",
      queue([edit("a.vue", changed={"added": 10, "removed": 4}), edit("b.py", NOW + 1, changed={"added": 3, "removed": 0})], NOW)[0]["parts"][2:],
      [{"value": 13, "prefix": "+", "increments": True, "color": "green"}, {"value": 4, "prefix": "-", "increments": True, "color": "red"}])
check("a run that changed no lines says nothing about them", len(queue([edit("a.vue")], NOW)[0]["parts"]), 2)

# HOW LONG IT STAYS, and what it reports when it ends
check("editing, deleting and a test run hold their message; nothing else does",
      [queue([shell("x", effect=e, files=["a.py"])], NOW)[0]["hold"] for e in ("writes", "deletes", "tests", "reads", "builds")],
      [HOLD, HOLD, HOLD, 0.0, 0.0])
check("a message stays long enough to walk every name it has",
      queue([edit("a.py"), edit("b.py", NOW + 1), edit("c.py", NOW + 2)], NOW)[0]["hold"], 3 * FLIP_EVERY)
check("a message gives way at once when the queue has backed up behind it",
      [one["hold"] for one in queue([edit(f"f{i}.py", NOW + i) if i % 2 else shell(f"echo {i}", NOW + i) for i in range(24)], NOW + 30)][:2],
      [DRAINING, DRAINING])
check("a message with nothing to replace it lingers", queue([shell("ls")], NOW)[0]["lingers"], LINGERS)
check("only the last message of the queue can still be running",
      [one["done"] for one in queue([edit("a.vue"), shell("git commit -m x", NOW + 1)], NOW + 2)], [True, False])
check("a run that has finished is done and timed by when it finished",
      [(one["done"], one["for"]) for one in queue([shell("ls", done=NOW + 2)], NOW + 600)], [(True, 2)])
check("a message that has finished never shows a clock, however long it took",
      queue([shell("ls", done=NOW + 60)], NOW + 61)[0]["clock"], False)
check("only the tail differs when two names are not the same length",
      said([used("mcp__playwright__browser_take_screenshot", "playwright · browser take screenshot"),
            used("mcp__playwright__browser_navigate", "playwright · browser navigate", NOW + 1)]),
      [["using", "playwright", "·", "browser", ["take screenshot", "navigate"]]])
check("a message whose newest command has just started shows no clock",
      queue([shell("journal todo read 1"), shell("journal todo read 2", NOW + 19)], NOW + 20)[0]["clock"], False)
check("a clock appears once a running message has been up long enough",
      [(queue([shell("ls")], NOW + s)[0]["clock"], queue([shell("ls")], NOW + s)[0]["for"]) for s in (1, CLOCK_AFTER + 1)],
      [(False, 1), (True, 11)])
check("a build says whether it built or failed",
      [queue([shell("npm run build", effect="builds", done=NOW + 2, result=r)], NOW)[0]["parts"][-1] for r in ({"ok": True}, {"ok": False})],
      [{"value": "built", "color": "green"}, {"value": "failed", "color": "red"}])
check("a passing test run says passed",
      queue([shell("pytest", effect="tests", done=NOW + 2, result={"passed": 9})], NOW)[0]["parts"][-1], {"value": "passed", "color": "green"})
check("a failing test run says how many failed",
      queue([shell("pytest", effect="tests", done=NOW + 2, result={"failed": 3})], NOW)[0]["parts"][-1], {"value": "3 failed", "color": "red"})
check("while it is still running it says nothing about the outcome",
      [p["color"] for p in queue([shell("pytest", effect="tests", result={"failed": 3})], NOW)[0]["parts"]], ["gray", "muted"])


# THE WHOLE BAR is the queue, and nothing else
class Row:
    commands = [read("before.py"), edit("now.py", NOW + 1)]


check("the bar is the queue", [one["key"] for one in bar(Row(), NOW + 2)["queue"]], ["reading before.py", "editing now.py"])

done()
