from dataclasses import dataclass, field


@dataclass(frozen=True)
class DashboardView:
    """A plugin's dashboard as the viewer's dashboard draws it: its title, the page it opens on and its pages, or why there is nothing to show."""

    title: str = ""
    start: str = ""
    pages: dict = field(default_factory=dict)
    missing: str = ""

    @classmethod
    def from_json(cls, raw: dict) -> "DashboardView":
        return cls(title=str(raw.get("title", "")), start=str(raw.get("start", "")), pages=dict(raw.get("pages", {})))

    def serialized(self) -> dict:
        return {"missing": self.missing} if self.missing else {"title": self.title, "start": self.start, "pages": self.pages}
