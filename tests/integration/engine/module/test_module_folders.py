from uuid import uuid4
from pathlib import Path
import io
import json
import pytest
import re
import shutil
import subprocess

from engine.caller.caller_request import CallerRequest
from engine.cli.line_run import LineRun
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.registry.registry import Registry
from engine.testing.expectations.expect_row import expect_row
from tests.stories.engine.module.support.sample_programs import PATH

ROOT = Path(__file__).resolve().parents[4]
CUSTOM = ROOT / ".commandments" / "custom"
PLUGIN = Path(".journal/plugins/code-commandments/bin/commandments-release")
SKILLS = ("plain-code-words", "module-registration")
INLINE_RULE = "architecture_modules_inline_declaration"
UNLISTED_RULE = "architecture_modules_unlisted_declaration"
LIST_ENTRY_RULE = "architecture_modules_list_entry_not_a_class"
SECOND_DECLARATION_RULE = "architecture_modules_second_declaration_in_a_file"
CLEAN_MODULE = '''from engine.module.module import Module
from shop.cart_window import CartWindow


class ShopModule(Module):
    """Adds the shop."""

    name = "shop"
    windows = [CartWindow]
'''
CART_WINDOW = '''from engine.viewer.window_declaration import WindowDeclaration


class CartWindow(WindowDeclaration):
    """The cart."""
'''
SAMPLE = Path(__file__).resolve().parents[4] / "tests" / "stories" / "engine" / "module" / "support" / "folder_sample"
SAMPLES = "tests.stories.engine.module.support.suite_samples"
MODULES = "tests.stories.engine.module.support.agent_type_modules"


@pytest.fixture
def source_folder(tmp_path):
    folder = tmp_path / f"notes_{uuid4().hex}"
    shutil.copytree(SAMPLE, folder)
    return folder


def judged(tmp_path: Path, rule: str, files: dict[str, str]) -> subprocess.CompletedProcess[str]:
    """Judges a made-up module folder with one rule of the declaration detector: the rule file must exist, so a story fails until the detector is written."""
    custom = tmp_path / ".commandments" / "custom"
    (custom / "skills").mkdir(parents=True)
    shutil.copyfile(CUSTOM / f"{rule}.json", custom / f"{rule}.json")
    for skill in SKILLS:
        if (CUSTOM / "skills" / skill).is_dir():
            shutil.copytree(CUSTOM / "skills" / skill, custom / "skills" / skill)
    (custom.parent / "config.json").write_text(json.dumps({"detectors": [rule]}))
    for name, text in files.items():
        path = tmp_path / "src" / "shop" / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text)
    executable = next((str(folder / PLUGIN) for folder in (ROOT, *ROOT.parents) if (folder / PLUGIN).is_file()), None)
    if executable is None:
        pytest.skip("the code-commandments plugin is not installed")
    return subprocess.run([executable, "judge"], cwd=tmp_path, capture_output=True, text=True, timeout=60)


def refused(outcome: subprocess.CompletedProcess[str]) -> str:
    assert outcome.returncode == 1, outcome.stdout + outcome.stderr
    checklist = re.search(r"(\S+/sins\.md)", outcome.stdout)
    assert checklist, outcome.stdout
    return Path(checklist.group(1)).read_text()


def test_story_321_a_new_inline_declaration_in_a_module_is_refused_naming_the_file_and_line(journal, tmp_path):
    module = CLEAN_MODULE.replace("windows = [CartWindow]", 'windows = [WindowDeclaration("shop.cart", "Cart", "cart.js", loading=WindowLoading.COMPONENT)]')
    report = refused(judged(tmp_path, INLINE_RULE, {"shop_module.py": module, "cart_window.py": CART_WINDOW}))
    assert "shop_module.py:9" in report


def test_story_322_a_declaration_class_no_module_lists_is_found_by_the_check(journal, tmp_path):
    report = refused(judged(tmp_path, UNLISTED_RULE, {"shop_module.py": CLEAN_MODULE.replace("windows = [CartWindow]", "windows = []"), "cart_window.py": CART_WINDOW}))
    assert "cart_window.py" in report
    assert "CartWindow" in report


@pytest.mark.parametrize("entry", ['WindowDeclaration("shop.cart", "Cart", "cart.js")', '"shop.cart"', '("shop.cart", "Cart")'], ids=["call", "literal", "tuple"])
def test_story_369_a_list_entry_that_is_a_call_a_literal_or_a_tuple_is_refused_naming_the_attribute_and_file(journal, tmp_path, entry):
    module = CLEAN_MODULE.replace("windows = [CartWindow]", f"windows = [{entry}]")
    report = refused(judged(tmp_path, LIST_ENTRY_RULE, {"shop_module.py": module, "cart_window.py": CART_WINDOW}))
    assert "shop_module.py:9" in report


def test_story_370_no_file_holds_several_declaration_classes_so_a_module_imports_each_from_its_own_file(journal, tmp_path):
    two = CART_WINDOW + '''

class CheckoutWindow(WindowDeclaration):
    """The checkout."""
'''
    report = refused(judged(tmp_path, SECOND_DECLARATION_RULE, {"shop_module.py": CLEAN_MODULE, "cart_window.py": two}))
    assert "cart_window.py" in report
    assert "CheckoutWindow" in report


def test_a_module_is_copied_listed_and_synced_from_an_external_folder(journal, source_folder):
    stream = io.StringIO()
    code = LineRun(journal.home).run(["module", "add", str(source_folder)], CallerRequest({}, str(source_folder.parent), 0), stream)
    assert code == 0
    assert (journal.home.folder / 'modules' / source_folder.name / 'module.py').is_file()
    paths = json.loads(journal.home.module_list.read_text())
    assert f'{source_folder.name}.module:FolderNotesModule' in paths
    registry = Registry.read(journal.database)
    entry = next(template for template in registry.templates if template.module == "folder.notes")
    expect_row(entry.declaration, title="Folder review")


def test_an_entry_that_does_not_import_is_refused_by_module_sync(journal):
    journal.expect_sync_refusal("not_installed_module.module:MissingModule", "not_installed_module.module:MissingModule")


def test_a_folder_that_does_not_declare_a_module_leaves_no_installation(journal, source_folder):
    (source_folder / "module.py").write_text("VALUE = 1\n")
    saved_list = journal.home.module_list.read_text()
    stream = io.StringIO()
    code = LineRun(journal.home).run(["module", "add", str(source_folder)], CallerRequest({}, str(source_folder.parent), 0), stream)
    assert code == 1
    assert 'module' in stream.getvalue()
    assert journal.home.module_list.read_text() == saved_list
    assert not (journal.home.folder / 'modules' / source_folder.name).exists()


def test_a_refused_folder_can_be_fixed_and_added_again(journal, source_folder):
    module_file = source_folder / "module.py"
    original_code = module_file.read_text()
    module_file.write_text("VALUE = 1\n")
    runner = LineRun(journal.home)
    request = CallerRequest({}, str(source_folder.parent), 0)
    stream = io.StringIO()
    assert runner.run(['module', 'add', str(source_folder)], request, stream) == 1
    module_file.write_text(original_code)
    assert runner.run(['module', 'add', str(source_folder)], request, stream) == 0


def test_a_folder_cannot_replace_an_imported_python_package(journal, source_folder):
    source = source_folder.with_name("core")
    source_folder.rename(source)
    saved_list = journal.home.module_list.read_text()
    stream = io.StringIO()
    code = LineRun(journal.home).run(["module", "add", str(source)], CallerRequest({}, str(source.parent), 0), stream)
    assert code == 1
    assert 'already imported' in stream.getvalue()
    assert journal.home.module_list.read_text() == saved_list


def test_540_a_bundle_that_requires_two_suites_loads_once_both_are_installed(journal):
    journal.expect_sync_success(f"{SAMPLES}:ShopSuite")
    journal.expect_sync_success(f"{SAMPLES}:YardSuite")
    journal.expect_sync_success(f"{SAMPLES}:BundleSuite")
    registry = Registry.read(journal.database)
    bundle = registry.suite("bundle")
    assert bundle is not None and bundle.requires == ('shop', 'yard'), str([suite.name for suite in registry.top_suites()])
    assert 'bundle' in [suite.name for suite in registry.top_suites()], str([suite.name for suite in registry.top_suites()])
    assert 'shop' not in [suite.name for suite in registry.top_suites()], str([suite.name for suite in registry.top_suites()])


def test_541_a_bundle_without_a_suite_it_requires_is_refused_naming_what_is_missing(journal):
    journal.expect_sync_success(f"{SAMPLES}:ShopSuite")
    journal.expect_sync_refusal(f"{SAMPLES}:LoneBundleSuite", "suite lone-bundle requires suite yard: install the module that ships it first")


def test_two_modules_providing_one_program_are_refused_at_sync(journal):
    journal.expect_sync_success(f"{PATH}:SampleProgramModule")
    journal.expect_sync_refusal(f"{PATH}:SecondProgramModule", "two modules provide the agent program sample: sample.program and second.program")


def test_a_suite_registers_a_helper_type_through_the_module_funnel(journal):
    journal.expect_sync_success(f"{MODULES}:HelperTypeSuiteOfSuiteRegistersHelperType")
    book = journal.container.get(HelperTypeBook)
    assert book.find('suite-clerk').module == 'sample.clerk'
    assert book.is_helper('suite-clerk')
