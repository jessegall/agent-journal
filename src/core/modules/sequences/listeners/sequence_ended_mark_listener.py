from core.base.agent_role import AgentRole
from core.base.change.logged_event import LoggedEvent
from core.base.change.updated import Updated
from core.modules.agents.models.agent import Agent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.sequences.commands.move_sequence_run.move_sequence_run_handler import ABANDONED, FINISHED
from core.modules.sequences.models.enums.sequence_mark_type import SequenceMarkType
from core.modules.sequences.models.enums.sequence_mark_variant import SequenceMarkVariant
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.models.sequence_run import SequenceRun


class SequenceEndedMarkListener(MarkListener[Updated[SequenceRun]]):
    """Shows a mark when the main agent finishes or gives up a sequence."""

    name = "sequences.ended-mark"
    module_name = "journal.core.sequences"

    def handle(self, event: Updated[SequenceRun], logged: LoggedEvent) -> None:
        run = event.row
        if "ended_at" not in logged.data or run.ended_at is None:
            return
        if run.outcome == FINISHED:
            variant, action = SequenceMarkVariant.FINISHED, "finished"
        elif run.outcome.startswith(f"{ABANDONED}:"):
            variant, action = SequenceMarkVariant.ABANDONED, "given up"
        else:
            return
        if self.event_rows.required(Agent, run.session_agent_id).role != AgentRole.MAIN:
            return
        sequence = self.event_rows.required(Sequence, run.sequence_id)
        self.show(logged, SequenceMarkType.SEQUENCE, variant, f"Sequence {sequence.id} {action}: {sequence.title}", None, "sequence", sequence.id)
