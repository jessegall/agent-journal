from engine.enums.access import Access
from engine.agent.agent_policy import AgentPolicy
from engine.enums.agent_role import AgentRole
from engine.agent.agent_roster import AgentRoster
from engine.driver.agent_hook import AgentHook
from engine.driver.rule_answer import RuleAnswer
from engine.enums.role_group import RoleGroup
from engine.helper_type.helper_type import HelperType
from engine.driver.driver import Driver
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.suite import Suite
from engine.module.module import Module


class ClerkRoster(AgentRoster):
    def available(self, environment_id: int) -> tuple:
        return ()


class Clerk(Module):
    name = "sample.clerk"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.agents"]
    helper_types = [HelperType("clerk", "Clerk", extends="helper", roster=ClerkRoster)]


class Duplicate(Clerk):
    name = "sample.duplicate"
    helper_types = [HelperType("main", "Duplicate main")]


class InvalidKey(Clerk):
    helper_types = [HelperType("Clerk_1", "Clerk")]


class MissingLabel(Clerk):
    helper_types = [HelperType("clerk", " ")]


class MissingDependency(Clerk):
    dependencies = []


class InvalidRoster(Clerk):
    helper_types = [HelperType("clerk", "Clerk", roster=str)]


class UnknownBase(Clerk):
    helper_types = [HelperType("clerk", "Clerk", extends="missing-base")]


class Loop(Clerk):
    helper_types = [HelperType("clerk", "Clerk", extends="assistant"), HelperType("assistant", "Assistant", extends="clerk")]


class WritingHelper(Clerk):
    helper_types = [HelperType("clerk", "Clerk", extends="helper", access=Access.WRITING)]


class WritingDescendant(Clerk):
    helper_types = [HelperType("clerk", "Clerk", extends="helper"),
                   HelperType("assistant", "Assistant", extends="clerk", access=Access.WRITING)]


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


class EveryHelperRule(DriverRule):
    name = "sample.every-helper"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.HELPER]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer(refusal="sample rule holds for every helper")


class EveryHelperRules(Clerk):
    driver_rules = [EveryHelperRule]


class ReaderHelperRule(DriverRule):
    name = "sample.read-only-helper"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    role_group = RoleGroup.HELPERS

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer(refusal="sample rule holds for read-only helpers")


class ReaderHelperRules(Clerk):
    driver_rules = [ReaderHelperRule]


class HelperTypeSuite(Suite):
    name = "sample-helpers"
    helper_types = [HelperType("suite-clerk", "Suite clerk")]


class SuiteRegistersHelperType(Clerk):
    suites = [HelperTypeSuite]
