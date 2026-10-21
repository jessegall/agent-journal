from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.commit_detected import CommitDetected


class GitConduct(Conduct):
    """The git feature's conduct in every state: a commit whose message closed tasks is named with them, and the task open next after that close."""

    def on_commit_detected(self, event: CommitDetected, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        if not event.closed:
            return self.none()
        closed = Tasks.COMMIT_CLOSURE.create(sha=event.short_sha(), tasks=event.closed_words())
        if event.next_open is None:
            return self.none(closed)
        return self.none(closed, Tasks.NEXT_TASK.create(n=event.next_open.id, title=event.next_open.title))
