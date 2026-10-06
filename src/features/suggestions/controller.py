import time
from enum import StrEnum

import controllers.types as types_module
from controllers.base import Controller
from controllers.types import Plugins
from resources import types
from controllers.marks import action
from resources.base import SYSTEM, USER

YES, CHANGE, NO = "Yes, I want this", "Change it first", "No, don't do this"
OPEN_SUGGESTIONS = 5
ACCEPTING = {"title": YES, "description": "Adds it as a to-do", "code": ""}
ADJUSTING = {"title": CHANGE, "description": "Write your version as a to-do", "code": ""}
DECLINING = {"title": NO, "description": "The agent won't suggest it again", "code": ""}


class Decision(StrEnum):
    ACCEPT = "accept"
    ADJUST = "adjust"
    DECLINE = "decline"
    INSTALL = "install"
    NONE = ""

    @classmethod
    def of(cls, how: str) -> "Decision":
        word = how.strip().split(":", 1)[0].strip().lower()
        if word in WORDS:
            return WORDS[word]
        return cls.ADJUST if how.strip() else cls.NONE

    def files_todo(self) -> bool:
        return self in (Decision.ACCEPT, Decision.ADJUST)


WORDS = {YES.lower(): Decision.ACCEPT, "accept": Decision.ACCEPT, NO.lower(): Decision.DECLINE, "decline": Decision.DECLINE,
         "install": Decision.INSTALL}


class Suggestions(Controller):
    resource = types.Suggestion

    @action
    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        waiting = self.rows.standing()
        if len(waiting) >= OPEN_SUGGESTIONS:
            self._refuse(f"{OPEN_SUGGESTIONS} suggestions already wait on the user: {', '.join(str(s.n) for s in waiting)}")
        declined = [s for s in self.rows.every() if s.decision == Decision.DECLINE and s.title.lower() == title.lower()]
        if declined and not data.pop("despite", None):
            s = declined[-1]
            self._refuse(f"suggestion {s.n} was declined{': ' + s.outcome if s.outcome else ''}; --set despite=true --set because=\"<what changed>\" to propose it again")
        options = [ACCEPTING, ADJUSTING, DECLINING]
        return super().create(title, abstract, brief, options=options, **data)

    @action
    def complete(self, n: int, how: str = "", **data):
        return super().complete(n, how, decision=str(Decision.of(how)), **data)

    @action
    def reopen(self, n: int, why: str = "the user took the answer back"):
        super().reopen(n, why)
        return self.update(n, decision="", todo=0)

    @action(network=True)
    def install(self, n: int):
        if self.actor != USER:
            self._refuse("only you install a suggested plugin, by pressing Yes on it")
        s = self.load(n)
        if not s.data.get("plugin"):
            self._refuse(f"suggestion {n} is not a plugin to install")
        if not s.data.get("commit"):
            self._refuse(f"suggestion {n} names no commit to install, so nothing is installed")
        return Plugins(self.record, actor=self.actor).action("install")(source=s.data["plugin"], ref=s.data["commit"], yes=True)

    @action
    def note_window(self, n: int):
        return self.update(n, window_seen=time.time())


types_module.register(Suggestions)


def waiting_suggestions(record) -> int:
    return len(Suggestions(record, actor=SYSTEM).rows.standing())
