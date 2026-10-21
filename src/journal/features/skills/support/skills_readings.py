import re
from dataclasses import dataclass

from journal.features.skills.support.skill_card import SkillCard

JOURNAL = "journal"


@dataclass(frozen=True)
class SkillsReadings:
    """The skills feature's reading: the skills the agent owes a read of, the hash of each it has read in this window, and every skill the journal ships."""

    owed: tuple[str, ...]
    loaded: dict
    skills: tuple[SkillCard, ...]

    def due_at_start(self, state: str) -> list[SkillCard]:
        return self.unread([card for card in self.skills if card.name == JOURNAL] + [card for card in self.skills if state in card.required_in])

    def named_in(self, prompt: str) -> list[SkillCard]:
        text = {w.lower() for w in re.findall(r"[a-z]+", prompt, re.I)}
        return self.unread([card for card in self.skills if text & {k.lower() for k in card.keywords}])

    def unread(self, cards: list[SkillCard]) -> list[SkillCard]:
        return [card for card in cards if self.loaded.get(card.name) != card.digest]

    def owed_cards(self) -> list[SkillCard]:
        return [card for card in self.skills if card.name in self.owed]
