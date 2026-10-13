from events import Fact
from events.chat_etiquette import EtiquetteDue, ShopTalkInChat, ThickProseInChat, ThirdPersonInChat
from features.chat_etiquette.details import PROSE, REMIND, SHOP, THIRD_PERSON
from receiving import Handler
from serving import Chat


class NameShopTalk(Handler[ShopTalkInChat]):
    def handle(self, event: ShopTalkInChat, chat: Chat) -> list[Fact]:
        chat.nudge(SHOP, words=event.words)
        return []


class NameThirdPerson(Handler[ThirdPersonInChat]):
    def handle(self, event: ThirdPersonInChat, chat: Chat) -> list[Fact]:
        chat.nudge(THIRD_PERSON, words=event.words)
        return []


class RemindOfEtiquette(Handler[EtiquetteDue]):
    def handle(self, event: EtiquetteDue, chat: Chat) -> list[Fact]:
        chat.nudge(REMIND)
        return []


class NameThickProse(Handler[ThickProseInChat]):
    def handle(self, event: ThickProseInChat, chat: Chat) -> list[Fact]:
        chat.nudge(PROSE, dashes=event.dashes)
        return []
