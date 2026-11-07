from dataclasses import dataclass

from core.base.type_guards import is_list, is_mapping
from server.viewer.viewer_line_request import ViewerLineRequest
from server.viewer.viewer_request_error import ViewerRequestError


@dataclass(frozen=True)
class ViewerLinesRequest:
    """The body of POST /api/lines: command lines, answered in the order they are given."""

    lines: list[ViewerLineRequest]

    @classmethod
    def parsed(cls, data: object) -> "ViewerLinesRequest":
        entries = data["lines"] if is_mapping(data) and "lines" in data else None
        if not is_list(entries):
            raise ViewerRequestError("a lines request is a JSON object with a list of lines")
        return cls([ViewerLineRequest.parsed(entry) for entry in entries])
