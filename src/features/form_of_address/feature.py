from controllers.discussion import VOICE_FACES
from framework.base import Feature
from controllers.types import Profiles
from features.form_of_address.details import FormOfAddressDetails
from framework.journal import Journal
from controllers.form_of_address.address import address, voice_of
from features.form_of_address.details import VOICE_SET
from declaring.registries import ADDRESS, START_PARTS


__all__ = ["Profiles"]


class FormOfAddress(Feature):
    details = FormOfAddressDetails

    def register(self, journal: Journal) -> None:
        START_PARTS.add(self, address, key=ADDRESS)
        VOICE_FACES.add(self, lambda record: voice_of(record).faces())

    def settings_changed(self, record, actor: str) -> None:
        self._announce_voice(record, actor)

    def _announce_voice(self, record, actor: str) -> None:
        """Tells the agent how it is called, once the profile that names it changed."""
        line = address(record)
        if line:
            self.to_primary(record, VOICE_SET, actor=actor, voice=line)
