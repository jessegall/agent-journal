import re

from journal.chat.cards import DETAIL_CHARACTERS

CODE_SYMBOLS = re.compile(r"[{}\[\]();=\"]")
CODE_SYMBOL_COUNT = 8
CARD_LINE_CHARACTERS = DETAIL_CHARACTERS


class CardLine:
    """Whether a line a reader picks reads as a status for the user on a card: neither code nor data, and short enough for the card's line, never cut to fit."""

    @staticmethod
    def is_poor(text: str) -> bool:
        return len(text) > CARD_LINE_CHARACTERS or len(CODE_SYMBOLS.findall(text)) >= CODE_SYMBOL_COUNT
