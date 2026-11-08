import json

from tests.stories.core.modules.plugins.support.plugin_samples import MANIFEST, sample_plugin_folder
from tests.stories.core.support.fixtures import UserJoined
from core.base.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client


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
    story.expect_refusal(f'plugin propose {story.plugin_folder} --why "judges the code" --reason needed', "A person was asked in the dock", actor=story.agent)
    request = story.container.get(Queries).query(ApprovalRequest).first()
    with viewer_client(story) as viewer:
        viewer.value("messages.chat", ["approval", "accept", str(request.id)])
    story.expect_text("plugin list", "sample", "on", "1.0.0")


def test_an_agent_installs_disables_enables_configures_and_removes_a_plugin(new_story):
    story = plugin_story(new_story)
    story.expect_refusal(f"plugin install {story.plugin_folder} --yes --reason needed", "A person was asked in the dock", actor=story.agent)
    request = story.container.get(Queries).query(ApprovalRequest).first()
    with viewer_client(story) as viewer:
        viewer.value("messages.chat", ["approval", "accept", str(request.id)])
    for line in ("plugin disable sample", "plugin enable sample", "plugin configure sample level 2", "plugin remove sample"):
        story.expect_success(line, actor=story.agent)


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


def test_a_plugin_with_a_manifest_for_this_journal_version_installs_from_that_manifest(new_story):
    story = plugin_story(new_story)
    (story.plugin_folder / "journal-plugin.5.json").write_text(json.dumps({**MANIFEST, "version": "2.0.0"}))
    (story.plugin_folder / "journal-plugin.9.json").write_text(json.dumps({**MANIFEST, "version": "9.0.0"}))
    story.expect_text(f"plugin install {story.plugin_folder} --yes", "installed sample, on", actor=story.user)
    story.expect_text("plugin list", "sample", "2.0.0", actor=story.user)
    installed = story.home.folder / "plugins" / "sample"
    story.expect_rows((installed / "journal-plugin.json").is_file(), (installed / "journal-plugin.5.json").is_file(), (installed / "journal-plugin.9.json").is_file())


def test_a_plugin_whose_manifests_are_all_for_a_newer_journal_is_refused_plainly(new_story):
    story = plugin_story(new_story)
    (story.plugin_folder / "journal-plugin.json").unlink()
    (story.plugin_folder / "journal-plugin.9.json").write_text(json.dumps(MANIFEST))
    story.expect_refusal(f"plugin install {story.plugin_folder} --yes", "is for a newer journal: the lowest is for 9, this journal is 5.0.0", actor=story.user)
