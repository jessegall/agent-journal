from core.base.agent_role import AgentRole
from core.base.change.logged_event import LoggedEvent
from core.modules.agents.models.agent import Agent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.sequences.models.enums.sequence_mark_type import SequenceMarkType
from core.modules.sequences.models.enums.sequence_mark_variant import SequenceMarkVariant
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.models.sequence_run import SequenceRun


class SequenceStartedMarkListener(MarkListener):
    """A sequence the main agent starts shows a chat mark; other agents' runs show none."""

    name = "sequences.started-mark"
    event = "sequence_run.create"
    module_name = "journal.core.sequences"

    def handle(self, event: LoggedEvent) -> None:
        run = self.queries.query(SequenceRun).find(event.row_id)
        if self.queries.query(Agent).find(run.agent_id).role != AgentRole.MAIN:
            return
        sequence = self.queries.query(Sequence).find(run.sequence_id)
        self.show(event, SequenceMarkType.SEQUENCE, SequenceMarkVariant.STARTED, f"Sequence {sequence.id} started: {sequence.title}", run.environment_id, None, "sequence", sequence.id)
