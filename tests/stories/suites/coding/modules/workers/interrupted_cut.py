from unittest.mock import patch

import pytest

from server.work.booting_work import BootingWork
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, FIRST_PROOF, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.memory_git.memory_worktree_git import MemoryWorktreeGit


def test_a_restart_in_the_middle_of_a_cut_undoes_it_and_the_task_is_dispatched_again(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    with patch.object(MemoryWorktreeGit, "cut", side_effect=KeyboardInterrupt), pytest.raises(KeyboardInterrupt):
        story.run(DISPATCH, actor=story.agent)
    story.expect_rows([worktree.state for worktree in story.story_rows(Worktree)] == [WorktreeState.NEW])
    BootingWork().run(story.container)
    story.run_listeners()
    story.expect_success("worker-worktree list", "nothing found")
    repository.expect_no_worktree()
    story.expect_success(lines.TASK_DETAILS, "state: open")
    worker = dispatched_worker(story, DISPATCH)
    repository.changed(worker.id, "cart.py", "TOTAL = 1\n")
    story.expect_success(FIRST_PROOF, "point: 1", actor=worker)
    story.expect_success(COMMIT, actor=worker)
