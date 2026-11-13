from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.scope.scopes import Scopes
from engine.setting.setting_values import SettingValues
from engine.time.clock import Clock
from suites.coding.modules.workers.commands.forward_worker_questions.forward_worker_questions import ForwardWorkerQuestions
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.ask_deadline import AskDeadline
from suites.coding.modules.workers.support.worker_questions import WorkerQuestions
from suites.coding.modules.workers.support.worker_settings import QUESTION_VISITS_LIMIT
from suites.coding.modules.workers.ticks.merger_retry import MergerRetry


class AskWatch:
    """Wakes the merger again for a worker's question whose answer is overdue, and sends the question to
    the main agent once its time is used or the merger read it as often as the limit allows. A reading of
    the merger that is still going does not hold this back. A question of a worker that has no worktree any
    more wakes nobody: it is closed as moot."""

    def __call__(self, container: Container) -> None:
        timestamp = container.get(Clock).timestamp()
        forwarded_workers: set[int] = set()
        for line in container.get(WorkerQuestions).open_lines():
            if line.worker_id in forwarded_workers:
                continue
            with container.get(Scopes).row_scope(line):
                deadline = AskDeadline.from_line(line, container.get(SettingValues).number(QUESTION_VISITS_LIMIT))
                is_worker_removed = container.get(WorktreeQuery).worker_worktree(line.worker_id) is None
                if is_worker_removed or deadline.is_forward_due(timestamp):
                    forwarded_workers.add(line.worker_id)
                    container.get(Bus).run(ForwardWorkerQuestions(line.worker_id), Actor.core(), environment_id=line.environment_id)
                elif deadline.is_answer_late(timestamp):
                    MergerRetry().retry_line(container, line)
