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
from engine.enums.work_type import WorkType
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from suites.coding.modules.workers.models.enums.worker_operation_name import WorkerOperationName
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from suites.coding.modules.workers.agent_messages.unfinished_merge_message import UnfinishedMergeMessage

MERGER_TYPE = "merger"
# a Working frame is ordered by its push time, never by a rank key
MERGE_JOB_RANK = ""
UNFINISHED_MERGE_KEY = "workers.unfinished-merge"
RUNNING_MERGES_REASON = "the merges the mergers of one step started that have not ended, one or two each"


class MergeJobStates(StateSource):
    """One Working frame for a merger's open job (doc 1310 section 4.4, the merge contract): work remains while a
    merge it started, accepted by the process queue, has not ended, so its stop is refused; once every merge
    ended, its stop hands the job in, with no report message, as its profile says."""

    state_type = Working
    rank = MERGE_JOB_RANK
    agent_types = [MERGER_TYPE]

    def __init__(self, jobs: HelperJobRows, queries: Queries) -> None:
        self.jobs, self.queries = jobs, queries

    def states(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        mergers = [agent.agent_id for agent in agents if agent.agent_type == MERGER_TYPE]
        merges = self.queries.query(WorkerOperation).filter(name=WorkerOperationName.MERGE, ended_at=None).matching(Among("creator_id", mergers)).every_row(RUNNING_MERGES_REASON) if mergers else []
        running_merges = {merge.creator_id: merge for merge in merges}
        merger_jobs: dict[int, Sequence[RequiredState | BlockPlan]] = {}
        for merger_id in mergers:
            job = self.jobs.open_job(merger_id)
            if job is None:
                continue
            running = running_merges.get(merger_id)
            text = UnfinishedMergeMessage.declared().agent_message(worker=running.worker_id).text if running is not None else f"job {job.id} is open"
            stop_reason = Reason(UNFINISHED_MERGE_KEY, DecisionClass.HOLD, MERGE_JOB_RANK, text)
            merger_jobs[merger_id] = tuple([RequiredState(Working(WorkReference(WorkType.MERGE_JOB, job.id, f"merge job {job.id}"), running is not None, stop_reason),
                                                      MERGE_JOB_RANK, StateKey("Working", RowReference("helper_job", job.id), f"job:{job.id}"))])
        return merger_jobs
