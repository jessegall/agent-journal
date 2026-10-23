from journal.chat.process_card import ProcessCard
from journal.repositories.messages import Messages


class ProcessCardPoll:
    """The fields each active process card shows now, asked of the process card class its message names, for the viewer's poll every second."""

    def __init__(self, messages: Messages, cards: dict[str, ProcessCard]) -> None:
        self.messages, self.cards = messages, cards

    def fields(self, ids: list[int]) -> dict[str, dict]:
        return {str(message.id): self.cards[message.data["process"]].refresh(message) for message in self.messages.active_cards(ids)}
