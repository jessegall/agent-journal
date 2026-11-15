from engine.agent.agent_role_reader import AgentRoleReader
from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.command_category import CommandCategory
from engine.helper_type.helper_type_book import HelperTypeBook
from core.modules.aliases.agent_messages.command_type_unknown_message import CommandTypeUnknownMessage
from core.modules.processes.models.enums.reading_exit import ReadingExit
from core.modules.processes.support.reading_notices.exit_texts import ExitTexts

UNCLASSIFIED_HINT = f"{ExitTexts.sentences(tuple([ReadingExit.CLASSIFY]))}, process when no type fits"


class UnknownCommandPolicy(EventPolicy):
    """Refuses a command of a type the journal does not know until the agent classifies its leading words, so the
    rules of its type, such as a saved alias for a long-running type, hold for it from then on."""

    key = "aliases.unknown-command"
    rank = "shell.all"

    def __init__(self, types: HelperTypeBook, roles: AgentRoleReader) -> None:
        self.types, self.roles = types, roles

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        shell = event.tool.shell if event.tool is not None else None
        if shell is None or shell.parse_error or not shell.aliases_loaded or not self.types.behaviours(self.roles.role(agent_id)).runs_saved_commands:
            return None
        unknown = next((part for part in shell.parts if part.program and part.classification.category is CommandCategory.UNKNOWN), None)
        return CommandTypeUnknownMessage.declared().agent_message(program=unknown.program, hint=UNCLASSIFIED_HINT) if unknown else None
