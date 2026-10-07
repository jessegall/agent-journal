import time
from dataclasses import dataclass

from engine.command_line import command_line
from engine import bus
from engine.journal_calls import JournalCall, pieces
from engine.gates import AFTERWARDS, DISPATCHING, POLICIES, HookCall, cancelled
from engine.reach import Reach
from resources.base import AGENT

PAUSED = "The user paused the agent: wait, and carry on only once you are resumed."
PAUSE = Reach.BOTH
EXPANDING = ("$", "`", "<<")
ANSWERED, KEPT_ANSWERED = "answers_ran", 200
ANSWERING = frozenset({("message", "reply"), ("message", "react"), ("message", "read"), ("message", "process"), ("message", "processed"), ("todo", "create")})


def answers(journal: JournalCall) -> bool:
    return journal.command in ANSWERING and journal.plain and not journal.options


@dataclass(frozen=True)
class ShellLine:
    calls: tuple[JournalCall, ...]
    others: int
    runnable: bool

    @classmethod
    def of(cls, shells: tuple) -> "ShellLine":
        found = [piece for shell in shells for piece in pieces(shell)]
        calls = tuple(JournalCall(piece) for piece in found if piece[0] == "journal")
        return cls(calls, len(found) - len(calls), not any(mark in shell for shell in shells for mark in EXPANDING))

    @property
    def is_answering_only(self) -> bool:
        return self.runnable and bool(self.calls) and not self.others and all(answers(call) for call in self.calls)


def serving(policy, call: HookCall) -> bool:
    return policy.guard.reaches(call.subagent)


def paused(call: HookCall) -> bool:
    return bool(call.row.paused) and PAUSE.reaches(call.subagent)


def gated(call: HookCall) -> str | None:
    dispatch = call.provider.dispatch(call.hook.tool, call.record.root.parent)
    reason = cancelled(DISPATCHING, call, dispatch) if dispatch else None
    bus.defer(lambda: [policy(call) for policy in AFTERWARDS.each() if serving(policy, call)])
    return reason or next((reason for policy in POLICIES.each() if serving(policy, call) and (reason := policy(call))), None)


def refusal(call: HookCall) -> str | None:
    if paused(call):
        return PAUSED
    why = gated(call)
    if why is None:
        return None
    line = ShellLine.of(call.hook.tool.commands)
    if line.is_answering_only:
        return None
    return why if call.subagent else f"{why}{alongside(call, line)}"


def run_answer(call: HookCall, journal: JournalCall) -> bool:
    cwd = ("--cwd", call.hook.cwd) if call.hook.cwd else ()
    _, code = command_line().captured(["--env", call.record.env, "--session", call.session, "--as", AGENT, *cwd, *journal.words[1:]], call.record.root)
    return code == 0


def first_try(call: HookCall) -> bool:
    return call.record.state(ANSWERED, call.session).claim(call.hook.tool_use, time.time(), keep=KEPT_ANSWERED)


def alongside(call: HookCall, line: ShellLine) -> str:
    answering = [journal for journal in line.calls if line.runnable and answers(journal) and call.hook.tool_use]
    retried = bool(answering) and not first_try(call)
    done = [journal for journal in answering if retried or run_answer(call, journal)]
    left = [journal for journal in line.calls if journal not in done]
    return "".join([f" — these journal commands on the same line ran, so do not run them again: {'; '.join(j.line for j in done)}" if done else "",
                    f" — and these were on the same line, so they did not run either: {'; '.join(j.line for j in left)}" if left else ""])
