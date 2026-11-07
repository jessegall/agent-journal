from typing import ClassVar


class PerformanceTool:
    """A developer tool that measures how fast the journal runs. A module lists it in performance_tools, and the
    engine calls its measure only through PerformanceTools, which keeps every tool quiet while tests run."""

    name: ClassVar[str]

    def measure(self, *values: object) -> object:
        raise NotImplementedError
