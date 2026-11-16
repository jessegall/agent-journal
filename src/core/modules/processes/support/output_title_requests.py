from core.modules.processes.models.output_title_request import OutputTitleRequest
from engine.database.kept_rows import KeptRows
from engine.command.context import Context
from engine.query.queries import Queries
from engine.repository.repository import Repository

OPEN_REQUESTS_REASON = "the runs one agent moved to the background and has not named yet, a handful"


class OutputTitleRequests:
    """The open requests for a run's title: an agent's, which its hold and its line read, and one run's."""

    def __init__(self, queries: Queries, kept: KeptRows, repository: Repository) -> None:
        self.queries, self.kept, self.repository = queries, kept, repository

    def agent_requests(self, agent_id: int) -> tuple[OutputTitleRequest, ...]:
        requests = self.queries.query(OutputTitleRequest).filter(session_agent_id=agent_id, closed_at=None).oldest()
        return self.kept.read(requests, lambda: tuple(requests.every_row(OPEN_REQUESTS_REASON)), name="processes.output-title-requests")

    def process_request(self, process_id: int) -> OutputTitleRequest | None:
        return self.queries.query(OutputTitleRequest).filter(process_id=process_id, closed_at=None).first()

    def close(self, process_id: int, context: Context) -> None:
        request = self.process_request(process_id)
        if request is not None:
            self.repository.update(request, context, closed_at=context.timestamp)
