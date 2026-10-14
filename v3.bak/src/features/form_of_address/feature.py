from dataclasses import replace

from events.features import FeatureUpdated
from events.form_of_address import VoiceChanged
from expects import Dispatches, Given, Nudged, nothing
from features.form_of_address.handlers import TellVoiceChanged
from features.form_of_address.listeners import SpotVoiceChange
from framework.base import Feature
from controllers.types import Profiles
from features.form_of_address.details import FormOfAddressDetails
from framework.journal import Journal
from features.form_of_address.details import VOICE_SET
from declaring.registries import ADDRESS, START_PARTS
from resources.base import SYSTEM, USER
from resources.types import AgentRow
from resources.voices import VOICE_FACES


__all__ = ["Profiles"]

CHANGED = FeatureUpdated(n=0, type="feature", action="updated", actor=USER, setting="form_of_address")


def address(record) -> str:
    return Profiles(record, actor=SYSTEM).how_to_talk()


def voice_of(record):
    return Profiles(record, actor=SYSTEM).standing()


class FormOfAddress(Feature):
    details = FormOfAddressDetails

    def register(self, journal: Journal) -> None:
        START_PARTS.add(self, address, key=ADDRESS)
        VOICE_FACES.add(self, lambda record: voice_of(record).faces())
        journal.events.listen(FeatureUpdated, SpotVoiceChange(), expects=[
            Given(CHANGED, rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(VoiceChanged(agent=1)),
            Given(CHANGED) >> Dispatches(nothing),
            Given(replace(CHANGED, setting="phone"), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(nothing),
        ])
        journal.events.handle(VoiceChanged, TellVoiceChanged(), expects=[
            Given(VoiceChanged(agent=1), rows=[AgentRow(n=1, title="claude-1")], settings={"form_of_address.title": "Captain", "form_of_address.first_name": "Ada"})
                >> Nudged(VOICE_SET, voice="Captain Ada"),
        ])
