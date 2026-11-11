from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.testing.stories.story import Story
from core.modules.settings.commands.set_setting.set_setting import SetSetting
from suites.coding.modules.workers.support.worker_settings import WORKER_RESUME_LIMIT

REVISION_PREFIX = "revision: "
SHOWN_SETTINGS = "work-settings show --environment main"


def settings_revision(story: Story) -> str:
    shown = story.run(SHOWN_SETTINGS, story.user)
    return next(line for line in shown.output_text.splitlines() if line.startswith(REVISION_PREFIX)).removeprefix(REVISION_PREFIX)


def apply_work_setting(story: Story, key: str, value: object) -> None:
    """A person changes one setting of the Workers screen, by the line the screen sends."""
    story.expect_success(f"work-settings apply --revision {settings_revision(story)} --environment main {key}={value}", actor=story.user)


def set_resume_limit(container: Container, count: int) -> None:
    """Sets how often a stopped worker is told to go on, as the story's setup through the container and not as one of its steps."""
    container.get(Bus).run(SetSetting(WORKER_RESUME_LIMIT, str(count), project=False), Actor.core(), environment_id=1)
