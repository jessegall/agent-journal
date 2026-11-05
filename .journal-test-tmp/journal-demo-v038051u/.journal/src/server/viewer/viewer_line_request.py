from dataclasses import dataclass

from core.base.type_guards import is_mapping, is_text_list
from server.viewer.viewer_request_error import ViewerRequestError


@dataclass(frozen=True)
class ViewerLineRequest:
    """The body of POST /api/line: the window that sends the line, the line's arguments and the environment it
    runs in, each required."""

    window: str
    line: list[str]
    environment: str

    @classmethod
    def parsed(cls, data: object) -> "ViewerLineRequest":
        if not is_mapping(data):
            raise ViewerRequestError("a line request is a JSON object")
        window, arguments, environment = data.get("window"), data.get("line"), data.get("environment")
        if not isinstance(window, str) or not window:
            raise ViewerRequestError("every line names the window that sends it")
        if not is_text_list(arguments) or not isinstance(environment, str):
            raise ViewerRequestError("a line names its arguments as a list of words and its environment")
        return cls(window, list(arguments), environment)
