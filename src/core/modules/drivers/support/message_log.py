from collections.abc import Sequence
from dataclasses import replace

from engine.command.context import Context
from engine.enums.hook_event_name import HookEventName
from engine.driver.agent_message import AgentMessage
from engine.driver.rule_answers import RuleAnswers
from engine.driver.span_queries import SpanQueries
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.time.timestamp import Timestamp
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.models.message_record import MessageRecord
from core.modules.drivers.support.message_records import MessageRecords


class MessageLog:
    """Which lines of a hook are held back: one already said in this turn, one said again too soon, and a
    repeat within the hook; and what was said, kept per agent. A line on a clock is held by its key, so a
    number that changes in its text does not start it again. A refusal is never held back."""

    def __init__(self, queries: Queries, repository: Repository, records: MessageRecords, spans: SpanQueries) -> None:
        self.queries, self.repository, self.records = queries, repository, records
        self.spans = spans

    def skipped_lines(self, agent_id: int, answers: RuleAnswers, timestamp: Timestamp) -> frozenset[tuple[str, str]]:
        return self.held_back(agent_id, answers.line_agent_messages, timestamp)

    def held_back(self, agent_id: int, lines: Sequence[AgentMessage], timestamp: Timestamp) -> frozenset[tuple[str, str]]:
        if not lines:
            return frozenset()
        turn_start = self.turn_start(agent_id)
        records = self.records.agent_message_rows(agent_id, lines)
        return frozenset((agent_message.key, agent_message.text) for agent_message in lines if self.is_skipped(agent_id, agent_message, turn_start, timestamp, records))

    def is_skipped(self, agent_id: int, agent_message: AgentMessage, turn_start: Timestamp | None, timestamp: Timestamp, records: list[MessageRecord]) -> bool:
        delivered_at = self.record(agent_id, agent_message, records).last_delivered_at
        if delivered_at is None:
            return False
        if agent_message.interval and not agent_message.interval.has_passed(self.spans, agent_id, delivered_at, timestamp):
            return True
        return agent_message.turn_limited and (turn_start is None or delivered_at.text >= turn_start.text)

    def turn_start(self, agent_id: int) -> Timestamp | None:
        prompt = self.queries.query(HookCall).filter(session_agent_id=agent_id, hook=HookEventName.PROMPT).newest().first()
        return prompt.created_at if prompt is not None else None

    def record(self, agent_id: int, agent_message: AgentMessage, records: list[MessageRecord]) -> MessageRecord:
        record = next((row for row in records if row.key == agent_message.key and (agent_message.interval or row.text == agent_message.text)), None)
        return record if record is not None else MessageRecord(session_agent_id=agent_id, creator_id=0, key=agent_message.key, text=agent_message.text)

    def write(self, agent_id: int, answers: RuleAnswers, context: Context) -> None:
        self.write_said(agent_id, (*answers.delivered_agent_messages, *answers.refusal_agent_messages), context)

    def write_said(self, agent_id: int, said: Sequence[AgentMessage], context: Context) -> None:
        agent_messages = tuple(record for agent_message in said for record in agent_message.records)
        if not agent_messages:
            return
        records = self.records.agent_message_rows(agent_id, agent_messages)
        for agent_message in agent_messages:
            current = self.record(agent_id, agent_message, records)
            if agent_message.interval and current.text != agent_message.text:
                current = next((row for row in records if row.key == agent_message.key and row.text == agent_message.text), current)
            saved = self.repository.save_change(current if current.is_saved else None,
                                        replace(current, creator_id=context.actor.id, text=agent_message.text, delivery_count=current.delivery_count + 1, last_delivered_at=context.timestamp), context)
            records = [saved, *(row for row in records if row.id != saved.id)]
