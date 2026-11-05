from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class ReleaseNote:
    """What one published release says changed, and when it was published."""

    tag: str
    text: str
    published_at: str

    def json(self) -> Mapping[str, object]:
        return {"tag": self.tag, "text": self.text, "published_at": self.published_at}
