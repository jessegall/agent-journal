import json
import re
import shutil
import subprocess
from pathlib import Path

import pytest

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


def test_story_321_a_new_inline_declaration_in_a_module_is_refused_naming_the_file_and_line(tmp_path):
    module = CLEAN_MODULE.replace("windows = [CartWindow]", 'windows = [WindowDeclaration("shop.cart", "Cart", "cart.js", loading=WindowLoading.COMPONENT)]')
    report = refused(judged(tmp_path, INLINE_RULE, {"shop_module.py": module, "cart_window.py": CART_WINDOW}))
    assert "shop_module.py:9" in report


def test_story_322_a_declaration_class_no_module_lists_is_found_by_the_check(tmp_path):
    report = refused(judged(tmp_path, UNLISTED_RULE, {"shop_module.py": CLEAN_MODULE.replace("windows = [CartWindow]", "windows = []"), "cart_window.py": CART_WINDOW}))
    assert "cart_window.py" in report
    assert "CartWindow" in report


@pytest.mark.parametrize("entry", ['WindowDeclaration("shop.cart", "Cart", "cart.js")', '"shop.cart"', '("shop.cart", "Cart")'], ids=["call", "literal", "tuple"])
def test_story_369_a_list_entry_that_is_a_call_a_literal_or_a_tuple_is_refused_naming_the_attribute_and_file(tmp_path, entry):
    module = CLEAN_MODULE.replace("windows = [CartWindow]", f"windows = [{entry}]")
    report = refused(judged(tmp_path, LIST_ENTRY_RULE, {"shop_module.py": module, "cart_window.py": CART_WINDOW}))
    assert "shop_module.py:9" in report


def test_story_370_no_file_holds_several_declaration_classes_so_a_module_imports_each_from_its_own_file(tmp_path):
    two = CART_WINDOW + '''

class CheckoutWindow(WindowDeclaration):
    """The checkout."""
'''
    report = refused(judged(tmp_path, SECOND_DECLARATION_RULE, {"shop_module.py": CLEAN_MODULE, "cart_window.py": two}))
    assert "cart_window.py" in report
    assert "CheckoutWindow" in report
