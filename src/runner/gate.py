import time
from dataclasses import dataclass

from engine.command_line import command_line
from engine import bus
from engine.journal_calls import JournalCall, pieces
from engine.inputs import UPDATE
from engine.gates import AFTERWARDS, DISPATCHING, POLICIES, HookCall, cancelled
from engine.reach import Reach
from resources.base import AGENT

PAUSED = "The user paused the agent: wait, and carry on only once you are resumed."
PAUSED_FOR_UPDATE = "The journal is updating and has paused you: start no command, wait, and carry on only once you are told to continue."
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
    if not (call.row.paused and PAUSE.reaches(call.subagent)):
        return False
    return not outlived(call)


def outlived(call: HookCall) -> bool:
    """A pause for an update that no update is under way for any more and that is older than any update takes: it is cleared here, where the call reads it, so a refusal never outlasts the update that gave it."""
    from controllers.types import Agents
    from engine import runtime
    from features.auto_update.pausing import STALE_PAUSE
    from resources.base import SYSTEM
    if call.row.paused_for != UPDATE or runtime.upgrading(call.record.root) or time.time() - float(call.row.paused) < STALE_PAUSE:
        return False
    Agents(call.record, actor=SYSTEM).update(call.row.n, paused=0, paused_for="")
    return True


def gated(call: HookCall) -> str | None:
    dispatch = call.provider.dispatch(call.hook.tool, call.record.root.parent)
    reason = cancelled(DISPATCHING, call, dispatch) if dispatch else None
    bus.defer(lambda: [policy(call) for policy in AFTERWARDS.each() if serving(policy, call)])
    return reason or next((reason for policy in POLICIES.each() if serving(policy, call) and (reason := policy(call))), None)


def refusal(call: HookCall) -> str | None:
    if paused(call):
        return PAUSED_FOR_UPDATE if call.row.paused_for == UPDATE else PAUSED
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


def ran_already(call: HookCall, journal: JournalCall) -> bool:
    """Whether this very command of this very call ran before: the refusal of a call comes more than once when the agent tries it again."""
    return call.record.state(ANSWERED, call.session).get(answered_key(call, journal)) is not None


def answered_key(call: HookCall, journal: JournalCall) -> str:
    return f"{call.hook.tool_use}:{journal.line}"


def answered(call: HookCall, journal: JournalCall) -> bool:
    """Runs a command the refusal answers in the call's place, and keeps that it ran only when it did, so a command that failed is tried again and never listed as run."""
    if ran_already(call, journal):
        return True
    if not run_answer(call, journal):
        return False
    return call.record.state(ANSWERED, call.session).claim(answered_key(call, journal), time.time(), keep=KEPT_ANSWERED) or True


def alongside(call: HookCall, line: ShellLine) -> str:
    answering = [journal for journal in line.calls if line.runnable and answers(journal) and call.hook.tool_use]
    done = [journal for journal in answering if answered(call, journal)]
    left = [journal for journal in line.calls if journal not in done]
    return "".join([f" — these journal commands on the same line ran, so do not run them again: {'; '.join(j.line for j in done)}" if done else "",
                    f" — and these were on the same line, so they did not run either: {'; '.join(j.line for j in left)}" if left else ""])
