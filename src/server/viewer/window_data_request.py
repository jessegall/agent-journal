from collections.abc import Mapping
from dataclasses import dataclass
from urllib.parse import parse_qsl

from server.viewer.viewer_request_error import ViewerRequestError

WINDOW_HEADER = "x-journal-window"
DATA_ONLY_HEADER = "x-journal-data-only"
ENVIRONMENT_NAME = "environment"
TAB_NAME = "tab"


@dataclass(frozen=True)
class WindowDataRequest:
    """A GET of one window's data: the window and the keys it wants from its headers, its state from the query."""

    window: str
    only: tuple[str, ...]
    environment: str
    state: Mapping[str, str]

    @classmethod
    def parsed(cls, window: str | None, only: str | None, query: str) -> "WindowDataRequest":
        if not window:
            raise ViewerRequestError(f"a window's data needs the header {WINDOW_HEADER}")
        state = dict(parse_qsl(query, keep_blank_values=True))
        if not state.get(ENVIRONMENT_NAME):
            raise ViewerRequestError("a window's data names its environment")
        keys = tuple(name.strip() for name in (only or "").split(",") if name.strip())
        return cls(window, keys, state[ENVIRONMENT_NAME], state)

    @property
    def tab(self) -> str:
        return self.state.get(TAB_NAME, "")
