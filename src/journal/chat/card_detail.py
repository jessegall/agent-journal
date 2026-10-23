DETAIL_CHARACTERS = 80


class CardDetail:
    """A chat card's second line, cut short to fit the card, with every line kept beside it when there are several."""

    @classmethod
    def parts(cls, detail: str) -> dict:
        lines = detail.strip().splitlines()
        if not lines:
            return {"detail": ""}
        head = {"detail": cls.shortened(lines[0])}
        return head | {"lines": lines} if len(lines) > 1 else head

    @staticmethod
    def shortened(detail: str) -> str:
        line = detail.strip()
        if len(line) <= DETAIL_CHARACTERS:
            return line
        return line[:DETAIL_CHARACTERS].rsplit(" ", 1)[0].rstrip(",.") + "…"
