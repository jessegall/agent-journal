from engine.viewer.layout_shape import tabs
from engine.viewer.viewer_layout import ViewerLayout


class PhoneLayout(ViewerLayout):
    """The phone: one row of tabs."""

    shape = tabs("messages.chat", "questions.waiting", "questions.questions", "tasks.tasks", "plans.plans", "agents.agents", "coding.file-feed")
