#!/usr/bin/env python3
"""A new session has no environment: it is told, it chooses, and it cannot write until it has.

    .journal/test_unbound.py

Every edge: a fresh session is bound to nothing; its start says so to the AGENT in the
block and to the USER in `systemMessage`, naming the environments that exist; every prompt
carries the choice while it stands; a write is refused and the refusal names the way out;
reads and the journal's own commands are never refused; `switch` ends all of it; an unbound
session holds no environment, so a second session is not told the start one is taken; a
delegated subagent is never asked to choose; and `bind_on_start` puts the old binding back.
"""
import json, os, shutil, sys, tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import state, testkit, tracks, transcript  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


def project(settings: dict | None = None) -> Path:
    d = Path(tempfile.mkdtemp()) / "proj"
    (d / ".claude").mkdir(parents=True)
    shutil.copytree(SRC, d / ".journal", ignore=shutil.ignore_patterns(
        "runtime", "state.json*", "record.json*", "todo", "docs", "tools",
        ".journal", ".git", ".claude", "__pycache__"))
    (d / ".journal" / "settings.json").write_text(json.dumps(settings or {}))
    tdir = transcript.project_dir(d)
    tdir.mkdir(parents=True, exist_ok=True)
    return d


#: ONE INTERPRETER PER PROJECT. This suite makes six throwaway projects (d, d2 .. d6), each
#: needing its own long-lived server bound to its own `.journal`.
_PROJECTS: dict = {}


def _project(d):
    if str(d) not in _PROJECTS:
        _PROJECTS[str(d)] = testkit.Project(d)
    return _PROJECTS[str(d)]


def fire(d, event, stem, **extra):
    path = transcript.project_dir(d) / f"{stem}.jsonl"
    if not path.exists():
        path.write_text("")
    code, out = _project(d).hook(event, session_id=stem, transcript_path=str(path), **extra)
    return json.loads(out) if out.strip() else {}


def context_of(out: dict) -> str:
    return out.get("hookSpecificOutput", {}).get("additionalContext", "")


def flat(text: str) -> str:
    """The block as one line: it is wrapped for reading, and a phrase may straddle a break."""
    return " ".join(text.split())


def journal(d, stem, *args):
    return _project(d).cli(*args, session=stem)


# ------------------------------------------------- a fresh session is bound to nothing
d = project()
root = d / ".journal"
out = fire(d, "SessionStart", "s1", source="startup")
check("no binding is written at the start", tracks.bound(root, "s1"), None)
check("reads still fall back to the start environment", tracks.current(root, "s1"), "default")

block = context_of(out)
check("the block tells the agent it is on no environment", "NO ENVIRONMENT yet" in block, True)
check("it does not claim the session is bound", "this session is bound to environment" in block, False)
check("it names the way out", 'journal switch "<name>"' in block, True)

said = out.get("systemMessage", "")
check("the USER is told, in systemMessage", "no environment yet" in said, True)
check("and the environments are named to them", "`default`" in said, True)

# ------------------------------------------------- every prompt carries the choice
out = fire(d, "UserPromptSubmit", "s1", prompt="fix the nudge dedup bug")
ctx = context_of(out)
check("the prompt carries the choice", "THIS SESSION HAS NO ENVIRONMENT" in ctx, True)
check("it lists what exists", "\n  default" in ctx, True)
check("it says to infer from what was asked", "DECIDE FROM WHAT THE USER JUST ASKED" in flat(ctx), True)
check("and to ask when the message asks for nothing", "ASK which environment" in flat(ctx), True)
check("a second prompt carries it again", "THIS SESSION HAS NO ENVIRONMENT" in
      context_of(fire(d, "UserPromptSubmit", "s1", prompt="hello")), True)

# ------------------------------------------------- writes are refused, reads are not
out = fire(d, "PreToolUse", "s1", tool_name="Edit", tool_input={"file_path": "a.py"})
deny = out.get("hookSpecificOutput", {})
check("a write is denied", deny.get("permissionDecision"), "deny")
check("the denial names the choice", "THIS SESSION HAS NO ENVIRONMENT" in
      deny.get("permissionDecisionReason", ""), True)
check("and says reads are free", "Reads are never gated" in
      deny.get("permissionDecisionReason", ""), True)
check("a read is not denied", fire(d, "PreToolUse", "s1", tool_name="Read",
                                   tool_input={"file_path": "a.py"}), {})
check("the journal's own command is not denied",
      fire(d, "PreToolUse", "s1", tool_name="Bash",
           tool_input={"command": '.journal/journal.py switch "nudges"'}), {})

# ------------------------------------------------- switching ends all of it
code, said = journal(d, "s1", "switch", "nudges")
check("the switch runs from an unbound session", code, 0)
check("and binds it", tracks.bound(root, "s1"), "nudges")
check("the prompt no longer carries the choice", context_of(
    fire(d, "UserPromptSubmit", "s1", prompt="hello")), "")
check("a write is no longer denied for the environment",
      "NO ENVIRONMENT" in fire(d, "PreToolUse", "s1", tool_name="Edit", tool_input={})
      .get("hookSpecificOutput", {}).get("permissionDecisionReason", ""), False)
check("a later start names the environment it took", "bound to environment `nudges`" in
      context_of(fire(d, "SessionStart", "s1", source="startup")), True)
check("and says nothing to the user", "systemMessage" in
      fire(d, "SessionStart", "s1", source="startup"), False)

# ------------------------------------------------- an unbound session holds no environment
d2 = project()
fire(d2, "SessionStart", "a", source="startup")
out = fire(d2, "SessionStart", "b", source="startup")
check("a second unbound session is not told the start environment is taken",
      "IS TAKEN" in context_of(out), False)
check("because the first one never took it", tracks.occupants(d2 / ".journal", "default", "b"), [])
journal(d2, "a", "switch", "default")
out = fire(d2, "SessionStart", "b", source="startup")
check("once a really holds it, a switch onto it is refused",
      journal(d2, "b", "switch", "default")[0] != 0, True)

# ------------------------------------------------- a subagent is never asked to choose
d3 = project()
fire(d3, "SessionStart", "s1", source="startup")
check("an undelegated subagent's write is not held on the environment",
      "NO ENVIRONMENT" in fire(d3, "PreToolUse", "s1", agent_id="abc", tool_name="Edit",
                               tool_input={}).get("hookSpecificOutput", {})
      .get("permissionDecisionReason", ""), False)
check("nor does its prompt carry the choice", "THIS SESSION HAS NO ENVIRONMENT" in context_of(
    fire(d3, "UserPromptSubmit", "s1", agent_id="abc", prompt="do the thing")), False)

# ------------------------------------------------- bind_on_start puts the old start back
d4 = project({"bind_on_start": True})
out = fire(d4, "SessionStart", "s1", source="startup")
check("with bind_on_start the session is bound at its start",
      tracks.bound(d4 / ".journal", "s1"), "default")
check("the block names the environment", "bound to environment `default`" in context_of(out), True)
check("the user is told nothing", "systemMessage" in out, False)
check("and no prompt carries a choice", context_of(
    fire(d4, "UserPromptSubmit", "s1", prompt="hello")), "")

# ---------------------------------------------------------------- the mark survives
# THE TRANSCRIPT MAY NOT BE ON DISK YET when SessionStart fires. Every other test here
# creates the file first, which is exactly why this went unseen: the prune that runs at the
# end of the same handler deleted the runtime file it had just written, and the only proof
# the hook ever ran went with it.
d5 = project()
missing = transcript.project_dir(d5) / "s-late.jsonl"     # deliberately NOT created
_, out_hook = _project(d5).hook("SessionStart", source="startup", session_id="s-late",
                                transcript_path=str(missing))
mark = d5 / ".journal" / "runtime" / "s-late.json"
check("the start block is still handed over", "THE JOURNAL IS IN FORCE" in out_hook, True)
check("the runtime file survives a transcript that is not on disk yet", mark.is_file(), True)
check("and it says the hook ran",
      json.loads(mark.read_text()).get("session_started") if mark.is_file() else None, "startup")

# a runtime file whose transcript really is gone is still pruned
d6 = project()
fire(d6, "SessionStart", "s-here", source="startup")
(transcript.project_dir(d6) / "s-gone.jsonl").write_text("")
fire(d6, "SessionStart", "s-gone", source="startup")
(transcript.project_dir(d6) / "s-gone.jsonl").unlink()
fire(d6, "SessionStart", "s-here", source="startup")   # the prune runs at a start
check("the file of a transcript that is gone is dropped",
      (d6 / ".journal" / "runtime" / "s-gone.json").is_file(), False)
check("and the live session's is kept",
      (d6 / ".journal" / "runtime" / "s-here.json").is_file(), True)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
