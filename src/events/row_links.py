"""What row links recognises: a file name the agent wrote that more than one project file bears."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class AmbiguousFileNamed(Fact):
    """The agent named a file by a bare name that this many project files share; these are the first of them."""

    name: str
    count: int
    paths: str
