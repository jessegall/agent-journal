from collections.abc import Sequence

from engine.caller.caller_request import SESSION_VARIABLE
from engine.cli.errors.usage_error import UsageError
from engine.cli.shell_handoff import RUNNER_VARIABLE
from engine.cli.subcommand_lookup import SubcommandLookup
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.driver.run_owners import RunOwners
from engine.driver.shell_line import ShellLine
from engine.driver.tool import Tool
from engine.enums.access import Access
from engine.enums.command_category import CommandCategory
from engine.enums.tool_type import ToolType
from engine.plan.plan_authors import PLAN_AUTHOR_LINES, PlanAuthors
from engine.plan.plan_edit import PlanEdit
from engine.provider.providers import Providers
from engine.query.queries import Queries
from engine.registry.registry import Registry
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.drivers.models.enums.permission_state import PermissionState
from core.modules.drivers.models.permission_request import PermissionRequest
from core.modules.drivers.agent_messages.limited_tool_message import LimitedToolMessage
from core.modules.drivers.agent_messages.old_hook_line_message import OldHookLineMessage
from core.modules.drivers.agent_messages.external_journal_line_message import ExternalJournalLineMessage
from core.modules.drivers.agent_messages.readonly_message import ReadonlyMessage
from core.modules.drivers.agent_messages.unjudged_line_message import UnjudgedLineMessage
from core.modules.drivers.support.tool_allowance import ToolAllowance
from core.modules.profiles.support.profile_files import ProfileFiles

ALLOWED_REQUESTS_REASON = "a tool use is matched against every permission the agent was given, oldest first"
MCP_PREFIX = "mcp__"
LIMITED_TOOL_TYPES = (ToolType.QUESTION, ToolType.UNCATEGORISED)
HELP_FLAG = "--help"
RUN_STOP_LINE = "output stop"
READ_TOOLS = ToolAllowance((ToolType.READ, ToolType.SEARCH, ToolType.SHELL), tuple(category for category in CommandCategory if category.is_readonly), ReadonlyMessage.declared())


class RestrictedReadAccess:
    """What an agent with read-only access may do: read, search and run the journal lines its type lists, on
    every program; a line no one can judge, a stop of a run it did not start and an edit of a plan it did not
    write are refused. A file change inside a folder its profile lets it write is allowed, a tool its profile
    names, and the one thing an allowed request for leave named, once."""

    def __init__(self, registry: Registry, providers: Providers, profiles: ProfileFiles, queries: Queries, lookup: SubcommandLookup, plan_authors: PlanAuthors,
                 folders: AgentFolders, run_owners: RunOwners) -> None:
        self.registry, self.providers, self.profiles, self.queries, self.lookup = registry, providers, profiles, queries, lookup
        self.plan_authors, self.folders, self.run_owners = plan_authors, folders, run_owners

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        tool = event.tool
        agent = self.queries.query(Agent).find(agent_id)
        if not self.is_limited(event, agent) or tool is None or self.permission(event, agent) is not None:
            return None
        if tool.category in LIMITED_TOOL_TYPES:
            return LimitedToolMessage.declared().agent_message(tool=tool.name)
        shell = tool.shell
        if shell is not None and shell.has_old_hook_part:
            return OldHookLineMessage.declared().agent_message()
        if shell is not None and shell.has_uncertain_part:
            return UnjudgedLineMessage.declared().agent_message()
        if shell is not None and self.reaches_external(shell, agent_id):
            return ExternalJournalLineMessage.declared().agent_message()
        return READ_TOOLS.refused(event, self.providers.provider(event.program))

    # the allowed request for leave this action spends, when the agent's read-only access would refuse it otherwise
    def spent_permission(self, event: HookEvent, agent_id: int) -> PermissionRequest | None:
        agent = self.queries.query(Agent).find(agent_id)
        return self.permission(event, agent) if self.is_limited(event, agent) else None

    def is_limited(self, event: HookEvent, agent: Agent) -> bool:
        tool = event.tool
        return agent.access == Access.READ and tool is not None and not self.is_listed(event, agent, tool) and not self.is_writable(agent, tool)

    def permission(self, event: HookEvent, agent: Agent) -> PermissionRequest | None:
        tool = event.tool
        if tool is None:
            return None
        allowed = self.queries.query(PermissionRequest).filter(asker_id=agent.id, state=PermissionState.ALLOWED).every_row(ALLOWED_REQUESTS_REASON)
        return next((request for request in allowed if (tool.shell is not None and tool.shell.is_permitted_line(request.action)) or request.action in tool.files), None)

    def reaches_external(self, shell: ShellLine, agent_id: int) -> bool:
        if shell.has_part_naming((SESSION_VARIABLE, RUNNER_VARIABLE, *(provider.session_variable for provider in self.providers.all()))):
            return True
        external = [part.arguments for part in shell.parts_running_journal_command() if HELP_FLAG not in part.arguments and self.is_external(" ".join(part.arguments[:2]))]
        foreign_stops = [arguments for arguments in external if " ".join(arguments[:2]) == RUN_STOP_LINE and not self.is_agent_run_stop(arguments, agent_id)]
        edits = [edit for edit in (self.plan_edit(arguments) for arguments in external) if edit is not None]
        return bool(foreign_stops) or (bool(edits) and not self.plan_authors.are_authors(agent_id, edits))

    def is_agent_run_stop(self, arguments: Sequence[str], agent_id: int) -> bool:
        process_id = next((int(word) for word in arguments[2:] if word.isdigit()), None)
        return process_id is not None and self.run_owners.started_run(agent_id, process_id)

    @staticmethod
    def plan_edit(arguments: Sequence[str]) -> PlanEdit | None:
        line = " ".join(arguments[:2])
        row_id = next((int(word) for word in arguments[2:] if word.isdigit()), None)
        return PlanEdit(line, row_id) if line in PLAN_AUTHOR_LINES and row_id is not None else None

    def is_external(self, line: str) -> bool:
        if not self.registry.is_external(line) or line in self.registry.subcommands:
            return self.registry.is_external(line)
        cli_name, _, name = line.partition(" ")
        try:
            self.lookup.subcommand(cli_name, name)
        except UsageError:
            return False
        return True

    # a profile names the tools its agents may use beside reading, an MCP tool or a program's own one such as Artifact,
    # but a named program tool never writes files: a write stays bound to the profile's writable folders
    def is_listed(self, event: HookEvent, agent: Agent, tool: Tool) -> bool:
        if tool.name in self.providers.provider(event.program).safe_tools:
            return True
        named = self.profiles.effective(agent.profile).mcp_tools
        return tool.name in named and (tool.name.startswith(MCP_PREFIX) or not tool.category.writes_files)

    def is_writable(self, agent: Agent, tool: Tool) -> bool:
        if not tool.category.writes_files or not tool.files:
            return False
        root, checkout = self.folders.folder(agent), self.folders.checkout_folder(agent)
        writable = [(checkout / name).resolve() for name in self.profiles.effective(agent.profile).writable_folders]
        return all(any((root / file).resolve().is_relative_to(folder) for folder in writable) for file in tool.files)
