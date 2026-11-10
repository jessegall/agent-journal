from core.modules.processes.events.output_ended import OutputEnded
from core.base.listener.save_listener import SaveListener
from core.base.listener.event_rows import EventRows
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader
from core.modules.processes.support.reader_requests import ReaderRequests
from core.base.command.context import Context


class ReaderFailureListener(SaveListener[OutputEnded]):
    """Opens a request when a reader fails on a completed run."""

    name = "processes.reader-failure"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, requests: ReaderRequests, rows: EventRows) -> None:
        self.queries, self.requests, self.rows = queries, requests, rows

    def handle(self, event: OutputEnded, context: Context) -> None:
        output = event.row
        if not output.line_count:
            return
        process = self.rows.required(Process, output.process_id)
        agent = self.rows.required(Agent, process.session_agent_id)
        if not self.requests.needed(process, agent):
            return
        reader = self.queries.query(Reader).find(output.reader_id) if output.reader_id is not None else None
        parts = self.queries.query(ProcessPart).filter(process_id=process.id)
        if output.reader_position:
            parts = parts.filter(position=output.reader_position)
        for part in parts.all_rows():
            self.requests.after_run(process, part, reader, context)
