import controllers.types as types_module
from controllers.base import Controller
from resources import types

ACCEPT, ADJUST, DECLINE = "Accept", "Adjust", "Decline"
OPEN_SUGGESTIONS = 5



def adjusted(how: str) -> str:
    return ADJUST.lower() if how.strip() else ""


class Suggestions(Controller):
    resource = types.Suggestion

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        waiting = self._standing()
        if len(waiting) >= OPEN_SUGGESTIONS:
            self._refuse(f"{OPEN_SUGGESTIONS} suggestions already wait on the user: {', '.join(str(s.n) for s in waiting)}")
        declined = [s for s in self._every() if s.decision == DECLINE.lower() and s.title.lower() == title.lower()]
        if declined and not data.pop("despite", None):
            s = declined[-1]
            self._refuse(f"suggestion {s.n} was declined{': ' + s.outcome if s.outcome else ''}; --set despite=true --set because=\"<what changed>\" to propose it again")
        options = [{"title": ACCEPT, "description": "a to-do is filed from it", "code": ""},
                   {"title": ADJUST, "description": "say what to do differently below; a to-do is filed from your words", "code": ""},
                   {"title": DECLINE, "description": "it is not proposed again", "code": ""}]
        return super().create(title, abstract, brief, options=options, **data)

    def complete(self, n: int, how: str = "", **data):
        word = how.strip().split(":", 1)[0].strip().lower()
        decision = word if word in (ACCEPT.lower(), DECLINE.lower()) else adjusted(how)
        self.update(n, decision=decision)
        return super().complete(n, how, **data)


types_module.register(Suggestions)
