from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.has_value import HasValue
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.scope.actor_scope import ActorScope
from core.modules.tasks.commands.make_task_log.make_task_log import MakeTaskLog
from core.modules.waits.commands.open_wait.open_wait import OpenWait
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.enums.wait_type import WaitType
from core.modules.waits.models.wait import Wait
from suites.coding.modules.workers.commands.ask_merger.ask_merger import AskMerger
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.support.ask_ledger import CLOCK_FORMAT, AskLedger
from suites.coding.modules.workers.support.group_message_limit import GROUP_MESSAGE_LIMIT_COUNT
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.support.worker_ask_facts_query import WorkerAskFactsQuery
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_point import WorkerPoint
from core.modules.agents.support.agent_label import AgentLabel
from engine.cli.row_numbers import RowNumbers

QUESTION_SOURCE = "workers.ask"


class AskMergerHandler(Handler[AskMerger, str]):
    """Sends a worker's question to the merger with its facts, opens the wait that lets the worker stop, and
    says what to do meanwhile. The same question asked again while it is open sends nothing."""

    command = AskMerger
    disabled_scopes = [ActorScope]

    def __init__(self, guidance: WorkerGuidance, facts_query: WorkerAskFactsQuery, inbox: MergerInbox, queries: Queries, bus: Bus, numbers: RowNumbers, ledger: AskLedger) -> None:
        self.numbers, self.ledger = numbers, ledger
        self.guidance, self.facts_query, self.inbox, self.queries, self.bus = guidance, facts_query, inbox, queries, bus

    def handle(self, command: AskMerger, context: Context) -> str:
        point = self.guidance.point(command.worker_id)
        if point.round.has_no_work():
            raise Refusal("you hold no task to ask about", "journal worker status shows your work")
        focus = f"{command.topic}: {command.text}"
        if not self.is_open(command.worker_id, focus):
            self.send(command, point, focus, context)
        return f"{self.due_line(command.worker_id)}{command.topic.waiting_work()}. {self.guidance.question_line(point.round)}"

    def due_line(self, worker_id: int) -> str:
        lines = [line for line in self.ledger.worker_lines(worker_id) if line.due_at is not None]
        if not lines:
            return ""
        return f"the merger has your question; an answer is due by {lines[-1].due_at.value.strftime(CLOCK_FORMAT)}, after that the main agent gets it. "

    def is_open(self, worker_id: int, focus: str) -> bool:
        return self.queries.query(Wait).filter(session_agent_id=worker_id, state=WaitState.OPEN, type=WaitType.ANSWER, focus=focus).exists()

    def send(self, command: AskMerger, point: WorkerPoint, focus: str, context: Context) -> None:
        group = point.counted_group_key()
        if self.queries.query(MergerLine).filter(worker_id=command.worker_id, group_key=group).matching(HasValue("topic")).count() >= GROUP_MESSAGE_LIMIT_COUNT:
            raise Refusal(f"{GROUP_MESSAGE_LIMIT_COUNT} of {GROUP_MESSAGE_LIMIT_COUNT} asks used in this group", "wait for the merge; the merger has your earlier asks")
        facts = self.facts_query.read(point)
        self.bus.dispatch(MakeTaskLog(facts.task, f"{AgentLabel.from_row_id(command.worker_id, self.numbers, "worker").text} asked the merger about {command.topic}: {command.text}"), context)
        text = f"{AgentLabel.from_row_id(command.worker_id, self.numbers, "worker").text} asks about {command.topic} on task {facts.task}: {command.text}\n{facts.text()}"
        wait = self.bus.dispatch(OpenWait(WaitType.ANSWER, focus), context)
        line = MergerLine(text=text, fallback_source=QUESTION_SOURCE, topic=command.topic, facts_json=facts.json_text(), worker_id=command.worker_id, group_key=group)
        self.inbox.deliver(self.ledger.timed(line, wait.id, facts.task, context.timestamp), context)
