from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.helpers.support.helper_nudges import START_WITHOUT_MODEL

STARTS = ("helper start", "worker dispatch")
MODEL_FLAG = "--model"


class StartNamesModelRule(DriverRule):
    """An agent's helper start or worker dispatch names its model, an exact one or default for the profile's own,
    so the model is always chosen (message 117983)."""

    name = "helpers.start-names-model"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None:
            return RuleAnswer.allowed()
        starts = [part for start in STARTS for part in shell.parts_running_journal_command(start)]
        starts_without_model = [part for part in starts if not any(argument.split("=")[0] == MODEL_FLAG for argument in part.arguments)]
        return RuleAnswer.refused(START_WITHOUT_MODEL.nudge()) if starts_without_model else RuleAnswer.allowed()
