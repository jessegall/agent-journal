from engine.command.context import Context
from engine.event.created import Created
from engine.listener.save_listener import SaveListener
from core.modules.drivers.support.agent_pins import AgentPins
from suites.coding.modules.workers.models.worktree import Worktree


class NewUnitPinListener(SaveListener[Created[Worktree]]):
    """A worker's new worktree is its new unit, a new work generation, so the worker is pinned forward to the
    active slices."""

    name = "workers.new-unit-pin"

    def __init__(self, pins: AgentPins) -> None:
        self.pins = pins

    def handle(self, event: Created[Worktree], context: Context) -> None:
        self.pins.repinned(event.row.session_agent_id, context)
