from engine.command.edit_command import EditCommand
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.plans.models.phase import Phase
from engine.event.updated import Updated
from engine.command.context import Context


class PhasePositionGuard(Guard[Updated[Phase]]):
    """A phase changes its place only through journal phase move, which shifts the phases between; an edit
    of its place alone would leave two phases on one place or a gap."""

    name = "plans.phase-position-by-move"

    def check(self, event: Updated[Phase], context: Context) -> None:
        if event.old_row is None or event.old_row.position == event.row.position:
            return
        if isinstance(context.command, EditCommand):
            raise Refusal("a phase changes its place only with journal phase move", f"journal phase move {event.row.id} --to <place>")
