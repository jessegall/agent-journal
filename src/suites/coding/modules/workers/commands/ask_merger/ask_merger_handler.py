from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.scope.actor_scope import ActorScope
from core.modules.tasks.commands.make_task_log.make_task_log import MakeTaskLog
from core.modules.waits.commands.open_wait.open_wait import OpenWait
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.enums.wait_type import WaitType
from core.modules.waits.models.wait import Wait
from suites.coding.modules.workers.commands.ask_merger.ask_merger import AskMerger
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.support.worker_ask_facts_query import WorkerAskFactsQuery
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_point import WorkerPoint

QUESTION_SOURCE = "workers.ask"


class AskMergerHandler(Handler[AskMerger, str]):
    """Sends a worker's question to the merger with its facts, opens the wait that lets the worker stop, and
    says what to do meanwhile. The same question asked again while it is open sends nothing."""

    command = AskMerger
    disabled_scopes = [ActorScope]

    def __init__(self, guidance: WorkerGuidance, facts_query: WorkerAskFactsQuery, inbox: MergerInbox, queries: Queries, bus: Bus) -> None:
        self.guidance, self.facts_query, self.inbox, self.queries, self.bus = guidance, facts_query, inbox, queries, bus

    def handle(self, command: AskMerger, context: Context) -> str:
        point = self.guidance.point(command.worker_id)
        if point.round.worktree is None and not point.round.started:
            raise Refusal("you hold no task to ask about", "journal worker status shows your work")
        focus = f"{command.topic}: {command.text}"
        if not self.is_open(command.worker_id, focus):
            self.send(command, point, focus, context)
        return f"{command.topic.waiting_work()}. {self.guidance.question_line(point.round)}"

    def is_open(self, worker_id: int, focus: str) -> bool:
        return self.queries.query(Wait).filter(session_agent_id=worker_id, state=WaitState.OPEN, type=WaitType.ANSWER, focus=focus).exists()

    def send(self, command: AskMerger, point: WorkerPoint, focus: str, context: Context) -> None:
        facts = self.facts_query.read(point)
        self.bus.dispatch(MakeTaskLog(facts.task, f"worker {command.worker_id} asked the merger about {command.topic}: {command.text}"), context)
        self.inbox.send(f"worker {command.worker_id} asks about {command.topic} on task {facts.task}: {command.text}\n{facts.text()}", QUESTION_SOURCE, context, command.topic, facts.json_text())
        self.bus.dispatch(OpenWait(WaitType.ANSWER, focus), context)
