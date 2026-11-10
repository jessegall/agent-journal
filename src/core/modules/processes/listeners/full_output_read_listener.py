from engine.change.updated import Updated
from engine.command.context import Context
from engine.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process


class FullOutputReadListener(SaveListener[Updated[Output]]):
    """Completes reads whose output was itself moved to another output."""

    name = "processes.full-output-read"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Updated[Output], context: Context) -> None:
        if not event.row.has_new_full_read(event.old_row):
            return
        process = self.queries.query(Process).find(event.row.process_id)
        if process.session_agent_id != context.actor.id:
            return
        pending = self.queries.query(Output).filter(full_read_output_id=process.id).all_rows()
        for output in pending:
            self.repository.update(output, context, fully_read_at=context.timestamp, full_read_output_id=None)
