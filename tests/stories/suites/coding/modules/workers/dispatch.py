from core.modules.agents.models.agent import Agent
from tests.stories.core.support.agent_labels import agent_number
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.modules.actors.models.actor_record import ActorRecord
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder, OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, dispatched_worker, expect_clean_environment, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import CHECKOUT_BRANCH, ENVIRONMENT_BRANCH
WORKER_START = "agent start s-2 claude worker --environment main"


def test_a_dispatch_cuts_the_worktree_from_the_environments_branch_while_the_checkout_is_on_another(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    base_commit = repository.tip(ENVIRONMENT_BRANCH)
    worker_id = dispatched_worker(story).id
    story.expect_success(f"agent show {agent_number(story, worker_id)}", "role: worker", f"parent_id: {story.agent.id}")
    story.expect_success("worker-worktree show 1", "state: cut", f"session_agent_id: {worker_id}", "task_id: 1", f"folder: {repository.worktree_folder(worker_id)}",
                         f"branch: {repository.worker_branch(worker_id)}", f"base_branch: {ENVIRONMENT_BRANCH}", f"base_commit: {base_commit}")
    story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {worker_id}")
    repository.expect_branch_tip(repository.worker_branch(worker_id), base_commit)
    repository.expect_head(repository.worker_branch(worker_id), repository.worktree_folder(worker_id))
    repository.expect_head(CHECKOUT_BRANCH)


def test_a_dispatch_in_an_environment_that_names_no_branch_is_refused_and_makes_nothing(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story, branch="")
    actors = tuple(story.story_rows(ActorRecord))
    story.expect_refusal(DISPATCH, "environment main has no branch: journal environment edit main --branch <branch>", actor=story.agent)
    expect_clean_environment(story, repository)
    story.expect_rows(tuple(story.story_rows(ActorRecord)) == actors)


def test_a_worker_that_dispatches_a_worker_is_refused_and_makes_nothing(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = Actor(story.new_row_id(f"{WORKER_START} --parent {story.agent.id}"), ActorType.AGENT)
    actors = tuple(story.story_rows(ActorRecord))
    story.expect_refusal(DISPATCH, "a worker dispatches no workers", actor=worker)
    story.expect_success("worker-worktree list", "nothing found")
    story.expect_success(f"agent list --parent {worker.id}", "nothing found")
    story.expect_success(lines.TASK_DETAILS, "state: open")
    repository.expect_no_worktree()
    story.expect_rows(tuple(story.story_rows(ActorRecord)) == actors)


def test_a_dispatch_of_a_task_that_is_not_open_is_refused_and_makes_nothing(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    repository = repository_environment(story)
    story.expect_success('task cancel 1 --reason "a story needs it cancelled"', actor=story.agent)
    story.expect_refusal(DISPATCH, "task 1 is cancelled: only an open or a blocked task can be assigned to a worker", actor=story.agent)
    story.expect_success("worker-worktree list", "nothing found")
    story.expect_rows(story.story_rows(Agent, role="worker") == ())
    story.expect_success(lines.TASK_DETAILS, "state: cancelled")
    repository.expect_no_worktree()


def test_a_persons_dispatch_without_a_program_is_refused_naming_the_flag(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    person = story.new_row_id('actor make user "Ada"')
    story.expect_refusal(DISPATCH, "a person's dispatch needs the program the worker runs", actor=Actor(person, ActorType.USER))
    expect_clean_environment(story, repository)


def test_a_zero_worker_run_limit_refuses_dispatch_without_creating_a_worker(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.expect_success("setting make journal.suites.coding.workers.worker-run-limit 0 --environment main", "key: journal.suites.coding.workers.worker-run-limit")
    story.expect_refusal(DISPATCH, "0 workers are running", actor=story.agent)
    story.expect_rows(story.story_rows(Agent, role="worker") == ())
    story.expect_success("worker-worktree list", "nothing found")


def test_a_persons_dispatch_with_a_program_uses_the_tasks_environment(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    person = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    worker_id = story.new_row_id(f"{DISPATCH} --program claude", actor=person)
    story.expect_text(f"agent show {agent_number(story, worker_id)}", "environment_id: 1", "role: worker")
    story.expect_text("task show 1", f"holder_id: {worker_id}", "state: started")
