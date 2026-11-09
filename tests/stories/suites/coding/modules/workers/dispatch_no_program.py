from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.testing.fake_launcher import FakeLauncher
from core.testing.hook_samples import HookSamples
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, DELIVERY, FIRST_PROOF, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

SESSION = "s-plugin-worker"
PERSON = 'actor make user "Ada"'
MISSING_PROGRAM = f"worker dispatch --test-command python=pytest --program claude --model sonnet 1 --no-program --session {SESSION}"


def person(story) -> Actor:
    return Actor(story.new_row_id(PERSON), ActorType.USER)


def test_a_person_dispatches_a_worker_that_starts_no_program_and_its_session_hooks_are_the_workers(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    try:
        worker = Actor(story.new_row_id(MISSING_PROGRAM, actor=person(story)), ActorType.AGENT)
        story.run_listeners()
        story.expect_rows(launcher.requests == [], story.container.get(Queries).query(Agent).find(worker.id).session == SESSION)
        story.expect_text("worker-worktree list", f"worker-{worker.id}")
        story.expect_hook_allowed(SESSION, HookSamples.tick())
        story.expect_rows(launcher.requests == [])
        repository.changed(worker.id, "cart.py", CART_CHANGE)
        story.expect_success(FIRST_PROOF, "point: 1", actor=worker)
        story.expect_success(DELIVERY, actor=worker)
        story.expect_success("proof check 1", "state: checked", actor=story.agent)
        story.expect_success(f"worker logs {worker.id}", actor=story.agent)
        repository.checkout(ENVIRONMENT_BRANCH)
        story.expect_success(f"worker merge --wait {worker.id}", actor=story.agent)
        story.expect_success(lines.TASK_DETAILS, "state: completed")
    finally:
        launcher.server.close()
        story.home.socket("launcher").unlink(missing_ok=True)


def test_an_agent_cannot_dispatch_a_worker_with_no_program(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.expect_refusal(MISSING_PROGRAM, "only a person dispatches a worker with no program", actor=story.agent)
    story.expect_success("worker-worktree list", "nothing found")


def test_a_session_is_refused_without_no_program(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.expect_refusal(f"worker dispatch --test-command python=pytest --program claude --model sonnet 1 --session {SESSION}", "add --no-program", actor=person(story))
