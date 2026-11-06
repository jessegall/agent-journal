from core.base.journal_home import JournalHome
from core.base.module.module_finder import ModuleFinder
from core.base.viewer.window_priority import WindowPriority


class WindowPriorities:
    """The request priority each module declares for its windows, read once; an unknown window is NORMAL."""

    def __init__(self, home: JournalHome) -> None:
        self.finder = ModuleFinder(home)
        self.declared: dict[str, WindowPriority] | None = None

    def priority(self, window: str) -> WindowPriority:
        if self.declared is None:
            self.declared = {declared.name: declared.request_priority for module in self.finder.modules() for declared in module.windows}
        return self.declared.get(window, WindowPriority.NORMAL)
