import re

CODE_SYMBOLS = re.compile(r"[{}\[\]();=\"]")
CODE_SYMBOL_COUNT = 8
CARD_LINE_CHARACTERS = 200


class CardLine:
    """Whether a line a reader picks reads as a status for the user on a card: neither code nor data, and short enough for the card."""

    @staticmethod
    def is_poor(text: str) -> bool:
        return len(text) > CARD_LINE_CHARACTERS or len(CODE_SYMBOLS.findall(text)) >= CODE_SYMBOL_COUNT
