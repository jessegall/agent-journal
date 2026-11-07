from dataclasses import replace

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.provider.providers import Providers
from core.base.query.queries import Queries
from core.modules.profiles.support.profile_files import ProfileFiles
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.base.query.conditions.is_null import IsNull
from core.modules.drivers.support.main_agent_line import MainAgentLine
from core.modules.helpers.commands.send_helper.send_helper import SendHelper
from core.modules.agents.commands.retire_agent.retire_agent import RetireAgent
from core.modules.helpers.commands.start_helper.start_helper import StartHelper
from suites.coding.modules.workers.commands.merge_worker.merge_worker import MergeWorker
from suites.coding.modules.workers.commands.merger.merger_commands import ReportToMerger, MergeNextWorker, PassWorkerToMain, ReadNextMerge, SendMergeFindings, TellMainAgent, WakeMerger
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome
from suites.coding.modules.workers.support.merger_nudges import MERGER_JOB, MERGER_MERGED, MERGER_PASSED, MERGER_PROFILE, MERGER_SOURCE, NO_WORKER_WAITING
from suites.coding.modules.workers.support.worker_log_lines import WorkerLogLines


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

    def __init__(self, queries: Queries, bus: Bus, agents: AgentRows, profiles: ProfileFiles, providers: Providers) -> None:
        self.queries, self.bus, self.agents, self.profiles, self.providers = queries, bus, agents, profiles, providers

    def handle(self, command: WakeMerger, context: Context) -> None:
        main_agent = self.agents.main_agent()
        try:
            if main_agent is None:
                raise Refusal("no main agent runs")
            self.give_job(Actor(main_agent.id, ActorType.AGENT), context)
        except Refusal:
            self.bus.run(TellMainAgent(command.fallback_line), context.actor, environment_id=context.environment_id)

    def give_job(self, actor: Actor, context: Context) -> None:
        kept = self.queries.query(Agent).filter(profile=MERGER_PROFILE).matching(IsNull("retired_at")).newest().first()
        is_outdated = kept is not None and kept.ended_at is not None and not self.fits_profile(kept)
        if is_outdated:
            self.bus.run(RetireAgent(kept.id, "its profile names another provider or model"), actor, environment_id=context.environment_id)
            kept = None
        if kept is None:
            self.bus.run(StartHelper(MERGER_PROFILE, MERGER_JOB), actor, environment_id=context.environment_id)
            return
        self.bus.run(SendHelper(kept.id, MERGER_JOB, steer=kept.ended_at is None), actor, environment_id=context.environment_id)


    def fits_profile(self, kept: Agent) -> bool:
        profile = self.profiles.effective(MERGER_PROFILE)
        program = profile.program or kept.program
        return kept.program == program and kept.program_model == self.providers.provider(program).profile_model(profile)


class ReadNextMergeHandler(Handler[ReadNextMerge, str]):
    """Prints the next worker waiting and marks its logs read."""

    command = ReadNextMerge

    def __init__(self, agents: AgentRows, queries: Queries, worktrees: WorktreeQuery, log_lines: WorkerLogLines, repository: Repository) -> None:
        self.agents, self.queries, self.worktrees, self.log_lines, self.repository = agents, queries, worktrees, log_lines, repository

    def handle(self, command: ReadNextMerge, context: Context) -> str:
        checked_merger(self.agents, context)
        lines = tuple(self.queries.query(MergerLine).filter(environment_id=context.environment_id).matching(IsNull("read_at")).oldest().all_rows())
        for line in lines:
            self.repository.save_change(line, replace(line, read_at=context.timestamp), context)
        inbox = "\n".join(f"line: {line.text}" for line in lines)
        worktree = next((row for row in self.worktrees.open_worktrees() if self.waits(row)), None)
        if worktree is None:
            return inbox or NO_WORKER_WAITING
        worker_id = worktree.session_agent_id
        review = self.log_lines.review(worktree)
        sections = [self.task_section(task, review.summary(task), [proof for proof in review.proofs if proof.task_id == task.id]) for task in review.tasks]
        self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.review_logs, logs_read_at=context.timestamp), context)
        important = "important lines: pass this worker to the main agent\n" if review.has_important_lines() else ""
        return f"{inbox}\nworker {worker_id}\n{important}\n" + "\n\n".join(sections)

    @staticmethod
    def waits(worktree: Worktree) -> bool:
        return worktree.state is WorktreeState.DELIVERED and worktree.tests_passed_at is not None and worktree.left_to_main_at is None

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
        self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.mark_tests_passed, left_to_main_at=context.timestamp), context)
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


class ReportToMergerHandler(Handler[ReportToMerger, None]):
    """Puts a worker's report before the merger, or the main agent when the merger is off."""

    command = ReportToMerger

    def __init__(self, inbox: MergerInbox) -> None:
        self.inbox = inbox

    def handle(self, command: ReportToMerger, context: Context) -> None:
        self.inbox.send(f"worker:{command.worker_id} reports: {command.text}", MERGER_SOURCE, context)
