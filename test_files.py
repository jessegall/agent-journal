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
check("a command that commits adds nothing: HEAD moved, so its numbers are not edits", files().get("a.txt"), (False, 4, 1))
_head = subprocess.run(["git", "rev-parse", "HEAD"], cwd=str(d), capture_output=True, text=True).stdout.strip()
check("but the commit it made goes on the open work, with its hash and subject",
      [(c["sha"], c["subject"]) for w in state.tracked(d / ".journal", "work", "w", []) for c in w.get("commits") or []],
      [(_head, "x")])

import controllers.activity as activity  # noqa: E402
j("work", "end", "change some files")
ended = [e for e in activity.ActivityController._events(d / ".journal", "w") if e["text"] == "Ended work"]
check("the Ended work line in Activity says how many files changed", [e["detail"] for e in ended], ["3 files changed"])
import commandlog  # noqa: E402
check("the tool uses since the last journal command become one line when a journal command runs",
      "Ran 2 commands, edited 5 files" in [e["text"] for e in commandlog.entries(d / ".journal", "w")], True)

print(f"\n{ok} passed, {fail} failed")
raise SystemExit(1 if fail else 0)
