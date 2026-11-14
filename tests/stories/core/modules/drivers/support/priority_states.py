from collections.abc import Sequence

from engine.driver.agent_hook import AgentHook
from engine.driver.agent_state import AgentState, StateTier
from engine.driver.driver_rule import DriverRule
from engine.driver.nudge import Nudge
from engine.driver.open_row import OpenRow
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from engine.enums.nudge_type import NudgeType
from engine.module.module import Module
from engine.module.suite import Suite

PATH = "tests.stories.core.modules.drivers.support.priority_states"
REFUSAL = Nudge("acme.critical_held", NudgeType.REFUSAL, "the critical sample holds the agent")


class SampleRule(DriverRule):
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def answer(self, hook):
        return RuleAnswer.allowed()


class FirstCriticalRule(SampleRule):
    name = "acme.first-critical"


class SecondCriticalRule(SampleRule):
    name = "acme.second-critical"


class StackedRule(SampleRule):
    name = "acme.stacked"


class HoldingRule(SampleRule):
    name = "acme.holding"

    def answer(self, hook):
        return RuleAnswer.refused(REFUSAL)


class AfterHoldRule(SampleRule):
    name = "acme.after-hold"


class OpenState(AgentState):
    """A state that is open for every hook."""

    def open_rows(self, hook: AgentHook) -> Sequence[OpenRow]:
        return [OpenRow("acme", 1, hook.timestamp)]


class FirstCritical(OpenState):
    name = "acme.first-critical"
    tier = StateTier.CRITICAL
    rules = [FirstCriticalRule]


class SecondCritical(OpenState):
    name = "acme.second-critical"
    tier = StateTier.CRITICAL
    rules = [SecondCriticalRule]


class Stacked(OpenState):
    name = "acme.stacked"
    tier = StateTier.STACK
    rules = [StackedRule]


class Holding(OpenState):
    name = "acme.holding"
    tier = StateTier.CRITICAL
    rules = [HoldingRule]


class AfterHold(OpenState):
    name = "acme.after-hold"
    tier = StateTier.STACK
    rules = [AfterHoldRule]


class OrderModule(Module):
    name = "acme.order"
    requires_engine = ">=5,<6"
    dependencies = ["journal.suites.coding"]
    agent_states = [FirstCritical, SecondCritical, Stacked]


class HoldModule(Module):
    name = "acme.hold"
    requires_engine = ">=5,<6"
    dependencies = ["journal.suites.coding"]
    agent_states = [Holding, AfterHold]


class OrderModuleJoining(Suite):
    name = "acme.order"
    joins = "coding"
    modules = [OrderModule]


class HoldModuleJoining(Suite):
    name = "acme.hold"
    joins = "coding"
    modules = [HoldModule]
