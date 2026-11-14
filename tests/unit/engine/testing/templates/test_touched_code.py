import importlib.util
import sys

from engine.module.source_hash import SourceHash
from engine.testing.templates.touched_code import TOUCHED_FILE, TouchedCode


def load_module(file, name):
    spec = importlib.util.spec_from_file_location(name, file)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


def sample_checkout(tmp_path):
    executed = tmp_path / "src" / "ran.py"
    unchanged = tmp_path / "src" / "untouched.py"
    executed.parent.mkdir()
    executed.write_text("def run():\n    return 1\n")
    unchanged.write_text("def other():\n    return 2\n")
    return executed, unchanged, load_module(executed, "touched_ran_sample"), load_module(unchanged, "touched_untouched_sample")


def test_a_template_stays_valid_when_a_file_its_build_never_ran_changes(tmp_path):
    executed, unchanged, executed_module, _ = sample_checkout(tmp_path)
    touched = TouchedCode(tmp_path)
    with touched.recording():
        executed_module.run()
    touched.write(tmp_path, None)
    unchanged.write_text("def other():\n    return 3\n")
    SourceHash.file_hash.cache_clear()
    assert set(TouchedCode.read(tmp_path)) == {"src/ran.py"}
    assert touched.is_unchanged(tmp_path)


def test_a_template_is_rebuilt_when_a_file_its_build_ran_changes(tmp_path):
    executed, _, executed_module, _ = sample_checkout(tmp_path)
    touched = TouchedCode(tmp_path)
    with touched.recording():
        executed_module.run()
    touched.write(tmp_path, None)
    executed.write_text("def run():\n    return 4\n")
    SourceHash.file_hash.cache_clear()
    assert not touched.is_unchanged(tmp_path)


def test_a_template_keeps_the_files_its_parent_template_ran(tmp_path):
    executed, _, executed_module, _ = sample_checkout(tmp_path)
    parent = tmp_path / "parent"
    parent.mkdir()
    own = TouchedCode(tmp_path)
    with own.recording():
        executed_module.run()
    own.write(parent, None)
    child = tmp_path / "child"
    child.mkdir()
    TouchedCode(tmp_path).write(child, parent)
    assert set(TouchedCode.read(child)) == {"src/ran.py"}
    assert (child / TOUCHED_FILE).is_file()
