from pathlib import Path

from events import Fact
from events.agents import ToolCallAnswered
from events.helper_worktrees import WorktreeBehind, WorktreeChecked
from receiving import Listener
from resources.types import Worktree
from serving import ReadRows


class SpotDriftedWorktree(Listener[ToolCallAnswered]):
    def listen(self, event: ToolCallAnswered, worktrees: ReadRows[Worktree]) -> list[Fact]:
        here = Path(event.cwd) if event.cwd else Path.cwd()
        places = tuple((here / given).resolve() for given in (str(here), *(event.paths if event.subagent else ())))
        facts = []
        for row, found in worktrees.drifted(places, (event.input,) if event.subagent else ()):
            facts.append(WorktreeChecked(n=row.n, working_tip=found.tip))
            if not found.current:
                facts.append(WorktreeBehind(working=row.working, commits=found.commits, path=row.path).once(f"drifted|{row.n}|{found.tip}"))
        return facts
