from journal.features.voices.chosen_voice import ChosenVoice
from journal.features.voices.shipped import Shipped
from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import AGENT, SYSTEM, V3Row
from journal.models.environment import Environment

NUMBERED = {voice.name: n for n, voice in enumerate(Shipped.ALL, 1)}


class ProfilesShaper(Shaper):
    """The five voices as the profile rows version 3's voice page lists; the chosen one is marked."""

    type = "profile"

    def __init__(self, chosen: ChosenVoice) -> None:
        self.chosen = chosen

    def rows(self, environment: Environment) -> list[V3Row]:
        chosen = self.chosen.voice().name
        rows = []
        for n, voice in enumerate(Shipped.ALL, 1):
            row = V3Row(type="profile", n=n, title=voice.name.capitalize(), brief=voice.text, seen=[SYSTEM, AGENT], created=1.0, updated=1.0,
                        data={"calling": voice.calling.value, "sample": voice.sample, "system": True, "environment": environment.name, "files": {}, "humour": voice.humour, "naming": voice.naming,
                              "address": voice.address, "voice": voice.name, "emoji": voice.emoji, "introduction": "", "chosen": voice.name == chosen, "helper": "worker", "helpers": "workers"})
            rows.append(row)
        return rows
