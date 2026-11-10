from dataclasses import asdict
from datetime import timedelta

from engine.time.clock import Clock
from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.time.timestamp import Timestamp
from core.modules.triggers.commands.schedule_trigger.schedule_trigger import ScheduleTrigger
from core.modules.triggers.commands.support.cron_line import CronLine
from core.modules.triggers.models.trigger import Trigger
from core.modules.triggers.support.trigger_approval import TriggerApproval


class ScheduleTriggerHandler(Handler[ScheduleTrigger, Trigger]):
    """Saves a scheduled trigger with the first time it comes: the time given, the interval after the present
    moment or the cron line's next minute."""

    command = ScheduleTrigger

    def __init__(self, repository: Repository, clock: Clock, approval: TriggerApproval) -> None:
        self.repository, self.clock, self.approval = repository, clock, approval

    def handle(self, command: ScheduleTrigger, context: Context) -> Trigger:
        if not (command.start_text or command.interval_minutes or command.cron_line):
            raise Refusal("a scheduled trigger needs --at, --every or --cron", "journal trigger schedule \"<text>\" --every 30")
        if command.interval_minutes is not None and command.interval_minutes < 1:
            raise Refusal("--every is a number of minutes, 1 or more", "journal trigger schedule \"<text>\" --every 30")
        end = Timestamp.parsed(command.end_text) if command.end_text else None
        return self.repository.save(Trigger(creator_id=context.actor.id, text=command.text, next_at=self.first_time(command), interval_minutes=command.interval_minutes,
                                            cron_line=command.cron_line, end_at=end, fire_limit=command.limit, action=command.action, needs_enabling=self.approval.needs_user(context.actor), **asdict(command.details)), context)

    def first_time(self, command: ScheduleTrigger) -> Timestamp:
        if command.start_text:
            return Timestamp.parsed(command.start_text)
        present = self.clock.timestamp()
        if command.interval_minutes:
            return Timestamp(present.value + timedelta(minutes=command.interval_minutes))
        return CronLine(command.cron_line).next_after(present)
