from engine.driver.agent_state import AgentState
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from engine.module.module import Module
from engine.module.suite import Suite

PATH = "tests.stories.core.modules.drivers.support.agent_state_modules"


class GatedRule(DriverRule):
    name = "acme.gated"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def answer(self, hook):
        return RuleAnswer.allowed()


class AcmeState(AgentState):
    name = "acme.state"
    rules = [GatedRule]


class StateModule(Module):
    name = "acme.states"
    requires_core = ">=5,<6"
    dependencies = ["journal.suites.coding"]
    agent_states = [AcmeState]


class StateModuleJoining(Suite):
    name = "acme.states"
    joins = "coding"
    modules = [StateModule]
