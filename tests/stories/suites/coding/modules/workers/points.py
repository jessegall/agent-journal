import json

from tests.stories.core.support.coding_fixtures import BuilderStarted, OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import delivered_worker, repository_environment
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_answers


def test_an_agent_with_no_worktree_has_no_points(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success(f"worker-worktree points --agent {story.agent.id} --json", '{"points": []}')


def test_the_points_of_a_worker_carry_the_proof_shown_for_each(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    points = json.loads(story.run(f"worker-worktree points --agent {worker.id} --json").output_text)["points"]
    expect_answers(points, 1)
    expect_row(points[0], id=1)
    expect_row(points[0]["proof"], state="shown")
    expect_row(points[0]["proof"], shortfall="")
