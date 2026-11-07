from core.base.database.database import Database
from core.base.environment_names import EnvironmentNames
from core.base.journal_container import synced_container
from core.base.journal_home import JournalHome
from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.base.registry.suite_windows import SuiteWindows
from core.base.viewer.window_place import WindowPlace
from core.modules.drivers.support.active_modules import ActiveModules
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.base.scope.scopes import Scopes
from server.viewer.unknown_environment_error import UnknownEnvironmentError
from core.base.registry.window_listing import WindowListing


class WindowsRoute:
    """Answers GET /api/windows: the windows the environment's suite offers and the sections of its active
    modules, the shipped sections first, each with the URL of its entry carrying the registry's fingerprint,
    so a page reloads a window's files after an install or an upgrade."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def windows(self, environment: str) -> list[WindowListing]:
        container = synced_container(self.home)
        try:
            registry = container.get(Registry)
            try:
                environment_id = container.get(EnvironmentNames).environment_id(environment)
            except Refusal as refusal:
                raise UnknownEnvironmentError(refusal.reason) from refusal
            with container.get(Scopes).read_scope((), None, environment_id):
                suite = container.get(SuiteChoice).suite()
                windows = SuiteWindows(registry).windows(suite.name) if suite is not None else []
                active = container.get(ActiveModules)
                sections = [window for window in registry.windows if window.place == WindowPlace.SECTION and active.is_active(window.module)]
                settings = container.get(SettingValues)
                windows = [window for window in (*windows, *sorted(sections, key=lambda section: not section.shipped)) if all(settings.flag(key) for key in window.required_settings)]
        finally:
            container.get(Database).close()
        return [window.listing(registry.module_fingerprints[window.module]) for window in windows]
