from dataclasses import dataclass

UNMATCHED = "no recent line would have matched"


@dataclass(frozen=True)
class ClassPreview:
    """The newest lines a class would have matched, as lines a person reads and as JSON."""

    matched: tuple[str, ...]

    def lines(self) -> list[str]:
        return [f"{len(self.matched)} recent lines would have matched:", *self.matched] if self.matched else [UNMATCHED]

    def json(self) -> dict[str, object]:
        return {"lines": list(self.matched)}
