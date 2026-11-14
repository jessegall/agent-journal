import json

from tests.stories.core.support.coding_fixtures import BuilderStarted, OpenTaskOrchestrator
from engine.testing.expectations.expect_row import expect_row
def test_an_agent_with_no_worktree_has_no_points(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success(f"worker-worktree points --agent {story.agent.id} --json", '{"points": []}')
