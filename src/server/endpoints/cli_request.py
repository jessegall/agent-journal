from core.base.caller.caller_request import CallerRequest
from core.base.deadline import Deadline
from core.base.timing import Timing
from core.base.type_guards import is_mapping, is_text_list
from dataclasses import dataclass, field
from server.endpoints.cli_request_error import CliRequestError


@dataclass(frozen=True)
class CliRequest:
    """One /cli request: the command line's words, what the server knows of its caller, the pid read from the
    socket rather than sent, how long the caller waits, when it says, and the request's timing."""

    argv: list[str]
    caller: CallerRequest
    deadline: Deadline | None = None
    timing: Timing = field(default_factory=Timing)

    @classmethod
    def parsed(cls, data: object, pid: int, timing: Timing) -> "CliRequest":
        if not is_mapping(data):
            raise CliRequestError("a /cli request is an object with argv, variables and folder")
        argv = data.get("argv")
        if not is_text_list(argv):
            raise CliRequestError("argv is the list of the command line's words")
        deadline_seconds = data.get("deadline_seconds")
        if deadline_seconds is not None and not isinstance(deadline_seconds, (int, float)):
            raise CliRequestError("deadline_seconds is a number of seconds")
        caller = CallerRequest.parsed({"variables": data.get("variables", {}), "folder": data.get("folder", ""), "pid": pid})
        return cls(argv, caller, Deadline.timeout(deadline_seconds) if deadline_seconds is not None else None, timing)
