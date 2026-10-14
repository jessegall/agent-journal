from events import Fact
from events.close_from_commits import CommitMade, LogRead, TrailerFound
from features.close_from_commits.trailers import Commit, closing
from receiving import Handler
from resources.types import AgentRow, Todo, Work
from serving import Chat, Remembered, Rows


class RememberTheLogs(Handler[LogRead]):
    def handle(self, event: LogRead, remembered: Remembered) -> list[Fact]:
        for key, value in (*event.stamps, *event.cursors):
            remembered.set(key, value)
        return []


class MarkTheCommit(Handler[CommitMade]):
    def handle(self, event: CommitMade, agents: Rows[AgentRow]) -> list[Fact]:
        agents.card(event.agent, label=f"Agent committed {event.sha[:8]} on `{event.branch}`", icon="branch", tone="commit", title=event.subject)
        return []


class CloseWhatTheCommitNames(Handler[TrailerFound]):
    def handle(self, event: TrailerFound, todos: Rows[Todo], works: Rows[Work], chat: Chat) -> list[Fact]:
        closed, ended = closing(todos, works, Commit(event.sha, event.subject, event.body), event.held_only)
        if closed:
            chat.say("closed", sha=event.sha[:9], rows=", ".join(closed), ended=f" and ended {', '.join(ended)}" if ended else "")
        return []
