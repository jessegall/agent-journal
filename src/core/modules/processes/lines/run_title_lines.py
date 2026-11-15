from collections.abc import Sequence
from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from collections import defaultdict

from engine.enums.hook_event_name import HookEventName
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.agent_messages.shared_title_message import SharedTitleMessage


class RunTitleLines(EventLineSource):
    """Two running outputs of one agent, of any role, with one title teach the title in words."""

    key = "processes.run-titles"
    events = [HookEventName.POST_TOOL_USE]

    def __init__(self, outputs: OutputQuery) -> None:
        self.outputs = outputs

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        titled = self.outputs.running_titles(agent_id).get()
        identical: defaultdict[str, list[str]] = defaultdict(list)
        for output in titled:
            identical[output.title].append(str(output.process_id))
        shared = [SharedTitleMessage.declared().agent_message(outputs=", ".join(numbers)) for numbers in identical.values() if len(numbers) > 1]
        return [*shared]
