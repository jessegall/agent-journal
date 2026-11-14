import pytest

from engine.performance.timing import Timing
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT, request_merge
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

pytestmark = pytest.mark.real_git

SECOND_JOB = 'task make "Second job" --brief "Do the second job" --environment main'
DELIVERY_STEPS = ["send_worktree_opened", "send_branch_start_found", "send_worktree_cut"]
PREPARE_STEPS = ["prepare_dependency_folders", "prepare_libraries", "prepare_hooks", "prepare_skills", "prepare_tool_graph", "prepare_instruction_files", "prepare_worktree_commands"]


def test_a_send_to_a_merged_worker_stamps_each_step_of_its_cut_and_preparation_in_order(played):
    story = played(OpenTaskOrchestrator)
    repository = repository_environment(story)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(SECOND_JOB, actor=story.agent)
    kept = dispatched_worker(story, "worker dispatch --test-command python=pytest --model sonnet 2")
    repository.changed(kept.id, "second.py", "SECOND = 1\n")
    story.expect_success('proof make 1 --task 2 "second.py:1, the second story"', actor=kept)
    story.expect_success(COMMIT, actor=kept)
    story.expect_success("proof check 1", actor=story.agent)
    story.expect_success(f"worker logs {agent_number(story, kept.id)}", actor=story.agent)
    request_merge(story, kept)
    story.expect_success(f"worker merge --wait {agent_number(story, kept.id)}", actor=story.agent)
    timing = story.container.get(Timing)
    timing.stamps[:] = Timing.started("go_start").stamps
    story.expect_success(f"worker send --wait {agent_number(story, kept.id)} --task 1", actor=story.agent)
    names = [name for name, _ in timing.stamps]
    story.expect_rows([name for name in names if name in DELIVERY_STEPS + PREPARE_STEPS] == DELIVERY_STEPS + PREPARE_STEPS, detail=names)
