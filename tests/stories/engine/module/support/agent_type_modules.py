from engine.helper_type.command_allow_list import CommandAllowList
from engine.enums.access import Access
from engine.agent.agent_roster import AgentRoster
from engine.helper_type.helper_type import HelperType
from core.modules.helpers.types.helper import Helper
from engine.agent_machine.driver import Driver
from core.modules.drivers.drivers.helper.helper_agent_driver import HelperAgentDriver
from engine.enums.work_stop import WorkStop
from engine.module.suite import Suite
from engine.module.module import Module


class ClerkRoster(AgentRoster):
    def available(self, environment_id: int) -> tuple:
        return ()


class ClerkHelper(Helper):
    key = "clerk"
    label = "Clerk"
    roster = ClerkRoster


class DuplicateMainType(HelperType):
    key = "main"
    label = "Duplicate main"
    commands = CommandAllowList()


class InvalidKeyType(HelperType):
    key = "Clerk_1"
    label = "Clerk"
    commands = CommandAllowList()


class UnlabelledClerk(HelperType):
    key = "clerk"
    label = " "
    commands = CommandAllowList()


class StringRosterClerk(HelperType):
    key = "clerk"
    label = "Clerk"
    roster = str
    commands = CommandAllowList()


class MissingBaseType(HelperType):
    key = "missing-base"
    label = "Missing base"
    behaviours = Helper.behaviours
    commands = CommandAllowList()


class MissingBaseClerk(MissingBaseType):
    key = "clerk"
    label = "Clerk"


class WritingClerk(Helper):
    key = "clerk"
    label = "Clerk"
    access = Access.WRITING


class WritingAssistant(ClerkHelper):
    key = "assistant"
    label = "Assistant"
    access = Access.WRITING


class SuiteClerk(HelperType):
    key = "suite-clerk"
    label = "Suite clerk"
    behaviours = Helper.behaviours
    commands = CommandAllowList()


class Clerk(Module):
    name = "sample.clerk"
    requires_engine = ">=6,<7"
    dependencies = ["journal.core.agents"]
    helper_types = [ClerkHelper]


class Duplicate(Clerk):
    name = "sample.duplicate"
    helper_types = [DuplicateMainType]


class InvalidKey(Clerk):
    helper_types = [InvalidKeyType]


class MissingLabel(Clerk):
    helper_types = [UnlabelledClerk]


class MissingDependency(Clerk):
    dependencies = []


class InvalidRoster(Clerk):
    helper_types = [StringRosterClerk]


class UnknownBase(Clerk):
    helper_types = [MissingBaseClerk]


class WritingHelper(Clerk):
    helper_types = [WritingClerk]


class WritingDescendant(Clerk):
    helper_types = [ClerkHelper, WritingAssistant]


class SampleSuite(Suite):
    name = "sample"


class UnknownDriver(Driver):
    name = "sample.unknown"
    suite = SampleSuite.name
    agent_type = "missing-driver-role"
    gathers = [HelperAgentDriver]
    rank_order = HelperAgentDriver.rank_order
    work_stop = WorkStop.JOB_REPORT


class DriverRole(Clerk):
    agent_drivers = [UnknownDriver]


class HelperTypeSuite(Suite):
    name = "sample-helpers"
    helper_types = [SuiteClerk]


class SuiteRegistersHelperType(Clerk):
    """Ships the suite that lists it."""


class SampleSuiteOfDriverRole(SampleSuite):
    modules = [DriverRole]




class HelperTypeSuiteOfSuiteRegistersHelperType(HelperTypeSuite):
    modules = [SuiteRegistersHelperType]
