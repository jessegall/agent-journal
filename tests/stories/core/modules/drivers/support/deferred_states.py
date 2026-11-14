from collections.abc import Sequence
from dataclasses import dataclass

from engine.command.command import Command
from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.agent_hook import AgentHook
from engine.driver.agent_state import AgentState
from engine.driver.deferred_rule import DeferredRule
from engine.driver.open_row import OpenRow
from engine.enums.hook_event_name import HookEventName
from engine.enums.state_tier import StateTier
from engine.module.module import Module
from engine.module.suite import Suite

PATH = "tests.stories.core.modules.drivers.support.deferred_states"
LINE = "a line for the agent"

# what the deferred commands did, in order; each story clears it first
NOTES: list[str] = []


@dataclass(frozen=True)
class Note(Command[None]):
    """The one command the sample deferred rules answer: it only writes down its text."""

    text: str


class NoteHandler(Handler[Note, None]):
    command = Note

    def handle(self, command: Note, context: Context) -> None:
        NOTES.append(command.text)


class NoteRule(DeferredRule):
    name = "acme.note"
    hook = HookEventName.POST_TOOL_USE

    def after(self, call):
        return [Note("noted")]


class LineRule(DeferredRule):
    name = "acme.line"
    hook = HookEventName.POST_TOOL_USE

    def after(self, call):
        return LINE


class RaisingRule(DeferredRule):
    name = "acme.raising"
    hook = HookEventName.POST_TOOL_USE

    def after(self, call):
        raise RuntimeError("the sample rule broke")


class RefusingRule(NoteRule):
    name = "acme.refusing"
    single_action_refusal = "refuses after the answer"


class OpenDeferred(AgentState):
    """A deferred state that is open for every hook."""

    tier = StateTier.DEFERRED

    def open_rows(self, hook: AgentHook) -> Sequence[OpenRow]:
        return [OpenRow("acme", 1, hook.timestamp)]


class QueueState(OpenDeferred):
    name = "acme.queue"
    deferred = [NoteRule]


class LineState(OpenDeferred):
    name = "acme.line-queue"
    deferred = [LineRule, NoteRule]


class RaisingState(OpenDeferred):
    name = "acme.raising-queue"
    deferred = [RaisingRule, NoteRule]


class RefusingState(OpenDeferred):
    name = "acme.refusing-queue"
    deferred = [RefusingRule]


class QueueModule(Module):
    name = "acme.queue"
    requires_engine = ">=5,<6"
    dependencies = ["journal.suites.coding"]
    agent_states = [QueueState]
    handlers = [NoteHandler]


class LineModule(QueueModule):
    name = "acme.line-queue"
    agent_states = [LineState]
    handlers = [NoteHandler]


class RaisingModule(QueueModule):
    name = "acme.raising-queue"
    agent_states = [RaisingState]
    handlers = [NoteHandler]


class RefusingModule(QueueModule):
    name = "acme.refusing-queue"
    agent_states = [RefusingState]
    handlers = [NoteHandler]


class QueueModuleJoining(Suite):
    name = "acme.queue"
    joins = "coding"
    modules = [QueueModule]


class LineModuleJoining(Suite):
    name = "acme.line-queue"
    joins = "coding"
    modules = [LineModule]


class RaisingModuleJoining(Suite):
    name = "acme.raising-queue"
    joins = "coding"
    modules = [RaisingModule]


class RefusingModuleJoining(Suite):
    name = "acme.refusing-queue"
    joins = "coding"
    modules = [RefusingModule]
