"""What a suggestion is answered with, and how many may wait at once."""

from enum import StrEnum

YES, CHANGE, NO = "Yes, I want this", "Change it first", "No, don't do this"
OPEN_SUGGESTIONS = 5


class Decision(StrEnum):
    ACCEPT = "accept"
    ADJUST = "adjust"
    DECLINE = "decline"
    INSTALL = "install"
    NONE = ""

    @classmethod
    def of(cls, how: str) -> "Decision":
        word = how.strip().split(":", 1)[0].strip().lower()
        if word in WORDS:
            return WORDS[word]
        return cls.ADJUST if how.strip() else cls.NONE

    def files_todo(self) -> bool:
        return self in (Decision.ACCEPT, Decision.ADJUST)


WORDS = {YES.lower(): Decision.ACCEPT, "accept": Decision.ACCEPT, NO.lower(): Decision.DECLINE, "decline": Decision.DECLINE,
         "install": Decision.INSTALL}
