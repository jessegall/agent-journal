from controllers.base import Controller
from resources import types


class Nudges(Controller):
    resource = types.Nudge

    def _whispered(self, session: str) -> str:
        mine = [n for n in self.unread() if n.private and n.session == session]
        for n in mine:
            self.read(n.n)
        return "\n".join(dict.fromkeys(f"{n.title}{' — ' + n.brief if n.brief else ''}" for n in mine))
