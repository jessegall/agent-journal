from datetime import datetime, timezone

from journal.engine.support.lazy_facts import LazyFacts
from journal.models.agent import Agent
from journal.models.task import Task
from journal.repositories.entries import Entries
from journal.features.tasks.support.passed_wait import PassedWait
from journal.features.tasks.support.person_wait import PersonWait
from journal.features.tasks.support.wait_checks import WaitChecks
from journal.repositories.checks import Checks
from journal.features.tasks.support.default_task_assigner import DefaultTaskAssigner
from journal.features.tasks.support.wait_progress_reader import WaitProgressReader
from journal.features.tasks.tasks_options import TasksOptions
from journal.repositories.setting_rows import SettingRows
from journal.repositories.plans import Plans
from journal.repositories.task_logs import TaskLogs
from journal.repositories.tasks import Tasks
from journal.repositories.workers import Workers
from journal.repositories.scope import Scope
from journal.support.stage_times import StageTimes
from journal.features.tasks.tasks_nudges import TasksNudges
from journal.chat.turn import Turn

HISTORY_TOOL_STARTS = 6
POLL_COMMANDS = 3
COMMAND_LINE_COUNT = 6
# the tasks an agent took in hand most recently, the one an event names among them: a main agent keeps the link to every task it ever held
RECENT_OWNED_TASKS = 8
# the open tasks a line names, the first by priority; the count says how many there are in all
OPEN_TASKS_SHOWN = 5
# the open tasks a line names as next, by number
OPEN_TASKS_NEXT = 3


class TasksDataReader:
    """Reads the tasks feature's part of the feature data for an agent, each fact the first time a listener asks for it, with the fields TasksData names."""

    def __init__(self, tasks: Tasks, plans: Plans, entries: Entries, logs: TaskLogs, workers: Workers, scope: Scope, stages: StageTimes, people: PersonWait, progress: WaitProgressReader, settings: SettingRows, assigner: DefaultTaskAssigner, checks: Checks, wait_checks: WaitChecks, turn: Turn) -> None:
        self.progress, self.settings, self.assigner, self.checks, self.wait_checks, self.turn = progress, settings, assigner, checks, wait_checks, turn
        self.tasks, self.plans, self.entries, self.logs, self.workers = tasks, plans, entries, logs, workers
        self.scope, self.stages, self.people = scope, stages, people

    def read(self, agent: Agent) -> LazyFacts:
        facts = LazyFacts("tasks", {
            "current_task": lambda: self.current_id(agent),
            "current_task_row": lambda: self.tasks.current(agent),
            "last_log_line": lambda: self.current_log(agent),
            "blocked": lambda: tuple(t.row_id for t in self.assigner.blocked_work()),
            "blocked_without_wait": lambda: tuple(t.row_id for t in self.tasks.blocked_without_wait()),
            "blocked_without_wait_summary": lambda: ", ".join(f"task {task.id}" for task in self.tasks.blocked_without_wait()),
            "loose_blocks_since": lambda: self.loose_blocks_since(agent),
            "completed_since_loose_blocks": lambda: self.tasks.completed_count_since(datetime.fromtimestamp(facts.loose_blocks_since, timezone.utc)),
            "broken_waits": lambda: tuple(t.row_id for t, check in self.tasks.broken_waits()),
            "broken_waits_summary": lambda: "; ".join(f"task {task.id} waits on check {check.id}, {check.title}, which cannot run" for task, check in self.tasks.broken_waits()),
            "next_open": lambda: self.assigner.offered(agent),
            "open_work": lambda: self.assigner.open_work(agent),
            "last_commands": lambda: self.last_commands(agent),
            "command_lines": lambda: tuple(self.entries.last_command_lines(agent.session, COMMAND_LINE_COUNT)),
            "turn_finished": lambda: self.turn.is_finished(agent),
            "wake_count": lambda: self.entries.nudge_count(agent.session, (TasksNudges.STOPPED_WITH_WORK.key,), agent.tool_uses),
            "open_ids": lambda: self.assigner.open_ids(OPEN_TASKS_SHOWN),
            "open_count": lambda: self.tasks.open_count(),
            "open_next": lambda: ", ".join(str(n) for n in self.tasks.open_page_ids(OPEN_TASKS_NEXT)),
            "started_ids": lambda: tuple(t.row_id for t in self.tasks.agent_started()),
            "agent_tasks": lambda: self.tasks.recent_task_ids(self.workers.agent_holder(agent), RECENT_OWNED_TASKS),
            "person_waits": lambda: tuple(t.row_id for t in self.tasks.blocked_tasks() if self.people.is_person_wait(t)),
            "unprioritised": lambda: tuple(t.row_id for t in self.tasks.unprioritised()),
            "blocking_priorities": lambda: facts.unprioritised if len(facts.unprioritised) >= self.settings.integer(TasksOptions.PRIORITY_BLOCK_TASKS) else (),
            "polled_checks": lambda: tuple(check.row_id for check in self.checks.unresolved_waits()),
            "passed_waits": lambda: tuple(PassedWait.read(check) for check in self.checks.passed_waits(self.wait_checks.waited())),
            "wait_progress": lambda: self.progress.running(agent.session),
            "last_moves": lambda: {t.row_id: t.update_time.timestamp() for t in self.tasks.blocked_tasks() if t.row_id not in facts.person_waits},
        }, lambda: self.scope.environment(agent.environment_id), self.stages)
        return facts

    def current_id(self, agent: Agent) -> int:
        current = self.tasks.current(agent)
        return current.row_id if current else 0

    def loose_blocks_since(self, agent: Agent) -> float:
        oldest = min((task.update_time.timestamp() for task in self.tasks.blocked_without_wait()), default=0.0)
        return max(oldest, self.entries.last_lines(agent.session, TasksNudges.LOOSE_BLOCKS.key))

    def current_log(self, agent: Agent) -> str:
        current = self.tasks.current(agent)
        return self.last_log(current) if current else ""

    def last_commands(self, agent: Agent) -> tuple[str, ...]:
        return tuple(self.entries.recent_commands(agent.session, HISTORY_TOOL_STARTS, POLL_COMMANDS))

    def last_log(self, task: Task) -> str:
        logs = self.logs.logs(task)
        return f'"{logs[-1].line}"' if logs else "nothing logged yet"
