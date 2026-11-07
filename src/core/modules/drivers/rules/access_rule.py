from core.base.access import Access
from core.base.caller.caller_request import SESSION_VARIABLE
from core.base.cli.shell_handoff import RUNNER_VARIABLE
from core.base.cli.subcommand_lookup import SubcommandLookup
from core.base.cli.usage_error import UsageError
from core.base.driver.agent_hook import AgentHook
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.shell_line import ShellLine
from core.base.driver.tool import Tool
from core.base.driver.tool_type import ToolType
from core.base.provider.providers import Providers
from core.base.query.queries import Queries
from core.base.registry.registry import Registry
from core.modules.agents.models.agent import Agent
from core.modules.drivers.rules.readonly_rule import ReadonlyRule
from core.modules.drivers.support.access_nudges import LIMITED_TOOL, OLD_HOOK_LINE, OUTWARD_JOURNAL_LINE, UNJUDGED_LINE
from core.modules.profiles.support.profile_files import ProfileFiles

MCP_PREFIX = "mcp__"
LIMITED_TOOL_TYPES = (ToolType.QUESTION, ToolType.UNCATEGORISED)

HELP_FLAG = "--help"


class AccessRule(ReadonlyRule):
    """An agent with read-only access reads, searches and runs journal commands, on every program and under every
    overlay; a line no one can judge, and a journal line that reaches past the journal, are refused."""

    name = "drivers.access"
    drivers = ["*"]
    overlay_proof = True
    allowed_tools = (ToolType.READ, ToolType.SEARCH, ToolType.SHELL)

    def __init__(self, registry: Registry, providers: Providers, profiles: ProfileFiles, queries: Queries, lookup: SubcommandLookup) -> None:
        self.registry, self.providers, self.profiles, self.queries, self.lookup = registry, providers, profiles, queries, lookup

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if hook.access != Access.READ or tool is None or self.is_listed(hook, tool):
            return RuleAnswer.allowed()
        if tool.category in LIMITED_TOOL_TYPES:
            return RuleAnswer.refused(LIMITED_TOOL.nudge(tool=tool.name))
        shell = tool.shell
        if shell is not None and shell.has_old_hook_part:
            return RuleAnswer.refused(OLD_HOOK_LINE.nudge())
        if shell is not None and shell.has_uncertain_part:
            return RuleAnswer.refused(UNJUDGED_LINE.nudge())
        if shell is not None and self.reaches_outward(shell):
            return RuleAnswer.refused(OUTWARD_JOURNAL_LINE.nudge())
        return super().answer(hook)

    def reaches_outward(self, shell: ShellLine) -> bool:
        if shell.contains_fragment(self.identity_variables()):
            return True
        return any(self.is_outward(" ".join(part.arguments[:2])) for part in shell.parts_running_journal_command() if HELP_FLAG not in part.arguments)

    def is_outward(self, line: str) -> bool:
        if not self.registry.is_outward(line) or line in self.registry.subcommands:
            return self.registry.is_outward(line)
        cli_name, _, name = line.partition(" ")
        try:
            self.lookup.subcommand(cli_name, name)
        except UsageError:
            return False
        return True

    def identity_variables(self) -> tuple[str, ...]:
        return (SESSION_VARIABLE, RUNNER_VARIABLE, *(provider.session_variable for provider in self.providers.all()))

    def is_listed(self, hook: AgentHook, tool: Tool) -> bool:
        if tool.name in self.providers.provider(hook.event.program).safe_tools:
            return True
        return tool.name.startswith(MCP_PREFIX) and tool.name in self.profile_tools(hook.agent_id)

    def profile_tools(self, agent_id: int) -> tuple[str, ...]:
        return self.profiles.effective(self.queries.query(Agent).find(agent_id).profile).mcp_tools
