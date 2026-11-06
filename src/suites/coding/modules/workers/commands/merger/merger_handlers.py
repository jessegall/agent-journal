from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.base.query.conditions.is_null import IsNull
from core.modules.drivers.support.main_agent_line import MainAgentLine
from core.modules.helpers.commands.send_helper.send_helper import SendHelper
from core.modules.helpers.commands.start_helper.start_helper import StartHelper
from suites.coding.modules.workers.commands.merge_worker.merge_worker import MergeWorker
from suites.coding.modules.workers.commands.merger.merger_commands import MergeNextWorker, PassWorkerToMain, ReadNextMerge, SendMergeFindings, TellMainAgent, WakeMerger
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome
from suites.coding.modules.workers.support.merger_nudges import MERGER_JOB, MERGER_MERGED, MERGER_PASSED, MERGER_PROFILE, MERGER_SOURCE, NOTHING_TO_MERGE
from suites.coding.modules.workers.support.worker_log_lines import WorkerLogLines
from suites.coding.modules.workers.support.worker_nudges import WORKER_TESTS_PASSED


def checked_merger(agents: AgentRows, context: Context) -> Agent:
    agent = agents.find(context.actor.id)
    if agent.profile != MERGER_PROFILE:
        raise Refusal("only the merger runs this", "the main agent uses journal worker merge")
    return agent


class TellMainAgentHandler(Handler[TellMainAgent, None]):
    """Sends the main agent a line of the merger."""

    command = TellMainAgent

    def __init__(self, main_line: MainAgentLine) -> None:
        self.main_line = main_line

    def handle(self, command: TellMainAgent, context: Context) -> None:
        self.main_line.send(command.text, MERGER_SOURCE, context)


class WakeMergerHandler(Handler[WakeMerger, None]):
    """Gives the merger the job: a new one, or the kept one, resumed or told. With none able to start, the main
    agent hears as it did before."""

    command = WakeMerger
    transactional = False

    def __init__(self, queries: Queries, bus: Bus, agents: AgentRows) -> None:
        self.queries, self.bus, self.agents = queries, bus, agents

    def handle(self, command: WakeMerger, context: Context) -> None:
        main_agent = self.agents.main_agent()
        try:
            if main_agent is None:
                raise Refusal("no main agent runs")
            self.give_job(Actor(main_agent.id, ActorType.AGENT), context)
        except Refusal:
            self.bus.run(TellMainAgent(WORKER_TESTS_PASSED.nudge(worker=command.worker_id).text), context.actor, environment_id=context.environment_id)

    def give_job(self, actor: Actor, context: Context) -> None:
        kept = self.queries.query(Agent).filter(profile=MERGER_PROFILE).matching(IsNull("retired_at")).newest().first()
        if kept is None:
            self.bus.run(StartHelper(MERGER_PROFILE, MERGER_JOB), actor, environment_id=context.environment_id)
            return
        self.bus.run(SendHelper(kept.id, MERGER_JOB, steer=kept.ended_at is None), actor, environment_id=context.environment_id)


class ReadNextMergeHandler(Handler[ReadNextMerge, str]):
    """Prints the next worker waiting and marks its logs read."""

    command = ReadNextMerge

    def __init__(self, agents: AgentRows, queries: Queries, worktrees: WorktreeQuery, log_lines: WorkerLogLines, repository: Repository) -> None:
        self.agents, self.queries, self.worktrees, self.log_lines, self.repository = agents, queries, worktrees, log_lines, repository

    def handle(self, command: ReadNextMerge, context: Context) -> str:
        checked_merger(self.agents, context)
        worktree = next((row for row in self.worktrees.open_worktrees() if row.state is WorktreeState.DELIVERED and row.tests_passed_at is not None), None)
        if worktree is None:
            return NOTHING_TO_MERGE
        worker_id = worktree.session_agent_id
        review = self.log_lines.review(worker_id)
        proofs = tuple(self.queries.query(Proof).filter(worktree_id=worktree.id).all_rows())
        sections = [self.task_section(task, review.summary(task), [proof for proof in proofs if proof.task_id == task.id]) for task in review.tasks]
        self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.review_logs, logs_read_at=context.timestamp), context)
        important = "important lines: pass this worker to the main agent\n" if review.has_important_lines() else ""
        return f"worker {worker_id}\n{important}\n" + "\n\n".join(sections)

    @staticmethod
    def task_section(task, summary: str, proofs: list[Proof]) -> str:
        proof_lines = "\n".join(f"proof {proof.id}, point {proof.point}, {proof.state}: {proof.text}" for proof in proofs)
        return f"{summary}\nbrief: {task.brief}\n{proof_lines}"


class MergeNextWorkerHandler(Handler[MergeNextWorker, MergeOutcome]):
    """Merges the worker, and tells the main agent one line."""

    command = MergeNextWorker
    transactional = False

    def __init__(self, agents: AgentRows, bus: Bus) -> None:
        self.agents, self.bus = agents, bus

    def handle(self, command: MergeNextWorker, context: Context) -> MergeOutcome:
        checked_merger(self.agents, context)
        outcome = self.bus.run(MergeWorker(command.worker_id), context.actor, environment_id=context.environment_id)
        if not outcome.conflicts:
            self.bus.run(TellMainAgent(MERGER_MERGED.nudge(worker=command.worker_id).text), context.actor, environment_id=context.environment_id)
        return outcome


class PassWorkerToMainHandler(Handler[PassWorkerToMain, None]):
    """Leaves the worker to the main agent: the merger no longer lists it."""

    command = PassWorkerToMain

    def __init__(self, agents: AgentRows, worktrees: WorktreeQuery, repository: Repository, main_line: MainAgentLine) -> None:
        self.agents, self.worktrees, self.repository, self.main_line = agents, worktrees, repository, main_line

    def handle(self, command: PassWorkerToMain, context: Context) -> None:
        checked_merger(self.agents, context)
        worktree: Worktree | None = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None:
            raise Refusal(f"worker {command.worker_id} has nothing delivered")
        self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.mark_tests_passed, tests_passed_at=None), context)
        self.main_line.send(MERGER_PASSED.nudge(worker=command.worker_id, reason=command.reason).text, MERGER_SOURCE, context)


class SendMergeFindingsHandler(Handler[SendMergeFindings, None]):
    """Sends the findings on a merge back to the worker that wrote the work."""

    command = SendMergeFindings
    transactional = False

    def __init__(self, agents: AgentRows, bus: Bus) -> None:
        self.agents, self.bus = agents, bus

    def handle(self, command: SendMergeFindings, context: Context) -> None:
        checked_merger(self.agents, context)
        main_agent = self.agents.main_agent()
        if main_agent is None:
            raise Refusal("no main agent runs")
        self.bus.run(SendWorker(command.worker_id, f"Findings from the judge on your merged work, please fix them: {command.findings}"),
                     Actor(main_agent.id, ActorType.AGENT), environment_id=context.environment_id)
