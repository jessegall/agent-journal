from core.base.change.change import Change
from core.base.command.edit_command import EditCommand
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.plans.phase import Phase


class PhasePositionByMove(Guard):
    """A phase changes its place only through journal phase move, which shifts the phases between; an edit of its
    place alone would leave two phases on one place or a gap."""

    name = "plans.phase-position-by-move"
    event = "phase.update"

    def check(self, change: Change[Model]) -> None:
        if not isinstance(change.old_row, Phase) or not isinstance(change.new_row, Phase) or change.old_row.position == change.new_row.position:
            return
        if isinstance(change.context.command, EditCommand):
            raise Refusal("a phase changes its place only with journal phase move", f"journal phase move {change.row.id} --to <place>")
