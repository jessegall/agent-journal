from core.base.database.database import Database
from core.base.environment_names import EnvironmentNames
from core.base.journal_container import synced_container
from core.base.journal_home import JournalHome
from core.base.registry.registry import Registry
from core.base.registry.suite_windows import SuiteWindows
from core.modules.drivers.suite_choice import SuiteChoice
from server.viewer.viewer_window import ViewerWindow


class WindowsRoute:
    """Answers GET /api/windows: the windows the environment's suite offers, each with the URL of its entry carrying
    the registry's fingerprint, so a page reloads a window's files after an install or an upgrade."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def windows(self, environment: str) -> list[ViewerWindow]:
        container = synced_container(self.home)
        try:
            registry = container.get(Registry)
            suite = container.get(SuiteChoice).suite(container.get(EnvironmentNames).environment_id(environment))
            windows = SuiteWindows(registry).windows(suite.name) if suite is not None else []
        finally:
            container.get(Database).close()
        return [ViewerWindow.listed(window, registry.fingerprint) for window in windows]
