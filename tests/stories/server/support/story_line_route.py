from core.base.container import Container
from core.base.database.database import Database
from core.base.journal_home import JournalHome
from core.testing.story_line_run import StoryLineRun
from core.base.database.repeated_work import RepeatedWork
from server.listener_thread import ListenerThread
from server.listener_wake import ListenerWake
from server.viewer.line_answer import LineAnswer
from server.viewer.line_route import LineRoute
from server.viewer.shared_row import SharedRow


class StoryLineRoute(LineRoute):
    """Checks repeated work around each viewer line on its selected container."""

    def __init__(self, home: JournalHome, listener_thread: ListenerThread) -> None:
        super().__init__(home, listener_thread)
        self.line_run = StoryLineRun(home, listener_runner=ListenerWake(listener_thread))

    def run_line(self, container: Container, window: str, argv: list[str], person_id: int, environment: str, shared: SharedRow | None) -> LineAnswer:
        work = container.get(Database).tally
        assert isinstance(work, RepeatedWork)
        with work.request():
            return super().run_line(container, window, argv, person_id, environment, shared)
