from collections.abc import Sequence
from dataclasses import asdict, dataclass

from core.base.viewer.window_key import WindowKey
from server.viewer.line_route import LineRoute
from server.viewer.timed_line_answer import TimedLineAnswer
from server.viewer.viewer_line_request import ViewerLineRequest
from server.viewer.viewer_lines_request import ViewerLinesRequest
from server.viewer.viewer_request_error import ViewerRequestError
from server.viewer.window_data_request import WindowDataRequest
from server.viewer.window_priorities import WindowPriorities


@dataclass(frozen=True)
class WindowDataAnswer:
    """The keys a window asked for, the lines that filled them for the request log, and what the window declares."""

    keys: Sequence[WindowKey]
    lines: Sequence[ViewerLineRequest]
    answers: Sequence[TimedLineAnswer]

    def body(self, declared: Sequence[WindowKey]) -> dict[str, object]:
        return {"keys": {key.name: asdict(timed.answer) for key, timed in zip(self.keys, self.answers, strict=True)},
                "declared": {key.name: key.listed() for key in declared}}


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
        declared = self.declared(request.window)
        if not request.only:
            return tuple(key for key in declared if key.is_on_screen(request.tab))
        by_name = {key.name: key for key in declared}
        unknown = [name for name in request.only if name not in by_name]
        if unknown:
            raise ViewerRequestError(f"{request.window} has no data {', '.join(unknown)}")
        return tuple(by_name[name] for name in request.only)

    def answer(self, request: WindowDataRequest, person_id: int) -> WindowDataAnswer:
        keys = self.keys(request)
        lines = tuple(ViewerLineRequest(request.window, key.line(request.state), request.environment) for key in keys)
        return WindowDataAnswer(keys, lines, self.lines.timed_answers(ViewerLinesRequest(list(lines)), person_id))
