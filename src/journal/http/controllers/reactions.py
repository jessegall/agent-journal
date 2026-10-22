from journal.http.controllers.controller import Controller
from journal.http.counts import Counts
from journal.http.support.model_fields import ModelFields
from journal.models.author import Author
from journal.models.reaction import Reaction
from journal.repositories.reactions import REACTS, Reactions


class ReactionController(Controller[Reaction]):
    """The faces on messages, each with the message it sits on; a face the agent put on counts as unseen."""

    repository: Reactions

    def __init__(self, reactions: Reactions) -> None:
        self.repository = reactions

    def counts(self, rows: list[Reaction]) -> Counts:
        all_items = self.repository.count()
        return Counts(all=all_items, open=all_items, unread=self.repository.authored(Author.AGENT))

    def shown_page(self, rows: list[Reaction]) -> list[dict]:
        enabled = self.repository.linked(REACTS)
        return [{**ModelFields.build(r), "message_id": enabled[r.id][0].id if r.id in enabled else None} for r in rows]
