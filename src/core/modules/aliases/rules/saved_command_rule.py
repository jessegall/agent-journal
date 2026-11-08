from core.base.helper_kind import HelperKind
from core.base.duration import Duration
from core.base.duration_error import DurationError
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.nudge import Nudge
from core.base.driver.part import Part
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.shell_line import ShellLine
from core.modules.aliases.models.alias import ARGS_MARK
from core.modules.aliases.queries.alias_query import AliasQuery
from core.modules.aliases.support.alias_nudges import SAVED_COMMAND_CHOICES, SAVED_COMMAND_DIRECT, SAVED_COMMAND_MIXED, SAVED_COMMAND_PIPED, SAVED_COMMAND_SILENT, SAVED_COMMAND_HELPER, SAVED_COMMAND_UNKNOWN, SAVED_COMMAND_UNREAD, SAVED_COMMAND_TIMEOUT
from core.modules.drivers.support.suite_choice import SuiteChoice

ASKING_FLAGS = ("--help", "-h", "--version", "-V")
SKIPPED_KEYS = (SAVED_COMMAND_UNKNOWN.key, SAVED_COMMAND_HELPER.key)


class SavedCommandRule(DriverRule):
    """Requires tests and builds to use saved commands with valid reading and timeout options."""

    name = "aliases.saved-command"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, aliases: AliasQuery, suites: SuiteChoice) -> None:
        self.aliases, self.suites = aliases, suites

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error:
            return RuleAnswer.allowed()
        try:
            for part in shell.parts:
                if part.timeout_duration is None:
                    continue
                Duration.parse(part.timeout_duration)
        except DurationError as error:
            return RuleAnswer.refused(SAVED_COMMAND_TIMEOUT.nudge())
        if not shell.aliases_loaded:
            return RuleAnswer.allowed()
        if hook.role not in self.suites.agent_policy().saved_command_roles:
            return RuleAnswer.allowed()
        refusals = (self.refusal(part, hook.role) for part in shell.parts)
        refusal = next((nudge for nudge in refusals if nudge and not (shell.is_skip_line and nudge.key in SKIPPED_KEYS)), None)
        if refusal:
            return RuleAnswer.refused(refusal)
        return RuleAnswer.refused(SAVED_COMMAND_MIXED.nudge()) if self.is_mixed(shell) else RuleAnswer.allowed()

    @staticmethod
    def is_mixed(shell: ShellLine) -> bool:
        parts = shell.parts[1:] if shell.is_skip_line else shell.parts
        long_parts = [part for part in parts if part.classification.category.is_long_running and not set(ASKING_FLAGS) & set(part.arguments)]
        return bool(long_parts) and len(long_parts) != len(parts)

    def part_refusal(self, part: Part, shell: ShellLine, role: str) -> Nudge | None:
        if not shell.aliases_loaded or role not in self.suites.agent_policy().saved_command_roles:
            return None
        return self.refusal(part, role)

    def refusal(self, part: Part, role: str) -> Nudge | None:
        if part.saved_command:
            return self.saved_refusal(part)
        category = part.classification.category
        if not category.is_long_running or set(ASKING_FLAGS) & set(part.arguments):
            return None
        saved = [alias for alias in self.aliases.all_rows() if alias.category is category]
        exact = next((alias for alias in saved if part.text.startswith(alias.line.replace(ARGS_MARK, "").strip())), None)
        if exact:
            return SAVED_COMMAND_DIRECT.nudge(name=exact.name)
        if saved:
            return SAVED_COMMAND_CHOICES.nudge(category=category.value)
        if role == HelperKind.READ_ONLY:
            return SAVED_COMMAND_HELPER.nudge(category=category.value)
        return SAVED_COMMAND_UNKNOWN.nudge(command=part.text, category=category.value)

    def saved_refusal(self, part: Part) -> Nudge | None:
        if part.pipe_target is not None:
            return SAVED_COMMAND_PIPED.nudge(name=part.saved_command)
        if set(ASKING_FLAGS) & set(part.arguments):
            return None
        if not part.read_flag:
            return SAVED_COMMAND_UNREAD.nudge(name=part.saved_command)
        alias = self.aliases.saved(part.saved_command)
        return SAVED_COMMAND_SILENT.nudge(name=alias.name) if alias is not None and alias.is_held else None
