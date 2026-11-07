from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

MERGE_COMMANDS = "journal.suites.coding.workers.merge-commands"
DELIVERED_BRANCH = "delivered"


def merge_commands(story, *commands: str) -> None:
    listed = ", ".join(f'"{command}"' for command in commands)
    story.expect_success(f"""setting set {MERGE_COMMANDS} '[{listed}]' --environment main""")


def test_a_merge_runs_its_commands_on_the_merged_branch_and_closes_the_task(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    merge_commands(story, f"git branch {DELIVERED_BRANCH} $JOURNAL_BRANCH")
    story.expect_success(f"worker merge --wait {worker.id}", actor=story.agent)
    repository.expect_branch_tip(DELIVERED_BRANCH, repository.tip(ENVIRONMENT_BRANCH))
    story.expect_text(lines.TASK_DETAILS, "state: completed")


def test_a_failed_merge_command_leaves_the_task_in_testing_and_a_second_merge_finishes_it(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    merge_commands(story, "echo the remote refused the push >&2; exit 1")
    story.expect_refusal(f"worker merge --wait {worker.id}", "the remote refused the push", actor=story.agent)
    story.expect_text(lines.TASK_DETAILS, "state: testing")
    story.expect_text("worker-worktree show 1", "state: delivered")
    merge_commands(story, f"git branch {DELIVERED_BRANCH} $JOURNAL_BRANCH")
    story.expect_success(f"worker merge --wait {worker.id}", actor=story.agent)
    repository.expect_branch_tip(DELIVERED_BRANCH, repository.tip(ENVIRONMENT_BRANCH))
    story.expect_text(lines.TASK_DETAILS, "state: completed")
    story.expect_text("worker-worktree show 1", "state: removed")
