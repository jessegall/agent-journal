from features.base import Feature
from features.clean_slate.details import CleanSlateDetails
from features.journal import Journal


class CleanSlate(Feature):
    details = CleanSlateDetails

    def register(self, journal: Journal) -> None:
        pass
