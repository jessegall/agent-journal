from engine.enums.agent_role import AgentRole
from engine.change.logged_event import LoggedEvent
from core.modules.agents.models.agent import Agent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.sequences.models.enums.sequence_mark_type import SequenceMarkType
from core.modules.sequences.models.enums.sequence_mark_variant import SequenceMarkVariant
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.models.sequence_run import SequenceRun
from engine.change.created import Created


class SequenceStartedMarkListener(MarkListener[Created[SequenceRun]]):
    """A sequence the main agent starts shows a chat mark; other agents' runs show none."""

    name = "sequences.started-mark"
    module_name = "journal.core.sequences"

    def handle(self, event: Created[SequenceRun], logged: LoggedEvent) -> None:
        run = event.row
        if self.event_rows.required(Agent, run.session_agent_id).role != AgentRole.MAIN:
            return
        sequence = self.event_rows.required(Sequence, run.sequence_id)
        self.show(logged, SequenceMarkType.SEQUENCE, SequenceMarkVariant.STARTED, f"Sequence {sequence.id} started: {sequence.title}", None, "sequence", sequence.id)
