#!/usr/bin/env python3
"""What the write gate must and must not stop.

    .journal/test_gate.py

THIS SUITE EXISTS BECAUSE THE GATE WAS WRONG THREE TIMES IN ONE DAY, and every one of the
three stopped a READ:

  `cat …; echo "=== useDispatch ==="; cat …`   `useDis` + `patch ` matched as a substring
  `python3 - <<'PY' … if n >= 6 … PY`          a heredoc body read as shell
  `./test.py 2>&1 | grep FAIL`                 a file-descriptor dup read as a redirect

Each fired during discovery — the one moment nobody can yet name the work, because the
reading is what tells them what the work is. A gate that interrupts reading teaches that it
is an obstacle to route around, and then the write it was built to catch is routed around
too. So the cases below are kept as regressions, and new ones go here before the fix does.

The bias is deliberate and stated: MISSING a write is cheaper than blocking a read. A false
deny stops real work and gets the gate switched off within the hour; a miss costs one
unfiled edit.
"""
import sys
from pathlib import Path

import json, os, shutil, subprocess, tempfile
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"

sys.path.insert(0, str(Path(__file__).resolve().parent))
import hook  # noqa: E402
SRC = Path(__file__).resolve().parent
import transcript  # noqa: E402

READS = [
    # the three regressions, first
    'cat resources/js/view/triggers.ts; echo "=== useDispatch ==="; cat resources/js/view/useDispatch.ts',
    "python3 - <<'PY'\nif shown >= 6: print(1)\nPY",
    './.journal/test_tracks.py 2>&1 | grep -A3 FAIL',
    # ordinary reading
    'grep -rn "confirm" src | head -20',
    'ls -la; wc -l *.py',
    'git status --short && git log --oneline -3',
    'git diff --stat; git show HEAD:file.py',
    'python3 -c "print(1)" 2>/dev/null',
    'echo "a > b"',
    "echo 'committee formed'",
    'sed -n "1,40p" file.py',
    'find . -name "*.php" | head',
    'cmd >&2',
    'diff <(cat a) <(cat b)',
    './journal.py start "x"',
    '.journal/journal.py remember "y"',
    'journal todo "park this" --brief <<\'EOF\'\nwhy and where\nEOF',
    'journal todo "park this" && journal open && git status',
]

WRITES = [
    'cat > foo.py <<EOF\nx\nEOF',
    'echo hi > notes.txt',
    'echo hi >> notes.txt',
    'sed -i "" s/a/b/ f.py',
    'rm -rf build',
    'mv a b',
    'cd /tmp && cp a b',
    'mkdir -p a/b',
    'touch new.txt',
    'chmod +x script.sh',
    'git commit -m "x"',
    'git checkout main',
    'git apply patch.diff',
    'FOO=1 tee out.txt',
    'sudo rm /etc/thing',
    'tee -a log < input',
    'ln -s a b',
    'patch -p1 < fix.diff',
    # A JOURNAL COMMAND EXEMPTS ITSELF, NOT THE LINE. These were waved through entirely.
    'journal todo "x" && rm -rf build',
    'git add -A && journal end "w"',
]

ok = fail = 0
for want, group, label in ((False, READS, "read "), (True, WRITES, "write")):
    for cmd in group:
        got = hook._is_write({"tool_name": "Bash", "tool_input": {"command": cmd}})
        if got == want:
            ok += 1
        else:
            fail += 1
            print(f"  FAIL expected {label}: {cmd.splitlines()[0][:70]}")

for name in ("Write", "Edit", "MultiEdit", "NotebookEdit"):
    got = hook._is_write({"tool_name": name, "tool_input": {}})
    ok, fail = (ok + 1, fail) if got else (ok, fail + 1)
    if not got:
        print(f"  FAIL the {name} tool must always be a write")

for name in ("Read", "Grep", "Glob", "WebFetch"):
    got = hook._is_write({"tool_name": name, "tool_input": {}})
    ok, fail = (ok + 1, fail) if not got else (ok, fail + 1)
    if got:
        print(f"  FAIL the {name} tool must never be a write")

# THE RUNG GATE: journal-only lines pass, a line that decides first passes, the rest do not
for cmd, want in (
    ('python3 .journal/journal.py nothing "only reads"', True),
    ('python3 .journal/journal.py search x', True),
    ('python .journal/journal.py remember "c" && make', True),
    ('journal search thing', True),
    ('.journal/journal.py --back=1 | head -40', True),
    ('journal remember "a claim" && git commit -m x', True),
    ('python3 other.py nothing "x"', False),
    ('journal nothing "only reads happened" ; ls', True),
    ('journal rule "r" && journal todo "t" && make', True),
    ('ls && journal nothing "late"', False),
    ('journal todo "t" && make', False),
    ('cat file', False),
):
    got = hook._is_journal({"tool_name": "Bash", "tool_input": {"command": cmd}})
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL rung gate expected {'pass' if want else 'deny'}: {cmd[:60]}")

# THE LINES A REAL AGENT RAN, and what the gates must say about each
RULE = "x" * 330
MULTI = ('cd /home/me/projects/app\n'
         f'  .journal/journal.py rule "{RULE}"\n'
         '  .journal/journal.py todo 1\n'
         '  git checkout -b slots-sweep\n'
         '  .journal/journal.py todo start 1\n'
         '  .journal/journal.py start "bring every composition to the WorkflowCard shape"')
got = hook._pin_overflow({"tool_name": "Bash", "tool_input": {"command": MULTI}}, 400)
ok, fail = (ok + 1, fail) if got is None else (ok, fail + 1)
if got is not None:
    print("  FAIL a newline ends the claim: a 330-char rule followed by other lines is under the cap")
for cmd, want in (
    ('cd proj\n.journal/journal.py start "w" && .journal/journal.py rule "r" && git checkout -b x', True),
    ('cd proj && journal start "w"; git checkout -b x', True),
    ('journal start "w" && git commit -m x', True),
    ('cd proj\njournal rule "r" && journal todo 1 && git checkout -b x && journal start "w"', False),
    ('git add -A && journal start "w"', False),
    ('journal todo "t" && rm -rf build', False),
):
    got = hook._declared_first({"tool_name": "Bash", "tool_input": {"command": cmd}})
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL declared-first expected {want}: {cmd[:60]!r}")
for cmd, fn, want in (
    ('J=.journal/journal.py; $J remember "c" && $J remember "d"', hook._is_journal, True),
    ('J=.journal/journal.py; $J search x | head', hook._is_journal, True),
    ('J=./.journal/journal.py; $J start "w" && git commit -m x', hook._declared_first, True),
    ('J=.journal/journal.py; ${J} nothing "no"', hook._is_journal, True),
    ('X=1; $UNKNOWN remember "c"', hook._is_journal, False),
):
    got = fn({"tool_name": "Bash", "tool_input": {"command": cmd}})
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL variable form expected {want}: {cmd[:60]}")
got = hook._is_journal({"tool_name": "Bash", "tool_input": {"command": 'cd proj && journal remember "c" && git commit -m x'}})
ok, fail = (ok + 1, fail) if got else (ok, fail + 1)
if not got:
    print("  FAIL cd before a deciding journal command is neutral for the rung gate")

# THE PIN CAP IS A DENIAL, NOT AN EXIT CODE. The command's own refusal is a stderr line
# after the fact; the gate says it before the command runs, off the same words.
LONG = "x" * 400
for cmd, want in (
    (f'journal remember "{LONG}"', True),
    (f'.journal/journal.py remember "{LONG}" --supersedes=3', True),
    (f'cd proj && ./.journal/journal.py remember "{LONG}" && journal pins', True),
    ('journal remember "a claim that fits"', False),
    (f'journal search remember; echo "{LONG}"', False),   # `remember` is the search term
    (f'echo "remember {LONG}"', False),                    # not the journal at all
    ('journal remember "unterminated', False),             # unparseable: left to the CLI
    # THE PATCH THAT GOT DENIED: a heredoc body mentioning the command is data, not a call
    ("python3 - <<'PY'\ns = '.journal/journal.py remember \"" + LONG + "\"'\nPY", False),
    (f'journal remember "{LONG}" <<EOF\nbody\nEOF', True),  # the opener's line still counts
    ('journal remember "' + "x" * 298 + '" 2>&1 | tail -1', False),  # the redirect is not claim
    ('journal remember "the report is at scratchpad/report.md"', True),  # cites a session path
    ('journal remember "see /tmp/out.txt for the numbers"', True),
    ('journal rule "never cite the scratchpad in a pin"', True),  # the word alone is enough: refuse
):
    got = hook._pin_overflow({"tool_name": "Bash", "tool_input": {"command": cmd}}, 300)
    if bool(got) == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL pin gate expected {'deny' if want else 'pass'}: {cmd[:60]}")
got = hook._pin_overflow({"tool_name": "Bash", "tool_input": {"command": f'journal remember "{LONG}"'}}, 0)
ok, fail = (ok + 1, fail) if got is None else (ok, fail + 1)
if got is not None:
    print("  FAIL a cap of 0 must not gate on length")

# DOES THE PROMPT ASK FOR WORK? Measured on this project's own prompts.
import asks
for text, want in (
    ("Lets rename the Nothing component to Empty ? or None? or Void? Suggestions?", True),
    ("cool! the app updated to latest version?", False),
    ("also, the context warnings, should also mention that claude should write todo's. agree?", True),
    ("are rules correctly injected in to the context on start too?! And after compaction etc?", False),
    ("please format the output of the todo commands so that it is human reaadable too!", True),
    ("nah, its fine, if it is on the latest version", False),
    ("what if we get distracted in the meantime? We swould surely forget", False),
    ("It should have parked this as a TODO even if it planned to do it next", True),
    ("I ran: journal todo --help it added it as the todo haha, we should fix that!", True),
    ("Also, make the output of search human readbale", True),
    ("yea, but why wait for the stop hook? nudge it when we detect the user asks for something", True),
    ("and currently it also contains duplicate user messages it seems", True),
    ("you can check the app project", True),
    ("So what did you like about your new version? What's different", False),
    ("Cool, can you commit and push and merge both to main", True),
    ("is the journal command aliased in the project right? Automatically?", False),
    ("cool, jsut to be sure, we have set no cap on the amount of injected rules right?", False),
    ("dont forget to update the skill too sir!", True),
    ("the dropdown is throwing 500s on every recompose now", True),
    ("ok", False), ("go ahead", False), ("yes please", False), ("cool, thanks!", False),
    ("what does the floor mark mean?", False),
    ("why did we remove PreCompact?", False),
    ('createa a good "question for work" detection algoritm', True),
    ("I want to increase the allowed pin length. increase to max 300.", True),
    ("how does the write gate decide what is a write?", False),
    ("oh wait! you did? ahh nvm, all good then", False),
    ("whats this?", False),
    ("Agree? open to feedback. I had to remind claude to write a pin..", False),
):
    got = asks.asks_for_work(text)
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL asks_for_work expected {want}: {text[:60]!r}")


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


# ---------------------------------------------------------------- the defaults: a 1M window, and never a gate on context
dd = Path(tempfile.mkdtemp()) / "proj"
(dd / ".claude").mkdir(parents=True)
shutil.copytree(SRC, dd / ".journal", ignore=shutil.ignore_patterns("runtime", "state.json*", "record.json*", "todo", "docs", "tools", ".journal", ".git", ".claude", "__pycache__"))
(dd / ".journal" / "settings.json").write_text("{}")
tdd = transcript.project_dir(dd); tdd.mkdir(parents=True, exist_ok=True)
pd = tdd / "s1.jsonl"
with pd.open("w") as fh:
    fh.write(json.dumps({"type": "user", "origin": {"kind": "human"}, "uuid": "u1", "message": {"role": "user", "content": "go"}}) + "\n")
    fh.write(json.dumps({"type": "assistant", "uuid": "a1", "message": {"role": "assistant", "content": [{"type": "text", "text": "[!reply] ok"}],
                         "usage": {"input_tokens": 720000}}}) + "\n")
def fire_dd(event, **extra):
    p = subprocess.run([str(dd / ".journal" / "hook.py")], input=json.dumps({"hook_event_name": event, "session_id": "s1", "transcript_path": str(pd), **extra}),
                       capture_output=True, text=True, timeout=60)
    return p.stdout
out = fire_dd("Stop")
check("with no settings at all the window is 1,000,000: 720k is the 70% rung", "context 72% full" in out, True)
out = fire_dd("PreToolUse", tool_name="Write", tool_input={"file_path": str(dd / "x.txt"), "content": "x"})
check("and the next tool call is NOT denied for it — the context rung never gates by default",
      "CONTEXT IS" in out, False)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
