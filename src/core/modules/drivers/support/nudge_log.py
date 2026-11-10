from dataclasses import replace

from core.base.command.context import Context
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.nudge import Nudge
from core.base.driver.rule_answers import RuleAnswers
from core.base.driver.span_queries import SpanQueries
from engine.query.queries import Queries
from core.base.repository.repository import Repository
from engine.time.timestamp import Timestamp
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.models.nudge_record import NudgeRecord
from core.modules.drivers.support.nudge_records import NudgeRecords


class NudgeLog:
    """Which lines of a hook are held back: one already said in this turn, one said again too soon, and a
    repeat within the hook; and what was said, kept per agent. A line on a clock is held by its key, so a
    number that changes in its text does not start it again. A refusal is never held back."""

    def __init__(self, queries: Queries, repository: Repository, records: NudgeRecords, spans: SpanQueries) -> None:
        self.queries, self.repository, self.records = queries, repository, records
        self.spans = spans

    def skipped_lines(self, agent_id: int, answers: RuleAnswers, timestamp: Timestamp) -> frozenset[tuple[str, str]]:
        lines = answers.line_nudges
        if not lines:
            return frozenset()
        turn_start = self.turn_start(agent_id)
        records = self.records.nudge_rows(agent_id, lines)
        return frozenset((nudge.key, nudge.text) for nudge in lines if self.is_skipped(agent_id, nudge, turn_start, timestamp, records))

    def is_skipped(self, agent_id: int, nudge: Nudge, turn_start: Timestamp | None, timestamp: Timestamp, records: list[NudgeRecord]) -> bool:
        delivered_at = self.record(agent_id, nudge, records).last_delivered_at
        if delivered_at is None:
            return False
        if nudge.interval and not nudge.interval.has_passed(self.spans, agent_id, delivered_at, timestamp):
            return True
        return nudge.turn_limited and (turn_start is None or delivered_at.text >= turn_start.text)

    def turn_start(self, agent_id: int) -> Timestamp | None:
        prompt = self.queries.query(HookCall).filter(session_agent_id=agent_id, hook=HookEventName.PROMPT).newest().first()
        return prompt.created_at if prompt is not None else None

    def record(self, agent_id: int, nudge: Nudge, records: list[NudgeRecord]) -> NudgeRecord:
        record = next((row for row in records if row.key == nudge.key and (nudge.interval or row.text == nudge.text)), None)
        return record if record is not None else NudgeRecord(session_agent_id=agent_id, creator_id=0, key=nudge.key, text=nudge.text)

    def write(self, agent_id: int, answers: RuleAnswers, context: Context) -> None:
        nudges = tuple(record for nudge in (*answers.delivered_nudges, *answers.refusal_nudges) for record in nudge.records)
        if not nudges:
            return
        records = self.records.nudge_rows(agent_id, nudges)
        for nudge in nudges:
            current = self.record(agent_id, nudge, records)
            if nudge.interval and current.text != nudge.text:
                current = next((row for row in records if row.key == nudge.key and row.text == nudge.text), current)
            saved = self.repository.save_change(current if current.is_saved else None,
                                        replace(current, creator_id=context.actor.id, text=nudge.text, delivery_count=current.delivery_count + 1, last_delivered_at=context.timestamp), context)
            records = [saved, *(row for row in records if row.id != saved.id)]
