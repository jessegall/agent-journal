from datetime import datetime, timedelta, timezone

from engine.command.bus import Bus
from engine.errors.refusal import Refusal
from engine.log.system_log_writer import SystemLogWriter
from engine.time.timestamp import Timestamp
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck
from suites.coding.modules.workers.models.worktree_behind_look import WorktreeBehindLook
from suites.coding.modules.workers.support.behind_checks import BehindChecks
from suites.coding.modules.workers.support.worker_settings import BEHIND_CHECK_MINUTES, BEHIND_COMMITS_TO_CHECK, BEHIND_RECHECK_COMMITS, KEEP_UP_TO_DATE
from suites.coding.modules.workers.ticks.behind_worktrees import BehindWorktrees

NOW = Timestamp(datetime(2026, 11, 12, 9, 0, tzinfo=timezone.utc))
SETTINGS = {KEEP_UP_TO_DATE: True, BEHIND_COMMITS_TO_CHECK: 3, BEHIND_CHECK_MINUTES: 10, BEHIND_RECHECK_COMMITS: 3}


class Rows:
    """The rows of one model, filtered by field values as the query does."""

    def __init__(self, rows: list[object]) -> None:
        self.rows = rows

    def filter(self, **values: object) -> "Rows":
        return Rows([row for row in self.rows if all(getattr(row, name) == value for name, value in values.items())])

    def oldest(self) -> "Rows":
        return self

    def newest(self) -> "Rows":
        return Rows(list(reversed(self.rows)))

    def every_row(self, reason: str) -> list[object]:
        return self.rows

    def first(self) -> object | None:
        return self.rows[0] if self.rows else None


class Queries:
    def __init__(self, **rows: list[object]) -> None:
        self.rows = rows

    def query(self, model: type) -> Rows:
        return Rows(self.rows.get(model.__name__, []))


class Settings:
    def __init__(self) -> None:
        self.values = dict(SETTINGS)

    def flag(self, key: str) -> bool:
        return bool(self.values[key])

    def number(self, key: str) -> int:
        return int(self.values[key])


def worktree(worktree_id: int = 1, state: WorktreeState = WorktreeState.CUT) -> Worktree:
    return Worktree(id=worktree_id, session_agent_id=7, task_id=1, creator_id=1, folder="/work", branch="workers/one", base_branch="version-5", state=state)


def check(state: BehindCheckState, behind: int = 3) -> WorktreeBehindCheck:
    return WorktreeBehindCheck(id=1, environment_id=1, worktree_id=1, base_tip="abc", behind=behind, state=state)


def checks(settings: Settings | None = None, **rows: list[object]) -> BehindChecks:
    return BehindChecks(Queries(**rows), settings or Settings())


def test_a_worktree_three_behind_opens_a_check_and_two_behind_does_not():
    assert (checks().opens(worktree(), 3), checks().opens(worktree(), 2)) == (True, False)


def test_zero_commits_to_check_or_the_switch_off_looks_at_no_worktree():
    off = BehindChecks(Queries(Worktree=[worktree()]), Settings())
    off.settings.values[BEHIND_COMMITS_TO_CHECK] = 0
    switched = BehindChecks(Queries(Worktree=[worktree()]), Settings())
    switched.settings.values[KEEP_UP_TO_DATE] = False
    assert (off.due_worktrees(NOW), switched.due_worktrees(NOW)) == ((), ())


def test_a_look_comes_once_per_ten_minutes_and_the_last_look_survives_a_restart():
    look = WorktreeBehindLook(id=1, environment_id=1, looked_at=Timestamp(NOW.value - timedelta(minutes=5)))
    assert checks(Worktree=[worktree()], WorktreeBehindLook=[look]).due_worktrees(NOW) == ()
    later = Timestamp(NOW.value + timedelta(minutes=5))
    assert checks(Worktree=[worktree()], WorktreeBehindLook=[look]).due_worktrees(later) == tuple([worktree()])


def test_a_delivered_worktree_is_not_looked_at():
    assert checks(Worktree=[worktree(1), worktree(2, WorktreeState.DELIVERED)]).due_worktrees(NOW) == tuple([worktree(1)])


def test_no_second_check_opens_while_one_is_open_ordered_or_clashing():
    for state in (BehindCheckState.OPEN, BehindCheckState.ORDERED, BehindCheckState.CONFLICTED):
        assert checks(WorktreeBehindCheck=[check(state)]).opens(worktree(), 9) is False


def test_a_worktree_left_alone_at_three_is_checked_again_at_six_not_four():
    left = [check(BehindCheckState.LEFT, behind=3)]
    assert (checks(WorktreeBehindCheck=left).opens(worktree(), 4), checks(WorktreeBehindCheck=left).opens(worktree(), 6)) == (False, True)


class FailingBus:
    """A bus whose count of worktree 1 is refused, as for a deleted base branch."""

    def __init__(self) -> None:
        self.checked: list[int] = []

    def run(self, command, actor, environment_id=None):
        if getattr(command, "worktree_id", None) == 1:
            raise Refusal("branch version-5 does not exist in /work")
        self.checked.append(getattr(command, "worktree_id", 0))


class Log:
    def __init__(self) -> None:
        self.lines: list[str] = []

    def write(self, level, text, source=None) -> None:
        self.lines.append(text)


class Container:
    def __init__(self, bus: FailingBus, log: Log) -> None:
        self.instances = {Bus: bus, SystemLogWriter: log}

    def get(self, kind: type) -> object:
        return self.instances[kind]


def test_one_worktree_with_a_deleted_base_branch_does_not_stop_the_others():
    bus, log = FailingBus(), Log()
    for worktree_id in (1, 2):
        BehindWorktrees.checked(Container(bus, log), worktree_id, 1)
    assert bus.checked == [2] and "worktree 1" in log.lines[0] and "does not exist" in log.lines[0]
