import ast
import inspect
from pathlib import Path

from suites.coding import coding_module
from suites.coding.windows.coding_windows import CODING_WINDOWS


def classes_in(path: str) -> list[str]:
    return [node.name for node in ast.parse(Path(path).read_text()).body if isinstance(node, ast.ClassDef)]


def test_each_coding_window_is_a_class_alone_in_its_file():
    assert all(classes_in(inspect.getfile(window)) == [window.__name__] for window in CODING_WINDOWS)


def test_each_key_of_a_coding_window_is_a_class_alone_in_its_own_file_under_keys():
    keys = {key for window in CODING_WINDOWS for key in window.keys}
    assert all(classes_in(inspect.getfile(key)) == [key.__name__] and Path(inspect.getfile(key)).parent.name == "keys" for key in keys)
    assert len(keys) == 23


def test_a_reader_of_the_coding_module_sees_one_name_per_list_and_few_imports():
    text = Path(inspect.getfile(coding_module)).read_text()
    imports = [node for node in ast.parse(text).body if isinstance(node, ast.ImportFrom)]
    assert len(text.splitlines()) < 60 and len(imports) < 30
