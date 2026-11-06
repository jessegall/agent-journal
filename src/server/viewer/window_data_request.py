from collections.abc import Mapping
from dataclasses import dataclass
from urllib.parse import parse_qsl

from server.viewer.viewer_request_error import ViewerRequestError

WINDOW_HEADER = "x-journal-window"
KEYS_HEADER = "x-journal-data-only"
ENVIRONMENT_FIELD = "environment"
TAB_FIELD = "tab"


@dataclass(frozen=True)
class WindowDataRequest:
    """A GET of one window's data: the window and the keys it wants from its headers, its state from the query."""

    window: str
    requested_keys: tuple[str, ...]
    environment: str
    state: Mapping[str, str]

    @classmethod
    def parsed(cls, window: str | None, keys_header: str | None, query: str) -> "WindowDataRequest":
        if not window:
            raise ViewerRequestError(f"a window's data needs the header {WINDOW_HEADER}")
        state = dict(parse_qsl(query, keep_blank_values=True))
        if not state.get(ENVIRONMENT_FIELD):
            raise ViewerRequestError("a window's data names its environment")
        requested_keys = tuple(name.strip() for name in (keys_header or "").split(",") if name.strip())
        return cls(window, requested_keys, state[ENVIRONMENT_FIELD], state)

    @property
    def tab(self) -> str:
        return self.state.get(TAB_FIELD, "")
