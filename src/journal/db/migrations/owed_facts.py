from dataclasses import dataclass, replace


@dataclass(frozen=True)
class OwedFacts:
    """What an agent owed the journal, as the facts on its row that the owed pauses became: not oriented, the mark owed, the skills owed."""

    oriented: bool = True
    mark_owed: int = 0
    skills: tuple[str, ...] = ()

    def owing(self, state: str, mark: int, skill: str) -> "OwedFacts":
        if state == "orienting":
            return replace(self, oriented=False)
        if state == "at_mark":
            return replace(self, mark_owed=max(self.mark_owed, mark))
        if state == "loading_skill" and skill:
            return replace(self, skills=(*self.skills, skill))
        return self
