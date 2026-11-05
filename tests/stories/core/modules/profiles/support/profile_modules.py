from core.base.access import Access
from core.base.agent_type import AgentType
from core.base.driver.suite import Suite
from core.base.module.module import Module
from core.base.profile.agent_profile import AgentProfile


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
