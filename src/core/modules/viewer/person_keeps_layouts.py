from core.base.refusal import Refusal
from core.modules.viewer.person_row_guard import PersonRowGuard
from core.modules.viewer.viewer_layout import ViewerLayout


class PersonKeepsLayouts(PersonRowGuard):
    """Refuses a layout written by anyone but the person it is for, so no agent or other person arranges someone's
    pages."""

    name = "viewer.person-keeps-layouts"
    event = "viewer_layout.*"
    model = ViewerLayout
    refusal = Refusal("only a person keeps a layout", "the viewer saves a layout when the person arranges a page")
