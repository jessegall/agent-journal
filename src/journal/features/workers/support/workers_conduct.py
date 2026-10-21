from pathlib import Path

from journal.engine.conduct import Conduct
from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.stop import Stop
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.worker_reported import WorkerReported
from journal.events.rows.worker_dispatched import WorkerDispatched
from journal.features.workers.support.path_mentions import PathMentions
from journal.features.workers.support.workers_data import WorkersData
from journal.support.dispatch_tools import DISPATCH_TOOLS

INDEPENDENT_ROLES = ("auditor", "reviewer", "plan-reviewer", "critic")


class WorkersConduct(Conduct):
    """The workers feature's conduct in every state: a subagent past the most allowed at once is held, a write into a worker's worktree is held, a new subagent whose job names files a finished one of the same kind worked on is held in favour of that one, the reports not acted on are named at a stop and on the tick, a worker this agent dispatches pushes Awaiting on its work, and a worker's report is told as it comes."""

    def on_tool_starting_workers_limit(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        if event.call.tool not in DISPATCH_TOOLS or event.subagent:
            return self.none()
        maximum, active = int(settings.value(Workers.SUBAGENT_LIMIT)), event.data.part(Workers).subagents_running
        return self.refuse(Workers.SUBAGENT_OVERFLOW.create(running=active)) if maximum and active >= maximum else self.none()

    def on_tool_starting_workers_worktrees(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        if event.subagent or not event.call.writes:
            return self.none()
        owner = worktree_edits(event.data.part(Workers), event.call.written_paths)
        return self.refuse(Workers.WORKER_FILE.create(n=owner.worker_id, name=owner.worker_name)) if owner else self.none()

    def on_tool_starting_workers_known(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        value = event.call.input if event.call.tool in DISPATCH_TOOLS else {}
        kind = value.get("subagent_type", "")
        matched = PathMentions.build(f"{value.get('description', '')} {value.get('prompt', '')}")
        if not matched or kind in INDEPENDENT_ROLES:
            return self.none()
        existing = next((d for d in reversed(event.data.part(Workers).dispatches) if not d.running and d.session and d.type == kind and matched & PathMentions.build(d.brief)), None)
        return self.refuse(Workers.SUBAGENT_REUSE.create(session=existing.session, task=existing.task)) if existing else self.none()

    def on_stop_workers(self, event: Stop, settings: Settings) -> Transition:
        return self.none(*report_mentions(event.data.part(workers_feature())))

    def on_ticked_workers(self, event: Ticked, settings: Settings) -> Transition:
        return self.none(*report_mentions(event.data.part(workers_feature())))

    def on_worker_dispatched_workers(self, event: WorkerDispatched, settings: Settings) -> Transition:
        from journal.features.tasks.states.external_wait import ExternalWait
        return self.push(ExternalWait.on_workers((event.worker_id,), event.time)) if event.dispatched_by == event.session else self.none()

    def on_worker_reported_workers(self, event: WorkerReported, settings: Settings) -> Transition:
        if event.dispatched_by and event.dispatched_by != event.session:
            return self.none()
        return self.none(workers_feature().WORKER_REPORTED.create(n=event.worker_id, name=event.name))


def report_mentions(workers: WorkersData) -> list[Nudge]:
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
