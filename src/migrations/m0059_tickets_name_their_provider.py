from pathlib import Path

from controllers.types import environment_records
from features.tickets.controller import Tickets
from providers import DRIVERS
from resources.base import SYSTEM


def run(root: Path) -> list[str]:
    records = list(environment_records(Path(root)))
    if not records:
        return []
    tickets = Tickets(records[0], actor=SYSTEM)
    moved = []
    for ticket in [tickets.load(found["n"]) for found in tickets.summaries()]:
        stamped = ticket.data.get("agent")
        if stamped in DRIVERS and stamped != ticket.provider:
            tickets.update(ticket.n, provider=stamped)
            moved.append(f"ticket {ticket.n} runs on {stamped}")
    return moved
