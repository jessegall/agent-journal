from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.support.actor import Actor
from journal.models.author import Author
from journal.models.link import Link
from journal.models.message import Message
from journal.models.reaction import Reaction
from journal.support.ref import Ref
from journal.repositories.links import Links
from journal.support.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository

REACTS = "reacts"


class Reactions(ScopedRepository[Reaction]):
    model = Reaction

    def __init__(self, connection: Connection, bus: Bus, scope: Scope, links: Links) -> None:
        super().__init__(connection, bus, scope)
        self.links = links

    def on(self, message: Message) -> list[Reaction]:
        return [self.find(ref.id) for ref in self.links.sources(message, REACTS)]

    def by_author(self, author: Author) -> int:
        return self.counted_in("author = ?", (author.value,))

    def toggle(self, message: Message, face: str, author: Author, by: Actor) -> Reaction | None:
        """The same face by the same side again takes it off; otherwise it goes on."""
        for made in self.on(message):
            if made.face == face and made.author == author:
                self.delete(made, by)
                return None
        made = self.save(Reaction(environment_id=message.environment_id, face=face, author=author), by)
        self.links.save(Link(source=Ref.to(made), target=Ref.to(message), kind=REACTS), by)
        return made
