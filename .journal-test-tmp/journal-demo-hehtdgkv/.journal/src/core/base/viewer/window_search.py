from collections.abc import Sequence
from dataclasses import dataclass

from core.base.dotted_path.dotted_path import DottedPath
from core.base.viewer.window_search_entry import WindowSearchEntry
from core.base.viewer.menu_item import MenuItem
from core.base.viewer.search_button import SearchButton
from core.base.viewer.window_searcher import WindowSearcher


@dataclass(frozen=True)
class WindowSearch:
    """The search of a window: the function from the terms to the rows found, the placeholder of its field, the
    menu behind the divider in the field and the button beside it."""

    search: type[WindowSearcher]
    placeholder: str
    context: Sequence[MenuItem] = ()
    button: SearchButton | None = None

    def listed(self) -> WindowSearchEntry:
        return WindowSearchEntry(searcher=DottedPath.class_path(self.search).text, placeholder=self.placeholder,
                                 context=[item.listed() for item in self.context], button=self.button.listed() if self.button is not None else {})

    def problems(self, window: str) -> list[str]:
        problems = [] if self.placeholder else [f"{window} declares a search with no placeholder"]
        return problems + [problem for item in self.context for problem in item.problems(window)]
