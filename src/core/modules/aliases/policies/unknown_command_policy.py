from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.command_category import CommandCategory
from core.modules.aliases.agent_messages.command_type_unknown_message import CommandTypeUnknownMessage
from core.modules.processes.models.enums.reading_exit import ReadingExit
from core.modules.processes.support.exits.exit_texts import ExitTexts

UNCLASSIFIED_HINT = f"{ExitTexts.sentences((ReadingExit.CLASSIFY,))}, process when no type fits"


class UnknownCommandPolicy(EventPolicy):
    """Refuses a command of a type the journal does not know until the agent, the main agent, a worker or a helper,
    classifies its leading words, so the rules of its type, such as a saved alias for a long-running type, hold for it
    from then on."""

    key = "aliases.unknown-command"
    rank = "shell.all"

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        shell = event.tool.shell if event.tool is not None else None
        if shell is None or shell.parse_error or not shell.aliases_loaded:
            return None
        unknown = next((part for part in shell.parts if part.program and part.classification.category is CommandCategory.UNKNOWN), None)
        return CommandTypeUnknownMessage.declared().agent_message(program=unknown.program, hint=UNCLASSIFIED_HINT) if unknown else None
