import time
from engine.extension import Extension
from resources.base import Refused, Resource, titled
from controllers.marks import action

FACES = ("👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩")
VOICE_FACES = Extension()
TWICE_WITHIN = 10.0


class Discussed:
    @action
    def comment(self, n: int, text: str) -> Resource:
        from controllers.types import Comments
        parent = self.peek(n)
        made = Comments(self.record, actor=self.actor).create(titled(text), brief=text.strip(), about=parent.ref)
        self._mark_commented(n, made)
        return made

    def _mark_commented(self, n: int, made: Resource) -> Resource:
        """Saves the row the comment is about with the comment named, unless a handler of the new comment has just saved it with the commenter among those who saw it: then it only says so."""
        row = self.load(n)
        if self.actor in row.seen and row.updated >= made.created:
            self._emit(n, "commented", comment=made.n)
            return row
        return self.save(row, "commented", comment=made.n)

    @action
    def comments(self, n: int) -> list[Resource]:
        from controllers.types import Comments
        return Comments(self.record, actor=self.actor).linked_to(f"{self.type}:{n}")

    @action
    def react(self, n: int, face: str) -> Resource | None:
        faces = (*FACES, *(own for faces_of in VOICE_FACES.each(self.record) for own in faces_of(self.record) if own not in FACES))
        if face not in faces:
            raise Refused(f"a reaction is one of {' '.join(faces)}")
        from controllers.types import Reactions
        r = self.peek(n)
        reactions = Reactions(self.record, actor=self.actor)
        for made in reactions.linked_to(r.ref):
            if made.face == face and made.author == self.actor:
                if time.time() - made.created < TWICE_WITHIN:
                    return made
                reactions.force_delete(made.n)
                return None
        return reactions.create(face, face=face, about=r.ref)
