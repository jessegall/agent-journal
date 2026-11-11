from engine.enums.agent_role import AgentRole
from engine.enums.command_category import CommandCategory
from engine.driver.driver import Driver
from engine.module.suite import Suite
from engine.enums.tool_type import ToolType
from engine.module.module import Module
from core.modules.drivers.rules.allowed_command_types_rule import AllowedCommandTypesRule
from core.modules.drivers.rules.allowed_tools_rule import AllowedToolsRule
from core.modules.drivers.rules.denied_programs_rule import DeniedProgramsRule
from core.modules.drivers.rules.journal_commands_rule import JournalCommandsRule
from core.modules.drivers.rules.no_full_test_run_rule import NoFullTestRunRule
from core.modules.drivers.rules.no_git_rule import NoGitRule
from core.modules.drivers.rules.no_shell_rule import NoShellRule
from core.modules.drivers.rules.read_write_rule import ReadWriteRule
from core.modules.drivers.rules.readonly_rule import ReadonlyRule
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.engine.driver.support.hook_agents import hook_agent
from tests.stories.core.support.fixtures import MainEnvironment

ACCESS_MODULE = "tests.stories.core.modules.drivers.support.access_rules:AccessModule"


class AccessSuite(Suite):
    name = "access"
    defaults = {AgentRole.MAIN: "access.reader"}
    complete_control = True


class AccessDriver(Driver):
    name = "access.base"
    suite = AccessSuite
    role = AgentRole.MAIN


class ReaderDriver(AccessDriver):
    name = "access.reader"
    rules = [ReadonlyRule]


class WriterDriver(AccessDriver):
    name = "access.writer"
    rules = [ReadWriteRule]


class JournalDriver(AccessDriver):
    name = "access.journal"
    rules = [JournalCommandsRule]


class NoShellDriver(AccessDriver):
    name = "access.no-shell"
    rules = [NoShellRule]


class NoGitDriver(AccessDriver):
    name = "access.no-git"
    rules = [NoGitRule]


class FileTestsDriver(AccessDriver):
    name = "access.named-tests"
    rules = [NoFullTestRunRule]


class ReadToolRule(AllowedToolsRule):
    name = "access.read-tool"
    allowed_tools = [ToolType.READ]
    allowed_commands = ()


class ReadToolDriver(AccessDriver):
    name = "access.read-tool"
    rules = [ReadToolRule]


class ReadCommandsRule(AllowedCommandTypesRule):
    name = "access.read-commands"
    allowed_commands = (CommandCategory.READ, CommandCategory.SEARCH)


class ReadCommandsDriver(AccessDriver):
    name = "access.read-commands"
    rules = [ReadCommandsRule]


class NoCurlRule(DeniedProgramsRule):
    name = "access.no-curl"
    denied_programs = ["curl"]


class NoCurlDriver(AccessDriver):
    name = "access.no-curl"
    rules = [NoCurlRule]


class UnrestrictedDriver(AccessDriver):
    name = "access.unrestricted"


class AccessModule(Module):
    name = "samples.access"
    requires_core = ">=5.0,<6"
    dependencies = ["journal.core.drivers"]
    suites = [AccessSuite]
    drivers = [ReaderDriver, WriterDriver, JournalDriver, NoShellDriver, NoGitDriver,
               FileTestsDriver, ReadToolDriver, ReadCommandsDriver, NoCurlDriver, UnrestrictedDriver]


class AccessStarted(StoryFixture):
    parent = MainEnvironment

    def steps(self, story):
        story.expect_success("suite choose access --environment main")
        story.agent = hook_agent(story, story.hook("s-1", HookSamples.session_start()))
