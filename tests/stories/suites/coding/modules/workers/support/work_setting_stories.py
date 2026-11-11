from engine.testing.stories.story import Story

REVISION_PREFIX = "revision: "
SHOWN_SETTINGS = "work-settings show --environment main"


def settings_revision(story: Story) -> str:
    shown = story.run(SHOWN_SETTINGS, story.user)
    return next(line for line in shown.output_text.splitlines() if line.startswith(REVISION_PREFIX)).removeprefix(REVISION_PREFIX)


def apply_work_setting(story: Story, key: str, value: object) -> None:
    """A person changes one setting of the Workers screen, by the line the screen sends."""
    story.expect_success(f"work-settings apply --revision {settings_revision(story)} --environment main {key}={value}", actor=story.user)
