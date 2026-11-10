from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.record_followup_step.record_followup_step import RecordFollowupStep
from suites.coding.modules.workers.models.merge_followup import MergeFollowup


class RecordFollowupStepHandler(Handler[RecordFollowupStep, MergeFollowup]):
    """Replaces the result of one step and keeps the others."""

    command = RecordFollowupStep
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def handle(self, command: RecordFollowupStep, context: Context) -> MergeFollowup:
        followup = self.rows.required(MergeFollowup, command.followup_id)
        results = tuple(command.outcome if index == command.index else outcome for index, outcome in enumerate(followup.results))
        return self.repository.update(followup, context, results=results)
