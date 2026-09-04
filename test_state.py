#!/usr/bin/env python3
"""The record is shared; the marks are one transcript's. What that must never get wrong.

    .journal/test_state.py

THIS SUITE EXISTS BECAUSE THE MARKS WERE PROJECT-WIDE FOR WEEKS AND NOBODY COULD SEE IT.
A session at line 53 inherited `held_at: 1746` from the one before and its untagged hold
could not fire until line 1747; a subagent's read raised `biggest_result` in the parent's
context; the 50% rung, announced once per project, was never announced again. Every green
light stayed green, because the failure was silence.

Every test runs against a throwaway directory. It never touches the real record. The hook
is driven as a subprocess with a hand-built payload, exactly as the harness drives it.
"""
import json, os, os, shutil, subprocess, sys, tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"  # no network from the hooks under test
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"  # a pull inside a suite runs no suites

SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import state, pins, work, tracks, hook, transcript, digest, todo  # noqa: E402

AT = "2026-09-01T12:00:00+00:00"
ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


def fresh() -> Path:
    return Path(tempfile.mkdtemp())


# ------------------------------------------------------------- two scopes
r = fresh()
state.put(r, "held_at", 40, stem="A")
state.put(r, "held_at", 7, stem="B")
pins.add(r, "shared", AT, 140)
check("A's mark is A's", state.get(r, "held_at", 0, stem="A"), 40)
check("B's mark is B's", state.get(r, "held_at", 0, stem="B"), 7)
check("a third transcript starts at nothing", state.get(r, "held_at", 0, stem="C"), 0)
check("the record is the same from every transcript",
      [p["fact"] for p in pins.live(r)], ["shared"])
check("runtime files are named by the stem",
      sorted(f.name for f in (r / "runtime").iterdir()), ["A.json", "B.json"])
check("a record key never lands in runtime",
      "pins" in state.runtime(r, "A"), False)
check("a runtime write with no stem is refused, not filed at project scope",
      (state.put(r, "held_at", 99), state.get(r, "held_at", 0, stem="A")), (None, 40))
check("a runtime read with no stem is the default", state.get(r, "held_at", -1), -1)
check("runtime_files lists every transcript",
      [s for s, _ in state.runtime_files(r)], ["A", "B"])

# ------------------------------------------------------ the old file retires
r = fresh()
(r / "state.json").write_text(json.dumps({"held_at": 1746, "baseline_at": 1939}))
check("retire moves the old file aside", state.retire_old(r), True)
check("and nothing of it is read", state.get(r, "held_at", 0, stem="A"), 0)
check("retired twice is quiet", state.retire_old(r), False)
check("the old marks are still on disk for a person to read",
      json.loads((r / "state.json.retired").read_text())["held_at"], 1746)

# ---------------------------------------------------- concurrent writers
WRITER = """
import sys, json
sys.path.insert(0, %r)
import state, pins
from pathlib import Path
root, mode, i = Path(sys.argv[1]), sys.argv[2], sys.argv[3]
if mode == "runtime":
    state.put(root, "biggest_result", int(i), stem="A")
else:
    ok, msg = pins.add(root, "pin " + i, %r, 140)
    assert ok, msg
""" % (str(SRC), AT)
for mode, label in (("runtime", "runtime"), ("record", "record")):
    r = fresh()
    procs = [subprocess.Popen([sys.executable, "-c", WRITER, str(r), mode, str(i)],
                              stdout=subprocess.PIPE, stderr=subprocess.PIPE)
             for i in range(8)]
    outs = [p.communicate() for p in procs]
    codes = [p.returncode for p in procs]
    check(f"eight concurrent {label} writers, none crash", codes, [0] * 8)
    if mode == "runtime":
        check("the runtime file is whole afterwards",
              isinstance(state.get(r, "biggest_result", None, stem="A"), int), True)
        check("no tmp file was left behind",
              [f.name for f in (r / "runtime").iterdir() if f.suffix == ".tmp"], [])
    else:
        check("all eight pins stand — none lost to a race",
              sorted(p["fact"] for p in pins.live(r)), sorted(f"pin {i}" for i in range(8)))

# switch racing remember: the pin lands on the environment that was current under the lock
r = fresh()
pins.add(r, "before", AT, 140)
SWITCHER = f"""
import sys; sys.path.insert(0, {str(SRC)!r})
import tracks; from pathlib import Path
for i in range(20):
    tracks.switch(Path(sys.argv[1]), "t%d" % (i % 2), {AT!r})
"""
PINNER = f"""
import sys; sys.path.insert(0, {str(SRC)!r})
import pins; from pathlib import Path
for i in range(20):
    ok, msg = pins.add(Path(sys.argv[1]), "race %d" % i, {AT!r}, 140)
    assert ok, msg
"""
ps = [subprocess.Popen([sys.executable, "-c", code, str(r)], stdout=subprocess.PIPE,
                       stderr=subprocess.PIPE) for code in (SWITCHER, PINNER)]
errs = [p.communicate()[1].decode() for p in ps]
check("switch and remember racing: neither crashes", [p.returncode for p in ps], [0, 0])
rec = json.loads((r / "record.json").read_text())
every = [p["fact"] for p in rec.get("pins", [])] + [
    p["fact"] for t in rec.get("tracks", {}).values() for p in t.get("pins", [])]
check("every pin written under the race exists on SOME environment, none vanished",
      sorted(every), sorted(["before"] + [f"race {i}" for i in range(20)]))

# the lock is reentrant
r = fresh()
with state.locked(r):
    with state.locked(r):
        pins.add(r, "nested", AT, 140)
check("nested locking does not deadlock and still writes", [p["fact"] for p in pins.live(r)],
      ["nested"])

# -------------------------------------------------------- the hook, end to end
def project_with(lines: int, stem: str = "s1", tagged: bool = False):
    """A throwaway project whose transcript dir the hook will resolve from its own path."""
    d = Path(tempfile.mkdtemp()) / "proj"
    (d / ".claude").mkdir(parents=True)
    shutil.copytree(SRC, d / ".journal",
                    ignore=shutil.ignore_patterns("runtime", "state.json*", "record.json*",
                                                  "todo", "docs", "tools", ".journal", ".git", ".claude", "__pycache__"))
    # this suite is not about the loop subject or the one-session-per-environment rule
    (d / ".journal" / "settings.json").write_text(json.dumps({"bind_on_start": True, "silenced": ["loop"], "one_session_per_environment": False, "gate_after_context_rung": True}))
    tdir = transcript.project_dir(d)
    tdir.mkdir(parents=True, exist_ok=True)
    path = tdir / f"{stem}.jsonl"
    with path.open("w") as fh:
        for i in range(lines):
            if i % 2 == 0:
                fh.write(json.dumps({"type": "user", "origin": {"kind": "human"},
                                     "message": {"role": "user", "content": f"q{i}"}}) + "\n")
            else:
                fh.write(json.dumps({"type": "assistant", "message": {
                    "role": "assistant", "content": [{"type": "text", "text": ("[!reply] " if tagged else "") + f"line {i}"}],
                    "usage": {"input_tokens": 1000}}}) + "\n")
    return d, path


def fire(d, event, path, **extra):
    payload = {"hook_event_name": event, "session_id": path.stem,
               "transcript_path": str(path), **extra}
    p = subprocess.run([str(d / ".journal" / "hook.py")], input=json.dumps(payload),
                       capture_output=True, text=True, timeout=60)
    return p.returncode, p.stdout, p.stderr


def held(out: str) -> tuple[str, str]:
    """(the one line the user sees, the reasoning the agent reads) of a Stop hold."""
    if not out.strip():
        return "", ""
    got = json.loads(out)
    if got.get("decision") != "block":
        return "", (got.get("hookSpecificOutput") or {}).get("additionalContext", "")
    label, _, ctx = got["reason"][len("journal: "):].partition(" — ")
    details = state.get(d / ".journal", "next_text", "", stem=path.stem) if "journal.py next" in ctx else ""
    return "journal reminded Claude: " + label, "journal: " + ctx + ("\n" + details if details else "")


def runtime_of(d, stem):
    return state.runtime(d / ".journal", stem)


# a fresh transcript is held on its first untagged message, at line 3 not line 1940
d, path = project_with(0)
fire(d, "SessionStart", path, source="startup")
check("SessionStart writes the floor at the line count then (0)", runtime_of(d, "s1")["floor"], 0)
with path.open("a") as fh:
    fh.write(json.dumps({"type": "user", "origin": {"kind": "human"},
                         "message": {"role": "user", "content": "hi"}}) + "\n")
    fh.write(json.dumps({"type": "assistant", "message": {
        "role": "assistant", "content": [{"type": "text", "text": "no tag here"}],
        "usage": {"input_tokens": 10}}}) + "\n")
code, out, err = fire(d, "Stop", path)
brief, why = held(out)
check("a fresh transcript is held on its first untagged message",
      (code, "carried no tag" in why), (0, True))
check("the user's line is a small label",
      (brief.count("\n"), brief), (0, "journal reminded Claude: 1 untagged message(s)"))
check("the context is the one-line instruction, naming the tags and the line",
      (why.startswith("journal: 1 message(s) carried no tag"), "[!discovery]" in why, "line 2" in why, "\n" in why),
      (True, True, True, False))
check("the hold is recorded in THIS transcript's file", runtime_of(d, "s1").get("held_at"), 2)
check("and not in any other", runtime_of(d, "other"), {})

# a second transcript in the same project starts clean
path2 = path.with_name("s2.jsonl")
shutil.copy(path, path2)
code, out, err = fire(d, "Stop", path2)
check("Stop as the FIRST event on a transcript writes a floor, holds nothing",
      (code, out.strip(), runtime_of(d, "s2").get("floor")), (0, "", 2))
check("s1's mark is untouched by s2", runtime_of(d, "s1").get("held_at"), 2)

# a session joined late (hook wired at line 400) is not held for its history
d, path = project_with(400)
code, out, err = fire(d, "PreToolUse", path, tool_name="Read", tool_input={})
check("PreToolUse on first sight writes the floor at 400", runtime_of(d, "s1")["floor"], 400)
code, out, err = fire(d, "Stop", path)
check("and the 200 untagged messages before it are not held", out.strip(), "")

# subagents get their own marks, keyed by their agent id
d, path = project_with(4)
big = {"tool_name": "Bash", "tool_input": {}, "tool_response": {"stdout": "x" * 30000}}
code, out, err = fire(d, "PostToolUse", path, agent_id="abc", **big)
check("a subagent's read files nothing and is nudged for nothing",
      (out.strip(), runtime_of(d, "agent-abc"), runtime_of(d, "s1").get("biggest_result")),
      ("", {}, None))
code, out, err = fire(d, "PostToolUse", path, **big)
check("so the parent is still told about ITS first big read", "CHARACTERS" in out, True)
for cmd, want in (('.journal/journal.py remember "a fact"', True),
                  ('cd x && ./.journal/journal.py start "work"', True),
                  ('.journal/journal.py search remember', False),
                  ('.journal/journal.py pins', False),
                  ('cat file.py', False)):
    code, out, err = fire(d, "PreToolUse", path, agent_id="abc", tool_name="Bash",
                          tool_input={"command": cmd})
    check(f"subagent journal write denied, reads and other tools not: {cmd[:40]}",
          "from a subagent is refused" in out, want)
code, out, err = fire(d, "PreToolUse", path, agent_id="abc", tool_name="Edit", tool_input={})
check("a subagent's edit is not gated on open work", out.strip(), "")

# the context ladder is silent while the window is unknown, and climbs when set
d, path = project_with(4)
with path.open("a") as fh:
    fh.write(json.dumps({"type": "assistant", "message": {
        "role": "assistant", "content": [{"type": "text", "text": "[!reply] fine"}],
        "usage": {"input_tokens": 120000}}}) + "\n")
fire(d, "SessionStart", path, source="startup")
code, out, err = fire(d, "Stop", path)
check("120k tokens with the window unknown: no rung", "CONTEXT IS" in out, False)
(d / ".journal" / "settings.json").write_text(json.dumps({"bind_on_start": True, "silenced": ["loop"], "one_session_per_environment": False, "gate_after_context_rung": True, "context_window": 200000}))
code, out, err = fire(d, "Stop", path)
check("the same reading with a 200k window set: the 50% rung", "CONTEXT IS 60% FULL" in held(out)[1], True)
check("the rung is this transcript's", runtime_of(d, "s1").get("warned_at"), 0.5)
(d / ".journal" / "settings.json").write_text(json.dumps({"bind_on_start": True, "silenced": ["loop"], "one_session_per_environment": False, "gate_after_context_rung": True, "context_window": 1000000}))
d2, path2 = project_with(4)
with path2.open("a") as fh:
    fh.write(json.dumps({"type": "assistant", "message": {
        "role": "assistant", "content": [{"type": "text", "text": "[!reply] fine"}],
        "usage": {"input_tokens": 250000}}}) + "\n")
code, out, err = fire(d2, "Stop", path2)
check("a peak past 200k rules the window in on its own: 25% of 1M, no rung",
      "CONTEXT IS" in out, False)

# after a rung, nothing runs until a decision: remember or nothing
d, path = project_with(4, tagged=True)
with path.open("a") as fh:
    fh.write(json.dumps({"type": "assistant", "message": {
        "role": "assistant", "content": [{"type": "text", "text": "[!reply] fine"}],
        "usage": {"input_tokens": 120000}}}) + "\n")
(d / ".journal" / "settings.json").write_text(json.dumps({"bind_on_start": True, "silenced": ["loop"], "one_session_per_environment": False, "gate_after_context_rung": True, "context_window": 200000}))
fire(d, "SessionStart", path, source="startup")
code, out, err = fire(d, "Stop", path)
check("the rung says the gate is coming", "NOTHING ELSE RUNS UNTIL" in held(out)[1], True)
check("and says to park deferred work", ("HOLDING TO DO LATER" in held(out)[1], 'todos add "<title>"' in held(out)[1]), (True, True))
check("and records that a pin is due", runtime_of(d, "s1").get("pin_due", {}).get("rung"), 0.5)
code, out, err = fire(d, "PreToolUse", path, tool_name="Read", tool_input={"file_path": "x"})
check("a Read is denied while a pin is due",
      ("deny" in out, "nothing has been decided" in out), (True, True))
code, out, err = fire(d, "PreToolUse", path, tool_name="Bash",
                      tool_input={"command": ".journal/journal.py search thing"})
check("the journal's own commands still run", out.strip(), "")
code, out, err = fire(d, "PreToolUse", path, tool_name="Bash",
                      tool_input={"command": "ls"}, agent_id="sub")
check("a subagent's calls are not gated by the parent's rung", out.strip(), "")
J = str(d / ".journal" / "journal.py")
env = {**os.environ, transcript.SESSION_ENV: "s1"}
p = subprocess.run([J, "nothing"], env=env, capture_output=True, text=True, timeout=60)
check("nothing without a reason is refused", (p.returncode, "wants a reason" in p.stderr), (1, True))
check("and the gate still stands", "pin_due" in runtime_of(d, "s1") and runtime_of(d, "s1")["pin_due"] is not None, True)
p = subprocess.run([J, "nothing", "this stretch only read files, no ruling was made"],
                   env=env, capture_output=True, text=True, timeout=60)
check("nothing with a reason is accepted", (p.returncode, "noted" in p.stdout), (0, True))
check("and lifts the gate", runtime_of(d, "s1").get("pin_due"), None)
check("the decision is on the record", runtime_of(d, "s1")["pin_decided"]["how"].startswith("declined"), True)
code, out, err = fire(d, "PreToolUse", path, tool_name="Read", tool_input={"file_path": "x"})
check("a Read runs again", out.strip(), "")
p = subprocess.run([J, "nothing", "again"], env=env, capture_output=True, text=True, timeout=60)
check("nothing with no rung waiting says so", (p.returncode, "no pin is due" in p.stderr), (1, True))
# a pin lifts it too, and an over-long one does not
runtime = d / ".journal" / "runtime" / "s1.json"
data = json.loads(runtime.read_text()); data["pin_due"] = {"rung": 0.7, "used": 1, "window": 2}
runtime.write_text(json.dumps(data))
p = subprocess.run([J, "remember", "x" * 600], env=env, capture_output=True, text=True, timeout=60)
check("a refused pin does not lift the gate", runtime_of(d, "s1").get("pin_due") is not None, True)
p = subprocess.run([J, "remember", "the report is in scratchpad/report.md"], env=env,
                   capture_output=True, text=True, timeout=60)
check("a pin citing a scratch path is refused, with the reason",
      (p.returncode, "exists for one session only" in p.stderr), (1, True))
p = subprocess.run([J, "remember", "a real claim"], env=env, capture_output=True, text=True, timeout=60)
check("an accepted pin lifts the gate", runtime_of(d, "s1").get("pin_due"), None)
# and the whole thing is a setting
(d / ".journal" / "settings.json").write_text(json.dumps({"bind_on_start": True, "silenced": ["loop"], "one_session_per_environment": False, "context_window": 200000,
                                                          "gate_after_context_rung": False}))
data = json.loads(runtime.read_text()); data["warned_at"] = 0.0; runtime.write_text(json.dumps(data))
code, out, err = fire(d, "Stop", path)
check("with the setting off the rung nudges and gates nothing",
      ("CONTEXT IS" in held(out)[1], "NOTHING ELSE RUNS" in held(out)[1], runtime_of(d, "s1").get("pin_due")),
      (True, False, None))

# an interrupted turn has no message to judge
L = transcript.Line
turn = [
    L(1, "user", "human", "do the thing", ""),
    L(2, "assistant", "text", "Looking at the file first.", ""),
    L(3, "user", "tool_result", "contents", ""),
    L(4, "assistant", "text", "Probing the suspected bug directly:", ""),
    L(5, "user", "injected", "[Request interrupted by user]", ""),
    L(6, "user", "human", "wait, design first", ""),
    L(7, "assistant", "text", "[!reply] Here is the design.", ""),
    L(8, "user", "human", "go", ""),
    L(9, "assistant", "text", "Running the build now.", ""),
    L(10, "user", "tool_result", "[Request interrupted by user for tool use]", ""),
    L(11, "user", "human", "stop", ""),
    L(12, "assistant", "text", "[!reply] Stopped.", ""),
]
check("an interrupted turn files nothing; delivered turns file their last message",
      sorted(transcript.filing_units(turn)), [7, 12])
check("the hook holds for nothing in an interrupted turn",
      [l.n for l in hook.untagged(turn, transcript.filing_units(turn))], [])

# a question put to the user needs no tag
turn = [
    L(1, "user", "human", "which?", ""),
    L(2, "assistant", "text", "asked: Which path?  [patch / recompose]", "", tools=["AskUserQuestion"]),
    L(3, "user", "human", "Your questions have been answered: patch", ""),
    L(4, "assistant", "text", "no tag here", ""),
    L(5, "user", "human", "ok", ""),
]
check("a question asked through the tool is never untagged; a bare message still is",
      [l.n for l in hook.untagged(turn, transcript.filing_units(turn))], [4])

# a task notification ends a turn; the answer before it is the message
turn = [
    L(1, "user", "human", "redesign it?", ""),
    L(2, "assistant", "text", "[!reply] Yes. The proxy turns reads into facts.", ""),
    L(3, "user", "task", "<task-notification>group 3 done</task-notification>", ""),
    L(4, "assistant", "text", "[!info] All four groups are in.", ""),
    L(5, "user", "human", "very nice, write it down", ""),
    L(6, "assistant", "text", "[!info] Written.", ""),
]
check("a task notification ends a turn, so the direct answer is filed",
      sorted(transcript.filing_units(turn)), [2, 4, 6])
check("and the digest shows the answer the user reacted to",
      [l.n for l in digest.select(turn)], [1, 2, 4, 5, 6])

# a hook hold between the answer and the prompt does not push the answer out
turn = [
    L(1, "user", "human", "go", ""),
    L(2, "assistant", "text", "[!reply] Done, here is the result.", ""),
    L(3, "user", "injected", "Stop hook feedback: still open", ""),
    L(4, "assistant", "text", "[!reply] Noted.", ""),
    L(5, "user", "injected", "Stop hook feedback: context", ""),
    L(6, "assistant", "text", "[!reply] Nothing to pin.", ""),
    L(7, "user", "injected", "Stop hook feedback: again", ""),
    L(8, "assistant", "text", "[!reply] Still nothing.", ""),
    L(9, "user", "human", "no! not like that", ""),
    L(10, "assistant", "text", "[!correction] Redone.", ""),
]
check("the last filed message before a prompt is kept whatever the distance",
      2 in {l.n for l in digest.select(turn)}, True)

# questions asked through the tool, and the user's answers, are spoken
dq = Path(tempfile.mkdtemp()) / "q.jsonl"
dq.write_text("\n".join(json.dumps(r) for r in [
    {"type": "user", "origin": {"kind": "human"}, "message": {"role": "user", "content": "can you ask again"}},
    {"type": "assistant", "message": {"role": "assistant", "content": [
        {"type": "text", "text": ""},
        {"type": "tool_use", "id": "tu1", "name": "AskUserQuestion", "input": {"questions": [
            {"question": "Which path?", "options": [{"label": "patch"}, {"label": "recompose"}]}]}}]}},
    {"type": "user", "message": {"role": "user", "content": [
        {"type": "tool_result", "tool_use_id": "tu1", "content": "Your questions have been answered: patch"}]}},
    {"type": "user", "message": {"role": "user", "content": [
        {"type": "tool_result", "tool_use_id": "tu2", "content": "a file"}]}},
]) + "\n")
qs, _ = transcript.read(dq)
check("the question is the agent's spoken text",
      (qs[1].kind, qs[1].spoken, "asked: Which path?  [patch / recompose]" in qs[1].text), ("text", True, True))
check("the answer is the user's own words", (qs[2].kind, qs[2].spoken), ("human", True))
check("an ordinary tool result is still nobody's speech", qs[3].kind, "tool_result")
check("journal user shows the answer", "patch" in digest.users_only(qs), True)

# a prompt recorded twice under one parent is one prompt, and numbering holds
dd = Path(tempfile.mkdtemp()) / "d.jsonl"
dd.write_text("\n".join(json.dumps(r) for r in [
    {"type": "user", "parentUuid": "a", "origin": {"kind": "human"}, "message": {"role": "user", "content": "go"}},
    {"type": "assistant", "parentUuid": "u1", "message": {"role": "assistant", "content": [{"type": "text", "text": "[!reply] ok"}]}},
    {"type": "user", "parentUuid": "b", "origin": {"kind": "human"}, "message": {"role": "user", "content": "dont start yet yhough"}},
    {"type": "user", "parentUuid": "b", "origin": {"kind": "human"}, "message": {"role": "user", "content": "dont start yet though"}},
    {"type": "user", "parentUuid": "b", "origin": {"kind": "human"}, "message": {"role": "user", "content": "dont start yet though. design first"}},
    {"type": "assistant", "parentUuid": "u5", "message": {"role": "assistant", "content": [{"type": "text", "text": "[!reply] design"}]}},
    {"type": "user", "parentUuid": "c", "origin": {"kind": "human"}, "message": {"role": "user", "content": "same words"}},
    {"type": "assistant", "parentUuid": "u7", "message": {"role": "assistant", "content": [{"type": "text", "text": "[!reply] answered"}]}},
    {"type": "user", "parentUuid": "d", "origin": {"kind": "human"}, "message": {"role": "user", "content": "same words"}},
]) + "\n")
ls, _ = transcript.read(dd)
check("the earlier copies are superseded, the last stands",
      [(l.n, l.kind) for l in ls if l.n in (3, 4, 5)], [(3, "superseded"), (4, "superseded"), (5, "human")])
check("numbering is untouched", [l.n for l in ls], list(range(1, 10)))
check("the same words after an answer are a new prompt", (ls[6].kind, ls[8].kind), ("human", "human"))
check("journal user shows one copy", digest.users_only(ls).count("dont start"), 1)

# subagents: every event is closed at the door
d, path = project_with(2)
for event, extra in (("Stop", {}), ("SessionStart", {"source": "startup"}),
                     ("PostToolUse", {"tool_name": "Bash", "tool_response": {"stdout": "x" * 50000}})):
    code, out, err = fire(d, event, path, agent_id="abc", **extra)
    check(f"a subagent's {event} does nothing", (code, out.strip(), err.strip()), (0, "", ""))
check("and writes no runtime file", state.runtime_files(d / ".journal"), [])

# rules: a pin for every environment, promote lifts a pin into one
r = fresh()
pins.add(r, "environment fact", AT, 300)
took, msg = pins.add(r, "every environment obeys this", AT, 300, key=pins.RULES)
check("a rule is written", (took, msg.startswith("ruled 1")), (True, True))
tracks.switch(r, "elsewhere", AT)
check("switching parks the pins but not the rules",
      ([p["fact"] for p in pins.live(r)], [p["fact"] for p in pins.live(r, pins.RULES)]),
      ([], ["every environment obeys this"]))
pins.add(r, "another environment's fact", AT, 300)
took, msg = pins.promote(r, 1, AT)
check("promote lifts the pin into a rule", (took, "rule 2, from pin 1" in msg), (True, True))
check("the pin is struck and says where it went",
      pins._all(r)[0]["struck"], "promoted to rule 2")
check("the rule carries the claim and remembers its origin",
      (pins.live(r, pins.RULES)[1]["fact"], pins.live(r, pins.RULES)[1]["promoted_from"]),
      ("another environment's fact", 1))
took, msg = pins.promote(r, 1, AT)
check("promoting a struck pin is refused", (took, "already struck" in msg), (False, True))
took, msg = pins.strike(r, 1, "repealed", key=pins.RULES)
check("a rule can be struck with a reason", (took, msg.startswith("struck rule 1")), (True, True))
check("rules --all still shows it", "repealed" in pins.render(r, all_of_them=True, key=pins.RULES), True)
tracks.switch(r, "default", AT)
check("back on default: its pin and the one standing rule",
      ([p["fact"] for p in pins.live(r)], [p["fact"] for p in pins.live(r, pins.RULES)]),
      (["environment fact"], ["another environment's fact"]))
took, msg = pins.add(r, "x" * 400, AT, 300, key=pins.RULES)
check("a rule has the same cap", (took, "300" in msg), (False, True))

# the block hands rules first, on every source, and the gates know the verbs
d, path = project_with(2)
J = str(d / ".journal" / "journal.py")
env = {**os.environ, transcript.SESSION_ENV: "s1"}
subprocess.run([J, "remember", "an environment fact"], env=env, capture_output=True, timeout=60)
subprocess.run([J, "rule", "a project rule"], env=env, capture_output=True, timeout=60)
for source in ("startup", "compact"):
    code, out, err = fire(d, "SessionStart", path, source=source)
    ctx = json.loads(out)["hookSpecificOutput"]["additionalContext"]
    check(f"{source}: rules come before pins, under their own header",
          (ctx.find("RULES OF THIS PROJECT") < ctx.find("a project rule") < ctx.find("an environment fact")), True)
p = subprocess.run([J, "promote", "1"], env=env, capture_output=True, text=True, timeout=60)
check("cli promote", (p.returncode, "rule 2, from pin 1" in p.stdout), (0, True))
p = subprocess.run([J, "rules"], env=env, capture_output=True, text=True, timeout=60)
check("cli rules lists both", ("a project rule" in p.stdout, "an environment fact" in p.stdout), (True, True))
p = subprocess.run([J, "rule", "--strike", "1", "no longer"], env=env, capture_output=True, text=True, timeout=60)
check("cli rule --strike", (p.returncode, "struck rule 1" in p.stdout), (0, True))
got = hook._pin_overflow({"tool_name": "Bash", "tool_input": {"command": f'.journal/journal.py rule "{"x" * 400}"'}}, 300)
check("an over-long rule is denied at the gate", got is not None, True)
code, out, err = fire(d, "PreToolUse", path, agent_id="abc", tool_name="Bash",
                      tool_input={"command": ".journal/journal.py rule \"x\""})
check("a subagent's rule is refused", "from a subagent is refused" in out, True)
code, out, err = fire(d, "PreToolUse", path, agent_id="abc", tool_name="Bash",
                      tool_input={"command": ".journal/journal.py promote 1"})
check("and so is its promote", "from a subagent is refused" in out, True)
runtime = d / ".journal" / "runtime" / "s1.json"
data = json.loads(runtime.read_text()); data["pin_due"] = {"rung": 0.5, "used": 1, "window": 2}
runtime.write_text(json.dumps(data))
subprocess.run([J, "rule", "decided by ruling"], env=env, capture_output=True, timeout=60)
check("a rule counts as the decision at a rung", runtime_of(d, "s1").get("pin_due"), None)

# to-dos: titled files, one environment each, closed by the work of the same name
r = fresh()
took, msg = todo.add(r, "default", "convert the remaining widgets", "why: they still read props\nstart in src/View", AT)
check("a to-do is a file under its environment", (took, (r / "todo" / "default" / "001-convert-the-remaining-widgets.md").is_file()), (True, True))
took, msg = todo.add(r, "default", "", "", AT)
check("a to-do needs a title", (took, "needs a title" in msg), (False, True))
took, msg = todo.add(r, "default", "Convert the remaining WIDGETS", "", AT)
check("a duplicate open title is refused", (took, "already waiting" in msg), (False, True))
todo.add(r, "default", "write the docs", "", AT)
todo.add(r, "other environment", "something else", "", AT)
listed = todo.render(r, "default")
check("the list is the current environment's titles only",
      ("  1  convert the remaining widgets" in listed, "  2  write the docs" in listed,
       "something else" in listed, "has a brief" in listed), (True, True, False, True))
check("another environment sees only its own", [t["title"] for t in todo.open_items(r, "other environment")], ["something else"])
ok_, body = todo.show(r, "default", 1)
check("the brief is the file's body", ("start in src/View" in body, "TO-DO 1" in body), (True, True))
t, err = todo.start(r, "default", 1, AT)
check("start marks it", bool(t and t.get("started")), True)
check("ending work with the title closes it", todo.close_titled(r, "default", "convert the remaining widgets", AT), "1")
check("it is gone from the open list", [t["n"] for t in todo.open_items(r, "default")], [2])
check("and its number holds in --all, struck through",
      "  1  ~~convert the remaining widgets~~" in todo.render(r, "default", all_of_them=True), True)
took, msg = todo.done(r, "default", 2, "", AT)
check("done wants how", (took, "how it was resolved" in msg), (False, True))
took, msg = todo.done(r, "default", 2, "turned out unnecessary", AT)
check("done with how", (took, "done 2" in msg), (True, True))
took, msg = todo.done(r, "default", 2, "again", AT)
check("done twice is refused", (took, "already done" in msg), (False, True))
check("nothing waiting reads so", todo.render(r, "default").strip(), "Nothing is waiting.")
check("carry names the titles and says it is not an instruction",
      ("something else" in todo.carry(r, "other environment"), "not an instruction" in todo.carry(r, "other environment")), (True, True))
check("carry is empty with nothing waiting", todo.carry(r, "default"), "")
took, msg = todo.add(r, "a/b: weird  environment", "spaced   title", "", AT)
check("hostile environment and title names slug safely", took and "spaced title" in msg, True)

# the CLI, and the stop line
d, path = project_with(4, tagged=True)
J = str(d / ".journal" / "journal.py")
env = {**os.environ, transcript.SESSION_ENV: "s1"}
p = subprocess.run([J, "todo", "convert the remaining widgets", "--brief"], env=env,
                   input="brief here\n", capture_output=True, text=True, timeout=60)
check("cli adds with a brief from stdin", (p.returncode, "to-do 1" in p.stdout), (0, True))
p = subprocess.run([J, "todo", "1"], env=env, capture_output=True, text=True, timeout=60)
check("cli shows the brief", "brief here" in p.stdout, True)
p = subprocess.run([J, "todo"], env=env, capture_output=True, text=True, timeout=60)
check("cli lists titles", "1  convert the remaining widgets" in p.stdout, True)
fire(d, "SessionStart", path, source="startup")
code, out, err = fire(d, "Stop", path)
check("a stop with nothing open says what is waiting, as context, not a hold",
      ("to-do(s) waiting" in out, '"decision"' in out, "not an instruction" in out), (True, False, True))
code, out, err = fire(d, "Stop", path)
check("and not again while the list is unchanged", out.strip(), "")
subprocess.run([J, "todo", "second thing"], env=env, capture_output=True, text=True, timeout=60)
code, out, err = fire(d, "Stop", path)
check("a changed list is said once more", "2 to-do(s)" in out, True)
p = subprocess.run([J, "todo", "start", "1"], env=env, capture_output=True, text=True, timeout=60)
check("cli todo start opens the work", (p.returncode, "open: convert the remaining widgets" in p.stdout), (0, True))
code, out, err = fire(d, "Stop", path)
check("with work open the to-do line is not said", "to-do(s) waiting" in out, False)
p = subprocess.run([J, "end", "convert the remaining widgets"], env=env, capture_output=True, text=True, timeout=60)
check("end closes the work and the to-do", "to-do 1 is done with it" in p.stdout, True)
p = subprocess.run([J, "todo", "drop", "2", "no longer wanted"], env=env, capture_output=True, text=True, timeout=60)
check("cli todo drop", (p.returncode, "dropped: no longer wanted" in p.stdout), (0, True))
code, out, err = fire(d, "SessionStart", path, source="startup")
ctx = json.loads(out)["hookSpecificOutput"]["additionalContext"]
check("with none waiting the start block says nothing about to-dos", "TO DO" in ctx, False)
subprocess.run([J, "todo", "third"], env=env, capture_output=True, text=True, timeout=60)
code, out, err = fire(d, "SessionStart", path, source="startup")
ctx = json.loads(out)["hookSpecificOutput"]["additionalContext"]
check("the start block lists what is waiting", ("TO DO on this environment" in ctx, "third" in ctx), (True, True))
code, out, err = fire(d, "PreToolUse", path, agent_id="abc", tool_name="Bash",
                      tool_input={"command": '.journal/journal.py todo "park this"'})
check("a subagent's todo is refused", "from a subagent is refused" in out, True)
code, out, err = fire(d, "PreToolUse", path, agent_id="abc", tool_name="Bash",
                      tool_input={"command": ".journal/journal.py todo"})
check("but listing them is a read", "from a subagent is refused" in out, False)

# the installer's pull never carries the record across — to-dos included
import install
r = fresh()
todo.add(r, "default", "mine", "", AT)
(r / "record.json").write_text("{}")
(r / "hook.py").write_text("")
check("to-dos and the record are data the pull leaves behind",
      [str(f) for f in install._package_files(r)], ["hook.py"])

# with nothing open, a line that starts work first may write; one that writes first may not
d, path = project_with(2)
for cmd, want in (('.journal/journal.py start "w" && git commit -m x', False),
                  ('journal start "w"; sed -i "" s/a/b/ f.py', False),
                  ('git add -A && journal start "w"', True),
                  ('journal todo "t" && rm -rf build', True)):
    code, out, err = fire(d, "PreToolUse", path, tool_name="Bash", tool_input={"command": cmd})
    check(f"write gate {'denies' if want else 'passes'}: {cmd[:44]}", "deny" in out, want)

# help works after any verb and never files anything; an unknown option is refused
d, path = project_with(2)
J = str(d / ".journal" / "journal.py")
env = {**os.environ, transcript.SESSION_ENV: "s1"}
p = subprocess.run([J, "todo", "--help"], env=env, capture_output=True, text=True, timeout=60)
check("journal todo --help prints the todo lines and exits 0",
      (p.returncode, "journal todo" in p.stdout, "delayed work" in p.stdout), (0, True, True))
check("and adds no to-do", todo.open_items(d / ".journal", "default"), [])
p = subprocess.run([J, "todo", "--bogus", "title"], env=env, capture_output=True, text=True, timeout=60)
check("an unknown option is refused", (p.returncode, "unknown option '--bogus'" in p.stderr), (1, True))
check("and adds no to-do either", todo.open_items(d / ".journal", "default"), [])
p = subprocess.run([J, "help", "remember"], env=env, capture_output=True, text=True, timeout=60)
check("journal help <verb> prints that verb", (p.returncode, "remember" in p.stdout, "journal todo" in p.stdout), (0, True, False))
p = subprocess.run([J, "nosuch", "--help"], env=env, capture_output=True, text=True, timeout=60)
check("help for an unknown verb says so", (p.returncode, "No such command" in p.stderr), (1, True))

# search reads like a page
with path.open("a") as fh:
    fh.write(json.dumps({"type": "user", "origin": {"kind": "human"}, "timestamp": "2026-09-02T00:00:00Z",
                         "message": {"role": "user", "content": "we ruled the heredoc body is data"}}) + "\n")
p = subprocess.run([J, "search", "heredoc"], env=env, capture_output=True, text=True, timeout=60)
check("search leads with the citation and marks the term",
      ("MENTION 'heredoc'" in p.stdout, "USER" in p.stdout, "«heredoc»" in p.stdout), (True, True, True))
p = subprocess.run([J, "search", "zzzznotthere"], env=env, capture_output=True, text=True, timeout=60)
check("an empty search says the record does not have it", "does not have it" in p.stdout, True)
# search paginates: 25 a page, newest first
with path.open("a") as fh:
    for i in range(60):
        fh.write(json.dumps({"type": "user", "origin": {"kind": "human"}, "timestamp": f"2026-09-02T00:00:{i:02d}Z",
                             "message": {"role": "user", "content": f"pagetest number {i}"}}) + "\n")
p = subprocess.run([J, "search", "pagetest"], env=env, capture_output=True, text=True, timeout=60)
check("page 1 of 3, newest first, 25 entries",
      ("60 LINE(S)" in p.stdout, "page 1 of 3" in p.stdout, "number 59" in p.stdout, "number 35" in p.stdout,
       "number 34" in p.stdout, p.stdout.count("  USER") , "--page=2" in p.stdout),
      (True, True, True, True, False, 25, True))
p = subprocess.run([J, "search", "pagetest", "--page=3"], env=env, capture_output=True, text=True, timeout=60)
check("the last page holds the remainder and offers no next", ("number 0" in p.stdout, p.stdout.count("  USER"), "--page=4" in p.stdout), (True, 10, False))
p = subprocess.run([J, "search", "pagetest", "--page=9"], env=env, capture_output=True, text=True, timeout=60)
check("a page past the end is the last page", "page 3 of 3" in p.stdout, True)

# search is the whole transcript of the current environment, across every session
# this session: the start block put it on `default`; a switch moves it to beta mid-way
with path.open("a") as fh:
    fh.write(json.dumps({"type": "user", "message": {"role": "user", "content": [
        {"type": "tool_result", "tool_use_id": "t9", "content": "on beta — beta is new\n  default is parked, exactly as you left it"}]}}) + "\n")
    fh.write(json.dumps({"type": "user", "origin": {"kind": "human"}, "timestamp": "2026-09-02T00:01:00Z",
                         "message": {"role": "user", "content": "on beta we said heredoc again"}}) + "\n")
# an older session, entirely on beta from its start block
older = path.with_name("00000000-older.jsonl")
older.write_text("\n".join(json.dumps(r) for r in [
    {"type": "attachment", "attachment": {"type": "hook_additional_context", "hookEvent": "SessionStart",
                                          "content": ["THE JOURNAL IS IN FORCE HERE — you are on environment `beta`"]}},
    {"type": "user", "origin": {"kind": "human"}, "timestamp": "2026-08-30T00:00:00Z",
     "message": {"role": "user", "content": "last week on beta: the heredoc ruling"}},
]) + "\n")
os.utime(older, (1, 1))
segs = transcript.track_segments(transcript.read(path)[0])
check("the session is segmented by its marks", [t for t, _, _ in segs][-2:], ["default", "beta"])
subprocess.run([J, "switch", "default"], env=env, capture_output=True, timeout=60)  # it chooses default
subprocess.run([J, "switch", "beta"], env=env, capture_output=True, timeout=60)
p = subprocess.run([J, "search", "heredoc"], env=env, capture_output=True, text=True, timeout=60)
check("on beta, search finds this session's beta stretch and last week's beta session, not default's",
      ("2 LINE(S)" in p.stdout, "THIS SESSION" in p.stdout, "SESSION 00000000" in p.stdout,
       "we ruled the heredoc body" in p.stdout), (True, True, True, False))
p = subprocess.run([J, "search", "heredoc", "--all"], env=env, capture_output=True, text=True, timeout=60)
check("--all sees every environment in every session", "3 LINE(S)" in p.stdout, True)
subprocess.run([J, "switch", "--back"], env=env, capture_output=True, timeout=60)
idx = json.loads((d / ".journal" / "record.json").read_text()).get("sessions", {})
check("the index records the session under every environment it was on",
      (("s1" in idx.get("default", [])), ("s1" in idx.get("beta", []))), (True, True))
# a session the index knows to be on another environment is not read for this one
other = path.with_name("11111111-other.jsonl")
other.write_text(json.dumps({"type": "user", "origin": {"kind": "human"}, "timestamp": "2026-08-31T00:00:00Z",
                             "message": {"role": "user", "content": "heredoc said on gamma only"}}) + "\n")
tracks.carried(d / ".journal", "gamma", "11111111-other")
p = subprocess.run([J, "search", "heredoc"], env=env, capture_output=True, text=True, timeout=60)
check("a session indexed under another environment is skipped", "gamma only" in p.stdout, False)
p = subprocess.run([J, "search", "heredoc", "--all"], env=env, capture_output=True, text=True, timeout=60)
check("but --all reads it", "gamma only" in p.stdout, True)

# bare journal is a status page; conversation is the digest; --back alone still reads
d, path = project_with(4, tagged=True)
J = str(d / ".journal" / "journal.py")
env = {**os.environ, transcript.SESSION_ENV: "s1"}
subprocess.run([J, "rule", "r"], env=env, capture_output=True, timeout=60)
subprocess.run([J, "todo", "t"], env=env, capture_output=True, timeout=60)
p = subprocess.run([J], env=env, capture_output=True, text=True, timeout=60)
check("bare journal is the status page",
      (p.returncode, "JOURNAL  environment default" in p.stdout, "1 in force" in p.stdout,
       "1 waiting" in p.stdout, "since the last compaction" in p.stdout and "line 1" not in p.stdout),
      (0, True, True, True, True))
p = subprocess.run([J, "conversation"], env=env, capture_output=True, text=True, timeout=60)
check("journal conversation is the digest", "CONVERSATION  since the last compaction" in p.stdout, True)
p = subprocess.run([J, "--back=1"], env=env, capture_output=True, text=True, timeout=60)
check("--back alone still reads", ("CONVERSATION" in p.stdout and "JOURNAL  environment" not in p.stdout), True)

# the installer carries the whole skill folder, and removes what the package no longer ships
d, path = project_with(2)
I = str(d / ".journal" / "install.py")
subprocess.run([I], capture_output=True, text=True, timeout=60)
installed = d / ".claude" / "skills" / "journal"
check("install carries SKILL.md and its references",
      ((installed / "SKILL.md").is_file(), (installed / "references" / "commands.md").is_file()), (True, True))
(installed / "references" / "stale.md").write_text("old")
p = subprocess.run([I], capture_output=True, text=True, timeout=60)
check("a file the package no longer ships is removed, by name",
      ((installed / "references" / "stale.md").exists(), "stale.md (no longer in the skill)" in p.stdout), (False, True))
p = subprocess.run([I, "--check"], capture_output=True, text=True, timeout=60)
check("and then there is nothing to change", "Nothing to change." in p.stdout, True)

# a deferral said in words and not parked: reminder at the prompt, refusal at the next call
for text, want in (
    ("[!reply] I'll rename Nothing to None once the Editor agent finishes its edits. For now, back to the failures.", True),
    ("[!info] I'm going to come back to that after the merge.", True),
    ("[!reply] Renamed it. The tests pass.", False),
    ("[!reply] Once and for all, the answer is no.", False),
    ("[!reply] I'll rename it now.", False),
):
    check(f"deferral detected: {text[:40]!r}", hook.deferred(text) is not None, want)
d, path = project_with(2, tagged=True)
J = str(d / ".journal" / "journal.py")
env = {**os.environ, transcript.SESSION_ENV: "s1"}
fire(d, "SessionStart", path, source="startup")


def prompt(text):
    with path.open("a") as fh:
        fh.write(json.dumps({"type": "user", "origin": {"kind": "human"}, "uuid": f"u{text[:6]}",
                             "message": {"role": "user", "content": text}}) + "\n")
    return fire(d, "UserPromptSubmit", path, prompt=text)


_replies = [0]


def reply(text):
    _replies[0] += 1
    with path.open("a") as fh:
        fh.write(json.dumps({"type": "assistant", "uuid": f"a{_replies[0]}", "message": {
            "role": "assistant", "content": [{"type": "text", "text": text}],
            "usage": {"input_tokens": 10}}}) + "\n")


code, out, err = prompt("rename Nothing to None?")
check("a request with nothing open: no reminder (the request is the work)", out.strip(), "")
subprocess.run([J, "start", "fix the batch of failures"], env=env, capture_output=True, timeout=60)
code, out, err = prompt("Lets rename the Nothing component to Empty? or None? Suggestions?")
ctx = json.loads(out)["hookSpecificOutput"]["additionalContext"]
check("a request while work is open carries the reminder",
      ("work is open — fix the batch of failures" in ctx, "park it before answering" in ctx), (True, True))
code, out, err = prompt("cool, thanks!")
check("an acknowledgement carries none", out.strip(), "")
code, out, err = prompt("is the alias installed automatically?")
check("a question carries none", out.strip(), "")
prompt("Lets rename the Nothing component to Empty? or None? Suggestions?")
reply("[!reply] I'll rename Nothing to None once the Editor agent finishes. For now, back to the batch.")
code, out, err = fire(d, "PreToolUse", path, tool_name="Bash", tool_input={"command": "ls"})
check("the next tool call after a spoken deferral is refused, naming the sentence",
      ("deny" in out, "once the Editor agent finishes" in out, "park it as a to-do" in out), (True, True, True))
code, out, err = fire(d, "PreToolUse", path, tool_name="Bash", tool_input={"command": "ls"})
check("the retry passes: said once per reply", out.strip(), "")
reply("[!reply] I'll come back to the banner after this.")
subprocess.run([J, "todo", "fix the banner"], env=env, capture_output=True, timeout=60)
code, out, err = fire(d, "PreToolUse", path, tool_name="Bash", tool_input={"command": "ls"})
check("a deferral with a to-do added since the prompt is not refused", "deny" in out, False)
prompt("why did we remove PreCompact?")
reply("[!reply] Because it had nothing left to do. I'll tidy the docstring after the tests.")
code, out, err = fire(d, "PreToolUse", path, tool_name="Bash", tool_input={"command": "ls"})
check("after a prompt that asked for no work, a deferral is the agent's own plan: not refused", "deny" in out, False)
prompt("also fix the banner alignment")
reply("[!reply] I'll do the banner once this batch is green.")
code, out, err = fire(d, "Stop", path)
brief, why = held(out)
check("at a stop, the same deferral is held once",
      (brief, "puts work off" in why), ("journal reminded Claude: work deferred in words, not parked", True))
code, out, err = fire(d, "Stop", path)
check("and not twice", "deferred in words" in out, False)

# auto: off, to-dos are listed and never started without the user's word; on, the idle stop autos
d, path = project_with(4, tagged=True)
J = str(d / ".journal" / "journal.py")
env = {**os.environ, transcript.SESSION_ENV: "s1"}
subprocess.run([J, "todo", "first chore"], env=env, capture_output=True, timeout=60)
subprocess.run([J, "todo", "second chore"], env=env, capture_output=True, timeout=60)
fire(d, "SessionStart", path, source="startup")
code, out, err = fire(d, "Stop", path)
check("auto off: an idle stop says what waits, as context, and calls it not an instruction",
      ('"decision"' in out, "not an instruction" in out), (False, True))
p = subprocess.run([J, "todo", "auto"], env=env, capture_output=True, text=True, timeout=60)
check("auto reports off by default", "auto is OFF" in p.stdout, True)
p = subprocess.run([J, "todo", "auto", "on"], env=env, capture_output=True, text=True, timeout=60)
check("auto on says the state now: nothing open, which to-do starts next",
      "Nothing is open, 2 to-do(s) waiting: the next idle stop starts to-do 1" in p.stdout, True)
subprocess.run([J, "start", "some work"], env=env, capture_output=True, timeout=60)
p2 = subprocess.run([J, "todo", "auto", "on"], env=env, capture_output=True, text=True, timeout=60)
check("with work open it says what the agent is working on",
      "Agent currently working on: some work" in p2.stdout, True)
subprocess.run([J, "end", "some work"], env=env, capture_output=True, timeout=60)
check("auto on is set on the record, per environment",
      (p.returncode, "auto ON" in p.stdout, json.loads((d / ".journal" / "record.json").read_text()).get("auto")),
      (0, True, {"default": True}))
code, out, err = fire(d, "SessionStart", path, source="startup")
ctx = json.loads(out)["hookSpecificOutput"]["additionalContext"]
check("the start block says auto is on and to pick up the next one",
      ("AUTO MODE IS ON" in ctx, "todos start <n>" in ctx, "not an instruction" in ctx), (True, True, False))
code, out, err = fire(d, "Stop", path)
brief, why = held(out)
check("auto on: an idle stop is held, naming the next to-do",
      (brief, "todos start 1" in why), ("journal reminded Claude: auto is on, 2 to-do(s) waiting", True))
code, out, err = fire(d, "Stop", path, stop_hook_active=True)
check("the stop that follows the hold passes (an agent that answered is not trapped)", out.strip(), "")
code, out, err = fire(d, "Stop", path)
check("the next turn's stop is held again", held(out)[0], "journal reminded Claude: auto is on, 2 to-do(s) waiting")
subprocess.run([J, "todo", "start", "1"], env=env, capture_output=True, timeout=60)
code, out, err = fire(d, "Stop", path)
brief, why = held(out)
check("with the to-do started, work is open: auto holds once to end it or park the rest",
      (brief, "first chore" in why, "park what is left" in why), ("journal reminded Claude: auto is on, work still open", True, True))
code, out, err = fire(d, "Stop", path, stop_hook_active=True)
check("and the stop after it passes", out.strip(), "")
subprocess.run([J, "end", "first chore"], env=env, capture_output=True, timeout=60)
code, out, err = fire(d, "Stop", path)
brief, why = held(out)
check("once it ends, the next idle stop brings the next one",
      (brief, "todos start 2" in why), ("journal reminded Claude: auto is on, 1 to-do(s) waiting", True))
p = subprocess.run([J, "todo"], env=env, capture_output=True, text=True, timeout=60)
check("the list says auto is on", "auto ON" in p.stdout, True)
p = subprocess.run([J, "todo", "auto", "off"], env=env, capture_output=True, text=True, timeout=60)
check("auto off again", "auto OFF" in p.stdout, True)
p = subprocess.run([J, "todo", "auto", "sideways"], env=env, capture_output=True, text=True, timeout=60)
check("auto refuses anything but on or off", p.returncode, 1)
subprocess.run([J, "switch", "chores"], env=env, capture_output=True, timeout=60)
subprocess.run([J, "todo", "auto", "on"], env=env, capture_output=True, timeout=60)
subprocess.run([J, "switch", "--back"], env=env, capture_output=True, timeout=60)
check("auto is per environment", (todo.auto(d / ".journal", "chores"), todo.auto(d / ".journal", "default")), (True, False))

# versions: the changelog since, the notice, the upgrade
import update
LOG = "# Changelog\n\n## 1.2.0 — docs\n\nDocs are catalogued.\n\n## 1.1.0 — to-dos\n\nTo-dos exist.\n\n## 1.0.0 — first\n\nThe start.\n"
check("entries parse newest first", [e[0] for e in update.entries(LOG)], ["1.2.0", "1.1.0", "1.0.0"])
check("since a version", [e[0] for e in update.since(LOG, "1.0.0")], ["1.2.0", "1.1.0"])
check("the changelog block tells the agent to reload the skill", "RELOAD THE JOURNAL SKILL" in update.render_since(LOG, "1.0.0", "1.2.0"), True)
check("render names both versions and the headlines",
      ("1.0.0 → 1.2.0" in update.render_since(LOG, "1.0.0", "1.2.0"), "1.1.0 — to-dos" in update.render_since(LOG, "1.0.0", "1.2.0")), (True, True))
check("nothing since the latest", update.render_since(LOG, "1.2.0", "1.2.0"), "")
d, path = project_with(2, tagged=True)
J = str(d / ".journal" / "journal.py")
env = {**os.environ, transcript.SESSION_ENV: "s1"}
(d / ".journal" / "runtime").mkdir(exist_ok=True)
(d / ".journal" / "runtime" / "upstream.cache").write_text(json.dumps({"version": "9.9.9", "headline": "everything", "at": 9e12}))
fire(d, "SessionStart", path, source="startup")
code, out, err = fire(d, "Stop", path)
check("a newer version upstream: the stop says so as context, with the upgrade command",
      ("9.9.9 IS AVAILABLE" in out, "journal.py update" in out, '"decision"' in out), (True, True, False))
code, out, err = fire(d, "Stop", path)
check("once per transcript per version", out.strip(), "")
code, out, err = fire(d, "SessionStart", path, source="startup")
check("the start block carries the notice too", "9.9.9 IS AVAILABLE" in json.loads(out)["hookSpecificOutput"]["additionalContext"], True)
p = subprocess.run([J], env=env, capture_output=True, text=True, timeout=60)
check("the status page shows the version and the available one", "9.9.9 available" in p.stdout, True)
# an upgrade from a path: the newer package lands, the changelog since is printed, and the next start is handed it once
src = Path(tempfile.mkdtemp()) / "pkg"
shutil.copytree(d / ".journal", src, ignore=shutil.ignore_patterns("runtime", "record.json*", "settings.json", "todo", "docs", "tools", ".journal", ".git", ".claude", "__pycache__"))
(src / "VERSION").write_text("9.0.0\n")
(src / "CHANGELOG.md").write_text("# Changelog\n\n## 9.0.0 — the test release\n\nA line about it.\n\n" + (src / "CHANGELOG.md").read_text().split("\n", 2)[2])
p = subprocess.run([J, "upgrade", f"--from={src}"], env=env, capture_output=True, text=True, timeout=60)
check("upgrade pulls the newer package and prints what changed",
      (p.returncode, "9.0.0 — the test release" in p.stdout, (d / ".journal" / "VERSION").read_text().strip()), (0, True, "9.0.0"))
code, out, err = fire(d, "SessionStart", path, source="startup")
ctx = json.loads(out)["hookSpecificOutput"]["additionalContext"]
check("the next session start is handed the changelog", "THE JOURNAL WAS UPGRADED" in ctx and "the test release" in ctx, True)
code, out, err = fire(d, "SessionStart", path, source="compact")
check("and not again in the same transcript", "THE JOURNAL WAS UPGRADED" in json.loads(out)["hookSpecificOutput"]["additionalContext"], False)
p = subprocess.run([J, "upgrade", f"--from={src}"], env=env, capture_output=True, text=True, timeout=60)
check("upgrading again is a no-op that says so", "Already at 9.0.0" in p.stdout, True)

# install --alias retires the alias 1.3.x wrote, and names one it did not write
home = Path(tempfile.mkdtemp())
(home / ".zshrc").write_text("export X=1\n# journal — added by .journal/install.py\nalias journal='\"$(git rev-parse --show-toplevel)\"/.journal/journal.py'\nalias ll='ls -l'\n")
(home / ".bashrc").write_text("alias journal='/somewhere/.journal/journal.py'\n")
d, path = project_with(2)
p = subprocess.run([str(d / ".journal" / "install.py"), "--alias"], env={**os.environ, "HOME": str(home)},
                   capture_output=True, text=True, timeout=60)
check("the installer's own alias is removed and said",
      ("old journal alias removed from ~/.zshrc" in p.stdout, "alias journal" in (home / ".zshrc").read_text(),
       "alias ll" in (home / ".zshrc").read_text()), (True, False, True))
check("an alias it did not write is named, not touched",
      ("shadows the journal command" in p.stdout, "/somewhere/" in p.stdout, "alias journal" in (home / ".bashrc").read_text()), (True, True, True))
check("the launcher landed", (home / ".local" / "bin" / "journal").is_file(), True)

# a subagent's marks are pruned with its transcript, and kept while it lives
d, path = project_with(2)
state.put(d / ".journal", "rules_at", [0.0], stem="agent-old")
sub = path.parent / "s1" / "subagents"; sub.mkdir(parents=True)
(sub / "agent-live.jsonl").write_text("")
state.put(d / ".journal", "rules_at", [0.0], stem="agent-live")
fire(d, "SessionStart", path, source="startup")
check("a subagent's file goes with its transcript, and stays while it exists",
      sorted(s for s, _ in state.runtime_files(d / ".journal")), ["agent-live", "s1"])

# subagents receive the rules: first call, then at their own marks; never pins
d, path = project_with(2)
J = str(d / ".journal" / "journal.py")
env = {**os.environ, transcript.SESSION_ENV: "s1"}
subprocess.run([J, "remember", "a pin of the environment"], env=env, capture_output=True, timeout=60)
subprocess.run([J, "rule", "a rule for every environment"], env=env, capture_output=True, timeout=60)
(d / ".journal" / "settings.json").write_text(json.dumps({"bind_on_start": True, "silenced": ["loop"], "one_session_per_environment": False, "gate_after_context_rung": True, "context_window": 200000}))
call = {"tool_name": "Read", "tool_input": {}, "tool_response": "x"}
code, out, err = fire(d, "PostToolUse", path, agent_id="abc", **call)
ctx = json.loads(out)["hookSpecificOutput"]["additionalContext"]
check("a subagent's first tool call hands it the rules and says whose journal it is",
      ("YOU ARE A SUBAGENT" in ctx, "a rule for every environment" in ctx, "a pin of the environment" in ctx),
      (True, True, False))
code, out, err = fire(d, "PostToolUse", path, agent_id="abc", **call)
check("the second call is silent", out.strip(), "")
sub = path.parent / "s1" / "subagents"; sub.mkdir(parents=True, exist_ok=True)
(sub / "agent-abc.jsonl").write_text(json.dumps({"type": "assistant", "message": {
    "role": "assistant", "content": [{"type": "text", "text": "working"}],
    "usage": {"input_tokens": 110000}}}) + "\n")
code, out, err = fire(d, "PostToolUse", path, agent_id="abc", **call)
ctx = json.loads(out)["hookSpecificOutput"]["additionalContext"]
check("at 55% of ITS window the rules come back, once for the 25 and 50 marks together",
      ("50% FULL" in ctx, "a rule for every environment" in ctx), (True, True))
check("and every mark crossed is recorded", runtime_of(d, "agent-abc")["rules_at"], [0.0, 0.25, 0.5])
code, out, err = fire(d, "PostToolUse", path, agent_id="abc", **call)
check("then silence until the next mark", out.strip(), "")
code, out, err = fire(d, "PostToolUse", path, agent_id="other", tool_name="Bash", tool_input={},
                      tool_response={"stdout": "x" * 90000})
ctx = json.loads(out)["hookSpecificOutput"]["additionalContext"]
check("a subagent is never told about tool cost, only the rules", "CHARACTERS" in ctx, False)
d2, path2 = project_with(2)
code, out, err = fire(d2, "PostToolUse", path2, agent_id="abc", **call)
check("with no rules a subagent hears nothing at all", out.strip(), "")

# the main agent's rung carries the rules again
d, path = project_with(4, tagged=True)
with path.open("a") as fh:
    fh.write(json.dumps({"type": "assistant", "message": {
        "role": "assistant", "content": [{"type": "text", "text": "[!reply] fine"}],
        "usage": {"input_tokens": 120000}}}) + "\n")
(d / ".journal" / "settings.json").write_text(json.dumps({"bind_on_start": True, "silenced": ["loop"], "one_session_per_environment": False, "gate_after_context_rung": True, "context_window": 200000}))
subprocess.run([J.replace(J.split("/.journal")[0], str(d)), "rule", "the standing rule"],
               env=env, capture_output=True, timeout=60)
fire(d, "SessionStart", path, source="startup")
code, out, err = fire(d, "Stop", path)
brief, why = held(out)
check("the rung hold carries the rules again",
      ("RULES OF THIS PROJECT" in why, "the standing rule" in why, "far behind" in why), (True, True, True))

# the rung fires mid-work, from a tool call, with the same gate behind it
d, path = project_with(4, tagged=True)
(d / ".journal" / "settings.json").write_text(json.dumps({"bind_on_start": True, "silenced": ["loop"], "one_session_per_environment": False, "gate_after_context_rung": True, "context_window": 200000}))
fire(d, "SessionStart", path, source="startup")
with path.open("a") as fh:
    fh.write(json.dumps({"type": "assistant", "message": {
        "role": "assistant", "content": [{"type": "text", "text": "[!reply] working"}],
        "usage": {"input_tokens": 191000}}}) + "\n")
code, out, err = fire(d, "PostToolUse", path, tool_name="Read", tool_input={}, tool_response="x")
check("a tool call past 95% delivers the rung as context, mid-work",
      ("CONTEXT IS 96% FULL" in out, "decide before any other tool runs" in out), (True, True))
check("and arms the same gate", runtime_of(d, "s1").get("pin_due", {}).get("rung"), 0.95)
code, out, err = fire(d, "PreToolUse", path, tool_name="Read", tool_input={"file_path": "x"})
check("so the next tool call is denied until a decision", "deny" in out, True)
code, out, err = fire(d, "PostToolUse", path, tool_name="Read", tool_input={}, tool_response="x")
check("the rung is not repeated on the next call", "CONTEXT IS" in out, False)
code, out, err = fire(d, "Stop", path)
check("at the stop the owed decision is raised once more, as the queue's first subject",
      held(out)[0], "journal reminded Claude: context 96% full, still undecided")
subprocess.run([J, "nothing", "only reads"], env=env, capture_output=True, timeout=60)
code, out, err = fire(d, "Stop", path, stop_hook_active=True)
check("decided: nothing else pending, the turn ends", out.strip(), "")

# the window is learned at a compaction
d, path = project_with(4, tagged=True)
(d / ".journal" / "settings.json").write_text(json.dumps({"bind_on_start": True, "silenced": ["loop"], "one_session_per_environment": False, "context_window": 0}))  # no override: learn it
with path.open("a") as fh:
    fh.write(json.dumps({"type": "assistant", "message": {"role": "assistant", "content": [{"type": "text", "text": "[!reply] x"}],
                         "usage": {"input_tokens": 930000}}}) + "\n")
    fh.write(json.dumps({"type": "system", "subtype": "compact_boundary"}) + "\n")
    fh.write(json.dumps({"type": "assistant", "message": {"role": "assistant", "content": [{"type": "text", "text": "[!reply] y"}],
                         "usage": {"input_tokens": 520000}}}) + "\n")
fire(d, "SessionStart", path, source="compact")
check("the peak before the compaction becomes the window, in the record",
      json.loads((d / ".journal" / "record.json").read_text()).get("window"), 1000000)
code, out, err = fire(d, "Stop", path)
check("and the ladder climbs it with no setting", held(out)[0], "journal reminded Claude: context 52% full")

# open work: told at start, held only for one's own
d, path = project_with(2, tagged=True)
J = str(d / ".journal" / "journal.py")
env = {**os.environ, transcript.SESSION_ENV: "s1"}
shutil.copy(path, path.with_name("other.jsonl"))  # the other session has a transcript of its own
subprocess.run([J, "start", "somebody else's work"], env={**os.environ, transcript.SESSION_ENV: "other"},
               capture_output=True, timeout=60)
subprocess.run([J, "start", "my work"], env=env, capture_output=True, timeout=60)
code, out, err = fire(d, "SessionStart", path, source="startup")
ctx = json.loads(out)["hookSpecificOutput"]["additionalContext"]
check("SessionStart on startup carries open work from every session",
      ("somebody else's work" in ctx, "my work" in ctx), (True, True))
check("and on startup does not claim a summary", "SUMMARY YOU ARE HOLDING" in ctx, False)
code, out, err = fire(d, "SessionStart", path, source="compact")
ctx = json.loads(out)["hookSpecificOutput"]["additionalContext"]
check("on compact it does", "SUMMARY YOU ARE HOLDING" in ctx, True)
code, out, err = fire(d, "Stop", path)
check("the stop holds only for work THIS transcript opened",
      ("my work" in out, "somebody else's work" in out), (True, False))
code, out, err = fire(d, "Stop", path)
check("and only once", out.strip(), "")

# pins are delivered on every source, with an honest header
d, path = project_with(2)
subprocess.run([J.replace(str(J.split('/.journal')[0]), str(d)), "remember", "a standing fact"],
               env=env, capture_output=True, timeout=60)
for source, head in (("startup", "FACTS THAT STAND ON THIS ENVIRONMENT"),
                     ("clear", "FACTS THAT STAND ON THIS ENVIRONMENT"),
                     ("fork", "FACTS THAT STAND ON THIS ENVIRONMENT"),
                     ("compact", "FACTS THE SUMMARY YOU ARE HOLDING DID NOT KEEP")):
    code, out, err = fire(d, "SessionStart", path, source=source)
    ctx = json.loads(out)["hookSpecificOutput"]["additionalContext"]
    check(f"{source} carries the pin under the right header",
          ("a standing fact" in ctx, head in ctx), (True, True))

# pruning: a runtime file whose transcript is gone is dropped; subagents' are found one level down
d, path = project_with(2)
fire(d, "SessionStart", path, source="startup")
state.put(d / ".journal", "held_at", 5, stem="gone")
sub = path.parent / "s1" / "subagents"
sub.mkdir(parents=True)
(sub / "agent-live.jsonl").write_text("")
state.put(d / ".journal", "biggest_result", 5, stem="agent-live")
fire(d, "SessionStart", path, source="resume")
check("a transcript-less runtime file is pruned; a live subagent's is kept",
      sorted(s for s, _ in state.runtime_files(d / ".journal")), ["agent-live", "s1"])

# the hook survives bad input
d, path = project_with(2)
p = subprocess.run([str(d / ".journal" / "hook.py")], input='{"hook_event_name":"Stop"}',
                   capture_output=True, text=True, timeout=60)
check("a payload with no session: exit 0 and one stderr line",
      (p.returncode, "names no session" in p.stderr), (0, True))
(d / ".journal" / "runtime").mkdir(exist_ok=True)
(d / ".journal" / "runtime" / "s1.json").mkdir()  # a directory where a file should be
code, out, err = fire(d, "Stop", path)
check("a handler that raises: exit 0 and says so", (code, "handler failed" in err), (0, True))

# the CLI knows its own transcript
d, path = project_with(4)
other = path.with_name("zz-newer.jsonl"); shutil.copy(path, other)
os.utime(other, None)
J = str(d / ".journal" / "journal.py")
p = subprocess.run([J, "remember", "cited"], env={**os.environ, transcript.SESSION_ENV: "s1"},
                   capture_output=True, text=True, timeout=60)
def _pins(rec):
    return rec["tracks"][rec.get("current") or "default"]["pins"]


rec = json.loads((d / ".journal" / "record.json").read_text())
check("remember cites the session from the environment, not the newest file",
      _pins(rec)[-1]["session"], "s1.jsonl")
e = {k: v for k, v in os.environ.items() if k != transcript.SESSION_ENV}
p = subprocess.run([J, "remember", "guessed"], env=e, capture_output=True, text=True, timeout=60)
rec = json.loads((d / ".journal" / "record.json").read_text())
check("without the environment it guesses the newest and SAYS so",
      (_pins(rec)[-1].get("guessed"), "guessed" in p.stderr), (True, True))

# verify reads the runtime files and never a baseline
d, path = project_with(2)
import verify
rows, _ = verify.check(d / ".journal")
fired = [ok for name, ok, _ in rows if name.startswith("the hook has")]
check("verify: inside a session, nothing fired before any hook ran is a failure", fired[:1], [False])
env_out = {k: v for k, v in os.environ.items() if k != transcript.SESSION_ENV}
p = subprocess.run([J, "verify"], env=env_out, capture_output=True, text=True, timeout=60)
check("verify: outside a session it is a fact with the next step, not a failure",
      ("· the hook has not fired yet" in p.stdout, "start Claude Code in this project" in p.stdout, "✗ the hook" in p.stdout), (True, True, False))
fire(d, "SessionStart", path, source="startup")
rows, _ = verify.check(d / ".journal")
fired = [ok for name, ok, _ in rows if name.startswith("the hook has fired —")]
check("verify: fired once a transcript carries a mark", fired, [True])
p = subprocess.run([str(d / ".journal" / "install.py")], env=env_out, capture_output=True, text=True, timeout=60)
check("install ends with a verdict and the next step, and no red marks",
      (("Installed." in p.stdout or "Already installed." in p.stdout), "Start Claude Code in this project" in p.stdout, "✗" in p.stdout), (True, True, False))

# --------------------------------------------- `work await` is TAUGHT, not merely shipped
# MEASURED, on this very project: an agent had to be told by the USER that `work await`
# exists. It was in the skill and in `journal work help`, and neither of those is read at
# the moment it is needed — a stop, with work open, while something is in flight. A command
# nobody is told about where they need it does not exist, so the two surfaces that always
# reach an agent must name it: the start block, and the hold that fires at exactly that stop.
import hook as _hook  # noqa: E402
for arm in (False, True):
    block = _hook.carried("startup", stem=None, unbound=arm)
    check(f"the start block names `work await` (unbound={arm})", "work await" in block, True)

d, path = project_with(4)
env = {**os.environ, transcript.SESSION_ENV: path.stem}
J = str(d / ".journal" / "journal.py")
fire(d, "SessionStart", path, source="startup")
subprocess.run([J, "work", "start", "a thing in flight"], env=env, capture_output=True, timeout=60)
code, out, err = fire(d, "Stop", path)
brief, why = held(out)
check("the open-work hold offers await beside end and update",
      (brief, "work await" in why), ("journal reminded Claude: work still open", True))

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
