from dataclasses import dataclass, replace

from journal.engine.base_state import BaseState
from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.stop import Stop
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.task_closed import TaskClosed
from journal.events.rows.task_logged import TaskLogged
from journal.events.rows.plan_started import PlanStarted
from journal.events.rows.task_started import TaskStarted
from journal.events.feature_data import FeatureData
from journal.support.permission import Permission

OPEN_TASK_LIMIT_SECONDS = 900.0
COMPACT = "compact"


@dataclass(frozen=True)
class Working(BaseState):
    """On one task. Writes are counted since the last log line: after the first N the log is asked for, every M the task is named back, and past the limit the next write waits for the log line. A stop with the task in hand is told to carry on, with the log line first when it is old, and is held while an approved plan is not started; a session resumed with it is told where it stands; a quiet quarter hour is told it is still open. Pushed by journal task start, popped by done and park."""

    name = "working"
    title = "Working"
    allows = frozenset({Permission.FILE_EDITS, Permission.RUN_COMMANDS, Permission.DISPATCH_SUBAGENTS})
    task_id: int = 0
    what: str = ""
    logged_at: float = 0.0
    edits: int = 0
    active_at: float = 0.0

    def is_plan_work(self) -> bool:
        return False

    def label(self) -> str:
        if self.task_id and self.what:
            return f"task {self.task_id}, {self.what}"
        return f"task {self.task_id}" if self.task_id else f"the work in hand, {self.what}"

    def logged(self, time: float) -> "Working":
        return replace(self, logged_at=time, edits=0)

    def log_command(self) -> str:
        return f"journal task log {self.task_id}" if self.task_id else "journal task log"

    def logged_words(self, time: float) -> str:
        minutes = int((time - self.logged_at) // 60)
        return "last logged just now" if minutes < 1 else f"last logged {minutes} min ago"

    def plan_state(self, **fields) -> BaseState:
        from journal.features.plans.states.following_plan import FollowingPlan
        return FollowingPlan(**fields)

    def continue_nudge(self, time: float) -> Nudge:
        from journal.features.tasks.feature import Tasks
        return Tasks.TASK_CONTINUATION.create(name=self.label(), logged=self.logged_words(time))

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        active = replace(self, active_at=event.time)
        if not event.call.writes or event.subagent:
            return self.changed(active)
        if self.edits >= int(settings.of(Tasks.LOG_LIMIT)):
            return self.hold(Tasks.LOG_EDIT_BLOCK.create(edits=self.edits, name=self.label(), log=self.log_command()))
        counted = replace(active, edits=self.edits + 1)
        lines = []
        if self.edits == int(settings.of(Tasks.FIRST_DELAY)):
            lines.append(Tasks.LOG_REQUEST.create(edits=self.edits, name=self.label(), log=self.log_command()))
        if self.edits and self.edits % int(settings.of(Tasks.TASK_REMINDER_INTERVAL)) == 0:
            lines.append(Tasks.CURRENT_TASK_REMINDER.create(name=self.label(), edits=self.edits))
        return self.changed(counted, *lines)

    def on_stop(self, event: Stop, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        from journal.features.tasks.feature import Tasks
        approved = event.data.of(Plans).approved
        if approved:
            return self.hold(Plans.APPROVED_UNSTARTED.create(n=approved[0]))
        if event.time - self.logged_at >= int(settings.of(Tasks.LOG_AGE_LIMIT)) * 60:
            return self.hold(Tasks.STOP_LOG_REQUEST.create(name=self.label(), logged=self.logged_words(event.time), log_command=self.log_command()))
        return self.hold(self.continue_nudge(event.time))

    def on_session_started(self, event: SessionStarted, settings: Settings) -> Transition:
        from journal.features.briefing.feature import Briefing
        from journal.features.git.feature import Git
        from journal.features.tasks.feature import Tasks
        nudges = [self.continue_nudge(event.time)]
        if event.source == COMPACT:
            nudges.append(Briefing.COMPACTION_SUMMARY.create(task=self.label(), last_log=event.data.of(Tasks).last_log_line, uncommitted=event.data.of(Git).uncommitted))
        return self.changed(replace(self, active_at=event.time), *nudges)

    def on_prompt_submitted(self, event: PromptSubmitted, settings: Settings) -> Transition:
        return self.changed(replace(self, active_at=event.time))

    def on_ticked(self, event: Ticked, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        if event.quiet_for >= OPEN_TASK_LIMIT_SECONDS:
            return self.unchanged(Tasks.OPEN_TASK.create(name=self.label()))
        return self.unchanged()

    def on_task_logged(self, event: TaskLogged, settings: Settings) -> Transition:
        return self.changed(self.logged(event.time)) if event.task_id == self.task_id else self.unchanged()

    def on_task_closed(self, event: TaskClosed, settings: Settings) -> Transition:
        return self.pop() if event.task_id == self.task_id else self.unchanged()

    def on_task_started(self, event: TaskStarted, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        from journal.features.plans.states.following_plan import FollowingPlan
        started = event.data.of(Plans).started
        if self.is_plan_work() or started is None or event.task_id != self.task_id or event.task_id not in started.tasks:
            return self.unchanged()
        return self.changed(self.plan_state(plan_id=started.plan_id, task_id=self.task_id, approved=True, logged_at=self.logged_at))

    def on_plan_started(self, event: PlanStarted, settings: Settings) -> Transition:
        from journal.features.plans.states.following_plan import FollowingPlan
        if self.is_plan_work() or event.task_id != self.task_id:
            return self.unchanged()
        return self.changed(self.plan_state(plan_id=event.plan_id, task_id=self.task_id, approved=True, logged_at=self.logged_at, edits=self.edits, active_at=self.active_at))

    def on_resume(self, data: FeatureData, settings: Settings) -> tuple[Nudge, ...] | Transition:
        from journal.features.tasks.feature import Tasks
        if self.task_id and data.of(Tasks).in_hand != self.task_id:
            return self.pop()
        return ()
