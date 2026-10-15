from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import AGENT, USER, V3Row
from journal.models.author import Author
from journal.models.environment import Environment
from journal.repositories.links import Links
from journal.repositories.reactions import Reactions


class ReactionsShaper(Shaper):
    """A face on a message, as version 3 drew it: its face in the title and the data, the message in the refs, the side that put it as the first seer."""

    type = "reaction"

    def __init__(self, reactions: Reactions, links: Links) -> None:
        self.reactions, self.links = reactions, links

    def rows(self, environment: Environment) -> list[V3Row]:
        return [V3Row.of("reaction", r, title=r.face, data={"face": r.face}, seen=[USER if r.author == Author.USER else AGENT],
                         refs=[f"message:{ref.id}" for ref in self.links.targets(r, "reacts")]) for r in self.reactions.in_(environment.id)]
