from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_a_command_naming_another_environment_keeps_its_own(new_story):
    story = new_story(fixture=BuilderStarted, environment="main")
    story.expect_success("environment make elsewhere /work/elsewhere", actor=story.user)
    story.expect_success('task make "Fix the shelf" --brief "It wobbles" --environment elsewhere', "environment_id: 2", actor=story.user)
