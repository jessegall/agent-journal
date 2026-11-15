from pathlib import Path

from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.agent_role import AgentRole
from engine.enums.command_category import CommandCategory
from engine.journal.journal_home import JOURNAL_FOLDER
from engine.listener.rows.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from core.modules.environments.models.environment import Environment
from suites.coding.modules.workers.support.coding_main_options import CodingMainOptions
from suites.coding.agent_messages.main_code_edit_refusal_message import MainCodeEditRefusalMessage

ALLOWED_COMMANDS = tuple(category.value for category in (CommandCategory.READ, CommandCategory.SEARCH, CommandCategory.TEST_RUN, CommandCategory.CHECK,
                                                          CommandCategory.VERSION_CONTROL))


class CheckoutWriteCodePolicy(EventPolicy):
    """While the main agent writes no code, it writes no file of the project checkout, by a file tool or a shell line;
    files outside the checkout, in the .journal folder (agent memory and worker worktrees) and journal commands stay
    allowed."""

    key = "coding.main-writes-no-code"
    rank = "access.all"
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, options: CodingMainOptions, rows: EventRows) -> None:
        self.options, self.rows = options, rows

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        tool = event.tool
        if tool is None or self.options.options().writes_code:
            return None
        if tool.category.writes_files:
            environment_id = self.rows.required(Agent, agent_id).environment_id
            folder = Path(self.rows.required(Environment, environment_id).folder).resolve()
            return MainCodeEditRefusalMessage.declared().agent_message() if any(self.is_project_file(folder, file) for file in tool.files) else None
        shell = tool.shell
        if shell is None:
            return None
        writes = shell.parse_error or not shell.parts or shell.has_uncertain_part or shell.has_non_journal_file_writes
        return MainCodeEditRefusalMessage.declared().agent_message() if writes or shell.disallowed_part(ALLOWED_COMMANDS) is not None else None

    @staticmethod
    def is_project_file(folder: Path, file: str) -> bool:
        path = (folder / file).resolve()
        return path.is_relative_to(folder) and not path.is_relative_to(folder / JOURNAL_FOLDER)
