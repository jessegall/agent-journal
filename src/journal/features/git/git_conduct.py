from journal.engine.conduct import Conduct
from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.commit_detected import CommitDetected


class GitConduct(Conduct):
    """The git feature's conduct in every state: a commit whose message closed tasks is named with them, and the task open next after that close."""

    def on_commit_detected(self, event: CommitDetected, settings: Settings) -> Transition:
        from journal.features.git.feature import Git
        refusals = [Git.WORKER_TASK_REFUSAL.create(task=item.task, worker=item.worker) for item in event.worker_tasks]
        return self.none(*refusals, *closure_lines(event))


def closure_lines(event: CommitDetected) -> list[Nudge]:
    from journal.features.tasks.feature import Tasks
    if not event.closed:
        return []
    closure = Tasks.COMMIT_CLOSURE.create(sha=event.short_sha(), tasks=event.closed_words())
    if event.next_open is None:
        return [closure]
    return [closure, Tasks.NEXT_TASK.create(n=event.next_open.id, title=event.next_open.title)]
