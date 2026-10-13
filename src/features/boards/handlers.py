from events import Fact
from events.boards import BoardFillingQuiet, CardsAddedToBoard
from features.boards.listeners import ADDED
from receiving import Handler
from resources.types import Board
from serving import Chat, Rows


class OfferToPlaceAddedCards(Handler[CardsAddedToBoard]):
    def handle(self, event: CardsAddedToBoard, chat: Chat) -> list[Fact]:
        chat.say(ADDED, n=event.board, title=event.title, count=event.count, tickets=event.tickets, uncovered=event.uncovered)
        return []


class MarkQuietFillingStalled(Handler[BoardFillingQuiet]):
    def handle(self, event: BoardFillingQuiet, boards: Rows[Board]) -> list[Fact]:
        boards.stall(event.board, f"nothing was written to the board for {event.seconds} seconds")
        return []
