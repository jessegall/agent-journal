from features.base import Feature
from features.form_of_address.controller import Profiles
from features.form_of_address.details import VOICE_SET, FormOfAddressDetails
from features.journal import Journal
from features.form_of_address.address import address
from features.session_briefing.start import ADDRESS, START_PARTS


__all__ = ["Profiles"]


class FormOfAddress(Feature):
    details = FormOfAddressDetails

    def register(self, journal: Journal) -> None:
        START_PARTS.add(self, address, key=ADDRESS)

    def settings_changed(self, record, actor: str) -> None:
        line = address(record)
        if line:
            self.to_primary(record, VOICE_SET, actor=actor, voice=line)
