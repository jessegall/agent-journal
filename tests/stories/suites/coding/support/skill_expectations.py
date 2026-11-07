from core.testing.story import Story


def expect_skill_text(story: Story, folder: str, *expected: str) -> None:
    text = (story.home.project_folder / ".claude" / "skills" / folder / "SKILL.md").read_text()
    for item in expected:
        assert item in text, item
