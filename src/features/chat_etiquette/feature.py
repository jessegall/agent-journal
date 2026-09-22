from features.base import Feature
from features.chat_etiquette.details import ChatEtiquetteDetails
from features.chat_etiquette.handlers import NameShopTalk
from features.journal import Journal


class ChatEtiquette(Feature):
    details = ChatEtiquetteDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(NameShopTalk())
