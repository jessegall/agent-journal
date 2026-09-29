from features.base import Feature
from features.form_of_address.details import AddressDetails
from features.journal import Journal
from features.form_of_address.address import address
from features.session_briefing.start import ADDRESS, START_PARTS


class FormOfAddress(Feature):
    details = AddressDetails

    def register(self, journal: Journal) -> None:
        START_PARTS[ADDRESS] = addressed
        return None


def addressed(record) -> str:
    return address(record) if FormOfAddress.on_for(record) else ""
