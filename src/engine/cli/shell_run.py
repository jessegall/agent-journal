from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class ShellRun:
    """A shell line a journal word stands for, to run in the caller's folder with these variables set."""

    line: str
    variables: Mapping[str, str]
    folder: str
