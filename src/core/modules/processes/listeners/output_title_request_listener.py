from engine.command.context import Context
from engine.event.moved import Moved
from engine.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.processes.models.lifecycles.process_lifecycle import ProcessLifecycle
from core.modules.processes.models.output_title_request import OutputTitleRequest
from core.modules.processes.models.process import Process
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.run_title import RunTitle


class OutputTitleRequestListener(SaveListener[Moved[Process]]):
    """A run its agent moves to the background with no descriptive title asks the agent to name it, in the move's own
    write: one request row a run, which the hold on its title reads."""

    name = "processes.output-title-request"
    moves = (ProcessLifecycle.background,)

    def __init__(self, queries: Queries, outputs: OutputQuery, repository: Repository) -> None:
        self.queries, self.outputs, self.repository = queries, outputs, repository

    def handle(self, event: Moved[Process], context: Context) -> None:
        process = event.row
        output = self.outputs.process(process.id).first()
        if (output is not None and RunTitle.is_descriptive(output.title, process.line)) or self.queries.query(OutputTitleRequest).filter(process_id=process.id).exists():
            return
        self.repository.save(OutputTitleRequest(session_agent_id=process.session_agent_id, process_id=process.id), context)
