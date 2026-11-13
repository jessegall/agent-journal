from engine.container.container import Container
from collections.abc import Callable
from engine.cli.line_run import ignore_completed
from engine.database.database import Database
from engine.database.reported_findings import ReportedFindings
from engine.journal.journal_home import JournalHome
from engine.testing.stories.story_line_run import StoryLineRun
from engine.database.repeated_work import RepeatedWork
from server.work.listeners.listener_thread import ListenerThread
from server.work.listeners.listener_wake_router import ListenerWakeRouter
from server.work.listeners.listener_wake import ListenerWake
from server.viewer.line_answer import LineAnswer
from server.viewer.line_route import LineRoute
from server.viewer.shared_row import SharedRow


class StoryLineRoute(LineRoute):
    """Checks repeated work around each viewer line on its selected container."""

    def __init__(self, home: JournalHome, wakes: ListenerWakeRouter, reported: ReportedFindings, completion_callback: Callable[[Container, list[str]], None] = ignore_completed) -> None:
        super().__init__(home, wakes, reported, completion_callback=completion_callback)
        self.line_run = StoryLineRun(home, listener_runner=ListenerWake(wakes), reported=reported, completion_callback=completion_callback)

    def run_line(self, container: Container, window: str, argv: list[str], person_id: int, environment: str, shared: SharedRow | None) -> LineAnswer:
        work = container.get(Database).repeated_work
        assert isinstance(work, RepeatedWork)
        with work.request():
            return super().run_line(container, window, argv, person_id, environment, shared)
