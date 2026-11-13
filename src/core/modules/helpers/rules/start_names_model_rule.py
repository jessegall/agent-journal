from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.helpers.support.helper_nudges import START_WITHOUT_MODEL

MODEL_FLAG = "--model"


class StartNamesModelRule(DriverRule):
    """An agent's helper start names its model, an exact one or default for the profile's own, so the model is
    always chosen (message 117983). A suite with starts of its own declares them on a rule of this class."""

    name = "helpers.start-names-model"
    single_action_refusal = "A helper start that names no model is refused, naming the flag"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    starts: tuple[str, ...] = ("helper start",)

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None:
            return RuleAnswer.allowed()
        starts = [part for start in self.starts for part in shell.parts_running_journal_command(start)]
        starts_without_model = [part for part in starts if not any(argument.split("=")[0] == MODEL_FLAG for argument in part.arguments)]
        return RuleAnswer.refused(START_WITHOUT_MODEL.nudge()) if starts_without_model else RuleAnswer.allowed()
