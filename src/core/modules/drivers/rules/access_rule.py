from collections.abc import Sequence
from engine.enums.access import Access
from engine.caller.caller_request import SESSION_VARIABLE
from engine.cli.shell_handoff import RUNNER_VARIABLE
from engine.cli.subcommand_lookup import SubcommandLookup
from engine.cli.usage_error import UsageError
from core.base.driver.agent_hook import AgentHook
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.shell_line import ShellLine
from core.base.driver.tool import Tool
from core.base.driver.tool_type import ToolType
from core.base.provider.providers import Providers
from engine.query.queries import Queries
from core.base.driver.run_owners import RunOwners
from engine.registry.registry import Registry
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_folders import AgentFolders
from engine.plan.plan_authors import PLAN_AUTHOR_LINES, PlanAuthors, PlanEdit
from core.modules.drivers.commands.use_permission.use_permission import UsePermission
from core.modules.drivers.models.enums.permission_state import PermissionState
from core.modules.drivers.models.permission_request import PermissionRequest
from core.modules.drivers.rules.readonly_rule import ReadonlyRule
from core.modules.drivers.support.access_nudges import LIMITED_TOOL, OLD_HOOK_LINE, OUTWARD_JOURNAL_LINE, UNJUDGED_LINE
from core.modules.profiles.support.profile_files import ProfileFiles

MCP_PREFIX = "mcp__"
LIMITED_TOOL_TYPES = (ToolType.QUESTION, ToolType.UNCATEGORISED)

HELP_FLAG = "--help"
RUN_STOP_LINE = "output stop"


class AccessRule(ReadonlyRule):
    """An agent with read-only access reads, searches and runs journal commands, on every program and under
    every overlay; a line no one can judge, and a journal line that reaches past the journal, are refused.
    A file change inside a folder its profile lets it write is allowed, and so is the one thing a request
    for leave named, once."""

    name = "drivers.access"
    drivers = ["*"]
    overlay_proof = True
    allowed_tools = (ToolType.READ, ToolType.SEARCH, ToolType.SHELL)
    refuses_one_action = "An agent with read-only access reads, searches and runs journal commands, on every program and under every"

    def __init__(self, registry: Registry, providers: Providers, profiles: ProfileFiles, queries: Queries, lookup: SubcommandLookup, plan_authors: PlanAuthors, folders: AgentFolders, run_owners: RunOwners) -> None:
        self.registry, self.providers, self.profiles, self.queries, self.lookup = registry, providers, profiles, queries, lookup
        self.plan_authors, self.folders, self.run_owners = plan_authors, folders, run_owners

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if hook.access != Access.READ or tool is None or self.is_listed(hook, tool) or self.is_writable(hook, tool):
            return RuleAnswer.allowed()
        permitted = self.permitted(hook, tool)
        if permitted is not None:
            return RuleAnswer.allowed().running(UsePermission(permitted.id))
        if tool.category in LIMITED_TOOL_TYPES:
            return RuleAnswer.refused(LIMITED_TOOL.nudge(tool=tool.name))
        shell = tool.shell
        if shell is not None and shell.has_old_hook_part:
            return RuleAnswer.refused(OLD_HOOK_LINE.nudge())
        if shell is not None and shell.has_uncertain_part:
            return RuleAnswer.refused(UNJUDGED_LINE.nudge())
        if shell is not None and self.reaches_outward(shell, hook.agent_id):
            return RuleAnswer.refused(OUTWARD_JOURNAL_LINE.nudge())
        return super().answer(hook)

    def reaches_outward(self, shell: ShellLine, agent_id: int) -> bool:
        if shell.has_part_naming(self.identity_variables()):
            return True
        outward = [part.arguments for part in shell.parts_running_journal_command() if HELP_FLAG not in part.arguments and not self.is_stop_of_agent_run(part.arguments, agent_id) and self.is_outward(" ".join(part.arguments[:2]))]
        edits = [self.plan_edit(arguments) for arguments in outward]
        return any(edit is None for edit in edits) or (bool(edits) and not self.plan_authors.are_authors(agent_id, [edit for edit in edits if edit is not None]))

    def is_stop_of_agent_run(self, arguments: Sequence[str], agent_id: int) -> bool:
        process_id = next((int(word) for word in arguments[2:] if word.isdigit()), None)
        return " ".join(arguments[:2]) == RUN_STOP_LINE and process_id is not None and self.run_owners.started_run(agent_id, process_id)

    @staticmethod
    def plan_edit(arguments: Sequence[str]) -> PlanEdit | None:
        line = " ".join(arguments[:2])
        row_id = next((int(word) for word in arguments[2:] if word.isdigit()), None)
        return PlanEdit(line, row_id) if line in PLAN_AUTHOR_LINES and row_id is not None else None

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

    def permitted(self, hook: AgentHook, tool: Tool) -> PermissionRequest | None:
        allowed = self.queries.query(PermissionRequest).filter(asker_id=hook.agent_id, state=PermissionState.ALLOWED).oldest().all_rows()
        return next((request for request in allowed if self.is_requested(request.action, tool)), None)

    @staticmethod
    def is_requested(action: str, tool: Tool) -> bool:
        return (tool.shell is not None and tool.shell.is_permitted_line(action)) or action in tool.files

    def is_listed(self, hook: AgentHook, tool: Tool) -> bool:
        if tool.name in self.providers.provider(hook.event.program).safe_tools:
            return True
        return tool.name.startswith(MCP_PREFIX) and tool.name in self.profile_tools(hook.agent_id)

    def is_writable(self, hook: AgentHook, tool: Tool) -> bool:
        if not tool.category.writes_files or not tool.files:
            return False
        agent = self.queries.query(Agent).find(hook.agent_id)
        root = self.folders.folder(agent)
        checkout = self.folders.checkout_folder(agent)
        writable = [(checkout / name).resolve() for name in self.profiles.effective(agent.profile).writable_folders]
        return all(any((root / file).resolve().is_relative_to(folder) for folder in writable) for file in tool.files)

    def profile_tools(self, agent_id: int) -> tuple[str, ...]:
        return self.profiles.effective(self.queries.query(Agent).find(agent_id).profile).mcp_tools
