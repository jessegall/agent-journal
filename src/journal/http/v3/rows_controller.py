from dataclasses import replace

from journal.http.request import Request
from journal.http.response import Response
from journal.http.v3.listing import Listing
from journal.http.v3.shapers.shapers import Shapers

TIMELINES = ("message", "comment")
"""The lists that are a chat or a feed: they page by number alone, so opening the journal loads the last page and the rest comes on scrolling up."""


class RowsController:
    """One type's rows as the viewer reads them, with the type's counts; each type is read alone, so one that fails leaves the others answering."""

    def __init__(self, shapers: Shapers) -> None:
        self.shapers = shapers

    def index(self, request: Request) -> Response:
        shaper = self.shapers.named(request.params["type"])
        listing = Listing.from_query(request.query)
        if shaper.type in TIMELINES:
            listing = replace(listing, timeline=True)
        return Response.json(shaper.answer(listing))
