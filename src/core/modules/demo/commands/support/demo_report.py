from dataclasses import dataclass


@dataclass(frozen=True)
class DemoReport:
    """The lines `journal demo` prints."""

    lines: list[str]
