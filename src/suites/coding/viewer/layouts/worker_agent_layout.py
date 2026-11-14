from engine.viewer.layout_shape import split, tabs
from engine.viewer.viewer_layout import ViewerLayout


class WorkerAgentLayout(ViewerLayout):
    """A worker's page as it opens: its file feed and terminal beside its points, to-dos, hook calls and tasks."""

    shape = split("row", 0.5, tabs("coding.file-feed", "coding.terminal"), tabs("workers.points", "workers.todos", "drivers.hook-calls", "tasks.tasks"))
