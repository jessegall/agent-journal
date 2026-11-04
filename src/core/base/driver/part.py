from dataclasses import dataclass

from core.base.driver.classification import Classification
from core.base.driver.hook_event_error import HookEventError
from core.base.driver.hook_fields import mapping, text, texts


@dataclass(frozen=True)
class Part:
    """One command of a shell line: its text, program, subcommand and arguments, how it is classified, the
    paths it reads and writes, how it joins the next, and the saved command it came from with what the agent reads
    of its output, such as tail:5."""

    text: str
    program: str
    subcommand: str
    arguments: tuple[str, ...]
    classification: Classification
    input_paths: tuple[str, ...]
    output_paths: tuple[str, ...]
    next_operator: str
    pipe_target: int | None
    is_full_test_run: bool = False
    saved_command: str = ""
    read_flag: str = ""
    timeout_duration: str | None = None

    @classmethod
    def parsed(cls, data: object) -> "Part":
        fields = mapping(data, "part")
        timeout = fields.get("timeout_duration")
        if timeout is not None and not isinstance(timeout, str):
            raise HookEventError(f"timeout_duration is a duration string, not {timeout!r}")
        pipe_target = fields.get("piped_into")
        if pipe_target is not None and not isinstance(pipe_target, int):
            raise HookEventError(f"piped_into is a part's number, not {pipe_target!r}")
        return cls(text(fields, "text"), text(fields, "program"), text(fields, "subcommand"), texts(fields, "arguments"),
                   Classification.parsed(fields.get("classification")), texts(fields, "read_paths"), texts(fields, "write_paths"),
                   text(fields, "joined_by"), pipe_target, fields.get("is_full_test_run") is True, text(fields, "saved_command"), text(fields, "read_flag"), timeout)
