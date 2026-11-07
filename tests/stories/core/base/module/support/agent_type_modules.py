from core.base.access import Access
from core.base.agent_policy import AgentPolicy
from core.base.agent_roster import AgentRoster
from core.base.agent_type import AgentType
from core.base.driver.driver import Driver
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.suite import Suite
from core.base.module.module import Module


class ClerkRoster(AgentRoster):
    def available(self, environment_id: int) -> tuple:
        return ()


class Clerk(Module):
    name = "sample.clerk"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.agents"]
    agent_types = [AgentType("clerk", "Clerk", extends="helper", roster=ClerkRoster)]


class Duplicate(Clerk):
    name = "sample.duplicate"
    agent_types = [AgentType("main", "Duplicate main")]


class InvalidKey(Clerk):
    agent_types = [AgentType("Clerk_1", "Clerk")]


class MissingLabel(Clerk):
    agent_types = [AgentType("clerk", " ")]


class MissingDependency(Clerk):
    dependencies = []


class InvalidRoster(Clerk):
    agent_types = [AgentType("clerk", "Clerk", roster=str)]


class UnknownBase(Clerk):
    agent_types = [AgentType("clerk", "Clerk", extends="missing-base")]


class Loop(Clerk):
    agent_types = [AgentType("clerk", "Clerk", extends="assistant"), AgentType("assistant", "Assistant", extends="clerk")]


class WritingHelper(Clerk):
    agent_types = [AgentType("clerk", "Clerk", extends="helper", access=Access.WRITING)]


class WritingDescendant(Clerk):
    agent_types = [AgentType("clerk", "Clerk", extends="helper"),
                   AgentType("assistant", "Assistant", extends="clerk", access=Access.WRITING)]


class SampleSuite(Suite):
    name = "sample"


class UnknownDriver(Driver):
    name = "sample.unknown"
    suite = SampleSuite
    role = "missing-driver-role"


class DriverRole(Clerk):
    suites = [SampleSuite]
    drivers = [UnknownDriver]


class DefaultSuite(SampleSuite):
    defaults = {"missing-default-role": "sample.unknown"}


class DefaultRole(DriverRole):
    suites = [DefaultSuite]


class PolicySuite(SampleSuite):
    agent_policy = AgentPolicy(job_roles=tuple(["missing-policy-role"]))


class PolicyRole(Clerk):
    suites = [PolicySuite]


class UnknownRule(DriverRule):
    name = "sample.rule"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = ["missing-rule-role"]


class RuleRole(Clerk):
    driver_rules = [UnknownRule]
