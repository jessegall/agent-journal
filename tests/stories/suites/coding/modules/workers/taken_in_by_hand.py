from engine.query.queries import Queries
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.close_claimed_worktree_tasks.close_claimed_worktree_tasks_handler import MERGED_TEXT
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.ticks.merger_retry import MergerRetry
from tests.stories.suites.coding.modules.workers.merger import merger_agent
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.memory_git.memory_repository import MemoryRepository
from tests.stories.suites.coding.modules.workers.test_queue import ended, queued_story


def merged_manually(story, repository: MemoryRepository) -> Worktree:
    worktree = story.container.get(Queries).query(Worktree).first()
    history = repository.history
    history.branches[ENVIRONMENT_BRANCH] = history.branches[worktree.branch]
    repository.files().write(history.tip(ENVIRONMENT_BRANCH).tree)
    return worktree


def expect_closed_without_the_merger(story, repository: MemoryRepository, worktree: Worktree) -> None:
    task = story.container.get(Queries).query(Task).find(worktree.task_id)
    closed = story.container.get(Queries).query(Worktree).find(worktree.id)
    story.expect_rows(task.state.value == "completed", task.outcome in ("its tests passed", MERGED_TEXT.format(branch=ENVIRONMENT_BRANCH)),
                      closed.merged_at is not None, closed.commit_before_merge == closed.commit_after_merge, closed.removed_at is not None, merger_agent(story) is None,
                      detail=f"{task.state} {task.outcome!r} {closed}")
    story.expect_success("worker-worktree list", "nothing found")
    repository.expect_no_worktree()


def test_a_delivered_branch_taken_in_by_hand_closes_as_merged_when_its_tests_pass_and_no_merger_is_sent(new_story, monkeypatch):
    story, repository, _, started = queued_story(new_story, monkeypatch)
    worktree = merged_manually(story, repository)
    ended(story, started[0], 0)
    expect_closed_without_the_merger(story, repository, worktree)


def test_a_merge_ready_branch_taken_in_by_hand_later_is_closed_at_the_next_round_without_the_merger(new_story, monkeypatch):
    story, repository, _, started = queued_story(new_story, monkeypatch)
    ended(story, started[0], 0)
    story.expect_rows(merger_agent(story) is None, detail="the merger could not start while nothing launches")
    worktree = merged_manually(story, repository)
    MergerRetry()(story.container)
    story.run_listeners()
    expect_closed_without_the_merger(story, repository, worktree)
