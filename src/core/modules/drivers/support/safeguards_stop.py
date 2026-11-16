import re
from dataclasses import dataclass

from engine.driver.hook_event import HookEvent

SAFEGUARDS_WORD = "safeguards"
REQUEST_ID = re.compile(r"req_\w+")


@dataclass(frozen=True)
class SafeguardsStop:
    """A turn the model's safeguards ended with an API error: the words of the error and the request id in them."""

    details: str
    request_id: str | None

    @classmethod
    def read(cls, event: HookEvent) -> "SafeguardsStop | None":
        details = event.failure_text
        if SAFEGUARDS_WORD not in details.lower():
            return None
        request = REQUEST_ID.search(details)
        return cls(details, request.group() if request is not None else None)
