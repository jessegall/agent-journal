import json

from engine.command.context import Context
from engine.query.queries import Queries
from core.modules.processes.models.process import Process


OUTPUT_LIMIT_BYTES = 400


class OutputDelivery:
    """Finds the run whose capped output must be read in full."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def pending(self, text: str, data: object, process_id: int | None, json_output: bool, context: Context) -> int | None:
        if process_id is None:
            return None
        process = self.queries.query(Process).filter(id=process_id, session_agent_id=context.actor.id).first()
        rendered = json.dumps(data, sort_keys=True) if json_output else text
        if process is not None and process.limit_seconds > 0 and len(rendered.encode()) + 1 > OUTPUT_LIMIT_BYTES:
            return process.id
        return None
