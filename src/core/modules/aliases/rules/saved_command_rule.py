from engine.helper_type.helper_type_book import HelperTypeBook
from engine.time.duration import Duration
from engine.errors.duration_error import DurationError
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.nudge import Nudge
from engine.driver.part import Part
from engine.driver.rule_answer import RuleAnswer
from engine.driver.shell_line import ShellLine
from core.modules.aliases.queries.alias_query import AliasQuery
from core.modules.aliases.nudges.saved_command_choices_nudge import SavedCommandChoicesNudge
from core.modules.aliases.nudges.saved_command_direct_nudge import SavedCommandDirectNudge
from core.modules.aliases.nudges.saved_command_mixed_nudge import SavedCommandMixedNudge
from core.modules.aliases.nudges.saved_command_piped_nudge import SavedCommandPipedNudge
from core.modules.aliases.nudges.saved_command_silent_nudge import SavedCommandSilentNudge
from core.modules.aliases.nudges.saved_command_helper_nudge import SavedCommandHelperNudge
from core.modules.aliases.nudges.saved_command_unknown_nudge import SavedCommandUnknownNudge
from core.modules.aliases.nudges.saved_command_unread_nudge import SavedCommandUnreadNudge
from core.modules.aliases.nudges.saved_command_timeout_nudge import SavedCommandTimeoutNudge

ASKING_FLAGS = ("--help", "-h", "--version", "-V")
SKIPPED_KEYS = (SavedCommandUnknownNudge.declared().key, SavedCommandHelperNudge.declared().key, SavedCommandMixedNudge.declared().key, SavedCommandSilentNudge.declared().key)


class SavedCommandRule(DriverRule):
    """Requires tests and builds to use saved commands with valid reading and timeout options."""

    name = "aliases.saved-command"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    single_action_refusal = "Requires tests and builds to use saved commands with valid reading and timeout options"

    def __init__(self, aliases: AliasQuery, types: HelperTypeBook) -> None:
        self.aliases, self.types = aliases, types

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error:
            return RuleAnswer.allowed()
        try:
            for part in shell.parts:
                if part.timeout_duration is None:
                    continue
                Duration.parse(part.timeout_duration)
        except DurationError:
            return RuleAnswer.refused(SavedCommandTimeoutNudge.declared().nudge())
        if not shell.aliases_loaded:
            return RuleAnswer.allowed()
        if not self.types.behaviours(hook.role).runs_saved_commands:
            return RuleAnswer.allowed()
        refusals = (self.refusal(part, hook.role) for part in shell.parts)
        refusal = next((nudge for nudge in refusals if nudge and not (shell.is_skip_line and nudge.key in SKIPPED_KEYS)), None)
        if refusal:
            return RuleAnswer.refused(refusal)
        return RuleAnswer.refused(SavedCommandMixedNudge.declared().nudge()) if self.is_mixed(shell) else RuleAnswer.allowed()

    @staticmethod
    def is_mixed(shell: ShellLine) -> bool:
        parts = shell.parts[1:] if shell.is_skip_line else shell.parts
        long_parts = [part for part in parts if part.classification.category.is_long_running and not set(ASKING_FLAGS) & set(part.arguments)]
        return bool(long_parts) and len(long_parts) != len(parts)

    def part_refusal(self, part: Part, shell: ShellLine, role: str) -> Nudge | None:
        if not shell.aliases_loaded or not self.types.behaviours(role).runs_saved_commands:
            return None
        return self.refusal(part, role)

    def refusal(self, part: Part, role: str) -> Nudge | None:
        if part.saved_command:
            return self.saved_refusal(part)
        category = part.classification.category
        if not category.is_long_running or set(ASKING_FLAGS) & set(part.arguments):
            return None
        exact = self.aliases.first_beginning(part.text, category)
        if exact:
            return SavedCommandDirectNudge.declared().nudge(name=exact.name)
        if self.aliases.with_category(category).exists():
            return SavedCommandChoicesNudge.declared().nudge(category=category.value)
        if role in self.types.read_access_keys():
            return SavedCommandHelperNudge.declared().nudge(category=category.value)
        return SavedCommandUnknownNudge.declared().nudge(command=part.text, category=category.value)

    def saved_refusal(self, part: Part) -> Nudge | None:
        if part.pipe_target is not None:
            return SavedCommandPipedNudge.declared().nudge(name=part.saved_command)
        if set(ASKING_FLAGS) & set(part.arguments):
            return None
        if not part.read_flag:
            return SavedCommandUnreadNudge.declared().nudge(name=part.saved_command)
        alias = self.aliases.saved(part.saved_command)
        return SavedCommandSilentNudge.declared().nudge(name=alias.name) if alias is not None and alias.is_claimed else None
