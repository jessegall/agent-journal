from pathlib import Path

from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.listener.event_rows import EventRows
from core.modules.environments.models.environment import Environment
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from suites.coding.support.coding_main_options import CodingMainOptions
from suites.coding.support.coding_nudges import MAIN_WRITES_NO_CODE

JOURNAL_FOLDER = ".journal"
ALLOWED_COMMANDS = tuple(category.value for category in (CommandCategory.READ, CommandCategory.SEARCH, CommandCategory.TEST_RUN, CommandCategory.CHECK,
                                                          CommandCategory.VERSION_CONTROL))


class MainFileWriteRule(DriverRule):
    """While the main agent writes no code, it writes no file of the project checkout, by a file tool or a shell line; files
    outside the checkout, in the .journal folder (agent memory and worker worktrees) and journal commands stay allowed."""

    name = "coding.main-writes-no-code"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]

    def __init__(self, options: CodingMainOptions, rows: EventRows) -> None:
        self.options, self.rows = options, rows

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or self.options.options().writes_code:
            return RuleAnswer.allowed()
        if tool.category.writes_files:
            folder = Path(self.rows.required(Environment, hook.environment_id).folder).resolve()
            return RuleAnswer.refused(MAIN_WRITES_NO_CODE.nudge()) if any(self.is_project_file(folder, file) for file in tool.files) else RuleAnswer.allowed()
        shell = tool.shell
        if shell is None:
            return RuleAnswer.allowed()
        writes = shell.parse_error or not shell.parts or shell.has_uncertain_part or shell.has_non_journal_file_writes
        return RuleAnswer.refused(MAIN_WRITES_NO_CODE.nudge()) if writes or shell.disallowed_part(ALLOWED_COMMANDS) is not None else RuleAnswer.allowed()

    @staticmethod
    def is_project_file(folder: Path, file: str) -> bool:
        path = (folder / file).resolve()
        return path.is_relative_to(folder) and not path.is_relative_to(folder / JOURNAL_FOLDER)
