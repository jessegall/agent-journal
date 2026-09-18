#!/usr/bin/env python3
"""The files a piece of work changed are recorded on it, with lines added and removed.

    .journal/test_files.py
"""
import json, os, subprocess, sys, tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import state, testkit, transcript  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


def git(d, *args):
    subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", *args], cwd=str(d),
                   capture_output=True, text=True, timeout=30, check=True)


d = Path(tempfile.mkdtemp()) / "proj"
(d / ".claude").mkdir(parents=True)
testkit.make(d, SRC)
(d / ".journal" / "settings.json").write_text(json.dumps({"silenced": ["loop"], "one_session_per_environment": False}))
transcript.project_dir(d).mkdir(parents=True, exist_ok=True)
(d / ".gitignore").write_text(".journal/\n.claude/\n")
(d / "a.txt").write_text("one\ntwo\n")
git(d, "init", "-q")
git(d, "add", "a.txt", ".gitignore")
git(d, "commit", "-q", "-m", "start")

stem = "aaaaaaaa-0000-4000-8000-000000000001"
path = transcript.project_dir(d) / f"{stem}.jsonl"
path.write_text("")
P = testkit.Project(d)


def fire(event, **extra):
    return P.hook(event, session_id=stem, transcript_path=str(path), **extra)[1]


def j(*a):
    return P.cli(*a, session=stem, stdin="")


def files():
    standing = [w for w in state.tracked(d / ".journal", "work", "w", []) if not w.get("ended")]
    return {f["path"]: (f["created"], f["added"], f["removed"]) for f in (standing[0].get("files") or [])} if standing else {}


fire("SessionStart", source="startup")
j("switch", "w")
fire("PostToolUse", tool_name="Edit", tool_input={"file_path": str(d / "a.txt")},
     tool_response={"filePath": str(d / "a.txt"), "structuredPatch": [{"lines": [" one", "-two", "+2", "+three"]}]})
check("with nothing open, a changed file is recorded nowhere", files(), {})

j("work", "start", "change some files")
fire("PostToolUse", tool_name="Edit", tool_input={"file_path": str(d / "a.txt")},
     tool_response={"filePath": str(d / "a.txt"), "structuredPatch": [{"lines": [" one", "-two", "+2", "+three"]}]})
check("an Edit records its file with the patch's added and removed lines", files(), {"a.txt": (False, 2, 1)})
fire("PostToolUse", tool_name="Edit", tool_input={"file_path": str(d / "a.txt")},
     tool_response={"filePath": str(d / "a.txt"), "structuredPatch": [{"lines": ["+four"]}]})
check("a second edit to the same file adds to its counts", files(), {"a.txt": (False, 3, 1)})
fire("PostToolUse", tool_name="Write", tool_input={"file_path": str(d / "new.py")},
     tool_response={"type": "create", "filePath": str(d / "new.py"), "content": "x = 1\ny = 2\nz = 3\n", "structuredPatch": []})
check("a Write that creates a file counts its lines and marks it new", files().get("new.py"), (True, 3, 0))
fire("PostToolUse", tool_name="Write", tool_input={"file_path": "/tmp/elsewhere.txt"},
     tool_response={"type": "create", "filePath": "/tmp/elsewhere.txt", "content": "x\n"})
fire("PostToolUse", tool_name="Write", tool_input={"file_path": str(d / ".journal" / "note.md")},
     tool_response={"type": "create", "filePath": str(d / ".journal" / "note.md"), "content": "x\n"})
check("files outside the project or inside the journal are not recorded", sorted(files()), ["a.txt", "new.py"])

fire("PreToolUse", tool_name="Bash", tool_input={"command": "cp a.txt b.txt"})
(d / "b.txt").write_text("copied\nlines\n")
with (d / "a.txt").open("a") as fh:
    fh.write("five\n")
fire("PostToolUse", tool_name="Bash", tool_input={"command": "cp a.txt b.txt"}, tool_response={"stdout": ""})
got = files()
check("a shell command's changes are counted from git: a new file, and lines added to a tracked one",
      (got.get("b.txt"), got.get("a.txt")), ((True, 2, 0), (False, 4, 1)))

fire("PreToolUse", tool_name="Bash", tool_input={"command": "git commit -am x"})
git(d, "add", "-A")
git(d, "commit", "-q", "-m", "x")
fire("PostToolUse", tool_name="Bash", tool_input={"command": "git commit -am x"}, tool_response={"stdout": ""})
check("a command that commits adds nothing it had counted already", files().get("a.txt"), (False, 4, 1))
_head = subprocess.run(["git", "rev-parse", "HEAD"], cwd=str(d), capture_output=True, text=True).stdout.strip()
check("but the commit it made goes on the open work, with its hash and subject",
      [(c["sha"], c["subject"]) for w in state.tracked(d / ".journal", "work", "w", []) for c in w.get("commits") or []],
      [(_head, "x")])

_script = "python3 - <<'PY'\nopen('a.txt', 'a').write('six\\n')\nPY"
fire("PreToolUse", tool_name="Bash", tool_input={"command": _script})
with (d / "a.txt").open("a") as fh:
    fh.write("six\n")
fire("PostToolUse", tool_name="Bash", tool_input={"command": _script}, tool_response={"stdout": ""})
check("a script that writes a file is counted, though the gate does not call it a write", files().get("a.txt"), (False, 5, 1))

fire("PreToolUse", tool_name="Bash", tool_input={"command": "sed -i '' s/one/1/ a.txt && git commit -qam y"})
(d / "a.txt").write_text((d / "a.txt").read_text().replace("one", "1"))
(d / "c.txt").write_text("c\n")
git(d, "add", "-A")
git(d, "commit", "-q", "-m", "y")
fire("PostToolUse", tool_name="Bash", tool_input={"command": "sed -i '' s/one/1/ a.txt && git commit -qam y"}, tool_response={"stdout": ""})
got = files()
check("a line that edits and commits still counts what it edited", (got.get("a.txt"), got.get("c.txt")), ((False, 6, 2), (False, 1, 0)))

import controllers.activity as activity  # noqa: E402
j("work", "end", "change some files")
ended = [e for e in activity.ActivityController._events(d / ".journal", "w") if e["text"] == "Ended work"]
check("the Ended work line in Activity says how many files changed", [e["detail"] for e in ended], ["4 files changed"])
import commandlog  # noqa: E402
# THE QUEUE IS WRITTEN OUT BY WHATEVER COMES NEXT: a journal command, a commit being recorded, or the
# use that fills the batch (commandlog.QUEUE_SIZE). So a run like this one leaves several summed
# lines, not one — each holding the uses since the last thing that flushed. Asserted as the lines
# themselves, so a drift prints what it said.
_summed = [e["text"] for e in commandlog.entries(d / ".journal", "w")
           if e.get("by") == "Agent" and not e.get("kind") and not e.get("sha")]
check("the tool uses between two journal commands become one summed line each time",
      _summed, ["Edited 1 file", "Edited 3 files", "Ran 1 command, edited 2 files", "Ran 2 commands",
                "Ran 1 command"])

# ─────────── a call that commits AND ends the work still records the commit ───────────
# ONE TOOL CALL CAN CLOSE THE WORK IT WAS DOING: `git commit … && journal work end "…"`. The hook
# only looks after the call, when nothing is open any more, so the commit used to land nowhere.
j("work", "start", "the last piece")
_both = 'git commit -qam z && .journal/journal.py work end "the last piece"'
fire("PreToolUse", tool_name="Bash", tool_input={"command": _both})
with (d / "a.txt").open("a") as fh:
    fh.write("seven\n")
git(d, "add", "-A")
git(d, "commit", "-q", "-m", "z")
j("work", "end", "the last piece")
fire("PostToolUse", tool_name="Bash", tool_input={"command": _both}, tool_response={"stdout": ""})
_z = subprocess.run(["git", "rev-parse", "HEAD"], cwd=str(d), capture_output=True, text=True).stdout.strip()
_last = [w for w in state.tracked(d / ".journal", "work", "w", []) if w["subject"] == "the last piece"]
check("a commit made by the call that ended the work still lands on that work",
      [(c["sha"], c["subject"]) for w in _last for c in w.get("commits") or []], [(_z, "z")])

# ─────────── a call through an MCP server is its own line, holding what it called ───────────
import commandlog as _cl  # noqa: E402
fire("PostToolUse", tool_name="mcp__playwright__browser_navigate", tool_input={}, tool_response={})
fire("PostToolUse", tool_name="mcp__playwright__browser_take_screenshot", tool_input={}, tool_response={})
_rows = [e for e in _cl.entries(d / ".journal", "w") if e.get("kind") == "mcp"]
check("two calls through one server are one line, naming the server and holding both calls",
      [(e["text"], e["detail"], e["calls"]) for e in _rows],
      [("Used Playwright", "2 calls", ["browser_navigate", "browser_take_screenshot"])])
fire("PostToolUse", tool_name="Bash", tool_input={"command": "echo between"}, tool_response={"stdout": ""})
fire("PostToolUse", tool_name="mcp__playwright__browser_click", tool_input={}, tool_response={})
_rows = [e for e in _cl.entries(d / ".journal", "w") if e.get("kind") == "mcp"]
check("a line in between ends the run, so the next call starts a line of its own",
      [(e["text"], e["calls"]) for e in _rows],
      [("Used Playwright", ["browser_navigate", "browser_take_screenshot"]), ("Used Playwright", ["browser_click"])])
fire("PostToolUse", tool_name="mcp__claude_ai_Gmail__search", tool_input={}, tool_response={})
check("another server is another line, named after it",
      [e["text"] for e in _cl.entries(d / ".journal", "w") if e.get("kind") == "mcp"][-1], "Used Claude ai Gmail")
check("and an MCP call is not counted into the summed tool line",
      "used 1 tool" in " ".join(e["text"] for e in _cl.entries(d / ".journal", "w")).lower(), False)

print(f"\n{ok} passed, {fail} failed")
raise SystemExit(1 if fail else 0)
