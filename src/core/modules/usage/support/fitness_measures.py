from datetime import timedelta

from core.base.query.conditions.greater import Greater
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.usage.support.agent_fitness import AgentFitness, FitnessMeasure
from core.modules.waits.models.wait import Wait

WARM_UP_MINUTES = 30
WAIT_WINDOW_MINUTES = 60
COMPLETION_WINDOW_HOURS = 2
LOAD_WINDOW_MINUTES = 30
MESSAGE_WAIT_PASS_MINUTES = 5
MINUTES_FALL_FACTOR = 6
WAIT_SHARE_PASS = 0.15
MESSAGE_WEIGHT = 3
WAIT_WEIGHT = 3
LOAD_WARN = 0.7
LOAD_CRITICAL = 0.9
EMPTY_CLEARING_RATE = 2


class FitnessMeasures:
    """Works out an agent's fitness and load from rows the journal keeps: how long the oldest message has waited, what share of the last hour went on waits, and how fast tasks close; version 4's measures of workers, lines of code and merges have no rows here."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def fitness(self, agent: Agent, now: Timestamp) -> AgentFitness:
        measures = [self.message_wait(agent, now), self.wait_share(agent, now), self.completion_rate(agent, now)]
        is_measured = agent.created_at.elapsed_seconds(now) >= WARM_UP_MINUTES * 60
        weights = sum(measure.weight for measure in measures)
        score = round(100 * sum(measure.weight * measure.closeness for measure in measures) / weights) if is_measured else None
        load = round(self.load(agent, now), 2)
        return AgentFitness(agent.id, is_measured, score, measures, load, "critical" if load >= LOAD_CRITICAL else "warn" if load >= LOAD_WARN else "")

    def message_wait(self, agent: Agent, now: Timestamp) -> FitnessMeasure:
        waiting = self.queries.query(Message).filter(environment_id=agent.environment_id, type=MessageType.USER).matching(IsNull("read_at")).oldest().page(1, 1).rows
        minutes = waiting[0].created_at.elapsed_seconds(now) / 60 if waiting else 0.0
        return FitnessMeasure("message_wait", "Oldest message waiting, minutes", round(minutes, 1), MESSAGE_WAIT_PASS_MINUTES, self.minutes_closeness(minutes), MESSAGE_WEIGHT)

    def wait_share(self, agent: Agent, now: Timestamp) -> FitnessMeasure:
        begin = now.value - timedelta(minutes=WAIT_WINDOW_MINUTES)
        seconds = 0.0
        for wait in self.queries.query(Wait).filter(agent_id=agent.id).all_rows():
            end = wait.ended_at.value if wait.ended_at else now.value
            seconds += max(0.0, (end - max(wait.opened_at.value, begin)).total_seconds())
        share = min(1.0, seconds / (WAIT_WINDOW_MINUTES * 60))
        closeness = 1.0 if share <= WAIT_SHARE_PASS else (1 - share) / (1 - WAIT_SHARE_PASS)
        return FitnessMeasure("wait_share", "Share of the last hour spent waiting", round(share, 2), WAIT_SHARE_PASS, round(closeness, 2), WAIT_WEIGHT)

    def completion_rate(self, agent: Agent, now: Timestamp) -> FitnessMeasure:
        since = Timestamp(now.value - timedelta(hours=COMPLETION_WINDOW_HOURS)).text
        closed = self.queries.query(Task).filter(environment_id=agent.environment_id, state=TaskState.COMPLETED).matching(Greater("closed_at", since)).count()
        return FitnessMeasure("completion_rate", "Tasks completed an hour", closed / COMPLETION_WINDOW_HOURS, None, 1.0, 0)

    def load(self, agent: Agent, now: Timestamp) -> float:
        since = Timestamp(now.value - timedelta(minutes=LOAD_WINDOW_MINUTES)).text
        recent = self.queries.query(Message).filter(environment_id=agent.environment_id).matching(Greater("created_at", since))
        per_hour = 60 / LOAD_WINDOW_MINUTES
        arrivals = recent.filter(type=MessageType.USER).count() * per_hour
        cleared = recent.filter(type=MessageType.AGENT).count() * per_hour
        return arrivals / (cleared or EMPTY_CLEARING_RATE)

    @staticmethod
    def minutes_closeness(minutes: float) -> float:
        if minutes <= MESSAGE_WAIT_PASS_MINUTES:
            return 1.0
        return round(max(0.0, 1 - (minutes - MESSAGE_WAIT_PASS_MINUTES) / ((MINUTES_FALL_FACTOR - 1) * MESSAGE_WAIT_PASS_MINUTES)), 2)
