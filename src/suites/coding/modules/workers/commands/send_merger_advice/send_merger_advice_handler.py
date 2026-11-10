from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.messages.commands.send_agent_message.send_agent_message import SendAgentMessage
from suites.coding.modules.workers.commands.merger.require_merger import require_merger
from suites.coding.modules.workers.commands.send_merger_advice.send_merger_advice import SendMergerAdvice
from suites.coding.modules.workers.models.merger_advice import MergerAdvice
from suites.coding.modules.workers.models.merger_visit import MergerVisit
from suites.coding.modules.workers.support.group_message_limit import GROUP_MESSAGE_LIMIT_COUNT
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_point import WorkerPoint
from suites.coding.modules.workers.support.merger_visits import MergerVisits


class SendMergerAdviceHandler(Handler[SendMergerAdvice, str]):
    """Gives a worker the merger's advice: five per group, one per visit, and only when the worker moved."""

    command = SendMergerAdvice
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, guidance: WorkerGuidance, queries: Queries, repository: Repository, bus: Bus, visits: MergerVisits) -> None:
        self.agents, self.guidance, self.queries, self.repository, self.bus, self.visits = agents, guidance, queries, repository, bus, visits

    def handle(self, command: SendMergerAdvice, context: Context) -> str:
        require_merger(self.agents, context)
        self.visits.close_newest(context)
        point = self.guidance.point(command.worker_id)
        if point.round.worktree is None:
            raise Refusal(f"agent {command.worker_id} has no open work", "advise a worker that is at work")
        task_id = self.guidance.current_task(point.round).id
        group_rows = tuple(self.queries.query(MergerAdvice).filter(worker_id=command.worker_id, group_key=point.counted_group_key()).oldest().all_rows())
        visit = self.queries.query(MergerVisit).newest().first()
        visit_id = None if visit is None else visit.id
        self.check_limit(group_rows)
        self.check_visit(command.worker_id, visit_id)
        self.check_point(group_rows, point, task_id)
        self.repository.save(MergerAdvice(worker_id=command.worker_id, group_key=point.counted_group_key(), step=point.step, task_id=task_id, visit_id=visit_id, text=command.text), context)
        self.bus.dispatch(SendAgentMessage(command.worker_id, command.text, is_counted=True), context)
        return f"advice {len(group_rows) + 1} of {GROUP_MESSAGE_LIMIT_COUNT} in this group sent to worker {command.worker_id}"

    @staticmethod
    def check_limit(group_rows: tuple[MergerAdvice, ...]) -> None:
        if len(group_rows) >= GROUP_MESSAGE_LIMIT_COUNT:
            raise Refusal(f"{GROUP_MESSAGE_LIMIT_COUNT} of {GROUP_MESSAGE_LIMIT_COUNT} used in this group", 'wait for the merge, or journal merger tell "<what>" --tried ... --option ... --option ... --recommend ...')

    def check_visit(self, worker_id: int, visit_id: int | None) -> None:
        last = self.queries.query(MergerAdvice).filter(worker_id=worker_id).newest().first()
        if last is not None and last.visit_id == visit_id:
            raise Refusal(f"you already advised worker {worker_id} in this visit", "say it all in one advice, after your next journal merger next")

    @staticmethod
    def check_point(group_rows: tuple[MergerAdvice, ...], point: WorkerPoint, task_id: int) -> None:
        if group_rows and group_rows[-1].is_at(point.step, task_id):
            raise Refusal("the worker's point has not changed since your last advice", "wait until the worker has moved")
