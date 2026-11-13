from pathlib import Path

from engine.journal.journal_home import JournalHome
from engine.module.module import Module
from engine.module.module_finder import ModuleFinder
from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue
from tests.unit.support.setting_view_check import SettingViewCheck

PROJECT_FOLDER = Path(__file__).resolve().parents[4]
# the view files that read a setting key for something other than drawing its row, each with its reason
ALLOWED = {
    "src/suites/coding/web/src/AgentSettings.vue": "reads the two switches that start the work for the line under the Work tab",
    "src/suites/coding/web/src/WorkMode.vue": "the auto switch of the top bar sets the setting by its key",
    "src/suites/coding/web/src/helperRows.js": "the agent type screen splits the merge hooks list into one list per profile, which no generated field does",
    "src/suites/coding/modules/workers/web/src/WorkerModels.vue": "a window of its own that edits the allowed models list, not a generated screen",
    "src/suites/coding/modules/workers/web/src/WorkerSplit.vue": "a window of its own that edits the program split, not a generated screen",
    "src/tunnels/tunler/web/src/TunlerAccount.vue": "the account panel of the tunnel reads and sets its own settings",
    "src/tunnels/tunler/web/src/TunlerDomain.vue": "the domain panel of the tunnel reads and sets its own settings",
}


class SampleModule(Module):
    name = "journal.sample"
    settings = [SettingValue("auto", "Auto", "Whether it goes on.", SettingType.FLAG, default=True)]


def checked(folder: Path, allowed: dict[str, str] | None = None) -> SettingViewCheck:
    return SettingViewCheck(folder, [SampleModule], allowed or {})


def test_a_view_that_names_a_declared_key_is_named_with_the_key(tmp_path):
    view = tmp_path / "src" / "suites" / "coding" / "web" / "src" / "Row.vue"
    view.parent.mkdir(parents=True)
    view.write_text('<script setup>const KEY = "journal.sample.auto";</script>\n')
    assert checked(tmp_path).failures() == ["src/suites/coding/web/src/Row.vue names the declared settings journal.sample.auto: draw them from their declaration"]


def test_a_view_that_names_a_text_that_is_no_declared_key_is_quiet(tmp_path):
    view = tmp_path / "src" / "core" / "modules" / "x" / "web" / "src" / "Row.vue"
    view.parent.mkdir(parents=True)
    view.write_text('<script setup>const NOT_A_KEY = "journal.sample.other";</script>\n')
    assert checked(tmp_path).failures() == []


def test_the_setting_components_module_and_files_outside_the_views_are_not_judged(tmp_path):
    inside = tmp_path / "src" / "core" / "modules" / "setting_components" / "web" / "src" / "Row.vue"
    outside = tmp_path / "src" / "core" / "modules" / "x" / "support" / "names.py"
    for path in (inside, outside):
        path.parent.mkdir(parents=True)
        path.write_text('"journal.sample.auto"\n')
    assert checked(tmp_path).failures() == []


def test_an_allowed_view_is_quiet_and_an_allowance_for_a_file_that_is_gone_is_named(tmp_path):
    view = tmp_path / "src" / "suites" / "coding" / "web" / "src" / "Row.vue"
    view.parent.mkdir(parents=True)
    view.write_text('"journal.sample.auto"\n')
    check = checked(tmp_path, {"src/suites/coding/web/src/Row.vue": "a reason", "src/suites/coding/web/src/Gone.vue": "a reason"})
    assert (check.failures(), check.unknown_allowances()) == ([], ["src/suites/coding/web/src/Gone.vue"])


def test_the_tree_names_no_declared_setting_in_a_view_but_the_allowed_ones():
    modules = ModuleFinder(JournalHome(PROJECT_FOLDER / ".journal")).default_modules()
    check = SettingViewCheck(PROJECT_FOLDER, modules, ALLOWED)
    assert check.failures() == []
    assert check.unknown_allowances() == []


def test_every_declared_setting_has_a_component_that_can_draw_its_kind():
    modules = ModuleFinder(JournalHome(PROJECT_FOLDER / ".journal")).default_modules()
    assert SettingViewCheck(PROJECT_FOLDER, modules, {}).component_failures() == []


def test_a_view_of_the_core_viewer_and_a_typescript_view_are_judged_too(tmp_path):
    for relative in ("src/viewer/src/Row.vue", "src/core/modules/x/web/src/rows.ts"):
        view = tmp_path / relative
        view.parent.mkdir(parents=True)
        view.write_text('"journal.sample.auto"\n')
    assert [problem.split(" ")[0] for problem in checked(tmp_path).failures()] == ["src/core/modules/x/web/src/rows.ts", "src/viewer/src/Row.vue"]
