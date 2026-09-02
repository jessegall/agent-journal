#!/usr/bin/env python3
"""Tools: scripts kept for repeated work, catalogued and run through the journal.

    .journal/test_tools.py
"""
import json, os, shutil, subprocess, sys, tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import tools, transcript  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


d = Path(tempfile.mkdtemp()) / "proj"
(d / ".claude").mkdir(parents=True)
shutil.copytree(SRC, d / ".journal", ignore=shutil.ignore_patterns("runtime", "state.json*", "record.json*",
                                                                   "todo", "docs", "tools", "__pycache__"))
(d / ".journal" / "settings.json").write_text("{}")
tdir = transcript.project_dir(d); tdir.mkdir(parents=True, exist_ok=True)
path = tdir / "s1.jsonl"; path.write_text("")
J = str(d / ".journal" / "journal.py")
env = {**os.environ, transcript.SESSION_ENV: "s1"}
root = d / ".journal"


def j(*args, stdin=""):
    p = subprocess.run([J, *args], env=env, input=stdin, capture_output=True, text=True)
    return p.returncode, p.stdout + p.stderr


def fire(event, **extra):
    payload = {"hook_event_name": event, "session_id": "s1", "transcript_path": str(path), **extra}
    p = subprocess.run([str(root / "hook.py")], input=json.dumps(payload), capture_output=True, text=True)
    return p.stdout


code, out = j("tools")
check("an empty catalogue says so", (code, "No tools are catalogued" in out), (0, True))
code, out = j("tools", "add", "mover", "Move a class")
check("a tool needs a summary", (code, "needs a summary" in out), (1, True))
code, out = j("tools", "add", "mover", "Move a class", "--summary=Moves a class with every reference.", "--entry=run.py")
check("an entry that does not exist yet is refused", (code, "Write the script first" in out), (1, True))
code, out = j("tools", "add", "mover", "Move a class", "--summary=Moves a class with every reference.",
              "--usage=journal tools run mover Old New", "--when=Renaming or moving any class.", "--brief",
              stdin="Give the new name alone to rename in place.\n")
check("a tool is a folder with a tool.md", (code, "tool mover" in out, (root / "tools" / "mover" / "tool.md").is_file(),
                                            "no entry point yet" in out), (0, True, True, True))
(root / "tools" / "mover" / "run.py").write_text("import sys, os\nprint('moved', *sys.argv[1:], 'from', os.path.basename(os.getcwd()))\n")
code, out = j("tools", "set", "mover", "entry", "run.py")
check("the entry can be set once the script exists", (code, "entry is now 'run.py'" in out), (0, True))
code, out = j("tools", "add", "mover", "again", "--summary=x")
check("a duplicate name is refused", code, 1)
code, out = j("tools")
check("the catalogue shows name, title, summary, usage and entry",
      ("mover  —  Move a class" in out, "Moves a class" in out, "journal tools run mover Old New" in out, "entry run.py" in out), (True, True, True, True))
code, out = j("tools", "mover")
check("reading a tool shows what, usage, when, the body and how to run",
      ("TOOL mover" in out, "USAGE" in out, "WHEN" in out, "rename in place" in out, "journal tools run mover" in out), (True, True, True, True, True))
code, out = j("tools", "nosuch")
check("a missing tool says so", (code, "no tool named" in out), (1, True))
code, out = j("tools", "run", "mover", "Bone", "RenderNode")
check("run executes the entry from the project root with the arguments, via the interpreter",
      (code, out.strip()), (0, "moved Bone RenderNode from proj"))
code, out = j("tools", "run", "mover", "--dry-run", "X")
check("arguments that look like flags reach the tool untouched", out.strip(), "moved --dry-run X from proj")
# an entry anywhere in the project
(d / "scripts").mkdir()
(d / "scripts" / "callers.sh").write_text("#!/bin/sh\necho callers $1\n")
os.chmod(d / "scripts" / "callers.sh", 0o755)
code, out = j("tools", "add", "callers", "Callers of a method", "--summary=Lists the callers of a method.", "--entry=scripts/callers.sh")
check("an entry can live anywhere in the project", (code, "no entry point" in out), (0, False))
code, out = j("tools", "run", "callers", "handle")
check("and runs as an executable", out.strip(), "callers handle")
# adopting
(root / "tools" / "unreached").mkdir()
(root / "tools" / "unreached" / "uncovered.php").write_text("<?php\n\n/**\n * Reports every method name declared in src/ with the location of its callers.\n */\n")
code, out = j("tools")
check("a folder without tool.md is named", "no tool.md: unreached" in out, True)
code, out = j("tools", "index")
check("index writes a tool.md from what the folder holds",
      (code, "tool unreached — entry uncovered.php" in out, "Reports every method name" in tools.get(root, "unreached")[0]["summary"]), (0, True, True))
# removing
code, out = j("tools", "remove", "callers")
check("remove wants why", code, 1)
code, out = j("tools", "remove", "callers", "the IDE does this now")
check("remove retires under struck/ with the reason",
      (code, (root / "tools" / "struck" / "callers" / "tool.md").is_file(), "the IDE does this now" in (root / "tools" / "struck" / "callers" / "tool.md").read_text(),
       tools.get(root, "callers")[0]), (0, True, True, None))
# what a session is handed
out = fire("SessionStart", source="startup")
ctx = json.loads(out)["hookSpecificOutput"]["additionalContext"]
check("the start block carries the tools catalogue with usage",
      ("TOOLS OF THIS PROJECT" in ctx, "mover" in ctx, "journal tools run mover Old New" in ctx, "Lists the callers" in ctx), (True, True, True, False))
code, out = j()
check("the status page has a tools row", "tools" in out and "2 catalogued" in out, True)
# gates
out = fire("PreToolUse", tool_name="Bash", tool_input={"command": ".journal/journal.py tools run mover A B"})
check("running a tool with nothing open is refused like any write", "deny" in out, True)
out = fire("PreToolUse", tool_name="Bash", tool_input={"command": ".journal/journal.py tools mover"})
check("reading a tool is not", "deny" in out, False)
j("work", "start", "a rename")
out = fire("PreToolUse", tool_name="Bash", tool_input={"command": ".journal/journal.py tools run mover A B"})
check("with work open it runs", "deny" in out, False)
out = fire("PreToolUse", agent_id="abc", tool_name="Bash", tool_input={"command": '.journal/journal.py tools add x "y" --summary=z'})
check("a subagent cannot add a tool", "from a subagent is refused" in out, True)
out = fire("PreToolUse", agent_id="abc", tool_name="Bash", tool_input={"command": ".journal/journal.py tools run mover A B"})
check("but may run one", "from a subagent is refused" in out, False)

# the tool-shaped hint
def post(**kw):
    return fire("PostToolUse", tool_response="ok", **kw)
out = post(tool_name="Write", tool_input={"file_path": "/private/tmp/claude-x/scratchpad/fix.py"})
check("a script written into the scratchpad earns a hint naming tools add", ("is a script you wrote" in out, "tools add" in out), (True, True))
out = post(tool_name="Write", tool_input={"file_path": "/private/tmp/claude-x/scratchpad/fix.py"})
check("once per file", out.strip(), "")
out = post(tool_name="Write", tool_input={"file_path": str(d / "scripts" / "sweep.sh")})
check("a script written into scripts/ earns one too", "scripts/sweep.sh is a script you wrote" in out, True)
out = post(tool_name="Write", tool_input={"file_path": str(d / "src" / "Thing.php")})
check("source code is not a tool", out.strip(), "")
out = post(tool_name="Write", tool_input={"file_path": str(root / "tools" / "mover" / "run.py")})
check("a script inside .journal/tools is already a tool", out.strip(), "")
body = "x = 1\n" * 80
out = post(tool_name="Bash", tool_input={"command": f"python3 - <<'PY'\n{body}PY"})
check("a long inline script the first time: nothing", out.strip(), "")
out = post(tool_name="Bash", tool_input={"command": f"python3 - <<'PY'\n{body}PY"})
check("the same inline script twice: a hint", "has now run twice" in out, True)
out = post(tool_name="Bash", tool_input={"command": f"python3 - <<'PY'\n{body}PY"})
check("and once only", out.strip(), "")
out = post(tool_name="Bash", tool_input={"command": "php /tmp/helper.php src/"})
check("running a scratch script by name: a hint", "/tmp/helper.php is a scratch script you ran" in out, True)
out = post(tool_name="Bash", tool_input={"command": "python3 .journal/journal.py tools run mover A B"})
check("the journal's own commands never", out.strip(), "")

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
