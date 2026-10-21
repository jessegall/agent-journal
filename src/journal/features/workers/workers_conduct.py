from pathlib import Path

from journal.events.feature_data import FeatureData
from journal.engine.conduct import Conduct
from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.stop import Stop
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.worker_reported import WorkerReported
from journal.events.rows.worker_stopped import WorkerStopped
from journal.events.rows.worker_dispatched import WorkerDispatched
from journal.features.workers.support.path_mentions import PathMentions
from journal.features.workers.support.workers_data import WorkersData
from journal.support.subagent_dispatch import SubagentDispatch

INDEPENDENT_ROLES = ("auditor", "reviewer", "plan-reviewer", "critic")


class WorkersConduct(Conduct):
    """The workers feature's conduct in every state: a subagent past the most allowed at once is held, a write into a worker's worktree is held, a new subagent whose job names files a finished one of the same kind worked on is held in favour of that one, the reports not acted on are named at a stop and on the tick, a worker this agent dispatches pushes Awaiting on its work, and a worker's report is told as it comes."""

    def limit_check(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        if not isinstance(event.call.operation, SubagentDispatch) or event.subagent:
            return self.none()
        maximum, active = int(settings.value(Workers.SUBAGENT_LIMIT)), event.data.part(Workers).active_subagents
        return self.refuse(Workers.SUBAGENT_OVERFLOW.create(running=active)) if maximum and active >= maximum else self.none()

    def worktrees_check(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        if event.subagent or not event.call.writes:
            return self.none()
        owner = worktree_edits(event.data.part(Workers), event.call.edited_paths)
        return self.refuse(Workers.WORKER_FILE.create(n=owner.worker_id, name=owner.worker_name)) if owner else self.none()

    def known_check(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        dispatch = event.call.operation
        if not isinstance(dispatch, SubagentDispatch):
            return self.none()
        matched = PathMentions.build(f"{dispatch.title} {dispatch.brief}")
        if not matched or dispatch.role in INDEPENDENT_ROLES:
            return self.none()
        existing = next((d for d in reversed(event.data.part(Workers).dispatches) if not d.is_active and d.session and d.type == dispatch.role and matched & PathMentions.build(d.brief)), None)
        return self.refuse(Workers.SUBAGENT_REUSE.create(session=existing.session, task=existing.task)) if existing else self.none()

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        return Transition.merged(self, [WorkersConduct.known_check(self, event, settings), WorkersConduct.limit_check(self, event, settings), WorkersConduct.worktrees_check(self, event, settings)])

    def on_stop(self, event: Stop, settings: Settings) -> Transition:
        return self.none(*report_mentions(event.data))

    def on_ticked(self, event: Ticked, settings: Settings) -> Transition:
        return self.none(*report_mentions(event.data))

    def on_worker_dispatched(self, event: WorkerDispatched, settings: Settings) -> Transition:
        from journal.features.tasks.states.external_wait import ExternalWait
        return self.push(ExternalWait.opened(*event.wait_terms())) if event.awaiter == event.session else self.none()

    def on_worker_reported(self, event: WorkerReported, settings: Settings) -> Transition:
        if event.dispatcher and event.dispatcher != event.session:
            return self.none()
        return self.none(workers_feature().WORKER_REPORTED.create(n=event.worker_id, name=event.name))

    def on_worker_stopped(self, event: WorkerStopped, settings: Settings) -> Transition:
        if event.dispatcher and event.dispatcher != event.session:
            return self.none()
        return self.none(workers_feature().WORKER_STOPPED_UNREPORTED.create(n=event.worker_id, name=event.name))


def report_mentions(data: FeatureData) -> list[Nudge]:
    workers = data.part(workers_feature())
    return [workers_feature().UNREAD_WORKER_REPORTS.create(reports_waiting=workers.reports_summary)] if workers.reports_waiting else []


def workers_feature():
    from journal.features.workers.feature import Workers
    return Workers


def worktree_edits(workers: WorkersData, edited_paths: tuple[str, ...]):
    saved = [Path(p).expanduser().resolve() for p in edited_paths]
    contained = [p for p in saved if p.is_relative_to(workers.worktrees_root)]
    if not contained:
        return None
    folder = contained[0].relative_to(workers.worktrees_root).parts[0]
    return next((w for w in workers.worktrees if w.folder == folder), None)
