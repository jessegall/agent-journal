import importlib.util
from pathlib import Path

import pytest

SCRIPT = Path(__file__).resolve().parents[3] / "scripts" / "move_class_file.py"
SPECIFICATION = importlib.util.spec_from_file_location("move_class_file", SCRIPT)
assert SPECIFICATION is not None and SPECIFICATION.loader is not None
script = importlib.util.module_from_spec(SPECIFICATION)
SPECIFICATION.loader.exec_module(script)

SOURCE = "src/core/base/sample_error.py"
TARGET = "src/engine/errors/sample_error.py"


def write(root, relative, text=""):
    path = root / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)
    return path


def project(root, importer_text):
    write(root, SOURCE, "class SampleError(Exception):\n    pass\n")
    return write(root, "src/core/user.py", importer_text)


def moved(root):
    return script.move_file(root, root / SOURCE, root / TARGET)


def test_a_from_import_is_rewritten_and_the_file_moves(tmp_path):
    importer = project(tmp_path, "from core.base.sample_error import SampleError\n")
    moved(tmp_path)
    assert importer.read_text() == "from engine.errors.sample_error import SampleError\n"
    assert (tmp_path / TARGET).is_file() and not (tmp_path / SOURCE).exists()


def test_a_multi_line_from_import_is_rewritten(tmp_path):
    importer = project(tmp_path, "from core.base.sample_error import (\n    SampleError,\n    OTHER_VALUE,\n)\n")
    moved(tmp_path)
    assert importer.read_text() == "from engine.errors.sample_error import (\n    SampleError,\n    OTHER_VALUE,\n)\n"


def test_an_import_with_a_new_name_is_rewritten(tmp_path):
    importer = project(tmp_path, "import core.base.sample_error as errors\n\nerrors.SampleError\n")
    moved(tmp_path)
    assert importer.read_text() == "import engine.errors.sample_error as errors\n\nerrors.SampleError\n"


def test_a_plain_import_rewrites_where_the_full_path_is_used(tmp_path):
    importer = project(tmp_path, "import core.base.sample_error\n\nraise core.base.sample_error.SampleError()\n")
    moved(tmp_path)
    assert importer.read_text() == "import engine.errors.sample_error\n\nraise engine.errors.sample_error.SampleError()\n"


def test_a_name_in_a_docstring_or_in_all_is_not_touched(tmp_path):
    text = '"""See core.base.sample_error."""\n__all__ = ["core.base.sample_error"]\n'
    importer = project(tmp_path, text)
    moved(tmp_path)
    assert importer.read_text() == text


def test_a_longer_module_name_is_not_rewritten(tmp_path):
    importer = project(tmp_path, "from core.base.sample_error_list import Row\n")
    moved(tmp_path)
    assert importer.read_text() == "from core.base.sample_error_list import Row\n"


def test_a_name_inside_a_longer_string_stops_the_move_and_is_named(tmp_path):
    text = 'PATH = "see core.base.sample_error for more"\n'
    importer = project(tmp_path, text)
    with pytest.raises(script.MoveRefused, match="src/core/user.py:1"):
        moved(tmp_path)
    assert (tmp_path / SOURCE).is_file() and importer.read_text() == text


def test_a_relative_import_stops_the_move(tmp_path):
    project(tmp_path, "")
    write(tmp_path, "src/core/base/neighbour.py", "from .sample_error import SampleError\n")
    with pytest.raises(script.MoveRefused, match="relative import"):
        moved(tmp_path)


def test_a_target_that_exists_is_refused(tmp_path):
    project(tmp_path, "")
    write(tmp_path, TARGET)
    with pytest.raises(script.MoveRefused, match="exists"):
        moved(tmp_path)


def test_leaving_an_alias_is_refused(tmp_path):
    project(tmp_path, "")
    with pytest.raises(script.MoveRefused, match="no alias"):
        script.move_file(tmp_path, tmp_path / SOURCE, tmp_path / TARGET, leave_alias=True)


def test_a_change_to_a_line_of_the_moved_file_that_is_no_import_is_refused(tmp_path):
    write(tmp_path, SOURCE, "import core.base.sample_error\n\nclass SampleError(Exception):\n    parent = core.base.sample_error.OTHER\n")
    with pytest.raises(script.MoveRefused, match="not an import"):
        moved(tmp_path)


def test_two_files_of_one_name_in_two_folders_do_not_collide(tmp_path):
    importer = project(tmp_path, "from core.base.sample_error import A\nfrom core.modules.tasks.sample_error import B\n")
    write(tmp_path, "src/core/modules/tasks/sample_error.py")
    moved(tmp_path)
    assert importer.read_text() == "from engine.errors.sample_error import A\nfrom core.modules.tasks.sample_error import B\n"
    assert (tmp_path / "src/core/modules/tasks/sample_error.py").is_file()


def test_missing_packages_are_created_below_the_source_root(tmp_path):
    project(tmp_path, "")
    moved(tmp_path)
    assert (tmp_path / "src/engine/__init__.py").is_file() and (tmp_path / "src/engine/errors/__init__.py").is_file()
    assert not (tmp_path / "src/__init__.py").exists()


def test_a_dry_run_names_the_files_and_changes_nothing(tmp_path):
    importer = project(tmp_path, "from core.base.sample_error import SampleError\n")
    report = script.move_file(tmp_path, tmp_path / SOURCE, tmp_path / TARGET, dry_run=True)
    assert report == ["change src/core/user.py", "1 Python files and 0 other files change"]
    assert importer.read_text() == "from core.base.sample_error import SampleError\n" and (tmp_path / SOURCE).is_file()
