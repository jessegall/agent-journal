from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.plugins.support.plugin_samples import event_plugin_folder
from tests.stories.core.support.coding_fixtures import UserBuilder

PLUGIN = "kinds"
CLASS_LINE = "kinds judge: long lane, cost 4"


class PluginClassMade(StoryFixture):
    """A plugin is installed and the person made a class for its runs."""

    parent = UserBuilder

    def steps(self, story: Story) -> None:
        installed(story)
        story.expect_success(f"queue-class add kinds-judge --plugin {PLUGIN} --lane long --cost 4 --priority normal", actor=story.user)


def installed(story: Story) -> None:
    folder = event_plugin_folder(story.home.folder.parent / "sources", [], {}, name=PLUGIN)
    story.expect_success(f"plugin install {folder} --yes", actor=story.user)
    story.run_listeners()


def test_a_removed_plugins_class_is_hidden_and_comes_back_when_the_plugin_is_installed_again(new_story):
    story = new_story(fixture=PluginClassMade)
    story.expect_text("queue-class list", f"holds plugin {PLUGIN}", actor=story.user)
    story.expect_success(f"plugin remove {PLUGIN}", actor=story.user)
    story.run_listeners()
    story.expect_no_text("queue-class list", f"holds plugin {PLUGIN}", actor=story.user)
    installed(story)
    story.expect_text("queue-class list", f"holds plugin {PLUGIN}", actor=story.user)


def test_an_upgrade_keeps_the_persons_classes_beside_the_built_in_ones(new_story):
    story = new_story(fixture=PluginClassMade)
    code, report = story.synced()
    story.expect_rows(code == 0, detail=report)
    story.expect_text("queue-class list", f"holds plugin {PLUGIN}", "graphify: long lane, cost 8", actor=story.user)
