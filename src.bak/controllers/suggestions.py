import time

from controllers.base import Controller
from controllers.plugins import Plugins
from resources import types
from controllers.marks import action
from resources.base import SYSTEM, USER
from resources.suggestions import CHANGE, Decision, NO, WORDS, YES

ACCEPTING = {"title": YES, "description": "Adds it as a to-do", "code": ""}
ADJUSTING = {"title": CHANGE, "description": "Write your version as a to-do", "code": ""}
DECLINING = {"title": NO, "description": "The agent won't suggest it again", "code": ""}


class Suggestions(Controller):
    resource = types.Suggestion

    @action
    def create(self, title: str, abstract: str = "", brief: str = "", **data):
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
