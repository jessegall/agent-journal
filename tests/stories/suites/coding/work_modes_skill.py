from tests.stories.core.support.coding_fixtures import BuilderStarted


def skill_text(story, folder: str) -> str:
    return (story.home.project_folder / ".claude" / "skills" / folder / "SKILL.md").read_text()


def test_the_work_modes_skill_is_written_for_the_builder_and_the_orchestrator(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run("skill write")
    text = skill_text(story, "journal-work-modes")
    assert "name: journal-work-modes" in text
    assert "coding.orchestrator" in text and "coding.builder" in text
