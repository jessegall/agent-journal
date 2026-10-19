from journal.http.controllers.controller import Controller
from journal.http.counts import Counts
from journal.http.model_fields import ModelFields
from journal.models.author import Author
from journal.models.reaction import Reaction
from journal.repositories.reactions import REACTS, Reactions


class ReactionController(Controller[Reaction]):
    """The faces on messages, each with the message it sits on; a face the agent put on counts as unseen."""

    def __init__(self, reactions: Reactions) -> None:
        self.repository = reactions

    def counts(self, rows: list[Reaction]) -> Counts:
        every = self.repository.counted_in()
        return Counts(all=every, open=every, unread=self.repository.by_author(Author.AGENT))

    def shown_page(self, rows: list[Reaction]) -> list[dict]:
        on = self.repository.linked(REACTS)
        return [{**ModelFields.of(r), "message_id": on[r.id][0].id if r.id in on else None} for r in rows]
