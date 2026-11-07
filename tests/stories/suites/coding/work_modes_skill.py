from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.suites.coding.support.skill_expectations import expect_skill_text


def test_the_work_modes_skill_is_written_for_the_builder_and_the_orchestrator(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run("skill write")
    expect_skill_text(story, "journal-work-modes", "name: journal-work-modes", "coding.auto-mode", "Orchestrator")
