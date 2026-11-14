from engine.testing.stories.story import Story


def expect_project_files(story: Story) -> None:
    text = story.run("project-file list --environment main --json", actor=story.agent).output_text
    assert '"name": "shop"' in text and '".git"' not in text
    assert text.index('"shop"') < text.index('"notes.bin"')
