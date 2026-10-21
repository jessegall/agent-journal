from dataclasses import dataclass


@dataclass(frozen=True)
class OpenTask:
    """An open task named by its number, title and brief, with the plan it is next in when a plan holds it."""

    id: int
    title: str
    brief: str
    plan_id: int

    def line(self) -> str:
        plan = f"plan {self.plan_id}: " if self.plan_id else ""
        brief = f". brief: {self.brief}" if self.brief else ""
        return f"{plan}task {self.id}, {self.title} is next{brief}"
