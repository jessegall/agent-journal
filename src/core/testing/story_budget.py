import time
from dataclasses import dataclass

POINTS_BUDGET = 20000
CPU_SECONDS_BUDGET = 3.0
BUDGET_MARKER = "story_budget"


@dataclass(frozen=True)
class StoryBudget:
    """What a story's test body may cost: database points, which hold under any machine load, and the processor
    seconds of its own thread, which a busy machine barely changes; a story that needs more declares it with a
    reason."""

    points: int = POINTS_BUDGET
    cpu_seconds: float = CPU_SECONDS_BUDGET

    def overrun(self, points: int, cpu_seconds: float) -> str:
        parts = [f"{points} database points, over its budget of {self.points}" if points > self.points else "",
                 f"{cpu_seconds:.2f} processor seconds, over its budget of {self.cpu_seconds}" if cpu_seconds > self.cpu_seconds else ""]
        found = [part for part in parts if part]
        if not found:
            return ""
        return (f"the story cost {' and '.join(found)}: find what it repeats (a registry, a template, a wait) or declare a larger budget "
                f"with @pytest.mark.{BUDGET_MARKER}(points=..., cpu_seconds=..., reason=...)")

    @staticmethod
    def clock() -> float:
        return time.thread_time()
