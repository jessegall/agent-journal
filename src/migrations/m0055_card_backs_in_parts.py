from pathlib import Path

from controllers.types import environment_records
from features.tickets.controller import Tickets
from features.tickets.resource import card_back
from resources.base import SYSTEM


def run(root: Path) -> list[str]:
    records = environment_records(Path(root))
    if not records:
        return []
    tickets = Tickets(records[0], actor=SYSTEM)
    reshaped = []
    for ticket in tickets._standing():
        shaped = card_back(ticket.brief)
        if shaped != ticket.brief:
            tickets.update(ticket.n, brief=shaped)
            reshaped.append(ticket.ref)
    return reshaped
