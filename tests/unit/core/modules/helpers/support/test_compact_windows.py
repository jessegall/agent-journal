from types import SimpleNamespace

from core.modules.helpers.support.compact_windows import CompactWindows
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_FINISH_TASK, CONTEXT_LIMIT_HARD_TOKENS


def windows(started: tuple, finish_first: bool = True, hard: int = 600_000) -> CompactWindows:
    settings = SimpleNamespace(number=lambda key: {CONTEXT_LIMIT_HARD_TOKENS: hard}[key], flag=lambda key: {CONTEXT_LIMIT_FINISH_TASK: finish_first}[key])
    tasks = SimpleNamespace(started_tasks=lambda agent_id: started)
    return CompactWindows(settings, None, tasks, None, None, None)


def test_an_agent_with_a_started_task_compacts_at_the_hard_size():
    assert windows(started=("task",)).window(1, 400_000) == 600_000


def test_an_agent_with_no_started_task_compacts_at_its_own_size():
    assert windows(started=()).window(1, 400_000) == 400_000


def test_without_finishing_first_the_agent_always_compacts_at_its_own_size():
    assert windows(started=("task",), finish_first=False).window(1, 400_000) == 400_000


def test_a_hard_size_below_the_agents_own_size_is_never_used():
    assert windows(started=("task",), hard=300_000).window(1, 400_000) == 400_000
