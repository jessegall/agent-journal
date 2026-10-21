from journal.support.deferred import Deferred
from journal.events.listener import Listener
from journal.events.models.saved import Saved
from journal.features.mentions.support.mentioned import Mentioned
from journal.support.actor import Actor
from journal.models.link import Link
from journal.models.model import Model
from journal.support.ref import Ref
from journal.repositories.links import Links

MENTIONS = "mentions"


class LinkMentions(Listener[Saved]):
    """A row saved with text of its own is linked to every row its text names that exists, on the deferred worker after the write has answered, never on the write's thread."""

    def __init__(self, deferred: Deferred, links: Links) -> None:
        self.deferred, self.links = deferred, links

    def handle(self, event: Saved) -> None:
        if isinstance(event.model, Link) or not event.model.mentioning_text():
            return
        self.deferred.add(lambda row=event.model, actor=event.actor: self.link(row, actor))

    def link(self, row: Model, actor: Actor) -> None:
        source = Ref.to(row)
        for target in Mentioned.in_(row.mentioning_text()):
            if target != source and self.links.is_row(target) and not self.links.where(source=source, target=target, kind=MENTIONS):
                self.links.save(Link(source=source, target=target, kind=MENTIONS), actor)
