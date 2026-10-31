from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import BuilderWithStartedTask, OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, dispatched_worker, expect_clean_environment, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import CHECKOUT_BRANCH, ENVIRONMENT_BRANCH
WORKER_START = "agent start s-2 claude worker --environment main"


def test_a_dispatch_cuts_the_worktree_from_the_environments_branch_while_the_checkout_is_on_another(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    base_commit = repository.tip(ENVIRONMENT_BRANCH)
    worker_id = dispatched_worker(story).id
    story.expect_success(f"agent show {worker_id}", "role: worker", f"parent_id: {story.agent.id}")
    story.expect_success("worker-worktree show 1", "state: cut", f"agent_id: {worker_id}", "task_id: 1", f"folder: {repository.worktree_folder(worker_id)}",
                         f"branch: {repository.worker_branch(worker_id)}", f"base_branch: {ENVIRONMENT_BRANCH}", f"base_commit: {base_commit}")
    story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {worker_id}")
    repository.expect_branch_tip(repository.worker_branch(worker_id), base_commit)
    repository.expect_head(repository.worker_branch(worker_id), repository.worktree_folder(worker_id))
    repository.expect_head(CHECKOUT_BRANCH)


def test_a_dispatch_in_an_environment_that_names_no_branch_is_refused_and_makes_nothing(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story, branch="")
    story.expect_refusal(DISPATCH, "environment main has no branch: journal environment edit main --branch <branch>", actor=story.agent)
    expect_clean_environment(story, repository)


def test_a_dispatch_from_a_branch_that_does_not_exist_is_refused_and_makes_nothing(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story, branch="version-6")
    story.expect_refusal(DISPATCH, f"branch version-6 does not exist in {repository.folder}", actor=story.agent)
    expect_clean_environment(story, repository)


def test_a_worker_that_dispatches_a_worker_is_refused_and_makes_nothing(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = Actor(story.new_row_id(f"{WORKER_START} --parent {story.agent.id}"), ActorType.AGENT)
    story.expect_refusal(DISPATCH, "a worker dispatches no workers", actor=worker)
    story.expect_success("worker-worktree list", "nothing found")
    story.expect_success(f"agent list --parent {worker.id}", "nothing found")
    story.expect_success(lines.TASK_DETAILS, "state: open")
    repository.expect_no_worktree()


def test_a_dispatch_whose_worktree_command_fails_is_refused_with_its_output_and_removes_the_worktree_and_its_branch(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    story.expect_success("""setting make journal.suites.coding.workers.worktree-commands '["echo npm is not installed >&2; exit 1"]' --environment main""", "key: journal.suites.coding.workers.worktree-commands")
    story.expect_refusal(DISPATCH, "npm is not installed", actor=story.agent)
    expect_clean_environment(story, repository)


def test_a_dispatch_of_a_task_that_is_not_open_is_refused_and_makes_nothing(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    repository = repository_environment(story)
    story.expect_refusal(DISPATCH, "task 1 is started: a worker is dispatched to an open task", actor=story.agent)
    story.expect_success("worker-worktree list", "nothing found")
    story.expect_success("agent list --role worker", "nothing found")
    story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {story.agent.id}")
    repository.expect_no_worktree()


def test_a_persons_dispatch_without_a_program_is_refused_naming_the_flag(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    person = story.new_row_id('actor make user "Ada"')
    story.expect_refusal(DISPATCH, "a person's dispatch needs the program the worker runs", actor=Actor(person, ActorType.USER))
    expect_clean_environment(story, repository)


def test_a_dispatch_is_refused_while_the_environment_has_as_many_workers_out_as_its_limit_allows(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    story.expect_success("setting make journal.suites.coding.workers.worker-limit 0 --environment main", "key: journal.suites.coding.workers.worker-limit")
    story.expect_refusal(DISPATCH, "0 workers are out already", actor=story.agent)
    story.expect_success("agent list --role worker", "nothing found")
