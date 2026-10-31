import json

from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story
from tests.stories.core.modules.plugins.support.plugin_samples import MANIFEST


def plugin_folder(journal_folder):
    folder = journal_folder / "plugins" / "code-commandments"
    folder.mkdir(parents=True)
    (folder / "journal-plugin.json").write_text(json.dumps({**MANIFEST, "name": "code-commandments", "settings": ""}))
    (folder / "run.sh").write_text("#!/bin/sh\n")


def test_an_installed_version_4_plugin_keeps_its_release_its_switch_and_its_settings(new_story):
    story = upgraded_story(new_story, plugin_folder)
    story.expect_text("plugin list", "code-commandments", "on", "v6.26.0")
    assert "journal.core.plugins: moved 1" in story.upgrade_text


def test_a_version_4_plugin_whose_folder_is_gone_moves_switched_off(new_story):
    story = upgraded_story(new_story)
    story.expect_text("plugin list", "code-commandments", "off")
