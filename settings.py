from __future__ import annotations

import json
from pathlib import Path
from templates import render as fill

#: Older names for settings, still accepted: environments were called environments.
ALIASES = {"one_session_per_track": "one_session_per_environment"}

DEFAULTS = {
    # How much either side of a prompt is kept, so "yes please" has its question.
    "context_messages": 2,

    # `nudge_untagged` LIVED HERE and is gone: it was read only by a MessageDisplay handler
    # that wrote a key nothing read. A setting that does nothing is the failure this module
    # exists to report, so anyone who kept it is told so by the unknown-key line.

    # THE ONE RULE: a message that carries no tag is a message that filed nothing, and it
    # is held for at the STOP, never mid-task. A tool count is an arbitrary boundary
    # that can fire mid-thought; a stop is the moment the stretch is about to be lost, which
    # is the moment worth holding. Set false to nudge and never hold.
    "hold_stop_on_untagged": True,

    # A write is refused while no work is open. It was declared here for weeks and never
    # built; it is built now because the nudge was measured and found not to land — a real
    # session tagged 843 lines faithfully and ran `journal start` zero times. ON by default,
    # because a gate nobody turns on is the same as the setting that was never implemented.
    "gate_writes_on_start": True,

    # HOW LONG WORK MAY WAIT before the hold comes back. `journal work await` says the work
    # is in flight on something the agent cannot hurry — a subagent, a build, a review —
    # and the stop stops nudging it. It always expires, because a wait with no end is how
    # work is abandoned quietly: the awaited thing dies, nothing nudges, and the journal
    # reads as busy forever. The default is one loop cycle plus a margin, so a session
    # running `journal next` on a loop is woken before its wait runs out.
    "await_default_minutes": 20,
    "await_max_minutes": 120,

    # A NEW SESSION CHOOSES ITS ENVIRONMENT; IT IS NOT GIVEN ONE. Binding at the start put
    # every fresh session on the project's start environment — one it did not choose and
    # could not see — and its pins, to-dos and work landed there because nothing had asked.
    # So a session starts unbound: the user is shown one line saying so, the agent is told
    # to infer the environment from the first prompt and say which it took, or to ask when
    # the prompt names nothing, and the journal refuses until one is chosen — READS as well
    # as writes, because there is no default environment to read. True restores the old
    # binding at start, and is the one way a project says every session belongs on it.
    "bind_on_start": False,

    # WHICH EVENTS INTERRUPT. Everything the user does in the viewer reaches an idle session
    # through the launcher; these kinds reach one that is mid-turn as well, because the user
    # speaking is the one thing that cannot wait. The rest — a plan approved, a suggestion
    # decided, a to-do edited, a newer version upstream — is there when the turn ends.
    # The names are the event's own kind: message, question, comment, suggestion, plan, did,
    # update. An empty list means nothing interrupts; every kind listed means everything does.
    "channel_reach_now": ["message", "question", "comment"],

    # A tool result bigger than this, and bigger than anything before it this session, is
    # reported once. Characters, not tokens: it is the transcript's own unit and roughly
    # four to one. 0 turns it off.
    "tool_cost_floor": 20_000,

    # A file that is not source — no source extension, not tracked by git; outside the
    # project, anything that is not source — read this many times in one session earns a
    # hint, once, to attach it to a doc. 0 turns it off.
    "attach_hint_reads": 2,

    # THE CAP IS ON LENGTH, NOT COUNT. Measured: a hundred pins is about 4,700 tokens,
    # under half a percent of a million-token window — so counting them rationed something
    # that costs nothing, while the real damage was a pin grown into a paragraph and
    # re-read in full at every compaction forever. A pin is a CLAIM; its reasoning stays in
    # the transcript, and `journal pins <n> --full` reads the stretch around it. 0 removes
    # the limit. It was 140, then 300, and a claim with its one constraint kept brushing
    # it; 400 is about 100 tokens re-read per start and still short of a paragraph. What
    # does not fit in 400 is several claims, and several claims are several pins.
    "pin_max_chars": 400,

    # Messages either side of a pin that `journal pins <n> --full` shows.
    "pin_context": 4,

    # HOW OFTEN A REMINDER COMES BACK MID-TURN, in tool calls. A reminder is shown at the
    # head of every stop chain; this is the other half, for the long agentic stretch where
    # the next stop is an hour away and the instruction is fifty results back. Agent-only
    # at this cadence — the same line in the user's terminal at every interval is the wall
    # the stop queue exists to avoid. 0 leaves reminders to the stop.
    #
    # IT WAS 15, AND THAT WAS THE WRONG FAILURE TO OPTIMISE AGAINST. A reminder is the one
    # channel here with no condition on it, which makes it the one channel that can teach
    # the reader to skim — and everything else in this package that fired on a condition
    # rather than a record ended up doing exactly that, eleven wrong nudges to catch three.
    # A repeated line is not read harder for repeating sooner; past some interval it stops
    # being an instruction and becomes furniture, and the agent it was written for is the
    # reader least able to say when that happened. 50 is far enough apart to still land as
    # an interruption, and still several times in the kind of stretch a reminder is for.
    "reminder_every": 50,

    # AUTO MODE MEANS THE LIST GETS WORKED, and an agent that stopped with work ready is the
    # one case nothing notices: its own hooks only fire when it acts, and the launcher only
    # speaks when the user does. So the launcher nudges it back after this many minutes idle.
    # It fires only while something is READY — never on an empty or wholly blocked list — and
    # again each interval, because the reason it stopped is usually that nothing is coming.
    # 0 turns it off. Nothing nudges when auto is off: that is the user's list to hand out.
    "idle_nudge_minutes": 10,

    # THE CAP ON ONE REMINDER, in characters — tighter than a pin's, because a pin is
    # re-read at every compaction and a reminder is re-read dozens of times in one
    # session. What does not fit in a line is a briefing, not an instruction. 0 removes it.
    "reminder_max_chars": 200,

    # THE CAP ON A QUESTION'S TITLE, in characters. A question's title is the question, in
    # one line: it is what the user reads in the viewer's list and at the top of the card,
    # and a title that runs four lines is a brief with a question bolted on the end. The
    # context is not refused, it is MOVED — `--description` takes it, and each choice is
    # its own `--option`. Same shape as a pin's claim and its reasoning. 0 removes it.
    "question_max_chars": 200,

    # HOW LONG A FINISHED SUBAGENT STAYS ON THE HOME, in minutes. A subagent used to leave the
    # list the instant it stopped — exactly when the user turns to look at what it just did, and
    # the one moment its line is worth clicking. It stays, marked finished and with its age, and
    # then goes. 0 drops it the moment it ends.
    "crew_finished_minutes": 15,

    # THE RUNGS AT WHICH THE CONTEXT NUDGE FIRES, each one once. A single warning could not
    # be both early enough to think in and late enough to feel urgent, so it is a ladder:
    # 50% is the cheap moment to decide what must outlive the window, 95% is the last word.
    # Empty disables it. See `context._RUNGS` for what each rung says.
    "context_warn_ladder": [0.5, 0.7, 0.9, 0.95],

    # AFTER A RUNG, NOTHING RUNS UNTIL A DECISION IS MADE. The rung's hold was measured
    # and did not land: the user had to remind the agent to pin. So the next tool call is
    # denied until `remember` or `nothing "<why>"` has been run — a decision, not a pin,
    # because a gate that manufactures pins is the padding the ladder warns against.
    "gate_after_context_rung": False,

    # WHERE THE MAIN AGENT IS REMINDED THAT RULES AND PINS EXIST, as a share of its window.
    # It is handed them in full at its start and then never again until a compaction, so by
    # the time a session is long enough to drift, the block that carried them is tens of
    # thousands of characters behind — which is exactly when the drift happens. A subagent
    # was told nothing until this existed.
    #
    # A POINTER, NOT THE TEXT. The claims are already in this context; re-injecting them
    # would spend the window to fight a symptom of the window being full, and the count is
    # what a reader needs to decide whether to look. Empty disables it.
    "recall_ladder": [0.35, 0.6, 0.85],


    # TOOL CALLS ON ONE STARTED TO-DO WITH NO `update` FILED before the hook says so, once.
    # The measurement behind "too much time without result" when auto is on. 0 turns it off.
    "stall_calls": 40,

    # TRANSCRIPT LINES OF PROGRESS BEFORE A HELD SUBJECT MAY BE RAISED AGAIN in the same
    # stop-chain. The budget used to be one hold per CHAIN: an agent held once, that then
    # answered and worked for nine minutes, met a stop where every subject it needed was
    # already marked raised, and stopped in silence — the longer the stretch, the more
    # certain the silence. A subject that never yields is no good either (it starves the
    # queue), so the line between nagging and the next stop after real work is progress,
    # measured in transcript lines. 0 restores one hold per chain.
    "hold_again_after_lines": 25,

    # HOW OFTEN AN IDLE AUTO SESSION IS WOKEN. With auto on, the agent is asked to keep a
    # loop running that prompts `journal next` at this interval, so a session left alone
    # comes back and carries on until nothing is left it can do. Minutes; 0 asks for none.
    "auto_loop_minutes": 15,

    # ONE LIVE SESSION PER ENVIRONMENT. A second session that starts on an environment another running
    # session holds is told at its start, held at its stops and refused edits until it has
    # switched; a switch onto a taken environment is refused. false lets sessions share an environment.
    "one_session_per_environment": True,

    # After this many hours without a hook event a bound session counts as gone — a
    # terminal closed without a SessionEnd — and its environment is free again.
    "session_stale_hours": 24.0,
    # How often, at most, a session runs the mechanical cleanup pass itself and says what it found. 0 turns it off.
    "cleanup_every_minutes": 60,
    # How many suggestions may wait on the user's decision per environment; one more is refused.
    "suggestion_max_open": 5,

    # THE ORDER OF THE STOP QUEUE, by subject: lower runs first. {"work": 1} puts open work
    # at the head. The defaults are NOT restated here — a list in a comment beside a
    # registry it does not read is a list that drifts, and this one had: it named seven of
    # the nine subjects, omitting `claimed`, which runs FIRST. `journal settings` prints the
    # order in force, from the registry itself.
    "stop_priority": {},

    # WHERE THE PROJECT'S DOCS LIVE, relative to the project root. The journal catalogues
    # what is there rather than keeping a store of its own: a knowledge base beside the
    # docs the humans read is one that drifts from them.
    "docs_dir": ".journal/docs",

    # THE WINDOW THE LADDER IS CLIMBED AGAINST, as an OVERRIDE. 0 means learn it: from the
    # peak once it rules out every window but one, or at the first compaction, whose peak
    # is the window. Until then the ladder stays silent.
    # It is not inferred from the smallest window that fits: that reported 54% at 108k
    # tokens of a 1M window and burned every rung before 20%, after which the ladder was
    # mute for the real compaction. `journal verify` says when this is unset.
    "context_window": 1_000_000,


    # Reminders to silence, by name, e.g. ["quiet"]. "viewer" is in here too: it stops the
    # journal putting the web viewer back up at a stop when it has gone away, for somebody who
    # closed it on purpose and does not want it resurrected.
    "silenced": [],
}

PATH = "settings.json"


MESSAGES = {
    "bad_json": "{path}: not valid JSON ({error}) — every default is in force",
    "not_object": "{path}: expected an object — every default is in force",
    "unknown": "{path}: unknown setting {key} — it does nothing",
    "wants": "{path}: {key} wants {kind}, got {value} — default kept",
    "kind_bool": "true/false",
    "kind_number": "a number",
    "kind_list": "a list",
    "kind_object": "an object",
    "project_only": "{key} belongs to the project, not to one environment — it describes where things "
                    "live or how environments themselves behave, so one environment cannot answer it "
                    "differently from another",
    "not_overridden": "{key} is not set on {env}; it is the project's already",
    "overridden": "{key} is {value} on {env}, {was} for the project",
    "gave_back": "{key} on {env} is back to the project's {was}",
}

def say(message: str, /, **values) -> str:
    return fill(MESSAGES[message], **values)


#: what this journal answers to per ENVIRONMENT, and what it can only answer to once.
#: A SETTING IS OVERRIDABLE UNLESS IT DESCRIBES THE PROJECT OR THE MACHINE. Where the docs live
#: is one folder for everyone; whether a session starts bound, and whether two may share an
#: environment, are rules ABOUT environments and cannot be decided inside one; how long a session
#: counts as alive is a fact about this machine's clock. Everything else — how loud the nudges
#: are, what is silenced, how a to-do list behaves — is a property of a line of work.
PROJECT_ONLY = frozenset(("docs_dir", "bind_on_start", "one_session_per_environment",
                          "session_stale_hours", "context_window", "channel_reach_now"))

#: the environment's disagreement with the project's settings, as a patch of keys
OVERRIDES = "setting_overrides"


def overridable(key: str) -> bool:
    return key in DEFAULTS and key not in PROJECT_ONLY


def load(root: Path, env: str | None = None) -> tuple[dict, list[str]]:
    out, problems = _project(root)
    if env:
        for key, value in _here(root, env).items():
            if overridable(key):
                out[key] = value
    return out, problems


def overrides(root: Path, env: str) -> dict:
    return {k: v for k, v in _here(root, env).items() if overridable(k)}


def override(root: Path, env: str, key: str, value, off: bool = False) -> tuple[bool, str]:
    import state
    key = ALIASES.get(key, key)
    if key not in DEFAULTS:
        return False, say("unknown", path=PATH, key=repr(key))
    if key in PROJECT_ONLY:
        return False, say("project_only", key=key)
    with state.locked(root):
        got = _here(root, env)
        if off:
            if key not in got:
                return False, say("not_overridden", key=key, env=env)
            got.pop(key)
        else:
            if not isinstance(value, type(DEFAULTS[key])) or (isinstance(DEFAULTS[key], bool) and not isinstance(value, bool)):
                if not (isinstance(DEFAULTS[key], float) and isinstance(value, (int, float))):
                    return False, say("wants", path=env, key=key, kind=_kind_of(key), value=repr(value))
            got[key] = value
        state.put_tracked(root, OVERRIDES, env, got)
    was = _project(root)[0][key]
    return True, (say("gave_back", key=key, env=env, was=was) if off
                  else say("overridden", key=key, env=env, value=value, was=was))


def _kind_of(key: str) -> str:
    want = type(DEFAULTS[key])
    return say({bool: "kind_bool", int: "kind_number", float: "kind_number",
                list: "kind_list", dict: "kind_object"}.get(want, "kind_object"))


def _here(root: Path, env: str) -> dict:
    import state
    got = state.tracked(root, OVERRIDES, env, {})
    return dict(got) if isinstance(got, dict) else {}


def _project(root: Path) -> tuple[dict, list[str]]:
    out = dict(DEFAULTS)
    problems: list[str] = []
    f = root / PATH
    if not f.is_file():
        return out, problems
    try:
        data = json.loads(f.read_text())
    except ValueError as e:
        return out, [say("bad_json", path=PATH, error=e)]
    if not isinstance(data, dict):
        return out, [say("not_object", path=PATH)]
    for key, value in data.items():
        # JSON has no comments and everybody writes them anyway. A `//` key is a note to
        # the next reader, not a setting, so it is neither applied nor complained about.
        if key.startswith("//"):
            continue
        key = ALIASES.get(key, key)   # an older name for a setting still works
        if key not in DEFAULTS:
            problems.append(say("unknown", path=PATH, key=repr(key)))
            continue
        want = type(DEFAULTS[key])
        if want is bool and not isinstance(value, bool):
            problems.append(say("wants", path=PATH, key=key, kind=say("kind_bool"), value=repr(value)))
            continue
        if want is float and not isinstance(value, (int, float)):
            problems.append(say("wants", path=PATH, key=key, kind=say("kind_number"), value=repr(value)))
            continue
        if want is int and not isinstance(value, int):
            problems.append(say("wants", path=PATH, key=key, kind=say("kind_number"), value=repr(value)))
            continue
        if want is list and not isinstance(value, list):
            problems.append(say("wants", path=PATH, key=key, kind=say("kind_list"), value=repr(value)))
            continue
        if want is dict and not isinstance(value, dict):
            problems.append(say("wants", path=PATH, key=key, kind=say("kind_object"), value=repr(value)))
            continue
        out[key] = value
    return out, problems
