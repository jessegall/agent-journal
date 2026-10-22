import re
from dataclasses import dataclass

from journal.features.skills.support.skill_card import SkillCard


@dataclass(frozen=True)
class SkillsData:
    """The skills feature's reading: the skills the agent owes a read of, the hash of each it has read in this window, and every skill the journal ships."""

    skills_due: tuple[str, ...]
    loaded: dict
    skills: tuple[SkillCard, ...]

    def start_debts(self, names: tuple[str, ...], state: str) -> list[SkillCard]:
        return self.unread([card for card in self.skills if card.name in names or state in card.required_states])

    def mentioned(self, prompt: str) -> list[SkillCard]:
        text = {w.lower() for w in re.findall(r"[a-z]+", prompt, re.I)}
        return self.unread([card for card in self.skills if text & {k.lower() for k in card.keywords}])

    def unread(self, cards: list[SkillCard]) -> list[SkillCard]:
        return [card for card in cards if self.loaded.get(card.name) != card.digest]

    def debt_cards(self) -> list[SkillCard]:
        return [card for card in self.skills if card.name in self.skills_due]
