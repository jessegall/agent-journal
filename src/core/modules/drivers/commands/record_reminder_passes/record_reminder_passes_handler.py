from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.commands.record_reminder_passes.record_reminder_passes import RecordReminderPasses
from core.modules.drivers.models.reminder_pass import ReminderPass


class RecordReminderPassesHandler(Handler[RecordReminderPasses, ReminderPass]):
    """Saves the count of passes of each thing a reminder names, with when it was counted, in one row."""

    command = RecordReminderPasses

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RecordReminderPasses, context: Context) -> ReminderPass:
        existing = self.queries.query(ReminderPass).filter(session_agent_id=command.agent_id, key=command.key).first()
        previous = existing.subject_counts() if existing is not None else {}
        counts = {**previous, **{subject: (passes, context.timestamp) for subject, passes in command.counts}}
        text = ReminderPass.counts_text(counts)
        if existing is not None:
            return self.repository.update(existing, context, counts=text)
        return self.repository.save(ReminderPass(session_agent_id=command.agent_id, creator_id=context.actor.id, key=command.key, counts=text), context)
