from collections.abc import Sequence
from dataclasses import asdict, dataclass

from core.base.viewer.window_key import WindowKey
from server.viewer.timed_line_answer import TimedLineAnswer
from server.viewer.viewer_line_request import ViewerLineRequest
from server.viewer.window_data_body import WindowDataBody


@dataclass(frozen=True)
class WindowDataAnswer:
    """The keys a window asked for, the lines that filled them for the request log, and all the keys it declares."""

    keys: Sequence[WindowKey]
    lines: Sequence[ViewerLineRequest]
    answers: Sequence[TimedLineAnswer]
    declared_keys: Sequence[WindowKey]

    def body(self) -> WindowDataBody:
        return WindowDataBody({key.name: asdict(timed.answer) for key, timed in zip(self.keys, self.answers, strict=True)},
                              {key.name: key.listed() for key in self.declared_keys})
