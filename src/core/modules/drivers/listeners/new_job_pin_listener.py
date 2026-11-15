from engine.command.context import Context
from engine.event.changed import Changed
from engine.listener.save_listener import SaveListener
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.drivers.support.agent_pins import AgentPins


class NewJobPinListener(SaveListener[Changed[HelperJob]]):
    """A job bound to a helper is a new work generation, so the helper is pinned forward to the active slices."""

    name = "drivers.new-job-pin"

    def __init__(self, pins: AgentPins) -> None:
        self.pins = pins

    def handle(self, event: Changed[HelperJob], context: Context) -> None:
        helper_id = event.row.helper_id
        if helper_id is not None and (event.old_row is None or event.old_row.helper_id != helper_id):
            self.pins.repinned(helper_id, context)
