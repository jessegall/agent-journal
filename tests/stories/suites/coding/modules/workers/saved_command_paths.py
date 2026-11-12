from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_a_saved_command_naming_a_worktree_is_not_saved(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_refusal('alias add build-tree ".journal/worktrees/main/worker-1/build.sh" --category build', "cannot contain a temporary worktree path", actor=story.agent)
