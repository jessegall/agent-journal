from engine.agent.agent_role_reader import AgentRoleReader
from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.driver.part import Part
from engine.driver.shell_line import ShellLine
from engine.errors.duration_error import DurationError
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.time.duration import Duration
from core.modules.aliases.agent_messages.saved_command_choices_message import SavedCommandChoicesMessage
from core.modules.aliases.agent_messages.saved_command_direct_message import SavedCommandDirectMessage
from core.modules.aliases.agent_messages.saved_command_helper_message import SavedCommandHelperMessage
from core.modules.aliases.agent_messages.saved_command_mixed_message import SavedCommandMixedMessage
from core.modules.aliases.agent_messages.saved_command_piped_message import SavedCommandPipedMessage
from core.modules.aliases.agent_messages.saved_command_silent_message import SavedCommandSilentMessage
from core.modules.aliases.agent_messages.saved_command_timeout_message import SavedCommandTimeoutMessage
from core.modules.aliases.agent_messages.saved_command_unknown_message import SavedCommandUnknownMessage
from core.modules.aliases.agent_messages.saved_command_unread_message import SavedCommandUnreadMessage
from core.modules.aliases.queries.alias_query import AliasQuery

ASKING_FLAGS = ("--help", "-h", "--version", "-V")
SKIPPED_KEYS = (SavedCommandUnknownMessage.declared().key, SavedCommandHelperMessage.declared().key, SavedCommandMixedMessage.declared().key, SavedCommandSilentMessage.declared().key)


class SavedCommandPolicy(EventPolicy):
    """Requires tests and builds to use saved commands with valid reading and timeout options."""

    key = "aliases.saved-command"
    rank = "shell.all"

    def __init__(self, aliases: AliasQuery, types: HelperTypeBook, roles: AgentRoleReader) -> None:
        self.aliases, self.types, self.roles = aliases, types, roles

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        shell = event.tool.shell if event.tool is not None else None
        if shell is None or shell.parse_error:
            return None
        try:
            for part in shell.parts:
                if part.timeout_duration is None:
                    continue
                Duration.parse(part.timeout_duration)
        except DurationError:
            return SavedCommandTimeoutMessage.declared().agent_message()
        if not shell.aliases_loaded:
            return None
        role = self.roles.role(agent_id)
        if not self.types.behaviours(role).runs_saved_commands:
            return None
        refusals = (self.part_refusal(part, role) for part in shell.parts)
        refusal = next((agent_message for agent_message in refusals if agent_message and not (shell.is_skip_line and agent_message.key in SKIPPED_KEYS)), None)
        return refusal

    @staticmethod
    def is_mixed(shell: ShellLine) -> bool:
        parts = shell.parts[1:] if shell.is_skip_line else shell.parts
        long_parts = [part for part in parts if part.classification.category.is_long_running and not set(ASKING_FLAGS) & set(part.arguments)]
        return bool(long_parts) and len(long_parts) != len(parts)

    def part_refusal(self, part: Part, role: str) -> AgentMessage | None:
        if part.saved_command:
            return self.saved_refusal(part)
        category = part.classification.category
        if not category.is_long_running or set(ASKING_FLAGS) & set(part.arguments):
            return None
        exact = self.aliases.first_beginning(part.text, category)
        if exact:
            return SavedCommandDirectMessage.declared().agent_message(name=exact.name)
        if self.aliases.with_category(category).exists():
            return SavedCommandChoicesMessage.declared().agent_message(category=category.value)
        if role in self.types.read_access_keys():
            return SavedCommandHelperMessage.declared().agent_message(category=category.value)
        return SavedCommandUnknownMessage.declared().agent_message(command=part.text, category=category.value)

    def saved_refusal(self, part: Part) -> AgentMessage | None:
        if part.pipe_target is not None:
            return SavedCommandPipedMessage.declared().agent_message(name=part.saved_command)
        if set(ASKING_FLAGS) & set(part.arguments):
            return None
        if not part.read_flag:
            return SavedCommandUnreadMessage.declared().agent_message(name=part.saved_command)
        alias = self.aliases.saved(part.saved_command)
        return SavedCommandSilentMessage.declared().agent_message(name=alias.name) if alias is not None and alias.is_claimed else None
