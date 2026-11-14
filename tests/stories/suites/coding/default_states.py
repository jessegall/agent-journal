from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import BuilderStartedWithoutPlainWords


def test_state_types_with_defaults_shows_what_the_coding_suite_gives_each_kind_of_agent(new_story):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    shown = story.run("driver state-types --defaults", actor=story.agent).output_text
    story.expect_rows("tasks.where-you-stand" in shown, "workers.worker-log-due" in shown, detail=shown)


def test_a_coding_main_agent_has_the_where_you_stand_default_at_the_bottom_of_its_states_and_nothing_is_written(new_story):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    shown = story.run(f"driver states {agent_number(story, story.agent.id)}", actor=story.agent).output_text
    in_place = next(line for line in shown.splitlines() if line.startswith("in_place:"))
    story.expect_rows("tasks.where-you-stand (agent:" in in_place and "since" in in_place, detail=shown)
