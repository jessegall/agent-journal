from core.base.refusal import Refusal
from core.modules.viewer.guards.person_row_guard import PersonRowGuard
from core.modules.viewer.models.viewer_layout import ViewerLayout
from core.base.change.changed import Changed
from core.base.command.context import Context


class LayoutOwnerGuard(PersonRowGuard[Changed[ViewerLayout]]):
    """Refuses a layout written by anyone but the person it is for, so no agent or other person arranges
    someone's pages."""

    name = "viewer.layout-owner"
    refusal = Refusal("this layout belongs to another person")
    question = "Change this saved layout?"
