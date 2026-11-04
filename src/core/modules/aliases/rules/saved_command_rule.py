from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.nudge import Nudge
from core.base.driver.part import Part
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.shell_line import JOURNAL_PROGRAM, ShellLine
from core.modules.aliases.models.alias import ARGS_MARK
from core.modules.aliases.queries.alias_query import AliasQuery
from core.modules.aliases.support.alias_nudges import SAVED_COMMAND_DIRECT, SAVED_COMMAND_PIPED, SAVED_COMMAND_SUBAGENT, SAVED_COMMAND_UNKNOWN, SAVED_COMMAND_UNREAD
from core.modules.drivers.support.suite_choice import SuiteChoice

SKIP_ARGUMENTS = ("alias", "skip")
ASKING_FLAGS = ("--help", "-h", "--version", "-V")


class SavedCommandRule(DriverRule):
    """Holds every test and build of a line to a saved command: one not saved is registered first, one that is
    saved runs as the journal command, and that command takes reading flags, never a pipe. A line that opens with
    a skip runs as written, and a hook that could not read the saved commands judges nothing."""

    name = "aliases.saved-command"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, aliases: AliasQuery, suites: SuiteChoice) -> None:
        self.aliases, self.suites = aliases, suites

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error or not shell.saved_commands_known or self.opens_with_skip(shell):
            return RuleAnswer.allowed()
        if hook.role not in self.suites.agent_policy(hook.environment_id).saved_command_roles:
            return RuleAnswer.allowed()
        refusals = (self.refusal(part, hook.role) for part in shell.parts)
        refusal = next((nudge for nudge in refusals if nudge), None)
        return RuleAnswer.refused(refusal) if refusal else RuleAnswer.allowed()

    @staticmethod
    def opens_with_skip(shell: ShellLine) -> bool:
        first = shell.parts[0] if shell.parts else None
        return first is not None and first.program == JOURNAL_PROGRAM and first.arguments[:2] == SKIP_ARGUMENTS and first.next_operator == "&&"

    def refusal(self, part: Part, role: str) -> Nudge | None:
        if part.saved_command:
            return self.saved_refusal(part)
        category = part.classification.category
        if not category.is_long_running or set(ASKING_FLAGS) & set(part.arguments):
            return None
        saved = next((alias for alias in self.aliases.all_rows() if alias.category is category and part.text.startswith(alias.line.replace(ARGS_MARK, "").strip())), None)
        if saved:
            return SAVED_COMMAND_DIRECT.nudge(name=saved.name)
        return (SAVED_COMMAND_SUBAGENT if role == AgentRole.SUBAGENT else SAVED_COMMAND_UNKNOWN).nudge(command=part.text, category=category.value)

    @staticmethod
    def saved_refusal(part: Part) -> Nudge | None:
        if part.pipe_target is not None:
            return SAVED_COMMAND_PIPED.nudge(name=part.saved_command)
        if not part.read_flag and not set(ASKING_FLAGS) & set(part.arguments):
            return SAVED_COMMAND_UNREAD.nudge(name=part.saved_command)
        return None
