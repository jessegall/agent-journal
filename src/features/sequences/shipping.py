from dataclasses import dataclass, field, replace


@dataclass(frozen=True)
class ShippedSequence:
    title: str
    brief: str
    steps: list
    starts_on: str = ""
    started_by: str = ""
    talks_in: str = ""
    dispatch: str = ""
    lasting: bool = False
    only_when_idle: bool = False
    unless: dict = field(default_factory=dict)
    words: tuple = ()

    def started_on(self, starts_on: str) -> "ShippedSequence":
        return replace(self, starts_on=starts_on)

    def written_out(self) -> str:
        steps = "\n".join(f"{i}. {title}: {body}" for i, (title, body) in enumerate(self.steps, 1))
        return f"## {self.title}\n\n{self.brief}\n\n{steps}"
