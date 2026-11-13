from collections.abc import Mapping
from dataclasses import dataclass, field
from engine.types.type_guards import is_mapping
from engine.caller.errors.caller_request_error import CallerRequestError

SESSION_VARIABLE = "JOURNAL_AGENT_SESSION"


@dataclass(frozen=True)
class CallerRequest:
    """What a run knows of its caller: the environment variables it was started with, its working folder, and
    the pid of the process that asked. A request from a hosted journal's agent does not trust its variables:
    only its chain of processes names its caller."""

    variables: Mapping[str, str] = field(default_factory=dict[str, str])
    folder: str = ""
    pid: int = 0
    trusts_variables: bool = True

    @property
    def process_id(self) -> int | None:
        number = self.variables.get("JOURNAL_PROCESS", "")
        return int(number) if number.isdecimal() else None

    @classmethod
    def parsed(cls, data: object) -> "CallerRequest":
        if not is_mapping(data):
            raise CallerRequestError(f"a caller request is an object, not {data!r}")
        variables, folder, pid = data.get("variables", {}), data.get("folder", ""), data.get("pid", 0)
        if not is_mapping(variables) or not all(isinstance(key, str) and isinstance(value, str) for key, value in variables.items()):
            raise CallerRequestError("variables names each variable with its text")
        if not isinstance(folder, str) or not isinstance(pid, int):
            raise CallerRequestError("folder is a text and pid a number")
        return cls({str(key): str(value) for key, value in variables.items()}, folder, pid)
