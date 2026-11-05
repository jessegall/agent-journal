from dataclasses import replace

from core.base.command.context import Context
from core.base.database.kept_rows import KeptRows
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.nudge import Nudge
from core.base.driver.rule_answers import RuleAnswers
from core.base.driver.span_queries import SpanQueries
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.timestamp import Timestamp
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.models.nudge_record import NudgeRecord


class NudgeLog:
    """Which lines of a hook are held back: one already said in this turn, one said again too soon, and a
    repeat within the hook; and what was said, kept per agent. A line on a clock is held by its key, so a
    number that changes in its text does not start it again. A refusal is never held back."""

    def __init__(self, queries: Queries, repository: Repository, kept: KeptRows, spans: SpanQueries) -> None:
        self.queries, self.repository, self.kept = queries, repository, kept
        self.spans = spans

    def skipped_lines(self, agent_id: int, answers: RuleAnswers, timestamp: Timestamp) -> frozenset[tuple[str, str]]:
        lines = answers.line_nudges
        if not lines:
            return frozenset()
        turn_start = self.turn_start(agent_id)
        return frozenset((nudge.key, nudge.text) for nudge in lines if self.is_skipped(agent_id, nudge, turn_start, timestamp))

    def is_skipped(self, agent_id: int, nudge: Nudge, turn_start: Timestamp | None, timestamp: Timestamp) -> bool:
        delivered_at = self.record(agent_id, nudge).last_delivered_at
        if delivered_at is None:
            return False
        if nudge.interval and not nudge.interval.has_passed(self.spans, agent_id, delivered_at, timestamp):
            return True
        return nudge.turn_limited and (turn_start is None or delivered_at.text >= turn_start.text)

    def turn_start(self, agent_id: int) -> Timestamp | None:
        prompts = self.queries.query(HookCall).filter(agent_id=agent_id, hook=HookEventName.PROMPT).newest().limited(1)
        return prompts[0].created_at if prompts else None

    def record(self, agent_id: int, nudge: Nudge) -> NudgeRecord:
        rows = self.queries.query(NudgeRecord).filter(agent_id=agent_id, key=nudge.key)
        query = (rows if nudge.interval else rows.filter(text=nudge.text)).descending("last_delivered_at")
        condition, parameters = "agent_id = ? AND key = ?", [agent_id, nudge.key]
        if not nudge.interval:
            condition += " AND text = ?"
            parameters.append(nudge.text)
        record = self.kept.read("nudge_records", query.first, condition, parameters,
                                name=f"drivers.nudge:{nudge.key if nudge.interval else nudge.text}")
        return record if record is not None else NudgeRecord(agent_id=agent_id, creator_id=0, key=nudge.key, text=nudge.text)

    def write(self, agent_id: int, answers: RuleAnswers, context: Context) -> None:
        for nudge in (*answers.delivered_nudges, *answers.refusal_nudges):
            current = self.record(agent_id, nudge)
            if nudge.interval and current.text != nudge.text:
                matching_records = self.queries.query(NudgeRecord).filter(agent_id=agent_id, key=nudge.key, text=nudge.text).limited(1)
                current = matching_records[0] if matching_records else current
            self.repository.save_change(current if current.is_saved else None,
                                        replace(current, creator_id=context.actor.id, text=nudge.text, delivery_count=current.delivery_count + 1, last_delivered_at=context.timestamp), context)
