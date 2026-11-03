from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.queries import Queries
from core.modules.processes.models.output import Output
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.support.process_nudges import LARGE_OUTPUT_READ
from core.modules.processes.support.process_settings import ProcessSettings


class LargeOutputReadRule(DriverRule):
    """Reading all of a large output names the flags that read part of it, once for each output; a short
    output read whole says nothing."""

    name = "processes.large-output-read"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]

    def __init__(self, queries: Queries, settings: ProcessSettings) -> None:
        self.queries, self.settings = queries, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        full_reads = [part for part in shell.parts_running_journal_command("output read") if "--all" in part.arguments] if shell is not None else []
        numbers = [int(term) for part in full_reads for term in part.arguments if term.isdigit()]
        kept = self.queries.query(Output).filter(process_id=numbers[0]).page(1, 1).rows if numbers else ()
        if not kept or kept[0].line_count <= self.settings.integer(ProcessSetting.LARGE_OUTPUT_LINES, hook.environment_id):
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(LARGE_OUTPUT_READ.nudge(output=kept[0].process_id, lines=kept[0].line_count))
