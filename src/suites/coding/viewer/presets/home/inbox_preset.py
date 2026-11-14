from engine.viewer.layout_shape import split, tabs
from engine.viewer.viewer_preset import ViewerPreset


class InboxPreset(ViewerPreset):
    """The chat beside the plans and the tasks."""

    key = "inbox"
    name = "Inbox"
    text = "Chat, plans, tasks"
    shape = split("row", 0.6, tabs("messages.chat"), split("col", 0.5, tabs("plans.plans"), tabs("tasks.tasks")))
