from collections.abc import Mapping, Sequence

from core.base.viewer.window_key import WindowKey
from server.viewer.line_route import LineRoute
from server.viewer.viewer_line_request import ViewerLineRequest
from server.viewer.viewer_lines_request import ViewerLinesRequest
from server.viewer.viewer_request_error import ViewerRequestError
from server.viewer.window_data_answer import WindowDataAnswer
from server.viewer.window_data_request import WindowDataRequest
from server.viewer.window_priorities import WindowPriorities


class WindowDataRoute:
    """Answers one window's data: it finds the window's keys, and runs those asked for, or those on screen when none
    is named, each through the line route with its permission checks. A key that fails leaves the others."""

    def __init__(self, windows: WindowPriorities, lines: LineRoute) -> None:
        self.windows, self.lines = windows, lines

    def declared(self, window: str) -> Sequence[WindowKey]:
        declaration = self.windows.window(window)
        if declaration is None:
            raise ViewerRequestError(f"no window {window}")
        return declaration.keys

    def keys(self, request: WindowDataRequest) -> tuple[WindowKey, ...]:
        declared_keys = self.declared(request.window)
        if not request.requested_keys:
            return tuple(key for key in declared_keys if key.shown_on(request.tab))
        keys_by_name = {key.name: key for key in declared_keys}
        return tuple(self.key_named(name, keys_by_name, request.window) for name in request.requested_keys)

    @staticmethod
    def key_named(name: str, keys_by_name: Mapping[str, WindowKey], window: str) -> WindowKey:
        if name in keys_by_name:
            return keys_by_name[name]
        for key in keys_by_name.values():
            id_key = key.of_id(name)
            if id_key is not None:
                return id_key
        raise ViewerRequestError(f"{window} has no data {name}")

    def answer(self, request: WindowDataRequest, person_id: int) -> WindowDataAnswer:
        keys = self.keys(request)
        lines = tuple(ViewerLineRequest(request.window, key.line(request.state), request.environment) for key in keys)
        return WindowDataAnswer(keys, lines, self.lines.timed_answers(ViewerLinesRequest(list(lines)), person_id), self.declared(request.window))
