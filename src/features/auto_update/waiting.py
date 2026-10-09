import time
from collections.abc import Callable

from controllers.types import Agents
from engine.record import Record
from engine.wording import clipped
from providers.command_effects import settled
from resources.base import SYSTEM

WAIT_SECONDS = 60.0
CHECK_EVERY = 2.0
SHOWN = 60


def running(root) -> list[tuple[Record, object]]:
    """Every live agent whose shell command is still running, in every environment."""
    return [(record, row) for record in Record.every(root) for row in Agents(record, actor=SYSTEM).rows.standing() if row.live and row.command_running]


def ended(record: Record, row, waited: float) -> str:
    """Marks a command the update gave up on as ended, with every card that counts it."""
    at = time.time()
    cards = [{**card, "state": "done", "ended": at} if card.get("state") == "running" else card for card in row.data.get("cards") or []]
    Agents(record, actor=SYSTEM).update(row.n, **settled(row, at), cards=cards)
    return f"gave up waiting for `{clipped(row.running['command'], SHOWN)}` in {record.env} after {int(waited)}s and marked it ended"


def wait_for_commands(root, step: Callable[[str], None], wait: float = WAIT_SECONDS, every: float = CHECK_EVERY) -> list[str]:
    """Waits a bounded time for the commands in flight to finish before the build is swapped, and names the ones it gave up on."""
    until = time.time() + wait
    open_runs = running(root)
    while open_runs and time.time() < until:
        step(f"Waiting for {len(open_runs)} running command{'s' if len(open_runs) > 1 else ''} to finish")
        time.sleep(every)
        open_runs = running(root)
    return [ended(record, row, wait) for record, row in open_runs]
