from core.base.registry.registry import Registry
from core.base.registry.suite_entry import SuiteEntry
from core.base.registry.window_entry import WindowEntry
from core.base.viewer.layout_preset import LayoutPreset
from core.base.viewer.layout_shape import LayoutShape


class SuiteWindows:
    """The viewer windows and default layouts a suite offers: its own, then those of the suites it requires; for a
    page, the layout named for the driver wins over the plain page's; of two presets with one key the first is kept."""

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def windows(self, suite_name: str) -> list[WindowEntry]:
        offered = list(dict.fromkeys(name for suite in self.suites(suite_name) for name in suite.windows))
        return sorted((window for window in self.registry.windows if window.name in offered), key=lambda window: offered.index(window.name))

    def has_layout(self, suite_name: str, page: str, driver: str) -> bool:
        return any(key in suite.layouts for suite in self.suites(suite_name) for key in (f"{page}@{driver}", page))

    def layout(self, suite_name: str, page: str, driver: str) -> LayoutShape:
        return next(suite.layouts[key] for suite in self.suites(suite_name) for key in (f"{page}@{driver}", page) if key in suite.layouts)

    def presets(self, suite_name: str, page: str) -> list[LayoutPreset]:
        offered = [preset for suite in self.suites(suite_name) for preset in suite.presets.get(page, ())]
        first_presets: dict[str, LayoutPreset] = {}
        for preset in offered:
            first_presets.setdefault(preset.key, preset)
        return list(first_presets.values())

    def suites(self, suite_name: str) -> list[SuiteEntry]:
        suite = self.registry.suite(suite_name)
        if suite is None:
            return []
        return [suite, *(required for name in suite.requires for required in self.suites(name))]
