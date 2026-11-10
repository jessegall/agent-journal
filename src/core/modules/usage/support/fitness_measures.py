from datetime import timedelta

from core.base.query.conditions.greater import Greater
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.base.query.conditions.among import Among
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES, MessageType
from core.modules.messages.models.message import Message
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.usage.support.agent_fitness import AgentFitness
from core.modules.usage.support.fitness_measure import FitnessMeasure
from core.modules.waits.models.wait import Wait

MINIMUM_AGE_MINUTES = 30
WAIT_WINDOW_MINUTES = 60
COMPLETION_WINDOW_HOURS = 2
WORKLOAD_WINDOW_MINUTES = 30
MESSAGE_WAIT_PASS_MINUTES = 5
MINUTES_FALL_FACTOR = 6
WAIT_SHARE_PASS = 0.15
MESSAGE_WEIGHT = 3
WAIT_WEIGHT = 3
WORKLOAD_WARNING = 0.7
WORKLOAD_CRITICAL = 0.9
EMPTY_CLEARING_RATE = 2


class FitnessMeasures:
    """Measures message delays, time spent waiting and task completion rates."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def fitness(self, agent: Agent, current_time: Timestamp) -> AgentFitness:
        measures = [self.message_wait(agent, current_time), self.wait_share(agent, current_time), self.completion_rate(agent, current_time)]
        is_measured = agent.creation_timestamp().elapsed_seconds(current_time) >= MINIMUM_AGE_MINUTES * 60
        weights = sum(measure.weight for measure in measures)
        score = round(100 * sum(measure.weight * measure.pass_share for measure in measures) / weights) if is_measured else None
        arrivals_hourly, answers_hourly = self.message_rates(agent, current_time)
        workload = round(arrivals_hourly / (answers_hourly or EMPTY_CLEARING_RATE), 2)
        return AgentFitness(agent.id, is_measured, score, measures, workload, self.workload_level(workload), arrivals_hourly, answers_hourly, self.waiting_messages(agent))

    def message_wait(self, agent: Agent, current_time: Timestamp) -> FitnessMeasure:
        oldest = self.queries.query(Message).matching(Among("type", PERSON_MESSAGE_TYPES)).matching(IsNull("read_at")).oldest().first()
        minutes = oldest.creation_timestamp().elapsed_seconds(current_time) / 60 if oldest is not None else 0.0
        return FitnessMeasure("message_wait", "Oldest message waiting, minutes", round(minutes, 1), MESSAGE_WAIT_PASS_MINUTES, self.minutes_score(minutes), MESSAGE_WEIGHT)

    def wait_share(self, agent: Agent, current_time: Timestamp) -> FitnessMeasure:
        begin = current_time.value - timedelta(minutes=WAIT_WINDOW_MINUTES)
        seconds = 0.0
        waits = self.queries.query(Wait).filter(session_agent_id=agent.id)
        for wait in (*waits.matching(IsNull("ended_at")).all_rows(), *waits.matching(Greater("ended_at", Timestamp(begin).text)).all_rows()):
            end = wait.ended_at.value if wait.ended_at else current_time.value
            seconds += max(0.0, (end - max(wait.opened_at.value, begin)).total_seconds())
        share = min(1.0, seconds / (WAIT_WINDOW_MINUTES * 60))
        pass_share = 1.0 if share <= WAIT_SHARE_PASS else (1 - share) / (1 - WAIT_SHARE_PASS)
        return FitnessMeasure("wait_share", "Share of the last hour spent waiting", round(share, 2), WAIT_SHARE_PASS, round(pass_share, 2), WAIT_WEIGHT)

    def completion_rate(self, agent: Agent, current_time: Timestamp) -> FitnessMeasure:
        start = Timestamp(current_time.value - timedelta(hours=COMPLETION_WINDOW_HOURS)).text
        closed = self.queries.query(Task).filter(state=TaskState.COMPLETED).matching(Greater("closed_at", start)).count()
        return FitnessMeasure("completion_rate", "Tasks completed an hour", closed / COMPLETION_WINDOW_HOURS, None, 1.0, 0)

    @staticmethod
    def workload_level(workload: float) -> str:
        if workload >= WORKLOAD_CRITICAL:
            return "critical"
        return "warn" if workload >= WORKLOAD_WARNING else ""

    def message_rates(self, agent: Agent, current_time: Timestamp) -> tuple[float, float]:
        start = Timestamp(current_time.value - timedelta(minutes=WORKLOAD_WINDOW_MINUTES)).text
        recent = self.queries.query(Message).matching(Greater("created_at", start))
        hourly = 60 / WORKLOAD_WINDOW_MINUTES
        arrivals = recent.matching(Among("type", PERSON_MESSAGE_TYPES)).count() * hourly
        answers = recent.filter(type=MessageType.AGENT).count() * hourly
        return arrivals, answers

    def waiting_messages(self, agent: Agent) -> int:
        return self.queries.query(Message).matching(Among("type", PERSON_MESSAGE_TYPES)).matching(IsNull("read_at")).count()

    @staticmethod
    def minutes_score(minutes: float) -> float:
        if minutes <= MESSAGE_WAIT_PASS_MINUTES:
            return 1.0
        return round(max(0.0, 1 - (minutes - MESSAGE_WAIT_PASS_MINUTES) / ((MINUTES_FALL_FACTOR - 1) * MESSAGE_WAIT_PASS_MINUTES)), 2)
