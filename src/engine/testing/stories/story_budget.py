from dataclasses import dataclass

POINTS_BUDGET = 20000
BUDGET_MARKER = "story_budget"


@dataclass(frozen=True)
class StoryBudget:
    """What a story's test body may cost in database points, which hold under any machine load; a story that
    needs more declares it with a reason."""

    points: int = POINTS_BUDGET

    def overrun(self, points: int) -> str:
        if points <= self.points:
            return ""
        return (f"the story cost {points} database points, over its budget of {self.points}: find what it repeats (a registry, "
                f"a template, a wait) or declare a larger budget with @pytest.mark.{BUDGET_MARKER}(points=..., reason=...)")
