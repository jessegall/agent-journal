from pathlib import Path

from journal.engine.conduct import Conduct
from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.idle import Idle
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.worker_back import WorkerBack
from journal.events.rows.worker_dispatched import WorkerDispatched
from journal.features.workers.support.named_paths import NamedPaths
from journal.features.workers.support.workers_readings import WorkersReadings
from journal.support.dispatch_tools import DISPATCH_TOOLS

FRESH = ("auditor", "reviewer", "plan-reviewer", "critic")


class WorkersConduct(Conduct):
    """The workers feature's conduct in every state: a subagent past the most allowed at once is held, a write into a worker's worktree is held, a new subagent whose job names files a finished one of the same kind worked on is held in favour of that one, the reports not acted on are named at a stop and on the tick, a worker this agent dispatches pushes Awaiting on its work, and a worker's report is told as it comes."""

    def on_tool_starting_workers_most(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        if event.call.tool not in DISPATCH_TOOLS or event.subagent:
            return self.unchanged()
        most, running = int(settings.of(Workers.MOST_SUBAGENTS)), event.readings.of(Workers).subagents_running
        return self.hold(Workers.TOO_MANY_SUBAGENTS.create(running=running)) if most and running >= most else self.unchanged()

    def on_tool_starting_workers_worktrees(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        if event.subagent or not event.call.writes:
            return self.unchanged()
        owner = worktree_written(event.readings.of(Workers), event.call.written_paths)
        return self.hold(Workers.FILE_IS_THE_WORKERS.create(n=owner.worker_id, name=owner.worker_name)) if owner else self.unchanged()

    def on_tool_starting_workers_known(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        given = event.call.input if event.call.tool in DISPATCH_TOOLS else {}
        kind = given.get("subagent_type", "")
        named = NamedPaths.of(f"{given.get('description', '')} {given.get('prompt', '')}")
        if not named or kind in FRESH:
            return self.unchanged()
        known = next((d for d in reversed(event.readings.of(Workers).dispatches) if not d.running and d.session and d.type == kind and named & NamedPaths.of(d.brief)), None)
        return self.hold(Workers.SEND_THE_JOB_TO_THE_SUBAGENT.create(session=known.session, task=known.task)) if known else self.unchanged()

    def on_idle_workers(self, event: Idle, settings: Settings) -> Transition:
        return self.unchanged(*reports_named(event.readings.of(workers_feature())))

    def on_ticked_workers(self, event: Ticked, settings: Settings) -> Transition:
        return self.unchanged(*reports_named(event.readings.of(workers_feature())))

    def on_worker_dispatched_workers(self, event: WorkerDispatched, settings: Settings) -> Transition:
        from journal.features.tasks.states.awaiting import Awaiting
        return self.push(Awaiting.on_workers((event.worker_id,), event.time)) if event.dispatched_by == event.session else self.unchanged()

    def on_worker_back_workers(self, event: WorkerBack, settings: Settings) -> Transition:
        if event.dispatched_by and event.dispatched_by != event.session:
            return self.unchanged()
        return self.unchanged(workers_feature().WORKER_REPORTED.create(n=event.worker_id, name=event.name))


def reports_named(workers: WorkersReadings) -> list[Nudge]:
    return [workers_feature().ACT_ON_THE_REPORTS.create(reports_waiting=workers.reports_summary)] if workers.reports_waiting else []


def workers_feature():
    from journal.features.workers.feature import Workers
    return Workers


def worktree_written(workers: WorkersReadings, written_paths: tuple[str, ...]):
    written = [Path(p).expanduser().resolve() for p in written_paths]
    inside = [p for p in written if p.is_relative_to(workers.worktrees_root)]
    if not inside:
        return None
    folder = inside[0].relative_to(workers.worktrees_root).parts[0]
    return next((w for w in workers.worktrees if w.folder == folder), None)
