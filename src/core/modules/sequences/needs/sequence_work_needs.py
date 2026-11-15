from collections.abc import Mapping, Sequence

from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.required_state import RequiredState
from engine.agent_machine.needs.state_source import StateSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.state_key import StateKey
from engine.agent_stack.reason import Reason
from engine.agent_stack.states.working import Working
from engine.agent_stack.row_reference import RowReference
from engine.agent_stack.work_reference import WorkReference
from engine.enums.decision_class import DecisionClass
from engine.enums.work_type import WorkType
from core.modules.sequences.nudges.sequence_unfinished_message import SequenceUnfinishedMessage
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.support.sequence_stop_blockers import SequenceStopBlockers

SEQUENCE_STOP_KEY = "sequences.finish-before-stop"
# a Working frame is ordered by its push time, never by a rank key
SEQUENCE_RANK = ""
SEQUENCE_SUBJECT = "sequence_run"


class SequenceWorkNeeds(StateSource):
    """One Working frame for the sequence an agent runs (doc 1310 section 10.4): work remains while the run is
    current, unless the agent waits on its question, a run it watches or its helper; the stop text names the
    sequence and its step."""
    state_type = Working
    rank = SEQUENCE_RANK

    def __init__(self, runs: SequenceRunQuery, blockers: SequenceStopBlockers) -> None:
        self.runs, self.blockers = runs, blockers

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        needs = {agent.agent_id: self.working(agent.agent_id) for agent in agents}
        return {agent_id: frames for agent_id, frames in needs.items() if frames}

    def working(self, agent_id: int) -> list[RequiredState | BlockPlan]:
        run = self.runs.current(agent_id)
        if run is None:
            return []
        reason = Reason(SEQUENCE_STOP_KEY, DecisionClass.HOLD, SEQUENCE_RANK, SequenceUnfinishedMessage.declared().nudge(sequence=run.sequence_id, step=run.step_number).text)
        return [RequiredState(Working(WorkReference(WorkType.SEQUENCE, run.id, f"sequence {run.sequence_id}"), not self.blockers.is_waiting(agent_id), reason), SEQUENCE_RANK,
                     StateKey("Working", RowReference(SEQUENCE_SUBJECT, run.id), f"sequence_run:{run.id}"))]
