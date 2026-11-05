from core.base.access import Access
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver import Driver
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.agent_type import AgentType
from core.base.driver.suite import Suite
from core.base.module.module import Module
from core.base.profile.agent_profile import AgentProfile
from suites.coding.coding_suite import CodingSuite


class ProfileModule(Module):
    name = "sample.profiles"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.agents"]
    profiles = [AgentProfile("module-reader", "Reads one question", "Read the files.", agent_type="helper")]


class DuplicateProfile(ProfileModule):
    profiles = [AgentProfile("journal-researcher", "Another researcher", "Read.")]


class UnknownType(ProfileModule):
    profiles = [AgentProfile("module-reader", "Reads", "Read.", agent_type="missing-type")]


class WritingProfile(ProfileModule):
    profiles = [AgentProfile("module-reader", "Writes", "Write.", access=Access.WRITING)]


class MissingDescription(ProfileModule):
    profiles = [AgentProfile("module-reader", " ", "Read.")]


class MissingBody(ProfileModule):
    profiles = [AgentProfile("module-reader", "Reads", " ")]


class InvalidName(ProfileModule):
    profiles = [AgentProfile("bad name", "Reads", "Read.")]


class MissingDefault(ProfileModule):
    agent_types = [AgentType("clerk", "Clerk", extends="helper", default_profile="missing-profile")]


class WrongDefaultType(ProfileModule):
    agent_types = [AgentType("clerk", "Clerk", extends="helper", default_profile="module-reader")]


class LegacySuite(Suite):
    name = "legacy-profiles"
    profiles = [AgentProfile("legacy-reader", "Reads", "Read.")]


class LegacyProfiles(ProfileModule):
    suites = [LegacySuite]


class ClerkRule(DriverRule):
    """A clerk reads and edits nothing else: the sample's rule on its own agent type."""

    name = "sample.clerk-rule"
    hook = HookEventName.PRE_TOOL_USE

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed()


class ClerkDriver(Driver):
    """Drives the sample's clerk."""

    name = "coding.clerk"
    suite = CodingSuite
    role = "clerk"
    rules = [ClerkRule]


class ClerkModule(Module):
    name = "sample.clerks"
    requires_core = ">=5,<6"
    parent_suite = "coding"
    dependencies = ["journal.core.agents", "journal.suites.coding"]
    agent_types = [AgentType("clerk", "Clerk", extends="helper", default_profile="sample-clerk")]
    profiles = [AgentProfile("sample-clerk", "Reads contracts", "Read the contracts.", agent_type="clerk", model="sonnet", codex_model="gpt-6.1-terra")]
    drivers = [ClerkDriver]
