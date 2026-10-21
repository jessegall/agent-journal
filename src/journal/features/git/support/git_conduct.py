from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.commit_made import CommitMade


class GitConduct(Conduct):
    """The git feature's conduct in every state: a commit whose message closed tasks is named with them, and the task open next after that close."""

    def on_commit_made_git(self, event: CommitMade, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        if not event.closed:
            return self.unchanged()
        closed = Tasks.COMMIT_CLOSURE.create(sha=event.sha[:8], tasks=", ".join(f"task {n}" for n in event.closed))
        if event.next_open is None:
            return self.unchanged(closed)
        return self.unchanged(closed, Tasks.NEXT_TASK.create(n=event.next_open.id, title=event.next_open.title))
