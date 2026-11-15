from collections.abc import Mapping, Sequence

from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.need import Need
from engine.agent_machine.needs.need_source import NeedSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.need_key import NeedKey
from engine.agent_stack.reason import Reason
from engine.agent_stack.states.working import Working
from engine.agent_stack.subject_reference import SubjectReference
from engine.agent_stack.work_reference import WorkReference
from engine.enums.decision_class import DecisionClass
from engine.enums.work_type import WorkType
from core.modules.sequences.nudges.sequence_unfinished_nudge import SequenceUnfinishedNudge
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.support.sequence_stop_blockers import SequenceStopBlockers

SEQUENCE_STOP_KEY = "sequences.finish-before-stop"
# a Working frame is ordered by its push time, never by a rank key
SEQUENCE_RANK = ""
SEQUENCE_SUBJECT = "sequence_run"


class SequenceWorkNeeds(NeedSource):
    """One Working frame for the sequence an agent runs (doc 1310 section 10.4): work remains while the run is
    current, unless the agent waits on its question, a run it watches or its helper; the stop text names the
    sequence and its step, as today's sequences.finish-before-stop does."""

    replaced_rules = tuple([SEQUENCE_STOP_KEY])
    state_type = Working
    rank = SEQUENCE_RANK

    def __init__(self, runs: SequenceRunQuery, blockers: SequenceStopBlockers) -> None:
        self.runs, self.blockers = runs, blockers

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[Need | BlockPlan]]:
        needs = {agent.agent_id: self.working(agent.agent_id) for agent in agents}
        return {agent_id: frames for agent_id, frames in needs.items() if frames}

    def working(self, agent_id: int) -> list[Need | BlockPlan]:
        run = self.runs.current(agent_id)
        if run is None:
            return []
        reason = Reason(SEQUENCE_STOP_KEY, DecisionClass.HOLD, SEQUENCE_RANK, SequenceUnfinishedNudge.declared().nudge(sequence=run.sequence_id, step=run.step_number).text)
        return [Need(Working(WorkReference(WorkType.SEQUENCE, run.id, f"sequence {run.sequence_id}"), not self.blockers.is_waiting(agent_id), reason), SEQUENCE_RANK,
                     NeedKey("Working", SubjectReference(SEQUENCE_SUBJECT, run.id), f"sequence_run:{run.id}"))]
