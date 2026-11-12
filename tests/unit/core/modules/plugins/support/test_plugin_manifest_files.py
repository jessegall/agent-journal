import json

import pytest

from engine.errors.refusal import Refusal
from core.modules.plugins.support.plugin_manifest_files import PluginManifestFiles


def plugin_folder(tmp_path, *versions: str, plain: bool = True):
    folder = tmp_path / "plugin"
    folder.mkdir()
    if plain:
        (folder / "journal-plugin.json").write_text(json.dumps({"name": "sample", "title": "Plain", "version": "1"}))
    for version in versions:
        (folder / f"journal-plugin.{version}.json").write_text(json.dumps({"name": "sample", "title": version, "version": "1"}))
    return folder


@pytest.mark.parametrize(("journal", "expected_file"), [("5.3.3", "journal-plugin.5.2.json"), ("4.62", "journal-plugin.4.json"),
                                                 ("5.2", "journal-plugin.5.2.json"), ("5.2.0", "journal-plugin.5.2.json"),
                                                 ("5.10", "journal-plugin.5.2.json"), ("3.9", "journal-plugin.json")])
def test_the_manifest_for_the_highest_version_at_or_below_the_journal_is_chosen(tmp_path, journal, expected_file):
    manifests = PluginManifestFiles.listed(plugin_folder(tmp_path, "4", "5.2", "6"))
    assert manifests.chosen(journal).name == expected_file


def test_a_plugin_with_only_the_plain_manifest_reads_it_on_every_journal(tmp_path):
    folder = plugin_folder(tmp_path)
    assert PluginManifestFiles.listed(folder).chosen("5.0.0").name == "journal-plugin.json"
    assert PluginManifestFiles.listed(folder).names == tuple(["journal-plugin.json"])


def test_every_manifest_for_a_newer_journal_is_reported_plainly(tmp_path):
    folder = plugin_folder(tmp_path, "5.4", "6", plain=False)
    with pytest.raises(Refusal, match="every manifest in .* is for a newer journal: the lowest is for 5.4, this journal is 5.0.0"):
        PluginManifestFiles.listed(folder).chosen("5.0.0")


def test_a_folder_without_any_manifest_contains_no_plugin(tmp_path):
    folder = tmp_path / "empty"
    folder.mkdir()
    with pytest.raises(Refusal, match="contains no plugin: journal-plugin.json is missing"):
        PluginManifestFiles.listed(folder).chosen("5.0.0")


def test_a_file_that_only_looks_like_a_manifest_is_not_one(tmp_path):
    folder = plugin_folder(tmp_path, "5")
    (folder / "journal-plugin.backup.json").write_text("{}")
    assert PluginManifestFiles.listed(folder).names == ("journal-plugin.json", "journal-plugin.5.json")
