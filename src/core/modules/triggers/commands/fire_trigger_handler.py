from dataclasses import replace
from datetime import timedelta

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.timestamp import Timestamp
from core.modules.triggers.commands.fire_trigger import FireTrigger
from core.modules.triggers.commands.support.cron_line import CronLine
from core.modules.triggers.models.trigger import Trigger


class FireTriggerHandler(Handler[FireTrigger, Trigger]):
    """Counts one firing of a scheduled trigger and moves its next time on; it ends when its limit is reached,
    its end has passed, or it was set for one time only."""

    command = FireTrigger

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: FireTrigger, context: Context) -> Trigger:
        trigger = self.queries.query(Trigger).find(command.trigger_id)
        count = trigger.fired_count + 1
        next_time = self.next_time(trigger, context.timestamp)
        ends = next_time is None or self.limit_reached(trigger, count) or (trigger.end_at is not None and next_time > trigger.end_at)
        return self.repository.save(replace(trigger, fired_count=count, next_at=next_time, ended_at=context.timestamp if ends else None), context)

    def limit_reached(self, trigger: Trigger, count: int) -> bool:
        return trigger.fire_limit is not None and count >= trigger.fire_limit

    def next_time(self, trigger: Trigger, present: Timestamp) -> Timestamp | None:
        if trigger.interval_minutes:
            return Timestamp(present.value + timedelta(minutes=trigger.interval_minutes))
        return CronLine(trigger.cron_line).next_after(present) if trigger.cron_line else None
