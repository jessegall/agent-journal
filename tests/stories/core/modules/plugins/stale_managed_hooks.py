from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.provider.managed_hook import ManagedHook
from engine.provider.managed_hooks import ManagedHooks
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.plugins.support.plugin_samples import event_plugin_folder
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_value

STAMP = "# @code-commandments-managed"
STAMPED_COMMAND = f"commandments-hook {STAMP}"
PROJECT_COMMAND = "project-check"


def managed_hook(command: str) -> ManagedHook:
    return ManagedHook.found("claude", "PreToolUse", "Bash", {"command": command}, ".claude/settings.json", True)


def commands(story: Story) -> list[str]:
    return [hook.command for hook in story.container.get(ManagedHooks).all()]


def install_stamped_plugin(story: Story) -> None:
    folder = event_plugin_folder(story.home.folder.parent, [], {}, name="commandments", hook_stamp=STAMP)
    story.expect_success(f"plugin install {folder} --yes", actor=story.user)


class PersonPresent(StoryFixture):
    """A person is in the project, with a managed file to be written."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)


def stamped_project_hooks(story: Story) -> None:
    story.container.get(ManagedHooks).added([managed_hook(STAMPED_COMMAND), managed_hook(PROJECT_COMMAND)])


def test_installing_a_plugin_removes_the_managed_hooks_with_its_stamp_and_keeps_the_others(new_story):
    story = new_story(fixture=PersonPresent)
    stamped_project_hooks(story)
    expect_value(commands(story), [STAMPED_COMMAND, PROJECT_COMMAND])
    install_stamped_plugin(story)
    expect_value(commands(story), [PROJECT_COMMAND])


def test_switching_a_plugin_on_removes_a_stamped_hook_that_came_back(new_story):
    story = new_story(fixture=PersonPresent)
    stamped_project_hooks(story)
    install_stamped_plugin(story)
    story.expect_success("plugin disable commandments", actor=story.user)
    story.container.get(ManagedHooks).added([managed_hook(STAMPED_COMMAND)])
    expect_value(STAMPED_COMMAND in commands(story), True)
    story.expect_success("plugin enable commandments", actor=story.user)
    expect_value(commands(story), [PROJECT_COMMAND])


def test_a_person_removes_managed_hooks_by_stamp(new_story):
    story = new_story(fixture=PersonPresent)
    stamped_project_hooks(story)
    story.expect_text(f'managed-hook remove --stamp "{STAMP}"', "removed 1 managed hooks", actor=story.user)
    expect_value(commands(story), [PROJECT_COMMAND])
    story.expect_text(f'managed-hook remove --stamp "{STAMP}"', "removed 0 managed hooks", actor=story.user)
