import re

CODES = re.compile(r"\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b")


class ColourCodes:
    """Takes the colour and cursor codes a program prints out of a text, so no escape is left in what a mark or a
    card shows or a reader reads."""

    @staticmethod
    def removed(text: str) -> str:
        return CODES.sub("", text)
