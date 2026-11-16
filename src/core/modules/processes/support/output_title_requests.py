from core.modules.processes.models.output_title_request import OutputTitleRequest
from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries

OPEN_REQUESTS_REASON = "the runs one agent moved to the background and has not named yet, a handful"


class OutputTitleRequests:
    """The open requests for a run's title: an agent's, which its hold and its line read, and one run's."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    # kept until the rows change, so the hold and the line of one step share one read
    def open_for_agent(self, agent_id: int) -> tuple[OutputTitleRequest, ...]:
        requests = self.queries.query(OutputTitleRequest).filter(session_agent_id=agent_id, closed_at=None).oldest()
        return self.kept.read(requests, lambda: tuple(requests.every_row(OPEN_REQUESTS_REASON)), name="processes.output-title-requests")

    def open_for_process(self, process_id: int) -> OutputTitleRequest | None:
        return self.queries.query(OutputTitleRequest).filter(process_id=process_id, closed_at=None).first()
