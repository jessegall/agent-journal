from events.asking import RowWriting
from receiving import Refuser
from resources.base import Refused
from resources.suggestions import OPEN_SUGGESTIONS, Decision
from resources.types import Suggestion
from serving import ReadRows

SUGGESTING = "suggestion"


def proposed(event: RowWriting) -> dict:
    """What a suggestion about to be proposed says, or nothing when the write is no proposal."""
    return dict(event.fields) if (event.type, event.action) == (SUGGESTING, "create") else {}


class FiveWaitAtMost(Refuser[RowWriting]):
    def refuse(self, event: RowWriting, suggestions: ReadRows[Suggestion]) -> None:
        waiting = suggestions.rows.standing() if proposed(event) else []
        if len(waiting) >= OPEN_SUGGESTIONS:
            raise Refused(f"{OPEN_SUGGESTIONS} suggestions already wait on the user: {', '.join(str(s.n) for s in waiting)}. "
                          "Write the rest into your report as sections with journal report section <report n> \"<part>\" \"<body>\" and link it, or wait until the user answers one")


class NotAgainAfterNo(Refuser[RowWriting]):
    def refuse(self, event: RowWriting, suggestions: ReadRows[Suggestion]) -> None:
        given = proposed(event)
        declined = [s for s in suggestions.rows.every() if s.decision == Decision.DECLINE and s.title.lower() == given["title"].lower()] if given else []
        if declined and not given.get("despite"):
            s = declined[-1]
            raise Refused(f"suggestion {s.n} was declined{': ' + s.outcome if s.outcome else ''}; --set despite=true --set because=\"<what changed>\" to propose it again")
