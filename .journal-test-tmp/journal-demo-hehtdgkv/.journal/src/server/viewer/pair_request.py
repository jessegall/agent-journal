import json
from dataclasses import dataclass

from core.base.type_guards import is_mapping
from server.viewer.viewer_request_error import ViewerRequestError


@dataclass(frozen=True)
class PairRequest:
    """The body of POST /viewer/pair: the code a phone brings."""

    code: str

    @classmethod
    def parsed(cls, body: bytes) -> "PairRequest":
        try:
            data = json.loads(body or b"{}")
        except json.JSONDecodeError as error:
            raise ViewerRequestError("a pairing request is a JSON object with its code") from error
        code = data.get("code") if is_mapping(data) else None
        if not isinstance(code, str) or not code.strip():
            raise ViewerRequestError("a pairing request names the code the phone was given")
        return cls(code.strip())
