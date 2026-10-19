from journal.features.search.support.search import CONVERSATION, Search
from journal.http.support.request import Request
from journal.support.response import Response


class SearchController:
    """The search page: every row here that holds all the words, in every model or the ones picked, and the conversations' lines when asked, as the search command finds them; the models it can pick from come with it."""

    def __init__(self, search: Search) -> None:
        self.search = search

    def index(self, request: Request) -> Response:
        words = str(request.query.get("words", "")).split()
        picked = [name for name in str(request.query.get("models", "")).split(",") if name] or self.search.models()
        asked = [*picked, CONVERSATION] if request.query.get("conversations") == "1" else picked
        return Response.json({"found": self.search.found_in(words, asked) if words else [], "models": self.search.models()})
