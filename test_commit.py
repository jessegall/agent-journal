#!/usr/bin/env python3
"""A commit closes the to-do its message names, and a close can be undone.

    .journal/test_commit.py

Owns the trailer protocol end to end: what `todo.refs_in` will and will not read out of a
commit message, what the PostToolUse hook does with a commit that has landed, and
`todos reopen`, which is what makes closing without a human in the loop affordable.
"""
import json, os, shutil, subprocess, sys, tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import todo, transcript  # noqa: E402

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
shutil.copytree(SRC, d / ".journal", ignore=shutil.ignore_patterns(
    "runtime", "state.json*", "record.json*", "todo", "docs", "tools", ".journal",
    ".git", ".claude", "__pycache__"))
(d / ".journal" / "settings.json").write_text("{}")
tdir = transcript.project_dir(d); tdir.mkdir(parents=True, exist_ok=True)
pd = tdir / "s1.jsonl"; pd.write_text("")
J = str(d / ".journal" / "journal.py")
env = {**os.environ, transcript.SESSION_ENV: "s1"}
root = d / ".journal"


def j(*args):
    p = subprocess.run([J, *args], env=env, cwd=str(d), capture_output=True, text=True, timeout=60)
    return p.returncode, (p.stdout + p.stderr).strip()


def git(*args):
    return subprocess.run(["git", *args], cwd=str(d), capture_output=True, text=True, timeout=60)


def commit(message):
    subprocess.run(["git", "commit", "-q", "--allow-empty", "-F", "-"], cwd=str(d),
                   input=message, text=True, capture_output=True, timeout=60)


def fire(command="git commit -q -F - <<'MSG'\nx\nMSG"):
    p = subprocess.run([str(d / ".journal" / "hook.py")], env=env, timeout=60, capture_output=True,
                       text=True, input=json.dumps({
                           "hook_event_name": "PostToolUse", "session_id": "s1",
                           "transcript_path": str(pd), "cwd": str(d), "tool_name": "Bash",
                           "tool_input": {"command": command}, "tool_response": "ok"}))
    out = (p.stdout + p.stderr).strip()
    return json.loads(out)["hookSpecificOutput"]["additionalContext"] if out.startswith("{") else out


# ───────────────────────────── the trailer is read, prose is not ──────────────────────────
MSG = ("kit: the placement ruling landed\n\n"
       "Prose that says this closes to-do 2, and mentions Journal: todos done 9 mid-sentence.\n\n"
       "Journal: todos done 1\n"
       "Journal: todos done beta/4 the cap landed with it\n")
check("a trailer on its own line is read, prose naming a to-do is not",
      todo.refs_in(MSG), [(None, 1, ""), ("beta", 4, "the cap landed with it")])
check("a message with no trailer reads as no refs", todo.refs_in("kit: closes to-do 3\n"), [])
# A MESSAGE THAT DOCUMENTS THE PROTOCOL shows an example, and an example is indented.
check("an indented example is a quotation, not an instruction",
      todo.refs_in("kit: the protocol is\n\n    Journal: todos done 5\n\nand that is all.\n"), [])
check("the footer is where it is read, above or below any other trailer",
      todo.refs_in("kit: x\n\nClaude-Session: y\nJournal: todos done 5\n"), [(None, 5, "")])

# ─────────────────────────────── a commit closes what it names ─────────────────────────────
j("prepare", "alpha"); j("switch", "alpha")
j("todos", "add", "the placement vocabulary")
j("todos", "add", "second one")
j("prepare", "beta"); j("switch", "beta"); j("todos", "add", "beta's first"); j("switch", "alpha")
git("init", "-q"); git("config", "user.email", "t@t"); git("config", "user.name", "t")

commit("kit: the placement ruling landed\n\nProse about to-do 2 that must not match.\n\nJournal: todos done 1\n")
out = fire()
check("the commit's trailer closes the to-do, naming its environment",
      ("CLOSED WHAT IT NAMED" in out, "done 1: the placement vocabulary" in out, "`alpha`" in out),
      (True, True, True))
code, listed = j("todos", "--all")
check("and the close cites the commit, not a summary of it",
      ("the placement ruling landed" in listed, "(" in listed and ")" in listed), (True, True))
check("to-do 2, which only the prose named, is untouched", "2  second one" in listed, True)

check("a second event on the same sha says nothing", fire(), "")
commit("kit: again\n\nJournal: todos done 1\n")
out = fire()
check("a new commit naming an already-closed to-do is a no-op with a note, not a failure",
      ("was already closed" in out, "CLOSED NOTHING" in out), (True, True))

commit("kit: nothing there\n\nJournal: todos done 77\n")
check("a number no environment has closes nothing, and says so",
      ("no environment has one" in fire()), True)

commit("kit: no trailer, only prose about to-do 2\n")
check("a commit with no trailer is silent", fire(), "")

# an ambiguous number: 1 exists on alpha (closed) and beta (open) — `<environment>/N` settles it
commit("kit: explicit\n\nJournal: todos done beta/1 the ruling landed\n")
out = fire()
check("<environment>/N closes the one it names, on the other environment",
      ("done 1: beta's first" in out, "`beta`" in out), (True, True))

# ─────────────────────────── from-commit: the same protocol, by hand ───────────────────────
j("switch", "alpha")
j("todos", "add", "closed from the CLI")
commit("kit: by hand\n\nJournal: todos done 3\n")
code, out = j("todos", "from-commit")
check("journal todos from-commit acts on HEAD's trailer", (code, "done 3" in out), (0, True))
code, out = j("todos", "from-commit", "HEAD~1")
check("and it reads any ref it is given", "already closed" in out or "beta" in out, True)

# ───────────────────────────────── reopen: the close is undoable ───────────────────────────
code, out = j("todos", "reopen", "2", "it was never closed")
check("reopen refuses a to-do that is not done", (code, "nothing to reopen" in out), (1, True))
code, out = j("todos", "reopen", "1")
check("reopen without a reason refuses", (code, "say why" in out), (1, True))
code, out = j("todos", "reopen", "1", "closed against the wrong number")
check("reopen undoes the close and keeps what it undid",
      (code, "reopened 1" in out, "the close it undoes" in out), (0, True, True))
code, listed = j("todos")
check("and the to-do is waiting again", "1  the placement vocabulary" in listed, True)

# ─────────────────── the commit that closed nothing teaches the trailer, once ──────────────
j("todos", "add", "a started one")
code, out = j("todos", "start", "4")
check("todos start hands over the trailer that closes it",
      ("Journal: todos done 4" in out), True)
commit("kit: a commit with no trailer at all\n")
out = fire()
check("a commit that closed nothing, with a to-do started, teaches the trailer",
      ("CLOSED NO TO-DO" in out, "Journal: todos done 4" in out), (True, True))
commit("kit: another one with no trailer\n")
check("and it is said once a session, not at every commit", fire(), "")

# ───────────────────── the git hook: the same protocol for a commit typed by hand ──────────
I = str(d / ".journal" / "install.py")


def install(*flags):
    p = subprocess.run([I, *flags], env=env, cwd=str(d), capture_output=True, text=True, timeout=120)
    return p.stdout + p.stderr


hookfile = d / ".git" / "hooks" / "post-commit"
out = install("--git-hook")
check("--git-hook installs an executable post-commit hook",
      (hookfile.is_file(), os.access(hookfile, os.X_OK), "post-commit" in out), (True, True, True))
check("and it names the journal, so a second run knows it is ours",
      "agent-journal" in hookfile.read_text(), True)
check("installing twice changes nothing", "+ " + str(hookfile) not in install("--git-hook"), True)

j("todos", "add", "closed by a commit typed by hand")
subprocess.run(["git", "commit", "-q", "--allow-empty", "-F", "-"], cwd=str(d), env=env,
               input="kit: by hand\n\nJournal: todos done 5\n", text=True, capture_output=True, timeout=60)
code, listed = j("todos", "--all")
check("a commit made outside a session closes its to-do through the git hook",
      "5  ~~closed by a commit typed by hand~~" in listed, True)

check("the git hook says nothing when a commit names no to-do",
      subprocess.run(["git", "commit", "-q", "--allow-empty", "-m", "kit: quiet please"],
                     cwd=str(d), env=env, capture_output=True, text=True, timeout=60).stdout.strip(), "")
code, out = j("todos", "from-commit")
check("but run by hand it still answers", "names no to-do" in out, True)

install("--no-git-hook")
check("--no-git-hook takes ours back out", hookfile.exists(), False)
hookfile.write_text("#!/bin/sh\necho someone else's\n")
out = install("--git-hook")
check("a post-commit that is not ours is never clobbered — the line to add is printed instead",
      ("not the journal's" in out, "someone else's" in hookfile.read_text(),
       "todos from-commit" in out), (True, True, True))
check("and --no-git-hook will not delete a hook it did not write",
      ("not the journal's" in install("--no-git-hook"), hookfile.is_file()), (True, True))

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
