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

    def toggle(self, message: Message, face: str, author: Author, actor: Actor) -> Reaction | None:
        for reaction in self.on(message):
            if reaction.face == face and reaction.author == author:
                self.delete(reaction, actor)
                return None
        reaction = self.save(Reaction(environment_id=message.environment_id, face=face, author=author).given_on(message.id), actor)
        self.links.save(Link(source=Ref.to(reaction), target=Ref.to(message), kind=REACTS), actor)
        return reaction
