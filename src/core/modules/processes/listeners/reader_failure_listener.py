from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.processes.commands.support.part_spec import PartSpec
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader
from core.modules.processes.support.reader_requests import ReaderRequests


class ReaderFailureListener(SaveListener):
    """Opens a request when a reader fails on a completed run."""

    name = "processes.reader-failure"
    event = "output.*"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, requests: ReaderRequests) -> None:
        self.queries, self.requests = queries, requests

    def handle(self, change: Change[Model]) -> None:
        output = change.new_row
        if not isinstance(output, Output) or output.ended_at is None or output.reader_id is None or not output.line_count:
            return
        if isinstance(change.old_row, Output) and change.old_row.ended_at is not None:
            return
        process = self.queries.query(Process).find(output.process_id)
        agent = self.queries.query(Agent).find(process.agent_id)
        if not self.requests.needed(process, agent):
            return
        reader = self.queries.query(Reader).find(output.reader_id)
        parts = self.queries.query(ProcessPart).filter(process_id=process.id)
        if output.reader_position:
            parts = parts.filter(position=output.reader_position)
        for part in parts.all_rows():
            self.requests.after_run(process, PartSpec(part.text, part.program, category=part.category, command=part.command), reader, change.context)
