from journal.chat.process_card_poll import ProcessCardPoll
from journal.http.support.request import Request
from journal.support.response import Response


class ProcessCardController:
    """The fields each active process card in the chat shows now, which the viewer asks for every second while any of them runs."""

    def __init__(self, refresh: ProcessCardPoll) -> None:
        self.refresh = refresh

    def fields(self, request: Request) -> Response:
        ids = [int(n) for n in request.query.get("ids", "").split(",") if n.strip().isdigit()]
        return Response.json(self.refresh.fields(ids))
