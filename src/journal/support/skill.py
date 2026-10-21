from dataclasses import dataclass


@dataclass(frozen=True)
class Skill:
    """A feature's teaching: what the agent must know to use it, written to the agent's skills folder and required at the moments the feature names."""

    name: str
    description: str
    body: str
    keywords: tuple[str, ...] = ()
    required_in: tuple[str, ...] = ()

    @property
    def folder(self) -> str:
        return f"journal-{self.name}" if self.name != "journal" else "journal"

    def text(self) -> str:
        return f"---\nname: {self.folder}\ndescription: {self.description}\n---\n\n{self.body.strip()}\n"
