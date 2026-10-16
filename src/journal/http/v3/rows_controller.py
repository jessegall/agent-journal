from dataclasses import replace

from journal.http.request import Request
from journal.http.response import Response
from journal.http.v3.listing import Listing
from journal.http.v3.shapers.shapers import Shapers
from journal.http.v3.v3_row import USER, V3Row
from journal.repositories.environments import Environments

TIMELINES = ("message", "comment")
"""The lists that are a chat or a feed: they page by number alone, so opening the journal loads the last page and the rest comes on scrolling up."""


class RowsController:
    """One type's rows as the viewer reads them, with the type's counts; each type is read alone, so one that fails leaves the others answering."""

    def __init__(self, shapers: Shapers, environments: Environments) -> None:
        self.shapers, self.environments = shapers, environments

    def index(self, request: Request) -> Response:
        shaper = self.shapers.named(request.params["type"])
        if shaper is None:
            return Response.not_found(request.params["type"])
        listing = Listing.from_query(request.query)
        if shaper.type in TIMELINES:
            listing = replace(listing, timeline=True)
        rows = shaper.rows(self.environments.existing(request.environment))
        return Response.json({**listing.listed(rows), "counts": self.counts(rows)})

    @staticmethod
    def counts(rows: list[V3Row]) -> dict:
        open_ = [r for r in rows if r.is_open]
        return {"all": len(rows), "open": len(open_), "unread": len([r for r in open_ if USER not in r.seen])}
