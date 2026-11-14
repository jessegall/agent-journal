from collections.abc import Sequence

from engine.driver.agent_hook import AgentHook
from engine.driver.agent_state import AgentState
from engine.driver.driver_rule import DriverRule
from engine.driver.open_row import OpenRow
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from engine.module.module import Module
from engine.module.suite import Suite

PATH = "tests.stories.core.modules.drivers.support.substate_states"

# whether the parent state is open, and which openers ran, for the story that is running; each story sets and clears them
PARENT_OPEN = [False]
OPENED: list[str] = []


class SampleRule(DriverRule):
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def answer(self, hook):
        return RuleAnswer.allowed()


class ParentRule(SampleRule):
    name = "acme.parent-rule"


class ChildRule(SampleRule):
    name = "acme.child-rule"


class ChildState(AgentState):
    name = "acme.child"
    rules = [ChildRule]

    def open_rows(self, hook: AgentHook) -> Sequence[OpenRow]:
        OPENED.append(self.name)
        return [OpenRow("acme", 2, hook.timestamp)]


class ParentState(AgentState):
    name = "acme.parent"
    rules = [ParentRule]
    substates = [ChildState]

    def open_rows(self, hook: AgentHook) -> Sequence[OpenRow]:
        OPENED.append(self.name)
        return [OpenRow("acme", 1, hook.timestamp)] if PARENT_OPEN[0] else []


class SubstateModule(Module):
    name = "acme.substates"
    requires_engine = ">=5,<6"
    dependencies = ["journal.suites.coding"]
    agent_states = [ParentState]


class SubstateModuleJoining(Suite):
    name = "acme.substates"
    joins = "coding"
    modules = [SubstateModule]
