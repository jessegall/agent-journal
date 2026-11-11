from core.modules.tasks.models.task import Task
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
from suites.coding.modules.workers.support.worker_questions import CLOCK_FORMAT, WorkerQuestions
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.support.escalations import Escalations
from suites.coding.modules.workers.commands.forward_worker_questions.forward_worker_questions import ForwardWorkerQuestions
from suites.coding.modules.workers.support.worker_settings import MERGER_GROUP_MESSAGE_LIMIT
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

    def __init__(self, guidance: WorkerGuidance, facts_query: WorkerAskFactsQuery, inbox: MergerInbox, queries: Queries, bus: Bus, numbers: RowNumbers, questions: WorkerQuestions, settings: SettingValues, escalations: Escalations) -> None:
        self.numbers, self.questions, self.settings = numbers, questions, settings
        self.escalations = escalations
        self.guidance, self.facts_query, self.inbox, self.queries, self.bus = guidance, facts_query, inbox, queries, bus

    def handle(self, command: AskMerger, context: Context) -> str:
        point = self.guidance.point(command.worker_id)
        if point.round.has_no_work():
            raise Refusal("you hold no task to ask about", "journal worker status shows your work")
        task = self.subject_task(command, point)
        focus = f"{command.topic}: {command.text}"
        if not self.is_open(command.worker_id, focus):
            self.send(command, point, task, focus, context)
        return f"{self.due_line(command.worker_id)}{command.topic.waiting_work()}. {self.guidance.question_line(point.round)}"

    def subject_task(self, command: AskMerger, point: WorkerPoint) -> Task:
        if command.task_id is None:
            return self.guidance.current_task(point.round)
        for started in point.round.started:
            if started.id == command.task_id:
                return started
        started_ids = ", ".join(str(started.id) for started in sorted(point.round.started, key=lambda started: started.id))
        raise Refusal(f"you hold {'task' if len(point.round.started) == 1 else 'tasks'} {started_ids}", 'journal worker ask "<what>" --task <one of them>')

    def due_line(self, worker_id: int) -> str:
        lines = [line for line in self.questions.worker_lines(worker_id) if line.due_at is not None]
        if not lines:
            return "the main agent has your question now. " if self.escalations.is_open(worker_id) else ""
        return f"the merger has your question; an answer is due by {lines[-1].due_at.value.strftime(CLOCK_FORMAT)}, after that the main agent gets it. "

    def is_open(self, worker_id: int, focus: str) -> bool:
        return self.queries.query(Wait).filter(session_agent_id=worker_id, state=WaitState.OPEN, type=WaitType.ANSWER, focus=focus).exists()

    def send(self, command: AskMerger, point: WorkerPoint, task: Task, focus: str, context: Context) -> None:
        group = point.counted_window_key()
        exceeds_limit = self.queries.query(MergerLine).filter(worker_id=command.worker_id, group_key=group).matching(HasValue("topic")).count() >= self.settings.number(MERGER_GROUP_MESSAGE_LIMIT)
        facts = self.facts_query.read(point, task)
        self.bus.dispatch(MakeTaskLog(facts.task, f"{AgentLabel.from_row_id(command.worker_id, self.numbers, "worker").text} asked the merger about {command.topic}: {command.text}"), context)
        text = f"{AgentLabel.from_row_id(command.worker_id, self.numbers, "worker").text} asks about {command.topic} on task {facts.task}: {command.text}\n{facts.text()}"
        wait = self.bus.dispatch(OpenWait(WaitType.ANSWER, focus), context)
        line = MergerLine(text=text, fallback_source=QUESTION_SOURCE, topic=command.topic, facts_json=facts.json_text(), worker_id=command.worker_id, group_key=group)
        self.inbox.deliver(self.questions.timed(line, wait.id, facts.task, context.timestamp), context)
        if exceeds_limit:
            self.bus.dispatch(ForwardWorkerQuestions(command.worker_id), context)
