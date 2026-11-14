from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_the_main_agent_reads_its_open_tasks_and_the_skills_to_load_in_the_overview(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_text("overview", "task list", "skill required", actor=story.agent)

