from collections.abc import Mapping, Sequence

from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.states.block_plan import BlockPlan
from engine.agent_machine.states.required_state import RequiredState
from engine.agent_machine.states.state_source import StateSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.state_key import StateKey
from engine.agent_stack.reason import Reason
from engine.agent_stack.states.working import Working
from engine.agent_stack.row_reference import RowReference
from engine.agent_stack.work_reference import WorkReference
from engine.enums.decision_class import DecisionClass
from engine.enums.state_end import StateEnd
from engine.enums.work_type import WorkType
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.drivers.models.enums.handover_state import HandoverState
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.drivers.support.helper_job_rows import HelperJobRows

# a Working stacked state is ordered by its push time, never by a rank key
JOB_RANK = ""
JOB_STOP_KEY = "helpers.job-open"
HELPER_TYPE = "helper"
JOB_SUBJECT = "helper_job"
ENDED_JOBS_REASON = "the ended jobs whose frames one step takes off one helper's stack, one at most"


class JobWorkStates(StateSource):
    """One Working stacked state for a read-only helper's open job (doc 1310 section 4.4): its allowed stop under it is
    the hand-in (section 4.9), and a new job pushes a new stacked state."""

    state_type = Working
    rank = JOB_RANK
    agent_types = [HELPER_TYPE]

    def __init__(self, jobs: HelperJobRows, queries: Queries) -> None:
        self.jobs, self.queries = jobs, queries

    def states(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        agent_jobs: dict[int, Sequence[RequiredState | BlockPlan]] = {}
        for agent in agents:
            job = self.jobs.open_job(agent.agent_id) if agent.agent_type == HELPER_TYPE else None
            # a job whose report save failed twice waits for its retry or drop, so the helper rests
            if job is not None and job.handover_state is not HandoverState.CAPTURE_FAILED:
                stop_reason = Reason(JOB_STOP_KEY, DecisionClass.HOLD, JOB_RANK, f"job {job.id} is open")
                agent_jobs[agent.agent_id] = (RequiredState(Working(WorkReference(WorkType.JOB, job.id, f"job {job.id}"), True, stop_reason), JOB_RANK,
                                                    StateKey("Working", RowReference(JOB_SUBJECT, job.id), f"job:{job.id}")),)
        return agent_jobs

    # a job's stacked state leaves handed in when its report was saved, else closed
    def ends(self, subjects: Sequence[RowReference]) -> Mapping[RowReference, StateEnd]:
        job_ids = [subject.row_id for subject in subjects if subject.model == JOB_SUBJECT]
        jobs = self.queries.query(HelperJob).matching(Among("id", job_ids)).every_row(ENDED_JOBS_REASON) if job_ids else []
        return {RowReference(JOB_SUBJECT, job.id): StateEnd.HANDED_IN if job.handover_state is HandoverState.COMPLETED else StateEnd.CLOSED
                for job in jobs if job.ended_at is not None}
