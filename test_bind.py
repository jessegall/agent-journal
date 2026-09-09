#!/usr/bin/env python3
"""Sessions are bound to environments: two sessions, two environments, one project.

    .journal/test_bind.py
"""
import json, os, shutil, subprocess, sys, tempfile
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


d = Path(tempfile.mkdtemp()) / "proj"
(d / ".claude").mkdir(parents=True)
shutil.copytree(SRC, d / ".journal", ignore=shutil.ignore_patterns(
    "runtime", "state.json*", "record.json*", "todo", "docs", "tools", ".journal", ".git", ".claude", "__pycache__"))
(d / ".journal" / "settings.json").write_text(json.dumps({"bind_on_start": True, "one_session_per_environment": False}))  # the rule has its own section below
root = d / ".journal"
tdir = transcript.project_dir(d); tdir.mkdir(parents=True, exist_ok=True)
J = str(root / "journal.py")


class S:
    def __init__(self, stem):
        self.stem = stem
        self.path = tdir / f"{stem}.jsonl"; self.path.write_text("")
        self.env = {**os.environ, transcript.SESSION_ENV: stem}
        self.start()

    def start(self):
        out = subprocess.run([str(root / "hook.py")], input=json.dumps({"hook_event_name": "SessionStart", "source": "startup",
                             "session_id": self.stem, "transcript_path": str(self.path)}), capture_output=True, text=True, timeout=60).stdout
        return json.loads(out)["hookSpecificOutput"]["additionalContext"]

    def j(self, *a):
        p = subprocess.run([J, *a], env=self.env, capture_output=True, text=True, timeout=60)
        return p.returncode, p.stdout + p.stderr


def terminal(*a):
    env = {k: v for k, v in os.environ.items() if k != transcript.SESSION_ENV}
    p = subprocess.run([J, *a], env=env, capture_output=True, text=True, timeout=60)
    return p.returncode, p.stdout + p.stderr


# ---------------------------------------------------------------- the old record shape is moved on first read
(root / "record.json").write_text(json.dumps({"pins": [{"fact": "old top-level pin", "at": "x", "struck": None}],
                                              "work": [], "current": "default",
                                              "tracks": {"side": {"pins": [{"fact": "parked pin", "at": "x", "struck": None}], "work": [], "at": "x"}}}))
# 1.34.0: the old TOP-LEVEL keys are still lifted out of the record on first read, and the
# migration is what carries them the rest of the way, into the environment's own folder.
import migrate  # noqa: E402
migrate.run(root)
check("an old record is moved under its environment, and out of the record",
      ([p["fact"] for p in state.get(root, "pins")],
       "pins" in json.loads((root / "record.json").read_text())),
      (["old top-level pin"], False))
check("and the environment that was parked keeps its own",
      [p["fact"] for p in (state.tracked(root, "pins", "side", []) or [])], ["parked pin"])

# ---------------------------------------------------------------- two sessions, two environments
a = S("aaaaaaaa-1")
ctx = a.start()
check("a session starts bound to the project's start environment", ("bound to environment `default`" in ctx, tracks.bound(root, "aaaaaaaa-1")), (True, "default"))
code, out = a.j("switch", "side")
check("a switch from inside a session moves that session only",
      (code, "this session is on side" in out, "the project still starts on default" in out, tracks.bound(root, "aaaaaaaa-1"),
       json.loads((root / "record.json").read_text())["current"]), (0, True, True, "side", "default"))
b = S("bbbbbbbb-2")
check("a second session starts on the project's start environment, not on a's", tracks.bound(root, "bbbbbbbb-2"), "default")
a.j("pin", "written from a on side"); b.j("pin", "written from b on default")
def held(name, key="pins"):
    f = root / "environments" / name / f"{key}.json"
    return json.loads(f.read_text())[key] if f.is_file() else []


check("each session's pin landed on its own environment",
      ([p["fact"] for p in held("side")][-1], [p["fact"] for p in held("default")][-1]),
      ("written from a on side", "written from b on default"))
code, out = a.j("pins")
check("a lists side's pins", ("written from a on side" in out, "written from b on default" in out), (True, False))
code, out = b.j("pins")
check("b lists default's", ("written from b on default" in out, "written from a on side" in out), (True, False))
a.j("work", "start", "side work"); b.j("work", "start", "default work")
code, out = a.j("open")
check("open work is the session's environment's", ("side work" in out, "default work" in out), (True, False))
code, out = a.j("tracks")
check("environments shows this session marked, the start environment, and who is where",
      ("*  side" in out or "* " in out, ">" in out, "aaaaaaaa" in out and "bbbbbbbb" in out), (True, True, True))
a.j("todo", "a side chore")
code, out = b.j("todo")
check("to-dos are the session's environment's too", "a side chore" in out, False)

# ---------------------------------------------------------------- --project, and a switch from the terminal
code, out = a.j("switch", "third", "--project")
check("--project binds this session and moves the start environment",
      (code, "the project starts on third" in out, tracks.bound(root, "aaaaaaaa-1"), json.loads((root / "record.json").read_text())["current"]),
      (0, True, "third", "third"))
check("b stays where it was", tracks.bound(root, "bbbbbbbb-2"), "default")
c = S("cccccccc-3")
check("a new session starts on the new start environment", tracks.bound(root, "cccccccc-3"), "third")
code, out = terminal("switch", "side")
check("from a terminal a switch is the project's, and it lists the sessions bound elsewhere with how to move them",
      (code, "the project starts on side" in out, "aaaaaaaa" in out and "bbbbbbbb" in out and "cccccccc" in out, "--session=<id>" in out),
      (0, True, True, True))
check("and none of them moved", (tracks.bound(root, "aaaaaaaa-1"), tracks.bound(root, "bbbbbbbb-2"), tracks.bound(root, "cccccccc-3")), ("third", "default", "third"))
code, out = terminal("switch", "side", "--session=bbbbbbbb")
check("--session moves that one", (code, tracks.bound(root, "bbbbbbbb-2"), tracks.bound(root, "aaaaaaaa-1")), (0, "side", "third"))
code, out = terminal("switch", "side", "--all-sessions")
check("--all-sessions moves every one", (tracks.bound(root, "aaaaaaaa-1"), tracks.bound(root, "cccccccc-3")), ("side", "side"))
code, out = a.j("switch", "--back")
check("--back returns this session to where it came from", (code, tracks.bound(root, "aaaaaaaa-1")), (0, "third"))
code, out = a.j("switch", "third")
check("switching to where you are is refused", code, 1)

# ---------------------------------------------------------------- the hooks read through the binding
ctx = a.start()
check("a session's start block names its own environment, not the project's", "bound to environment `third`" in ctx, True)
ctx = b.start()
check("and b's names b's", "bound to environment `side`" in ctx, True)
b.j("todo", "chore on side"); b.j("todo", "auto", "on")
out = subprocess.run([str(root / "hook.py")], input=json.dumps({"hook_event_name": "Stop", "session_id": "bbbbbbbb-2", "transcript_path": str(b.path)}),
                     capture_output=True, text=True, timeout=60).stdout
check("a stop hold reads the session's environment: b is held for side's list",
      "auto is on" in testkit.hold(out)[0], True)
out = subprocess.run([str(root / "hook.py")], input=json.dumps({"hook_event_name": "Stop", "session_id": "aaaaaaaa-1", "transcript_path": str(a.path)}),
                     capture_output=True, text=True, timeout=60).stdout
check("a, on third, is not held for side's list", "auto is on" in (json.loads(out).get("reason", "") if out.strip() else ""), False)
check("bindings are runtime, not record", (root / "runtime" / "bindings.map").is_file() and "bindings" not in (root / "record.json").read_text(), True)


# ---------------------------------------------------------------- one live session per environment
e = Path(tempfile.mkdtemp()) / "proj"
(e / ".claude").mkdir(parents=True)
shutil.copytree(SRC, e / ".journal", ignore=shutil.ignore_patterns(
    "runtime", "state.json*", "record.json*", "todo", "docs", "tools", ".journal", ".git", ".claude", "__pycache__"))
(e / ".journal" / "settings.json").write_text(json.dumps({"bind_on_start": True}))
root2 = e / ".journal"
tdir2 = transcript.project_dir(e); tdir2.mkdir(parents=True, exist_ok=True)
J2 = str(root2 / "journal.py")


class T:
    def __init__(self, stem):
        self.stem = stem
        self.path = tdir2 / f"{stem}.jsonl"; self.path.write_text("")
        self.env = {**os.environ, transcript.SESSION_ENV: stem}
        self.ctx = self.fire("SessionStart", source="startup")

    def fire(self, event, **extra):
        out = subprocess.run([str(root2 / "hook.py")], input=json.dumps({"hook_event_name": event, "session_id": self.stem,
                             "transcript_path": str(self.path), **extra}), capture_output=True, text=True, timeout=60).stdout
        if not out.strip():
            return ""
        got = json.loads(out)
        return got.get("reason") or (got.get("hookSpecificOutput") or {}).get("additionalContext") or \
            (got.get("hookSpecificOutput") or {}).get("permissionDecisionReason") or ""

    def j(self, *a):
        p = subprocess.run([J2, *a], env=self.env, capture_output=True, text=True, timeout=60)
        return p.returncode, p.stdout + p.stderr

    def write(self):
        return self.fire("PreToolUse", tool_name="Write", tool_input={"file_path": str(e / "f.txt"), "content": "x"})

    def bash(self, cmd):
        return self.fire("PreToolUse", tool_name="Bash", tool_input={"command": cmd})

    def read(self):
        return self.fire("PreToolUse", tool_name="Read", tool_input={"file_path": str(e / "f.txt")})


def term2(*a):
    env = {k: v for k, v in os.environ.items() if k != transcript.SESSION_ENV}
    p = subprocess.run([J2, *a], env=env, capture_output=True, text=True, timeout=60)
    return p.returncode, p.stdout + p.stderr


x = T("xxxxxxxx-1")
check("the first session on an environment is not told anything", "IS TAKEN" in x.ctx, False)
y = T("yyyyyyyy-2")
check("a second session on a taken environment is registered nowhere", tracks.bound(root2, "yyyyyyyy-2"), None)
check("a second session on the same environment is told at its start, and by whom",
      ("ENVIRONMENT `default` IS TAKEN" in y.ctx, "xxxxxxxx" in y.ctx, "switch" in y.ctx), (True, True, True))
check("its edits are refused until it switches", "IS TAKEN" in y.write(), True)
check("its reads are not", y.read(), "")
check("its stop is held, first in the queue", y.fire("Stop").startswith("journal: environment `default` is taken"), True)
check("its journal writes are refused while it is registered nowhere", "registered on no environment" in y.bash('.journal/journal.py pin "x"'), True)
check("but a switch is let through: it is what registers it", y.bash('.journal/journal.py switch "side"'), "")
check("and reads are", y.bash('.journal/journal.py pins'), "")
y.j("work", "start", "w")
check("open work does not lift it", "IS TAKEN" in y.write(), True)
code, out = y.j("switch", "side")
check("it switches to a free environment, and that registers it", (code, tracks.bound(root2, "yyyyyyyy-2")), (0, "side"))
check("and is not held or refused for the environment any more", (y.fire("Stop"), "IS TAKEN" in y.write()), ("", False))
check("the first session was never bothered", ("IS TAKEN" in x.write(), x.fire("Stop")), (False, ""))
code, out = x.j("switch", "side")
check("a switch onto a taken environment is refused, naming the holder", (code, "taken by session yyyyyyyy" in out), (1, True))
code, out = term2("switch", "side", "--session=xxxxxxxx")
check("moving a session onto a taken environment from a terminal is refused too", (code, "not moved" in out, tracks.bound(root2, "xxxxxxxx-1")), (1, True, "default"))
check("the --session switch moved the project's start environment there all the same",
      json.loads((root2 / "record.json").read_text())["current"], "side")
z = T("zzzzzzzz-3")
check("a session starting on the start environment finds it taken by the session on it", ("IS TAKEN" in z.ctx, "yyyyyyyy" in z.ctx), (True, True))
y.fire("SessionEnd", reason="exit")
check("SessionEnd frees the environment", tracks.bound(root2, "yyyyyyyy-2"), None)
check("and the waiting session is free at its next event", (z.fire("Stop"), "IS TAKEN" in z.write()), ("", False))
code, out = x.j("switch", "side")
check("a switch onto it is refused now because z holds it", (code, "zzzzzzzz" in out), (1, True))
state.put(root2, "seen_at", 1000, stem="zzzzzzzz-3")
code, out = x.j("switch", "side")
check("a session not seen for longer than session_stale_hours is gone: the environment is free", code, 0)
code, out = x.j("tracks")
check("environments says who is running and who is stale", ("xxxxxxxx-1 (active just now)".replace("-1", "") in out, "zzzzzzzz (stale)" in out), (True, True))
q = T("qqqqqqqq-4")   # start environment is side, held by x
check("the start block names the holder and how it was seen", ("IS TAKEN" in q.ctx, "xxxxxxxx" in q.ctx, "active" in q.ctx), (True, True, True))
# subagents: outside the rule entirely — a subagent of the waiting session edits, stops and
# is never bound, and the parent's environment holder is not disturbed by it
sub = {"hook_event_name": "PreToolUse", "session_id": "qqqqqqqq-4", "agent_id": "ab12", "transcript_path": str(q.path),
       "tool_name": "Write", "tool_input": {"file_path": str(e / "g.txt"), "content": "x"}}
p = subprocess.run([str(root2 / "hook.py")], input=json.dumps(sub), capture_output=True, text=True, timeout=60)
check("a subagent's edit on a taken environment is not refused", ("deny" in p.stdout, p.returncode), (False, 0))
p = subprocess.run([str(root2 / "hook.py")], input=json.dumps({**sub, "hook_event_name": "Stop"}), capture_output=True, text=True, timeout=60)
check("a subagent's stop is never held", p.stdout.strip(), "")
check("and a subagent is never bound to an environment", tracks.bound(root2, "agent-ab12"), None)
check("nor does it count as a session on one", "agent-ab12" in json.dumps(tracks.live(root2)), False)
p = subprocess.run([str(root2 / "hook.py")], input=json.dumps({**sub, "tool_input": {"command": '.journal/journal.py switch "elsewhere"'}, "tool_name": "Bash"}),
                   capture_output=True, text=True, timeout=60)
check("a subagent switching environments is refused — and by verb, not only by grant",
      "moves a SESSION" in testkit.denied(p.stdout), True)
(root2 / "settings.json").write_text(json.dumps({"bind_on_start": True, "one_session_per_environment": False}))
check("with the rule off, the same session is free", (q.fire("Stop"), "IS TAKEN" in q.write()), ("", False))
code, out = x.j("switch", "default")
check("and switches are not refused for it", code, 0)
(root2 / "settings.json").write_text(json.dumps({"bind_on_start": True, "silenced": ["track"]}))
r = T("rrrrrrrr-5")
check("silencing `environment` is the same as the rule off", "IS TAKEN" in r.ctx, False)

# ------------------------------------------------------------------ claiming an environment
# THE GUARD REFUSES AND DOES NOT ADJUDICATE, so the one case it is reached for — the holder
# is gone and the work is not — had no answer but waiting out the staleness window or
# turning the setting off for every environment at once.
(root2 / "settings.json").write_text(json.dumps({"bind_on_start": True}))
a = T("aaaaaaaa-6")
code, out = a.j("switch", "held-env")
check("a session takes an environment", (code, tracks.bound(root2, "aaaaaaaa-6")), (0, "held-env"))
b = T("bbbbbbbb-7")
code, out = b.j("switch", "held-env")
check("the guard still refuses a plain switch onto it", (code, "taken by session aaaaaaaa" in out), (1, True))
code, out = b.j("claim", "held-env")
check("a claim with no reason is refused: the evicted session is owed the sentence",
      (code, "a claim says why" in out), (1, True))
code, out = b.j("claim", "no-such-env", "mine now")
check("a claim of an environment that does not exist is refused, naming what would make one",
      (code, "nothing to claim" in out, "prepare" in out), (1, True, True))
code, out = b.j("claim", "held-env", "its terminal was closed hours ago")
check("the claim takes it, names who lost it and why",
      (code, "claimed held-env from session aaaaaaaa" in out, "its terminal was closed hours ago" in out),
      (0, True, True))
check("the claimer is bound to it", tracks.bound(root2, "bbbbbbbb-7"), "held-env")
check("and the holder is bound to NOTHING, never to a second session on the same environment",
      tracks.bound(root2, "aaaaaaaa-6"), None)
claims = json.loads((root2 / "record.json").read_text())["claims"]
check("the claim is on the record: who, from whom, and why",
      (claims[-1]["track"], claims[-1]["by"], claims[-1]["from"], claims[-1]["why"]),
      ("held-env", "bbbbbbbb-7", ["aaaaaaaa-6"], "its terminal was closed hours ago"))
held_text = a.fire("Stop")
check("the evicted session is told at its next stop, with the reason and how to take it back",
      ("was claimed by another session" in held_text, "bbbbbbbb" in held_text,
       "its terminal was closed hours ago" in held_text), (True, True, True))
check("it is news, said once: the next stop is not held for it again",
      "was claimed" in a.fire("Stop"), False)
c = T("cccccccc-8")
c.j("switch", "empty-env")
c.fire("SessionEnd", reason="exit")
code, out = b.j("claim", "empty-env", "starting fresh here")
check("claiming an environment nobody holds is allowed and says so plainly",
      (code, "held by nobody" in out), (0, True))
code, out = a.j("environments", "claim", "empty-env", "the twin spelling under the noun")
check("`journal environments claim` is the same command, eviction and all",
      (code, tracks.bound(root2, "aaaaaaaa-6"), tracks.bound(root2, "bbbbbbbb-7")),
      (0, "empty-env", None))
code, out = a.j("environments", "switch", "held-env")
check("and every other lifecycle verb answers under the noun too",
      (code, tracks.bound(root2, "aaaaaaaa-6")), (0, "held-env"))

# ─────────────── a subagent writes only what its dispatcher lent it ───────────────────────
# The grant is declared twice — by the session, in the record; by the subagent, on its
# command line — because nothing can DETECT a subagent: its shell carries the parent's id.
import grants as _g
gd = Path(tempfile.mkdtemp()) / "proj"
testkit.make(gd, Path(__file__).resolve().parent)
groot = gd / ".journal"
genv = {**os.environ, transcript.SESSION_ENV: "gs1"}
gpath = transcript.project_dir(gd) / "gs1.jsonl"; gpath.parent.mkdir(parents=True, exist_ok=True); gpath.write_text("")
gP = testkit.Project(gd)
gP.hook("SessionStart", source="startup", session_id="gs1", transcript_path=str(gpath))
gP.cli("prepare", "scout", session="gs1")
gP.cli("switch", "default", session="gs1")


def sub(cmd):
    """One subagent tool call: the parent's session id, plus an agent_id."""
    return gP.hook("PreToolUse", session_id="gs1", transcript_path=str(gpath), agent_id="a1",
                   tool_name="Bash", tool_input={"command": cmd})[1]


J2 = str(groot / "journal.py")
check("ungranted, a subagent's write is refused",
      "deny" in sub(f'{J2} work start "from a subagent"'), True)
gP.cli("grant", "scout", session="gs1")
check("granted but unnamed, still refused — the flag is the subagent's half of the grant",
      ("deny" in sub(f'{J2} work start "x"'),
       "needs the environment it was lent" in testkit.denied(sub(f'{J2} work start "x"'))),
      (True, True))
# A FORBIDDEN VERB IS REFUSED FOR ITS OWN REASON, BEFORE THE ENVIRONMENT IS EVEN CONSIDERED.
# Otherwise an agent that forgot `--env` would be told to add the flag and then refused
# again for the real reason — two walls where one honest sentence belongs.
check("and a verb it may never run says so, flag or no flag",
      "inherited, never written" in testkit.denied(sub(f'{J2} pins add "x"')), True)
# A REFUSAL MUST NOT OFFER A WAY ROUND ITSELF. This one used to list every environment the
# session had lent and suggest the first: a trial subagent read the list, picked another
# dispatch's environment, and filed eight pins into it. It was obeying a good message that
# asked for the wrong thing.
_wrong = testkit.denied(sub(f'{J2} --env="default" work start "x"'))
check("naming an environment nobody lent is refused too", bool(_wrong), True)
check("and the refusal names no other environment, and says to report rather than choose",
      ("scout" in _wrong, "not something to work around" in _wrong, "Report to the agent" in _wrong),
      (False, True, True))
check("granted AND named: it writes",
      "deny" in sub(f'{J2} --env="scout" --as="a1" work start "what I am doing"'), False)
# BOTH FLAGS OR NEITHER. Without `--as` the write lands in the environment's shared ledger
# instead of the agent's own — the collision the sub-environment exists to prevent, arriving
# silently. Measured: an agent started a to-do with no `--as`, was told "open: …", worked it,
# and was refused by `report` with "held by nobody".
check("named but unattributed is refused, and told why the flag matters",
      ("needs `--as=<your name>`" in testkit.denied(sub(f'{J2} --env="scout" work start "x"')),
       "held by nobody" in testkit.denied(sub(f'{J2} --env="scout" work start "x"'))),
      (True, True))
check("its reads were never gated", "deny" in sub(f"{J2} pins"), False)
# THE ONE THE ADVERSARIAL PASS FOUND: a subagent has no session, so `switch` would move the
# DISPATCHER's — the ground under the agent that sent it.
check("switch stays refused even on the granted environment",
      ("deny" in sub(f'{J2} --env="scout" switch "scout"'),
       "moves a SESSION" in testkit.denied(sub(f'{J2} --env="scout" switch "scout"'))),
      (True, True))
check("and so does prepare", "deny" in sub(f'{J2} --env="scout" prepare "another"'), True)
# A GRANT LENDS ONE ENVIRONMENT. Everything a subagent writes there is confined to it —
# but a RULE binds every environment, for every session, forever, and lives in the shared
# record. That is the fact-of-unknown-provenance the whole mechanism exists to prevent.
check("a rule binds every environment, so a subagent may not write one",
      ("binds every environment" in testkit.denied(sub(f'{J2} --env="scout" rules add "everyone must"'))),
      True)
check("but what belongs to the lent environment goes through",
      [bool(testkit.denied(sub(f'{J2} --env="scout" --as="a1" {v}'))) for v in
       ('work start "digging"', 'todos add "later"')],
      [False, False])
# THE USER'S RULING: a lent agent INHERITS this environment's pins and reminders and writes
# neither. Not for blast radius — a pin belongs to one environment exactly as work does —
# but for PROVENANCE: a pin is re-read in full at every compaction by every session that
# binds here, and nothing revisits it, so a claim whose reasoning nobody in the main
# conversation saw would stand in the record's highest-authority position forever.
for _v in ('pins add "a finding"', 'pin "a finding"', 'reminders add "do this always"'):
    check(f"a lent agent may not write `{_v.split()[0]}`",
          "inherited, never written" in testkit.denied(sub(f'{J2} --env="scout" {_v}')), True)
check("but it READS them freely — that is what inheriting means",
      [bool(testkit.denied(sub(f'{J2} --env="scout" {v}'))) for v in ("pins", "reminders")],
      [False, False])
# AND THE BRIEFING TEACHES ONLY WHAT IT MAY DO. It offered `pins add` as its example, which
# is refused — a wall on the agent's first useful act, carrying the dispatcher's authority.
_brief = gP.cli("grant", "scout", session="gs1")[1]
check("the dispatch sentence names no command the agent would be refused",
      ("pins add" in _brief, "work start" in _brief, "INHERIT" in _brief),
      (False, True, True))
# C2 — THE TWO LISTS CANNOT DRIFT APART. A verb named as forbidden that the gate cannot
# reach is a refusal nothing enforces: five of them were, and a granted subagent could have
# evicted a live session with `journal claim`.
check("every verb NEVER refuses is one the gate can actually see", _g.unreachable(), set())
# C1/C3 — the matrix: every never-verb, in both its spellings, granted, is refused
for v, spelling in (("claim", f'{J2} --env="scout" claim "scout" "mine"'),
                    ("grant", f'{J2} --env="scout" grant "scout"'),
                    ("environments switch", f'{J2} --env="scout" environments switch "scout"'),
                    ("environments remove", f'{J2} --env="scout" environments remove "scout"'),
                    ("prepare", f'{J2} --env="scout" prepare "another"')):
    check(f"granted, a subagent is still refused `{v}`", bool(testkit.denied(sub(spelling))), True)
# L3 — what it wrote survives revocation; a revoke closes a door, it does not undo
before = gP.cli("--env=scout", "todos", session="gs1")[1]
gP.cli("grant", "--off", "scout", session="gs1")
check("revoked: refused again", "deny" in sub(f'{J2} --env="scout" --as="a1" work start "x"'), True)
check("and what it wrote is untouched", gP.cli("--env=scout", "todos", session="gs1")[1], before)
# L1 — the grant dies with the session, which was a sentence before it was a fact
gP.cli("grant", "scout", session="gs1")
check("granted again", "deny" in sub(f'{J2} --env="scout" --as="a1" todos add "y"'), False)
gP.hook("SessionEnd", session_id="gs1", transcript_path=str(gpath), reason="exit")
check("and SessionEnd takes it back — a resumed session lends nothing it is not watching",
      "deny" in sub(f'{J2} --env="scout" pins add "z"'), True)
# I1/I2 — WHAT IT MAY TOUCH, measured. A granted subagent's whole write repertoire changes
# files under its own environment and nothing else: not the record, not another environment,
# not the bindings. That property is why docs, tools and rules are refused rather than
# merely discouraged — each writes somewhere every session reads.
import hashlib as _h
gP.cli("grant", "scout", session="gs1")


def _snap():
    out = {}
    for f in (groot).rglob("*"):
        if f.is_file() and "__pycache__" not in str(f) and not f.name.endswith(".py"):
            out[str(f.relative_to(groot))] = _h.md5(f.read_bytes()).hexdigest()
    return out


_before = _snap()
for args in (["--env=scout", "work", "start", "digging"], ["--env=scout", "pins", "add", "a finding"],
             ["--env=scout", "todos", "add", "later"], ["--env=scout", "reminders", "add", "keep at it"]):
    gP.cli(*args, session="gs1")
_touched = sorted(k for k in set(_before) | set(_snap()) if _before.get(k) != _snap().get(k))
check("a granted write touches only its own environment's files",
      [k for k in _touched if not k.startswith("environments/scout/")], [])
check("and it touches all four of them",
      sorted({k.split("/")[2] for k in _touched}),
      ["pins.json", "reminders.json", "todo", "work.json"])
for v in ('docs add "r" --abstract=x', 'tools add t "T" --summary=s --usage=u --entry=x'):
    check(f"a granted subagent may not write the project's own stores: {v[:9]}",
          "the PROJECT's" in testkit.denied(sub(f'{J2} --env="scout" {v}')), True)

# L4 — granting twice is idempotent and says so
gP.cli("grant", "scout", session="gs1")
code, out = gP.cli("grant", "scout", session="gs1")
check("a second grant of the same environment is idempotent and says so",
      (code, "already" in out, _g.granted(groot, "gs1").count("scout")), (0, True, 1))

# ─────────── a subagent's OWN ledger, and a to-do assigned and held ───────────────────────
# Two subagents lent one environment shared one work.json before this: B closed A's work by
# saying A's words, and the record could not tell them apart.
ad = Path(tempfile.mkdtemp()) / "proj"
testkit.make(ad, Path(__file__).resolve().parent)
aroot = ad / ".journal"
apath = transcript.project_dir(ad) / "as1.jsonl"
apath.parent.mkdir(parents=True, exist_ok=True); apath.write_text("")
aP = testkit.Project(ad)
aP.hook("SessionStart", source="startup", session_id="as1", transcript_path=str(apath))
aP.cli("prepare", "shared", session="as1"); aP.cli("switch", "default", session="as1")
aP.cli("grant", "shared", session="as1")
aJ = str(aroot / "journal.py")


def _agent(who, event="PreToolUse", **kw):
    return aP.hook(event, session_id="as1", transcript_path=str(apath), agent_id=who, **kw)[1]


# it is told its own name, once, on its first tool call
_first = _agent("a3f9", "PostToolUse", tool_name="Bash", tool_input={"command": "ls"},
                tool_response={"stdout": ""})
_told = testkit.flat((json.loads(_first).get("hookSpecificOutput") or {}).get("additionalContext", ""))
check("a subagent is told its own name on its first tool call",
      ("YOU ARE AGENT `a3f9`" in _told, '--as="a3f9"' in _told), (True, True))
check("and only once", _agent("a3f9", "PostToolUse", tool_name="Bash",
                             tool_input={"command": "ls"}, tool_response={"stdout": ""}).strip(), "")
# IT NEVER NAMES AN ENVIRONMENT IT IS GUESSING AT. Measured in this package's own dogfood
# run: three agents dispatched to three environments were each told, on their first tool
# call, that they worked under a FOURTH — an older grant that happened to be `lent[0]`. The
# agent id was right and the environment was wrong, stated with the hook's full authority
# against a dispatch prompt that had just named the correct one. It is the same failure the
# refusal already had and had already been fixed for.
aP.cli("grant", "second-loan", session="as1")
_two = testkit.flat((json.loads(aP.hook("PostToolUse", session_id="as1", transcript_path=str(apath),
    agent_id="c4d2", tool_name="Bash", tool_input={"command": "ls"}, tool_response={"stdout": ""})[1])
    .get("hookSpecificOutput") or {}).get("additionalContext", ""))
check("with several lent, the briefing names none of them and says the dispatch does",
      ("shared" in _two, "second-loan" in _two, "your dispatch named" in _two,
       "YOU ARE AGENT `c4d2`" in _two),
      (False, False, True, True))
aP.cli("grant", "--off", "second-loan", session="as1")

check("a second agent is told its own",
      "YOU ARE AGENT `b7c1`" in _agent("b7c1", "PostToolUse", tool_name="Bash",
                                       tool_input={"command": "ls"}, tool_response={"stdout": ""}), True)
# THE READABLE NAME WAS ALREADY ON DISK. The open question was how an agent comes by a name
# a person can read — the id being hex, and the alternative being to let it invent one,
# which then needs collision-checking against every live agent and binding back to the real
# id anyway. None of that: the harness writes `.../subagents/agent-<id>.meta.json` with the
# DESCRIPTION the dispatcher typed, before the agent's first tool call.
import agents as _ag, json as _json
_meta = transcript.project_dir(ad) / "as1" / "subagents"
_meta.mkdir(parents=True, exist_ok=True)
(_meta / "agent-a3f9.meta.json").write_text(_json.dumps({"description": "Flag and command tables",
                                                        "model": "sonnet"}))
check("the dispatcher's own words are the agent's readable name",
      _ag.described(ad, "as1", "a3f9"), "Flag and command tables")
check("and a missing one is normal, not an error",
      (_ag.described(ad, "as1", "nope"), _ag.described(ad, "", "a3f9")), ("", ""))
check("the briefing wears it beside the id, which is still what the gate decides on",
      ('YOU ARE AGENT `a3f9` — "Flag and command tables"' in _ag.briefing(["shared"], "a3f9",
                                                                         "Flag and command tables")),
      True)

# `journal lent` — THE DELIBERATE CHECK-IN. An agent used to learn its name as a side effect
# of whatever tool it happened to run first. This is it asking, and the CLI cannot answer:
# `agent_id` reaches the hook and never the process, which is the collision the whole grant
# exists for and does not stop applying to the command that asks about it.
_lent = testkit.flat((json.loads(aP.hook("PostToolUse", session_id="as1", transcript_path=str(apath),
    agent_id="a3f9", tool_name="Bash", tool_input={"command": f"{aJ} lent"},
    tool_response={"stdout": ""})[1]).get("hookSpecificOutput") or {}).get("additionalContext", ""))
check("`journal lent` is answered by the hook, with the agent's own name",
      ("YOU ARE AGENT `a3f9`" in _lent, '--as="a3f9"' in _lent), (True, True))
check("and it answers every time it is asked, unlike the one-shot briefing",
      "YOU ARE AGENT `a3f9`" in testkit.flat((json.loads(aP.hook("PostToolUse", session_id="as1",
          transcript_path=str(apath), agent_id="a3f9", tool_name="Bash",
          tool_input={"command": f"{aJ} lent"}, tool_response={"stdout": ""})[1])
          .get("hookSpecificOutput") or {}).get("additionalContext", "")), True)
check("a session running it is told plainly that nothing lent this to it",
      "You are a SESSION" in aP.cli("lent", session="as1")[1], True)

# separate ledgers
for _w in ("a3f9", "b7c1"):
    aP.cli("--env=shared", f"--as={_w}", "work", "start", f"{_w} is on it", session="as1")
check("each agent's work is its own file",
      [json.loads((aroot / "environments" / "shared" / "agents" / w / "work.json").read_text())["work"][0]["subject"]
       for w in ("a3f9", "b7c1")],
      ["a3f9 is on it", "b7c1 is on it"])
check("and one cannot close the other's by saying its words",
      "closes nothing" in aP.cli("--env=shared", "--as=b7c1", "work", "end", "a3f9 is on it", session="as1")[1],
      True)
# a claimed name is checked against the payload
check("claiming another agent's name is refused",
      "is not you" in testkit.denied(_agent("b7c1", tool_name="Bash",
          tool_input={"command": f'{aJ} --env="shared" --as="a3f9" work start "x"'})), True)
# assignment and the hold
aP.cli("--env=shared", "todos", "add", "refactor the parser", session="as1")
check("a to-do is assigned to one agent",
      "assigned to `a3f9`" in aP.cli("--env=shared", "assign", "1", "--to=a3f9", session="as1")[1], True)
check("and held against a second agent",
      "held by `a3f9`" in aP.cli("--env=shared", "assign", "1", "--to=b7c1", session="as1")[1], True)
check("a held row is not offered to the list",
      [t["n"] for t in __import__("todo").ready(aroot, "shared")], [])
# report, but never close
check("an agent it is not assigned to may not report it",
      "not assigned to you" in aP.cli("--env=shared", "--as=b7c1", "todos", "report", "1", "done", session="as1")[1],
      True)
_r = aP.cli("--env=shared", "--as=a3f9", "todos", "report", "1", "split the two entry points", session="as1")[1]
check("the agent holding it reports it finished, and is told the parent closes it",
      ("reported finished" in _r, "closes it" in _r), (True, True))
check("and the row is still OPEN, waiting on the parent",
      [t["n"] for t in __import__("todo").reported(aroot, "shared")], [1])
check("the parent closes it", aP.cli("--env=shared", "todos", "done", "1", "reviewed and merged", session="as1")[0], 0)

# STARTING A ROW CLAIMS IT. Measured in a dogfood run: an agent ran `todos start`, worked
# the row and was refused by `report` for holding nothing, because `started` and `assigned`
# were two facts and only a dispatcher set the second.
aP.cli("--env=shared", "todos", "add", "unpick the two entry points", session="as1")
_s = aP.cli("--env=shared", "--as=a3f9", "todos", "start", "2", session="as1")[1]
check("an agent that starts an unheld row claims it, and is told so",
      ("held for `a3f9`" in _s, "todos done" in _s), (True, False))
check("the hold is real: the row leaves the ready list",
      [t["n"] for t in __import__("todo").ready(aroot, "shared")], [])
check("and it can now report on it",
      "reported finished" in aP.cli("--env=shared", "--as=a3f9", "todos", "report", "2",
                                    "split them", session="as1")[1], True)
aP.cli("--env=shared", "todos", "add", "another row", session="as1")
aP.cli("--env=shared", "assign", "3", "--to=a3f9", session="as1")
check("a row another live agent holds cannot be started out from under it",
      "held by `a3f9`" in aP.cli("--env=shared", "--as=b7c1", "todos", "start", "3", session="as1")[1], True)
check("reporting a row nobody holds says how to claim it",
      "start 4 --as=b7c1" in (aP.cli("--env=shared", "todos", "add", "unheld", session="as1"),
                              aP.cli("--env=shared", "--as=b7c1", "todos", "report", "4",
                                     "x", session="as1"))[1][1], True)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
