from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.support.process_nudges import LARGE_OUTPUT_READ
from core.modules.processes.support.process_settings import ProcessSettings


class LargeOutputReadRule(DriverRule):
    """Reading all of a large output names the flags that read part of it, once for each output; a short
    output read whole says nothing."""

    name = "processes.large-output-read"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]

    def __init__(self, outputs: OutputQuery, settings: ProcessSettings) -> None:
        self.outputs, self.settings = outputs, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        full_reads = [part for part in shell.parts_running_journal_command("output read") if "--all" in part.arguments] if shell is not None else []
        numbers = [int(term) for part in full_reads for term in part.arguments if term.isdigit()]
        kept = self.outputs.process_output(numbers[0]) if numbers else None
        if kept is None or kept.line_count <= self.settings.integer(ProcessSetting.LARGE_OUTPUT_LINES):
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(LARGE_OUTPUT_READ.nudge(output=kept.process_id, lines=kept.line_count))
