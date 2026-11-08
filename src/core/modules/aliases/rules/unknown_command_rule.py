from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.aliases.support.alias_nudges import COMMAND_TYPE_UNKNOWN
from core.modules.drivers.support.suite_choice import SuiteChoice


class UnknownCommandRule(DriverRule):
    """Refuses a command of a type the journal does not know until the agent classifies its leading words, so the
    rules of its type, such as a saved alias for a test run, hold for it from then on."""

    name = "aliases.unknown-command"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, suites: SuiteChoice) -> None:
        self.suites = suites

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error or not shell.aliases_loaded or hook.role not in self.suites.agent_policy().saved_command_roles:
            return RuleAnswer.allowed()
        unknown = next((part for part in shell.parts if part.program and part.classification.category is CommandCategory.UNKNOWN), None)
        return RuleAnswer.refused(COMMAND_TYPE_UNKNOWN.nudge(program=unknown.program)) if unknown else RuleAnswer.allowed()
