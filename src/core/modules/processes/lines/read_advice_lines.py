from collections.abc import Sequence
from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.reading_notices.read_advice import ReadAdvice


class ReadAdviceLines(EventLineSource):
    """Answers a read of all of an output with the advice ReadAdvice gives for it, for every role."""

    key = "processes.read-advice"
    events = [HookEventName.POST_TOOL_USE]

    def __init__(self, outputs: OutputQuery, hint: ReadAdvice) -> None:
        self.outputs, self.advice = outputs, hint

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        shell = event.tool.shell if event.tool is not None else None
        full_reads = [part for part in shell.parts_running_journal_command("output read") if "--all" in part.arguments] if shell is not None else []
        numbers = [int(term) for part in full_reads for term in part.arguments if term.isdigit()]
        kept = self.outputs.process_output(numbers[0]) if numbers else None
        if kept is None:
            return []
        return [*self.advice.hint(kept)]
