from controllers.types import Todos
from engine.events.agents import AgentReported
from expects import Given, Refused, Unchanged
from features.base import Feature
from features.close_from_commits.commands import SweepLanded
from features.close_from_commits.details import CloseFromCommitsDetails
from features.close_from_commits.handlers import CloseRowsFromCommits
from features.journal import Journal
from resources.types import AgentRow, Todo


class CloseFromCommits(Feature):
    details = CloseFromCommitsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(CloseRowsFromCommits(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1"), Todo(n=5, title="Fix the crash")]) >> Unchanged(),
        ])
        journal.commands.add("todo", SweepLanded(), expects=[
            Given((Todos,), rows=[Todo(n=5, title="Fix the crash")]) >> Refused("this project has no main branch from a remote to read trailers from"),
        ])
