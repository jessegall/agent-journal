from features.base import Feature
from features.form_of_address.details import AddressDetails
from features.journal import Journal


class FormOfAddress(Feature):
    details = AddressDetails

    def register(self, journal: Journal) -> None:
        return None
