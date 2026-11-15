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
from engine.enums.frame_end import FrameEnd
from engine.enums.work_type import WorkType
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.drivers.models.enums.handover_state import HandoverState
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.drivers.support.helper_job_rows import HelperJobRows

# a Working frame is ordered by its push time, never by a rank key
JOB_RANK = ""
JOB_STOP_KEY = "helpers.job-open"
HELPER_TYPE = "helper"
JOB_SUBJECT = "helper_job"
ENDED_JOBS_REASON = "the ended jobs whose frames one step takes off one helper's stack, one at most"


class JobWorkNeeds(NeedSource):
    """One Working frame for a read-only helper's open job (doc 1310 section 4.4): its allowed stop under it is
    the hand-in (section 4.9), and a new job pushes a new frame."""

    state_type = Working
    rank = JOB_RANK
    agent_types = [HELPER_TYPE]

    def __init__(self, jobs: HelperJobRows, queries: Queries) -> None:
        self.jobs, self.queries = jobs, queries

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[Need | BlockPlan]]:
        agent_jobs: dict[int, Sequence[Need | BlockPlan]] = {}
        for agent in agents:
            job = self.jobs.open_job(agent.agent_id) if agent.agent_type == HELPER_TYPE else None
            # a job whose report save failed twice waits for its retry or drop, so the helper rests
            if job is not None and job.handover_state is not HandoverState.CAPTURE_FAILED:
                stop_reason = Reason(JOB_STOP_KEY, DecisionClass.HOLD, JOB_RANK, f"job {job.id} is open")
                agent_jobs[agent.agent_id] = tuple([Need(Working(WorkReference(WorkType.JOB, job.id, f"job {job.id}"), True, stop_reason), JOB_RANK,
                                                    NeedKey("Working", SubjectReference(JOB_SUBJECT, job.id), f"job:{job.id}"))])
        return agent_jobs

    # a job's frame leaves handed in when its report was saved, else closed
    def ends(self, subjects: Sequence[SubjectReference]) -> Mapping[SubjectReference, FrameEnd]:
        job_ids = [subject.row_id for subject in subjects if subject.model == JOB_SUBJECT]
        jobs = self.queries.query(HelperJob).matching(Among("id", job_ids)).every_row(ENDED_JOBS_REASON) if job_ids else []
        return {SubjectReference(JOB_SUBJECT, job.id): FrameEnd.HANDED_IN if job.handover_state is HandoverState.COMPLETED else FrameEnd.CLOSED
                for job in jobs if job.ended_at is not None}
