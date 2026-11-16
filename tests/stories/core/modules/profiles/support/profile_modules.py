from engine.helper_type.command_allow_list import CommandAllowList
from engine.enums.access import Access
from engine.agent_machine.driver import Driver
from core.modules.drivers.drivers.helper.helper_agent_driver import HelperAgentDriver
from engine.enums.work_stop import WorkStop
from engine.helper_type.helper_type import HelperType
from core.modules.helpers.types.helper import Helper
from engine.module.suite import Suite
from engine.module.module import Module
from engine.profile.agent_profile import AgentProfile
from suites.coding.coding_suite import CodingSuite
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE


class MissingProfileClerk(Helper):
    key = "clerk"
    label = "Clerk"
    default_profile = "missing-profile"


class ReaderProfileClerk(HelperType):
    key = "clerk"
    label = "Clerk"
    default_profile = "module-reader"
    behaviours = Helper.behaviours
    commands = CommandAllowList()


class SampleProfileClerk(Helper):
    key = "clerk"
    label = "Clerk"
    default_profile = "sample-clerk"


class ProfileModule(Module):
    name = "sample.profiles"
    requires_engine = ">=6,<7"
    dependencies = ["journal.core.agents"]
    profiles = [AgentProfile("module-reader", "Reads one question", "Read the files.", agent_type="helper")]


class DuplicateProfile(ProfileModule):
    profiles = [AgentProfile(f"{RESEARCHER_PROFILE.name}", "Another researcher", "Read.")]


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
    helper_types = [MissingProfileClerk]


class WrongDefaultType(ProfileModule):
    helper_types = [ReaderProfileClerk]


class LegacySuite(Suite):
    name = "legacy-profiles"
    profiles = [AgentProfile("legacy-reader", "Reads", "Read.")]


class LegacyProfiles(ProfileModule):
    """Ships the legacy suite, which lists it."""


class ClerkDriver(Driver):
    """Drives the sample's clerk."""

    name = "coding.clerk"
    suite = CodingSuite.name
    agent_type = "clerk"
    gathers = [HelperAgentDriver]
    rank_order = HelperAgentDriver.rank_order
    work_stop = WorkStop.JOB_REPORT


class ClerkModule(Module):
    name = "sample.clerks"
    requires_engine = ">=6,<7"
    dependencies = ["journal.core.agents", "journal.suites.coding"]
    helper_types = [SampleProfileClerk]
    profiles = [AgentProfile("sample-clerk", "Reads contracts", "Read the contracts.", agent_type="clerk", model="sonnet", codex_model="gpt-6.1-terra")]
    agent_drivers = [ClerkDriver]


class LegacySuiteOfLegacyProfiles(LegacySuite):
    modules = [LegacyProfiles]


class ClerkModuleJoining(Suite):
    name = "sample.clerks"
    joins = "coding"
    modules = [ClerkModule]


class BasedProfiles(ProfileModule):
    """A base profile and one built on it, which adds its own lines and its own model."""

    profiles = [AgentProfile("sample-base", "The shared body", "Read the files.", agent_type="helper", model="sonnet", skills=("journal",)),
                AgentProfile("sample-based", "Reads and answers", "Answer in one line.", base="sample-base", agent_type="helper", model="opus")]


class ChangedBase(BasedProfiles):
    """The same two profiles after the text of the base changed."""

    profiles = [AgentProfile("sample-base", "The shared body", "Read the files twice.", agent_type="helper", model="sonnet", skills=("journal",)),
                AgentProfile("sample-based", "Reads and answers", "Answer in one line.", base="sample-base", agent_type="helper", model="opus")]


class MissingBase(ProfileModule):
    profiles = [AgentProfile("module-reader", "Reads", "Read.", base="no-such-base")]


class LoopingBases(ProfileModule):
    profiles = [AgentProfile("module-reader", "Reads", "Read.", base="module-writer"), AgentProfile("module-writer", "Writes", "Write.", base="module-reader")]
