from journal.features.workers.support.worker_news import WorkerNews
from dataclasses import dataclass, field

from journal.models.support.agent_load import AgentLoad
from journal.models.support.measure_states import MeasureStates
from journal.models.support.pressure_band import PressureBand
from pathlib import Path

from journal.features.workers.support.merge_check import MergeCheck
from journal.features.workers.support.worker_worktree import WorkerWorktree
from journal.models.subagent import Subagent
from journal.features.workers.support.ready_work import ReadyWork
from journal.models.worker import Worker
from journal.models.worker_todo import WorkerTodo


@dataclass(frozen=True)
class WorkersData:
    """The workers feature's reading: the workers out and the idle workers whose report is not acted on, by name, profile and the files they touched, how many subagents of this session's rows are running, every subagent this session dispatched, the worktrees of the workers still at work or idle, the clocked-out workers' work waiting to be checked, those workers and the outputs, by number with their worker's, that ran in their worktrees, and, for a worker's own agent, its worker, the to-do items of the task it holds and its own outputs not yet ended; the merges the whole suite has not passed since; the agent's own load as last measured; each worker's queue, the tasks it takes next in order; the tasks of each started plan; and the agent's pressure band with when it last changed, and the state of each measure of its mode; and its workers' news since its last line of it."""

    dispatched_workers: tuple[Worker, ...]
    idle_workers: tuple[Worker, ...]
    active_subagents: int
    subagents: tuple[Subagent, ...]
    worktrees_root: Path
    worktrees: tuple[WorkerWorktree, ...]
    ready_work: tuple[ReadyWork, ...] = ()
    delivered_workers: tuple[Worker, ...] = ()
    delivered_runs: tuple[tuple[int, int], ...] = ()
    workload: AgentLoad = AgentLoad()
    merge_check: MergeCheck = MergeCheck()
    last_calls: dict[int, str] = field(default_factory=dict)
    resumable: tuple[int, ...] = ()
    queues: dict[int, tuple[int, ...]] = field(default_factory=dict)
    band: PressureBand = PressureBand.NONE
    band_changed_at: float = 0.0
    measures: MeasureStates = MeasureStates()
    delegable: tuple[int, ...] = ()
    plan_tasks: tuple[tuple[int, ...], ...] = ()
    news: WorkerNews = WorkerNews()
