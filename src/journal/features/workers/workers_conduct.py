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
from journal.features.workers.support.worker_line import WorkerLine
from journal.features.workers.support.path_mentions import PathMentions
from journal.models.worker import Worker
from journal.features.workers.support.workers_data import WorkersData
from journal.support.subagent_dispatch import SubagentDispatch

INDEPENDENT_ROLES = ("auditor", "reviewer", "plan-reviewer", "critic")


class WorkersConduct(Conduct):
    """The workers feature's conduct in every state: a subagent past the most allowed at once is held, a write into a worker's worktree is held, a new subagent whose job names files a finished one of the same kind worked on is held in favour of that one, a dispatch whose brief names files an idle worker touched is held in favour of that worker, a dispatch past its profile's kept workers is held while one of them is idle, retiring an idle worker is held until the repeat says why it cannot be reused, the reports not acted on are named at a stop and on the tick, a worker this agent dispatches pushes Awaiting on its work, and a worker's report is told as it comes."""

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
        matched = PathMentions.build(f"{dispatch.title} {dispatch.brief or ''}")
        if not matched or dispatch.role in INDEPENDENT_ROLES:
            return self.none()
        existing = next((d for d in reversed(event.data.part(Workers).dispatches) if not d.is_active and d.session and d.type == dispatch.role and matched & PathMentions.build(d.brief)), None)
        return self.refuse(Workers.SUBAGENT_REUSE.create(session=existing.session, task=existing.task)) if existing else self.none()

    def files_check(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        knowing = [w for line in worker_lines(event, "dispatch") if not line.fresh for w in knowing_workers(event.data.part(Workers), line.brief)]
        return self.refuse(Workers.WORKER_KNOWS_FILES.create(count=len(knowing), workers=idle_list(tuple(knowing)))) if knowing else self.none()

    def idle_cap_check(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        cap, workers = int(settings.value(Workers.IDLE_KEPT)), event.data.part(Workers)
        for line in [line for line in worker_lines(event, "dispatch") if cap and not is_reviewer(line.profile)]:
            kept, idle = kept_workers(workers, line.profile), idle_offers(workers, line)
            if len(kept) >= cap and idle:
                return self.refuse(Workers.IDLE_CAP.create(kept=len(kept), profile=line.profile, count=len(idle), workers=idle_list(idle)))
        return self.none()

    def retire_check(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        idle = {w.id: w for w in event.data.part(Workers).idle_workers}
        asked = [line for line in worker_lines(event, "complete", "stop") if line.number in idle and not line.why]
        return self.refuse(Workers.REUSE_QUESTION.create(n=asked[0].number, name=idle[asked[0].number].name)) if asked else self.none()

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        checks = (WorkersConduct.known_check, WorkersConduct.limit_check, WorkersConduct.worktrees_check, WorkersConduct.files_check, WorkersConduct.idle_cap_check, WorkersConduct.retire_check)
        return Transition.merged(self, [check(self, event, settings) for check in checks])

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
    summary = ", ".join(f"worker {w.id} ({w.name})" for w in data.part(workers_feature()).idle_workers)
    return [workers_feature().UNREAD_WORKER_REPORTS.create(reports_waiting=summary)] if summary else []


def worker_lines(event: ToolStarting, *verbs: str) -> list[WorkerLine]:
    return [line for part in event.call.parts if (line := WorkerLine.parsed(part.text)) and line.verb in verbs]


def idle_list(workers: tuple[Worker, ...]) -> str:
    return "\n".join(f"worker {w.id}, {w.name}, last on {w.files_line()}: `journal worker send {w.id} \"<job>\"`" for w in workers)


def workers_feature():
    from journal.features.workers.feature import Workers
    return Workers


def kept_workers(workers: WorkersData, profile: str) -> list[Worker]:
    return [w for w in (*workers.out_workers, *workers.idle_workers) if w.profile == profile]


def idle_offers(workers: WorkersData, line: WorkerLine) -> tuple[Worker, ...]:
    named = PathMentions.build(line.brief)
    return tuple(sorted((w for w in workers.idle_workers if w.profile == line.profile), key=lambda w: not w.overlaps(named)))


def is_reviewer(profile: str) -> bool:
    return any(role in profile for role in INDEPENDENT_ROLES)


def knowing_workers(workers: WorkersData, brief: str) -> list[Worker]:
    named = PathMentions.build(brief)
    return [w for w in reversed(workers.idle_workers) if w.overlaps(named)]


def worktree_edits(workers: WorkersData, edited_paths: tuple[str, ...]):
    saved = [Path(p).expanduser().resolve() for p in edited_paths]
    contained = [p for p in saved if p.is_relative_to(workers.worktrees_root)]
    if not contained:
        return None
    folder = contained[0].relative_to(workers.worktrees_root).parts[0]
    return next((w for w in workers.worktrees if w.folder == folder), None)
