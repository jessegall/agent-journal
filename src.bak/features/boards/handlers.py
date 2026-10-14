from events import Fact
from events.boards import BoardFillingQuiet, CardsAddedToBoard
from features.boards.listeners import ADDED
from receiving import Handler
from resources.types import Board
from serving import Chat, Rows


def uncovered(missing: tuple[str, ...]) -> str:
    """What the goal will miss without a card for it, as the line words it, and nothing when every clause has a card."""
    if not missing:
        return ""
    return f" Name in the same line what the goal will miss without a card for it: {'; '.join(missing)}."


class OfferToPlaceAddedCards(Handler[CardsAddedToBoard]):
    def handle(self, event: CardsAddedToBoard, chat: Chat) -> list[Fact]:
        chat.say(ADDED, n=event.board, title=event.title, count=event.count, tickets=event.tickets, uncovered=uncovered(event.missing))
        return []


class MarkQuietFillingStalled(Handler[BoardFillingQuiet]):
    def handle(self, event: BoardFillingQuiet, boards: Rows[Board]) -> list[Fact]:
        boards.stall(event.board, f"nothing was written to the board for {event.seconds} seconds")
        return []
