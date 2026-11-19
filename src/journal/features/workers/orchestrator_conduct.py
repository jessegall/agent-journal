from dataclasses import replace

from journal.events.feature_data import FeatureData
from journal.engine.base_state import BaseState
from journal.engine.conduct import Conduct
from journal.support.timeout import Timeout
from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.stop import Stop
from journal.events.agent.ticked import Ticked
from journal.events.agent.turn_displayed import TurnDisplayed
from journal.features.workers.support.queue_check import queue_check
from journal.features.workers.support.wait_text import WaitText
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.worker_model_mismatch import WorkerModelMismatch
from journal.events.rows.worker_spent import WorkerSpent
from journal.events.rows.task_delegated import TaskDelegated
from journal.models.support.model_fit import OVERPOWERED
from journal.features.workers.support.release_lines import ReleaseLines
from journal.models.command_output import CommandOutput
from journal.models.worker import Worker
from journal.features.plans.plans_part import PlansPart
from journal.features.plans.support.plan_status import PlanStatus
from journal.features.tasks.tasks_part import TasksPart
from journal.features.workers.workers_nudges import WorkersNudges
from journal.features.workers.workers_options import WorkersOptions
from journal.features.workers.workers_part import WorkersPart
from journal.features.workers.support.worker_news import WorkerNews

class OrchestratorConduct(Conduct):
    """The orchestrator's conduct, brought by its mode state to every state above it: a stop is refused while work this agent sent out waits clocked out, naming each worker, but for one it awaits, the worker itself or a run in its worktree, and once, with journal worker wait, while its workers are only still out, unless the worker news gathers their lines; a stop carries the status of every started plan, names a started plan that has not moved while another moves, and a run of the whole suite that failed after merges; the tick asks for the priorities at a phase start and every so many minutes, gives the workers' news in one line once each span when there is any, names the blocked tasks standing still and a started plan with many open tasks and no order; a release is refused unless the orchestrator may release, a full set of places names the oldest work to check, unless only running workers take a place or the worker news gathers it, a wait written in words is named; a queued task that unblocks others is named, and a single task dispatched or sent while others of its plan wait to be handed out is named once with the queue that takes them; and a merged worker whose model did not fit its work, or that spent much on work of a settled shape, is named."""

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        return Transition.merged(self, [check(self, event, settings) for check in (release_check, open_work_check, text_wait_check, queue_check)])

    def on_stop(self, event: Stop, settings: Settings) -> Transition:
        return Transition.merged(self, [crew_stop(self, event, settings), self.none(*plan_lines(event.data, event.time, settings), *suite_lines(event.data, settings))])

    def on_ticked(self, event: Ticked, settings: Settings) -> Transition:
        return self.none(*priorities_lines(event, settings), *unmoved_task_lines(event, settings), *unordered_lines(event, settings), *news_lines(event, settings), *finished_work_lines(event))

    def on_turn_displayed(self, event: TurnDisplayed, settings: Settings) -> Transition:
        return self.none(*text_wait_lines(event.content, settings)) if event.final else self.none()

    def on_task_delegated(self, event: TaskDelegated, settings: Settings) -> Transition:
        if not event.is_unblocking():
            return self.none()
        queues = event.data.part(WorkersPart).queues
        queue_places = [(worker, queue.index(event.task_id) + 1) for worker, queue in queues.items() if event.task_id in queue[1:]]
        return self.none(*(WorkersNudges.UNBLOCKER_QUEUED.create(task=event.task_id, n=worker, place=place) for worker, place in queue_places))

    def on_worker_spent(self, event: WorkerSpent, settings: Settings) -> Transition:
        if event.worker.is_other_dispatcher(event.session):
            return self.none()
        if not event.is_shaped_work_on_strongest() or not event.crossed(settings.decimal(WorkersOptions.COSTLY_SHAPED_WORK)):
            return self.none()
        return self.none(WorkersNudges.COSTLY_SHAPED_WORK.create(n=event.worker.id, model=event.model, dollars=f"{event.cost_dollars:.2f}"))

    def on_worker_model_mismatch(self, event: WorkerModelMismatch, settings: Settings) -> Transition:
        if event.worker.is_other_dispatcher(event.session):
            return self.none()
        if event.fit == OVERPOWERED:
            return self.none(WorkersNudges.MODEL_OVERPOWERED.create(n=event.worker.id, model=event.model))
        return self.none(WorkersNudges.MODEL_UNDERPOWERED.create(n=event.worker.id, model=event.model, send_backs=event.rejections))



def crew_stop(state: BaseState, event: Stop, settings: Settings) -> Transition:
    workers = event.data.part(WorkersPart)
    wait_refs = set(state.targets())
    delivered = [worker for worker in workers.delivered_workers if not worker.mention().is_other_dispatcher(event.session) and not is_waited(worker, wait_refs, workers.delivered_runs)]
    if delivered:
        return state.refuse(WorkersNudges.DELIVERED_WAITING.create(workers=worker_list(delivered)))
    active_workers = [worker for worker in workers.dispatched_workers if not worker.mention().is_other_dispatcher(event.session) and worker.mention().ref() not in wait_refs]
    if active_workers and not event.prior_refusal and not WorkerNews.is_gathered(settings):
        return state.refuse(WorkersNudges.ACTIVE_WORKERS.create(workers=worker_list(active_workers), numbers=" ".join(str(worker.id) for worker in active_workers)))
    return state.none()


def is_waited(worker: Worker, waited_refs: set[str], runs: tuple[tuple[int, int], ...]) -> bool:
    return worker.mention().ref() in waited_refs or any(f"{CommandOutput.table()}:{output}" in waited_refs for output, owner in runs if owner == worker.row_id)


def worker_list(workers: list[Worker]) -> str:
    return ", ".join(f"worker {worker.id} ({worker.name})" for worker in workers)


def plan_lines(data: FeatureData, moment: float, settings: Settings) -> tuple[Nudge, ...]:
    started = data.part(PlansPart).started_plans
    if not started:
        return ()
    return (WorkersNudges.STARTED_PLANS.create(plans="; ".join(plan.line(moment) for plan in started)), *stalled_lines(started, moment, settings))


def suite_lines(data: FeatureData, settings: Settings) -> tuple[Nudge, ...]:
    check = data.part(WorkersPart).merge_check
    return (WorkersNudges.SUITE_BROKEN.create(run=check.failed_run, workers=check.workers_line(), n=check.merged[-1].id),) if check.failed_run else ()


def stalled_lines(started: tuple[PlanStatus, ...], moment: float, settings: Settings) -> tuple[Nudge, ...]:
    minutes = settings.value(WorkersOptions.PLAN_STALL_MINUTES)
    stalled = [plan for plan in started if minutes and plan.is_stalled(moment, minutes * 60)]
    if len(stalled) == len(started):
        return ()
    return tuple(WorkersNudges.PLAN_STALLED.create(n=plan.plan_id, title=plan.title, since=plan.moved_line(), minutes=minutes) for plan in stalled)


def priorities_lines(event: Ticked, settings: Settings) -> tuple[Nudge, ...]:
    started = event.data.part(PlansPart).started
    if started is None:
        return ()
    interval = settings.integer(WorkersOptions.PRIORITIES_MINUTES) * 60
    if started.priorities_phase == started.current_phase and not (interval and Timeout.seconds(interval).started(started.priorities_at).is_elapsed(event.time)):
        return ()
    return (WorkersNudges.PRIORITIES.create(plan=started.plan_id, phase=started.current_phase),)


def text_wait_check(state: BaseState, event: ToolStarting, settings: Settings) -> Transition:
    return state.none(*text_wait_lines(WaitText.wait_command_text(event.call), settings))


def text_wait_lines(text: str, settings: Settings) -> tuple[Nudge, ...]:
    if not WaitText.is_word_wait(text):
        return ()
    return (WorkersNudges.WAIT_TEXT.create(),)


def unmoved_task_lines(event: Ticked, settings: Settings) -> tuple[Nudge, ...]:
    tasks = event.data.part(TasksPart)
    unmoved = tasks.last_moves
    if not unmoved:
        return ()
    long_unmoved = tuple(n for n, last_move in unmoved.items() if Timeout.minutes(settings.integer(WorkersOptions.STALLED_BLOCK_MINUTES)).started(last_move).is_elapsed(event.time))
    crowded = len(unmoved) > settings.decimal(WorkersOptions.BLOCKED_SHARE) * (tasks.open_count + len(unmoved))
    listed = tuple(sorted(unmoved)) if crowded else tuple(sorted(long_unmoved))
    return (WorkersNudges.UNMOVED_TASKS.create(tasks=", ".join(str(n) for n in listed)),) if listed else ()


def unordered_lines(event: Ticked, settings: Settings) -> tuple[Nudge, ...]:
    least = settings.integer(WorkersOptions.UNORDERED_PLAN_TASKS)
    plans = event.data.part(PlansPart).started_plans if least else ()
    return tuple(WorkersNudges.UNLINKED_TASKS.create(plan=status.plan_id, open=status.total - status.done) for status in plans if status.total - status.done >= least and not status.blocked)


def release_check(state: BaseState, event: ToolStarting, settings: Settings) -> Transition:
    if settings.value(WorkersOptions.ORCHESTRATOR_RELEASES):
        return state.none()
    releases = ReleaseLines.found(tuple(part.text for part in event.call.parts))
    return state.refuse(WorkersNudges.RELEASE_REFUSED.create(line=releases[0])) if releases else state.none()


def open_work_check(state: BaseState, event: ToolStarting, settings: Settings) -> Transition:
    if settings.value(WorkersOptions.NEXT_AT_CLOCK_OUT) or WorkerNews.is_gathered(settings):
        return state.none()
    workers = event.data.part(WorkersPart)
    if is_full((*workers.dispatched_workers, *workers.ready_work), settings.integer(WorkersOptions.WORKER_LIMIT)):
        if not workers.ready_work:
            return state.none()
        return state.none(WorkersNudges.PLACES_FULL.create(n=min(workers.ready_work, key=lambda work: work.delivered_at).worker))
    return state.none()


# finished work that waits this long on the orchestrator is named while it works, not only when it stops
FINISHED_WAIT_SECONDS = 600


def finished_work_lines(event: Ticked) -> tuple[Nudge, ...]:
    """Workers clocked out ten minutes or more ago that wait on this orchestrator, named on its tick every ten minutes: it is
    told so at a stop, but an orchestrator busy for hours never stops, and on the hosted journal 12 to 15 finished workers
    waited on it up to 15 hours while their tasks held the work behind them (19 Nov)."""
    workers = event.data.part(WorkersPart)
    waiting = [worker for worker in workers.delivered_workers if not worker.mention().is_other_dispatcher(event.session)
               and event.time - worker.delivery_time() >= FINISHED_WAIT_SECONDS]
    if not waiting:
        return ()
    return (WorkersNudges.FINISHED_WORK_WAITS.create(count=len(waiting), numbers=" ".join(str(worker.id) for worker in waiting)),)


def news_lines(event: Ticked, settings: Settings) -> tuple[Nudge, ...]:
    if not WorkerNews.is_gathered(settings):
        return ()
    news, seconds = event.data.part(WorkersPart).news, settings.integer(WorkersOptions.DIGEST_SECONDS)
    if not news.has_news():
        return ()
    span = f"{seconds // 60} min" if seconds >= 60 else f"{seconds} s"
    return (replace(WorkersNudges.WORKER_NEWS, repeat=Timeout.seconds(seconds)).create(span=span, counts=news.counts(), needs=news.needs_line()),)


def is_full(dispatched: tuple, limit: int) -> bool:
    return limit > 0 and len(dispatched) >= limit
