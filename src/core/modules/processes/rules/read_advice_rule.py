from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.reading_notices.read_advice import ReadAdvice


class ReadAdviceRule(DriverRule):
    """Answers a read of all of an output with the advice ReadAdvice gives for it, for every role."""

    name = "processes.read-advice"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]

    def __init__(self, outputs: OutputQuery, advice: ReadAdvice) -> None:
        self.outputs, self.advice = outputs, advice

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        full_reads = [part for part in shell.parts_running_journal_command("output read") if "--all" in part.arguments] if shell is not None else []
        numbers = [int(term) for part in full_reads for term in part.arguments if term.isdigit()]
        kept = self.outputs.process_output(numbers[0]) if numbers else None
        if kept is None:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(*self.advice.advice(kept))
