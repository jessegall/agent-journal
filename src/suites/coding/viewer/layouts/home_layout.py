from engine.viewer.layout_shape import split, tabs
from engine.viewer.viewer_layout import ViewerLayout


class HomeLayout(ViewerLayout):
    """The home page as it opens: the chat and terminal beside the tasks, plans, questions and file feed."""

    shape = split("row", 0.5, tabs("messages.chat", "coding.terminal"), tabs("tasks.tasks", "plans.plans", "questions.questions", "coding.file-feed", active="coding.file-feed"))
