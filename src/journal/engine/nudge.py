from dataclasses import dataclass


@dataclass(frozen=True)
class Nudge:
    """A line a feature can say to the agent, declared once: its name, its words as a template, and the feature that owns it, whose switch silences it."""

    feature: str
    name: str
    title: str
    brief: str = ""
    repeat_after: float = 300.0
    """Seconds before the same line may be said again to the same agent; 0 says it every time."""
    answered_in_chat: bool = False
    """Whether the agent's answer to this line is for the user and belongs in the chat, as an introduction or a reply does; otherwise a turn that only acknowledges the line is kept out of it."""

    def about(self, **values) -> "Said":
        from journal.support.said import Said
        return Said(feature=self.feature, name=self.name, title=self.title, brief=self.brief, repeat_after=self.repeat_after, answered_in_chat=self.answered_in_chat, values=values)

    @property
    def key(self) -> str:
        """feature.name: what the entry records and dedupe compares."""
        return f"{self.feature}.{self.name}"
