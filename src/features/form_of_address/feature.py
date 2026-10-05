from features.base import Feature
from features.form_of_address.details import FormOfAddressDetails
from features.journal import Journal
from features.form_of_address.address import address
from features.session_briefing.start import ADDRESS, START_PARTS


class FormOfAddress(Feature):
    details = FormOfAddressDetails

    def register(self, journal: Journal) -> None:
        START_PARTS.add(self, address, key=ADDRESS)

