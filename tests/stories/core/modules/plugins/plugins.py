from tests.stories.core.modules.plugins.support.plugin_samples import sample_plugin_folder
from tests.stories.core.support.fixtures import UserJoined


def plugin_story(new_story):
    story = new_story(fixture=UserJoined)
    story.plugin_folder = sample_plugin_folder(story.home.folder.parent)
    return story


def test_the_user_installs_a_plugin_from_its_folder_and_it_is_listed_on_with_its_version(new_story):
    story = plugin_story(new_story)
    story.expect_text(f"plugin install {story.plugin_folder} --yes", "installed sample, on", actor=story.user)
    story.expect_text("plugin list", "sample", "on", "1.0.0", actor=story.user)
    story.expect_rows((story.home.folder / "plugins" / "sample" / "run.sh").is_file(), (story.home.folder / "plugin-data" / "sample").is_dir())


def test_without_yes_an_install_only_shows_what_it_would_install(new_story):
    story = plugin_story(new_story)
    story.expect_text(f"plugin install {story.plugin_folder}", "nothing installed yet", actor=story.user)
    story.expect_text("plugin list", "no plugin is installed", actor=story.user)


def test_an_agent_proposes_a_plugin_and_the_user_installs_it(new_story):
    story = plugin_story(new_story)
    story.expect_text(f'plugin propose {story.plugin_folder} --why "judges the code"', "proposed sample: the user installs it if they want it", actor=story.agent)


def test_installing_enabling_disabling_configuring_and_removing_are_the_users_alone(new_story):
    story = plugin_story(new_story)
    story.run(f"plugin install {story.plugin_folder} --yes", actor=story.user)
    for line in (f"plugin install {story.plugin_folder} --yes", "plugin enable sample", "plugin disable sample", "plugin configure sample level 2", "plugin remove sample"):
        story.expect_refusal(line, "only the user", actor=story.agent)


def test_the_user_configures_a_setting_of_its_type_and_a_wrong_value_is_refused(new_story):
    story = plugin_story(new_story)
    story.run(f"plugin install {story.plugin_folder} --yes", actor=story.user)
    story.expect_text("plugin configure sample level 2", "sample level = 2", actor=story.user)
    story.expect_text("plugin settings sample", "level", "number", "2", actor=story.user)
    story.expect_refusal("plugin configure sample level high", "level is a number; high is not", actor=story.user)


def test_disable_switches_a_plugin_off_and_remove_keeps_its_data_unless_purged(new_story):
    story = plugin_story(new_story)
    story.run(f"plugin install {story.plugin_folder} --yes", actor=story.user)
    story.expect_text("plugin disable sample", "sample off", actor=story.user)
    story.expect_text("plugin remove sample", "removed sample; its data folder stays", actor=story.user)
    story.expect_rows((story.home.folder / "plugin-data" / "sample").is_dir(), not (story.home.folder / "plugins" / "sample").exists())


def test_with_no_plugin_installed_the_list_says_so(new_story):
    story = plugin_story(new_story)
    story.expect_text("plugin list", "no plugin is installed", actor=story.user)
