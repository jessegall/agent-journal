from events.asking import RowWriting
from receiving import Refuser
from resources.base import Refused
from resources.types import Ticket
from serving import ReadRows

CARD_LINE = 140
CARD_TITLE = 60


class DraftsCarryOneLine(Refuser[RowWriting]):
    def refuse(self, event: RowWriting, tickets: ReadRows[Ticket]) -> None:
        args = dict(event.fields)
        if event.type != "ticket" or event.action not in ("create", "update") or not tickets.would_be_draft(args):
            return
        line = args.get("abstract")
        if ("n" not in args or line is not None) and not 0 < len((line or "").strip()) <= CARD_LINE:
            raise Refused(f'a draft ticket carries --abstract "<one line>" of at most {CARD_LINE} characters, shown whole on its card; '
                          f'the deeper explanation goes in --brief and shows under More info')
        if len((args.get("title") or "").strip()) > CARD_TITLE:
            raise Refused(f"a draft ticket's title names it in at most {CARD_TITLE} characters, so its card shows it whole")
