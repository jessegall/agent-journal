from collections.abc import Sequence

from core.base.viewer.window_key import WindowKey
from core.base.viewer.window_key_line import WindowKeyLine
from server.viewer.line_route import LineRoute
from server.viewer.shared_row import SharedRow
from server.viewer.timed_line_answer import TimedLineAnswer
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

    def answer(self, request: WindowDataRequest, person_id: int, shared: SharedRow | None = None) -> WindowDataAnswer:
        keys = request.selected_keys(self.declared(request.window))
        lines = [ViewerLineRequest(request.window, key.line(request.state), request.environment) for key in keys]
        self.replace_answered_lines(keys, lines, request, person_id, shared)
        return WindowDataAnswer(keys, tuple(lines), self.read_lines(lines, person_id, shared), self.declared(request.window))

    def read_lines(self, lines: Sequence[ViewerLineRequest], person_id: int, shared: SharedRow | None) -> list[TimedLineAnswer]:
        requests = {(line.window, line.environment, tuple(line.line)): line for line in lines}
        answers = self.lines.timed_answers(ViewerLinesRequest(list(requests.values())), person_id, shared)
        answered = dict(zip(requests, answers))
        return [answered[(line.window, line.environment, tuple(line.line))] for line in lines]

    def replace_answered_lines(self, keys: Sequence[WindowKey], lines: list[ViewerLineRequest], request: WindowDataRequest, person_id: int, shared: SharedRow | None) -> None:
        places = [place for place, key in enumerate(keys) if key.answered_line]
        answers = self.read_lines([lines[place] for place in places], person_id, shared)
        for place, timed in zip(places, answers):
            if timed.answer.code != 0:
                continue
            key_line = WindowKeyLine.create(timed.answer.value)
            lines[place] = ViewerLineRequest(key_line.window, list(key_line.line), request.environment)
