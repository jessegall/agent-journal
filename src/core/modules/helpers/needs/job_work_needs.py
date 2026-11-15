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
from core.modules.drivers.support.helper_job_rows import HelperJobRows

# a Working frame is ordered by its push time, never by a rank key
JOB_RANK = ""
JOB_STOP_KEY = "helpers.job-open"
HELPER_TYPE = "helper"


class JobWorkNeeds(NeedSource):
    """One Working frame for a read-only helper's open job (doc 1310 section 4.4): its allowed stop under it is
    the hand-in (section 4.9), and a new job pushes a new frame."""

    state_type = Working
    rank = JOB_RANK
    agent_types = [HELPER_TYPE]

    def __init__(self, jobs: HelperJobRows) -> None:
        self.jobs = jobs

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[Need | BlockPlan]]:
        agent_jobs: dict[int, Sequence[Need | BlockPlan]] = {}
        for agent in agents:
            job = self.jobs.open_job(agent.agent_id) if agent.agent_type == HELPER_TYPE else None
            if job is not None:
                stop_reason = Reason(JOB_STOP_KEY, DecisionClass.HOLD, JOB_RANK, f"job {job.id} is open")
                agent_jobs[agent.agent_id] = tuple([Need(Working(WorkReference(WorkType.JOB, job.id, f"job {job.id}"), True, stop_reason), JOB_RANK,
                                                    NeedKey("Working", SubjectReference("helper_job", job.id), f"job:{job.id}"))])
        return agent_jobs
