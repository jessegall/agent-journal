import time
from resources.base import Refused, Resource, titled
from controllers.marks import action

FACES = ("👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩")
TWICE_WITHIN = 10.0


class Discussed:
    @action
    def comment(self, n: int, text: str) -> Resource:
        from controllers.types import Comments
        parent = self.load(n)
        made = Comments(self.record, actor=self.actor).create(titled(text), brief=text.strip(), about=parent.ref)
        self._mark_commented(n, made)
        return made

    def _mark_commented(self, n: int, made: Resource) -> Resource:
        return self.save(self.load(n), "commented", comment=made.n)

    @action
    def comments(self, n: int) -> list[Resource]:
        from controllers.types import Comments
        return Comments(self.record, actor=self.actor).linked_to(f"{self.type}:{n}")

    @action
    def react(self, n: int, face: str) -> Resource | None:
        if face not in FACES:
            raise Refused(f"a reaction is one of {' '.join(FACES)}")
        from controllers.types import Reactions
        r = self.load(n)
        reactions = Reactions(self.record, actor=self.actor)
        for made in reactions.linked_to(r.ref):
            if made.face == face and made.author == self.actor:
                if time.time() - made.created < TWICE_WITHIN:
                    return made
                reactions.force_delete(made.n)
                return None
        return reactions.create(face, face=face, about=r.ref)
