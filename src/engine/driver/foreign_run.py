from collections.abc import Mapping
from dataclasses import dataclass, field

from engine.driver.hook_event_error import HookEventError
from engine.driver.hook_fields import boolean, mapping, number, text
from engine.types.type_guards import is_list

REQUIRED_KEYS = ("id", "exit_code", "stdout", "stderr", "milliseconds", "timed_out")


@dataclass(frozen=True)
class ForeignRun:
    """The result of one managed hook on one firing."""

    id: str
    exit_code: int
    stdout: str
    stderr: str
    milliseconds: int
    timed_out: bool
    answer: Mapping[str, object] = field(default_factory=dict[str, object])

    @classmethod
    def parsed(cls, data: object) -> "ForeignRun":
        fields = mapping(data, "a foreign hook run")
        missing = [key for key in REQUIRED_KEYS if key not in fields]
        if missing:
            raise HookEventError(f"a foreign hook run needs {', '.join(missing)}")
        milliseconds = number(fields, "milliseconds")
        if milliseconds < 0:
            raise HookEventError(f"milliseconds is nonnegative, not {milliseconds}")
        answer = mapping(fields.get("answer", {}), "a foreign hook answer")
        return cls(text(fields, "id"), number(fields, "exit_code"), text(fields, "stdout"), text(fields, "stderr"), milliseconds, boolean(fields, "timed_out"),
                   {str(key): value for key, value in answer.items()})

    @classmethod
    def parsed_many(cls, data: object) -> tuple["ForeignRun", ...]:
        if not is_list(data):
            raise HookEventError(f"foreign is a list, not {data!r}")
        return tuple(cls.parsed(run) for run in data)
