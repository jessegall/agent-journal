from dataclasses import dataclass


@dataclass(frozen=True)
class Nudge:
    """A line a feature can say to the agent, declared once: its name, its words as a template, and the feature that owns it, whose switch silences it."""

    feature: str
    name: str
    title: str
    brief: str = ""

    def about(self, **values) -> "Said":
        from journal.features.said import Said
        return Said(self.feature, self.name, self.title, self.brief, values)

    @property
    def key(self) -> str:
        """feature.name: what the entry records and dedupe compares."""
        return f"{self.feature}.{self.name}"
