import json
import time
from dataclasses import dataclass
from pathlib import Path

from engine.command_line import command_line
from engine import bus
from events.answers import Refused
from events.asking import AgentDispatching, ToolCallAsked
from engine.journal_calls import JournalCall, pieces
from framework import command_effects
from engine import runtime
from engine.gates import HookCall
from declaring.reach import Reach
from resources.base import AGENT

PAUSED = "The user paused the agent: wait, and carry on only once you are resumed."
PAUSED_FOR_UPDATE = "The journal is updating and has paused you: start no command, wait, and carry on only once you are told to continue."
PAUSE = Reach.BOTH
EXPANDING = ("$", "`", "<<")
ANSWERED, KEPT_ANSWERED = "answers_ran", 200
ANSWERING = frozenset({("message", "reply"), ("message", "react"), ("message", "read"), ("message", "unread"), ("message", "process"), ("message", "processed"),
                       ("message", "tag"), ("todo", "create")})


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


def paused(call: HookCall) -> bool:
    return bool(call.row.paused) and PAUSE.reaches(call.subagent)


def updating(call: HookCall) -> bool:
    """Whether the journal updates now: the agent waits exactly as long as the update's own mark stands, with nothing written to its row."""
    return PAUSE.reaches(call.subagent) and runtime.upgrading(call.record.root)


def gated(call: HookCall) -> str | None:
    dispatch = call.provider.dispatch(call.hook.tool, call.record.root.parent)
    reason = dispatch_refused(call, dispatch) if dispatch else None
    return reason or refused_by_a_feature(call)


def refused_by_a_feature(call: HookCall) -> str | None:
    """Why a swept feature's answerer refused the call, asked as the engine's request."""
    tool = call.hook.tool
    asked = bus.asked(ToolCallAsked(tool=tool.name, input=input_of(tool), command=tool.shell_command or "", session=call.session, cwd=call.hook.cwd, paths=tuple(tool.paths), writings=tuple(one for one in tool.writings if one), subagent=call.subagent,
                                    writes=command_effects.writes(call.hook), background=tool.background),
                      call.record)
    return asked.why if isinstance(asked, Refused) else None


def dispatch_refused(call: HookCall, dispatch) -> str | None:
    """Why a swept feature's answerer refused the dispatch, asked with the dispatch as the provider read it."""
    asked = bus.asked(AgentDispatching(session=call.session, subagent=call.subagent, kind=dispatch.kind, model=dispatch.model or "",
                                       model_supported=dispatch.model_supported, models=tuple(dispatch.models), name_supported=dispatch.name_supported,
                                       description=dispatch.description, task=dispatch.task, prompt=dispatch.prompt, read_only=dispatch.read_only), call.record)
    return asked.why if isinstance(asked, Refused) else None


def input_of(tool) -> str:
    """What a tool call asks, as the engine names it: a shell call by its command, any other by its input."""
    return tool.shell_command or json.dumps(tool.tool_input, sort_keys=True)


def refusal(call: HookCall) -> str | None:
    if paused(call):
        return PAUSED
    if updating(call):
        return PAUSED_FOR_UPDATE
    why = gated(call)
    if why is None:
        return None
    line = ShellLine.of(call.hook.tool.commands)
    if line.is_answering_only or reads_a_message_file(call):
        return None
    return why if call.subagent else f"{why}{alongside(call, line)}"


@dataclass(frozen=True)
class Ran:
    """A journal command the gate ran in the agent's place, and what it printed, so a refused line still hands back what it asked for."""

    journal: JournalCall
    printed: str = ""
    ok: bool = False

    @classmethod
    def before(cls, journal: JournalCall) -> "Ran":
        """One that ran on an earlier try of the same call, whose output the agent already has."""
        return cls(journal, ok=True)


def reads_a_message_file(call: HookCall) -> bool:
    """Whether the call only reads files the user attached to a message. A picture cannot be weighed without opening it, so a hold on answering, which stops reading as well as writing, never stops that."""
    from controllers.types import Messages
    paths = call.hook.tool.paths
    if not paths or call.hook.tool.writings:
        return False
    attached = Messages(call.record).rows.folder()
    return all(attached in Path(path).parents for path in paths)


def run_answer(call: HookCall, journal: JournalCall) -> Ran:
    cwd = ("--cwd", call.hook.cwd) if call.hook.cwd else ()
    printed, code = command_line().captured(["--env", call.record.env, "--session", call.session, "--as", AGENT, *cwd, *journal.words[1:]], call.record.root)
    return Ran(journal, printed.strip(), code == 0)


def ran_already(call: HookCall, journal: JournalCall) -> bool:
    """Whether this very command of this very call ran before: the refusal of a call comes more than once when the agent tries it again."""
    return call.record.state(ANSWERED, call.session).get(answered_key(call, journal)) is not None


def answered_key(call: HookCall, journal: JournalCall) -> str:
    return f"{call.hook.tool_use}:{journal.line}"


def answered(call: HookCall, journal: JournalCall) -> Ran:
    """Runs a command the refusal answers in the call's place, and keeps that it ran only when it did, so a command that failed is tried again and never listed as run."""
    if ran_already(call, journal):
        return Ran.before(journal)
    ran = run_answer(call, journal)
    if ran.ok:
        call.record.state(ANSWERED, call.session).claim(answered_key(call, journal), time.time(), keep=KEPT_ANSWERED)
    return ran


def alongside(call: HookCall, line: ShellLine) -> str:
    answering = [journal for journal in line.calls if line.runnable and answers(journal) and call.hook.tool_use]
    done = [ran for ran in (answered(call, journal) for journal in answering) if ran.ok]
    left = [journal for journal in line.calls if journal not in [ran.journal for ran in done]]
    said = "\n\n".join(f"{ran.journal.line}:\n{ran.printed}" for ran in done if ran.printed)
    return "".join([f" — these journal commands on the same line ran, so do not run them again: {'; '.join(ran.journal.line for ran in done)}" if done else "",
                    f" — and these were on the same line, so they did not run either: {'; '.join(j.line for j in left)}" if left else "",
                    f"\n\n{said}" if said else ""])
