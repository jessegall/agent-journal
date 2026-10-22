from journal.features.search.support.search import CONVERSATION, Search
from journal.http.support.request import Request
from journal.support.response import Response


class SearchController:
    """The search page: every row here that holds all the words, in every model or the ones model_names, and the conversations' lines when names, as the search command finds them; the models it can pick from come with it."""

    def __init__(self, search: Search) -> None:
        self.search = search

    def index(self, request: Request) -> Response:
        text = str(request.query.get("words", "")).split()
        model_names = [name for name in str(request.query.get("models", "")).split(",") if name] or self.search.models()
        names = [*model_names, CONVERSATION] if request.query.get("conversations") == "1" else model_names
        return Response.json({"found": self.search.kind_hits(text, names) if text else [], "models": self.search.models()})
