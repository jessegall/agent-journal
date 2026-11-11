from core.modules.assignments.models.assignment import Assignment
from tests.stories.core.support.fixtures import UserJoined


def test_the_assignments_table_exists_after_start(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success("assignment list --environment main", actor=story.user)
    story.expect_rows(story.story_rows(Assignment) == ())


def test_assignment_make_and_edit_are_not_commands(new_story):
    story = new_story(fixture=UserJoined)
    for subcommand in ("make", "edit"):
        outcome = story.run(f"assignment {subcommand} --environment main", actor=story.user)
        story.expect_rows(outcome.code != 0, detail=outcome.output_text)
