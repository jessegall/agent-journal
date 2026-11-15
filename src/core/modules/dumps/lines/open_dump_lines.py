from collections.abc import Sequence
from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.dumps.models.dump import Dump
from core.modules.dumps.nudges.dump_open_message import DumpOpenMessage


class OpenDumpLines(EventLineSource):
    """Reminds the main agent of the oldest unfinished project dump after a tool call."""

    key = "dumps.open-dump"
    events = [HookEventName.POST_TOOL_USE]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        dump = self.queries.query(Dump).matching(IsNull("closed_at")).oldest().first()
        return [DumpOpenMessage.declared().nudge(dump=dump.id)] if dump is not None else []
