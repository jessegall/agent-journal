from features.avatar.details import AvatarDetails
from framework.base import Feature
from framework.journal import Journal


class Avatar(Feature):
    details = AvatarDetails

    def register(self, journal: Journal) -> None:
        return None
