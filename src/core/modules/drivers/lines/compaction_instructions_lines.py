from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from engine.provider.providers import Providers
from core.modules.drivers.agent_messages.compaction_instructions_message import CompactionInstructionsMessage

# Claude Code cuts a PreCompact hook's plain output at 10,000 characters
INSTRUCTIONS_LIMIT = 10_000


class CompactionInstructionsLines(EventLineSource):
    """A compaction is given the agent program's own instructions for its summary, for every compaction: one a
    person or the journal starts with a plain /compact, and an automatic one. A person's own /compact text
    needs nothing here, since the program joins it with these instructions (report 1456). It never refuses a
    compaction."""

    key = "drivers.compaction-instructions"
    events = [HookEventName.COMPACT]

    def __init__(self, providers: Providers) -> None:
        self.providers = providers

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        instructions = self.providers.provider(event.program).compaction_instructions[:INSTRUCTIONS_LIMIT] if event is not None else ""
        return [CompactionInstructionsMessage.declared().agent_message(text=instructions)] if instructions else []
