import os
from dataclasses import replace

from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.kept_plugin_checks import KEPT_PLUGIN_COUNT, KeptPluginChecks
from core.modules.plugins.support.plugin_run_check import PluginRunCheck

LATER_NS = 10**12


def sample_plugin(plugin_id: int = 1) -> Plugin:
    return Plugin(id=plugin_id, version=1, creator_id=1, name=f"sample-{plugin_id}", title="Sample", source="/sources/sample", release="1.0.0")


def code_folder(tmp_path, name: str = "sample"):
    folder = tmp_path / name
    folder.mkdir(exist_ok=True)
    (folder / "manifest.json").write_text("{}")
    return folder


class CountedChecks:
    def __init__(self, result=None) -> None:
        self.count, self.result = 0, result

    def __call__(self) -> PluginRunCheck:
        self.count += 1
        return self.result or PluginRunCheck(sample_plugin())


def test_the_checks_run_once_for_two_hooks_while_nothing_changed(tmp_path):
    kept, checks, folder = KeptPluginChecks(), CountedChecks(), code_folder(tmp_path)
    for _ in range(2):
        kept.check(sample_plugin(), folder, False, checks)
    assert checks.count == 1


def test_a_changed_manifest_runs_the_checks_again(tmp_path):
    kept, checks, folder = KeptPluginChecks(), CountedChecks(), code_folder(tmp_path)
    kept.check(sample_plugin(), folder, False, checks)
    manifest = folder / "manifest.json"
    manifest.write_text('{"name": "sample"}')
    os.utime(manifest, ns=(LATER_NS, LATER_NS))
    kept.check(sample_plugin(), folder, False, checks)
    assert checks.count == 2


def test_a_changed_plugin_row_runs_the_checks_again(tmp_path):
    kept, checks, folder = KeptPluginChecks(), CountedChecks(), code_folder(tmp_path)
    kept.check(sample_plugin(), folder, False, checks)
    kept.check(replace(sample_plugin(), version=2), folder, False, checks)
    assert checks.count == 2


def test_a_switched_off_notice_is_not_kept(tmp_path):
    kept, folder = KeptPluginChecks(), code_folder(tmp_path)
    checks = CountedChecks(PluginRunCheck(sample_plugin(), reason="its files changed since it was installed", is_changed=True))
    for _ in range(2):
        kept.check(sample_plugin(), folder, False, checks)
    assert checks.count == 2


def test_the_kept_checks_stay_within_their_limit(tmp_path):
    kept, folder = KeptPluginChecks(), code_folder(tmp_path)
    for plugin_id in range(KEPT_PLUGIN_COUNT + 5):
        kept.check(sample_plugin(plugin_id), folder, False, CountedChecks())
    assert len(kept.kept) <= KEPT_PLUGIN_COUNT
