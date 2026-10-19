from journal.features.search.search import Search
from journal.http.support.request import Request
from journal.support.response import Response


class SearchController:
    """The search page: every row and conversation line here that holds all the words, as the search command finds them."""

    def __init__(self, search: Search) -> None:
        self.search = search

    def index(self, request: Request) -> Response:
        words = str(request.query.get("words", "")).split()
        return Response.json({"found": self.search.found(words) if words else []})
