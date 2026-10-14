from events.answers import Allowed, Answer, Refused
from events.asking import ToolCallAsked
from framework.loaded import FEATURES
from engine.journal_calls import pieces
from pathlib import Path
from receiving import Answerer
from resources.types import Worktree
from serving import ReadRows


def goes_home(shell: str, home: Path) -> bool:
    first = pieces(shell)[0] if shell else ()
    return first[:1] == ("cd",) and len(first) == 2 and Path(first[1]).expanduser().resolve() == home.resolve()


class StayInYourCheckout(Answerer[ToolCallAsked]):
    def answer(self, event: ToolCallAsked, worktrees: ReadRows[Worktree]) -> Answer:
        home = None if event.subagent else worktrees.strays_from(event.cwd)
        if home is None or goes_home(event.input, home):
            return Allowed()
        return Refused(FEATURES["helper_worktrees"].line("strayed", {"folder": event.cwd, "home": home})[0])
