import importlib.util
import json
from pathlib import Path

import pytest

from tests.stories.suites.coding.modules.workers.support.git_repository import GitRepository

SCRIPT = Path(__file__).resolve().parents[3] / "scripts" / "move_class_file.py"
SPECIFICATION = importlib.util.spec_from_file_location("move_class_file_prefix", SCRIPT)
assert SPECIFICATION is not None and SPECIFICATION.loader is not None
script = importlib.util.module_from_spec(SPECIFICATION)
SPECIFICATION.loader.exec_module(script)

AREA = "src/core/former/sample_area"
AREA_TARGET = "src/engine/sample_area"
LOOSE_FILE = "src/core/former/sample_deadline.py"
LOOSE_TARGET = "src/engine/time/sample_deadline.py"


def write(root, relative, text=""):
    path = root / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)
    return path


def area_project(root):
    write(root, f"{AREA}/__init__.py")
    write(root, f"{AREA}/reach.py", "class Reach:\n    pass\n")
    write(root, f"{AREA}/inner/__init__.py")
    write(root, f"{AREA}/inner/rule.py", "from core.former.sample_area.reach import Reach\n")


def moved_area(root, **options):
    return script.move_path(root, root / AREA, root / AREA_TARGET, **options)


def test_a_folder_moves_in_one_pass_with_every_import_rewritten(tmp_path):
    area_project(tmp_path)
    importer = write(tmp_path, "src/core/user.py", "from core.former.sample_area.reach import Reach\nfrom core.former.sample_area.inner.rule import Reach as Other\n")
    moved_area(tmp_path)
    assert importer.read_text() == "from engine.sample_area.reach import Reach\nfrom engine.sample_area.inner.rule import Reach as Other\n"
    assert (tmp_path / AREA_TARGET / "inner/rule.py").read_text() == "from engine.sample_area.reach import Reach\n"
    assert not (tmp_path / AREA).exists()


def test_a_folder_merges_with_a_target_folder_that_exists(tmp_path):
    area_project(tmp_path)
    write(tmp_path, f"{AREA_TARGET}/__init__.py")
    neighbour = write(tmp_path, f"{AREA_TARGET}/neighbour.py", "class Neighbour:\n    pass\n")
    moved_area(tmp_path)
    assert neighbour.is_file() and (tmp_path / AREA_TARGET / "reach.py").is_file() and not (tmp_path / AREA).exists()


def test_a_file_at_the_target_path_refuses_the_folder_move(tmp_path):
    area_project(tmp_path)
    write(tmp_path, f"{AREA_TARGET}/reach.py")
    with pytest.raises(script.MoveError, match="src/engine/sample_area/reach.py exists"):
        moved_area(tmp_path)
    assert (tmp_path / AREA / "reach.py").is_file()


def test_a_package_file_with_text_at_a_target_package_file_refuses_the_move(tmp_path):
    area_project(tmp_path)
    write(tmp_path, f"{AREA}/__init__.py", "VALUE = 1\n")
    write(tmp_path, f"{AREA_TARGET}/__init__.py")
    with pytest.raises(script.MoveError, match="__init__.py exists"):
        moved_area(tmp_path)


def test_the_prefix_is_rewritten_in_strings_and_dotted_paths(tmp_path):
    area_project(tmp_path)
    importer = write(tmp_path, "src/core/user.py", 'MODULE = "core.former.sample_area.reach"\nCLASS_PATH = "core.former.sample_area.reach:Reach"\nFOLDER = "core.former.sample_area"\n')
    moved_area(tmp_path)
    assert importer.read_text() == 'MODULE = "engine.sample_area.reach"\nCLASS_PATH = "engine.sample_area.reach:Reach"\nFOLDER = "engine.sample_area"\n'


def test_a_longer_folder_name_keeps_its_prefix(tmp_path):
    area_project(tmp_path)
    importer = write(tmp_path, "src/core/user.py", "from core.former.sample_area_list.row import Row\n")
    moved_area(tmp_path)
    assert importer.read_text() == "from core.former.sample_area_list.row import Row\n"


def test_a_file_path_in_a_python_string_is_rewritten(tmp_path):
    area_project(tmp_path)
    importer = write(tmp_path, "src/core/user.py", 'FILE = "src/core/former/sample_area/reach.py"\n')
    moved_area(tmp_path)
    assert importer.read_text() == 'FILE = "src/engine/sample_area/reach.py"\n'


def test_a_config_rule_is_rewritten_for_a_folder(tmp_path):
    area_project(tmp_path)
    rule = write(tmp_path, ".commandments/config.json", '{"module": "core.former.sample_area.reach", "file": "src/core/former/sample_area/reach.py"}\n')
    moved_area(tmp_path)
    assert rule.read_text() == '{"module": "engine.sample_area.reach", "file": "src/engine/sample_area/reach.py"}\n'


def test_a_moved_file_leaves_the_allow_list_of_the_layout_rules(tmp_path):
    write(tmp_path, LOOSE_FILE, "class Deadline:\n    pass\n")
    rule = write(tmp_path, ".commandments/custom/architecture_layout_base_loose_class.json", '{"find": {"reject": [{"testCode": true}, {"file": "src/core/former/sample_deadline.py"}, {"file": "src/core/former/sample_clock.py"}]}}\n')
    script.move_path(tmp_path, tmp_path / LOOSE_FILE, tmp_path / LOOSE_TARGET)
    assert json.loads(rule.read_text())["find"]["reject"] == [{"testCode": True}, {"file": "src/core/former/sample_clock.py"}]


def test_a_folder_move_takes_its_test_folders(tmp_path):
    area_project(tmp_path)
    write(tmp_path, "tests/unit/core/former/sample_area/__init__.py")
    write(tmp_path, "tests/unit/core/former/sample_area/test_reach.py", "from core.former.sample_area.reach import Reach\n")
    write(tmp_path, "tests/stories/core/former/sample_area/__init__.py")
    write(tmp_path, "tests/stories/core/former/sample_area/reach_story.py")
    moved_area(tmp_path)
    assert (tmp_path / "tests/unit/engine/sample_area/test_reach.py").read_text() == "from engine.sample_area.reach import Reach\n"
    assert (tmp_path / "tests/unit/engine/sample_area/__init__.py").is_file() and (tmp_path / "tests/stories/engine/sample_area/reach_story.py").is_file()
    assert not (tmp_path / "tests/unit/core/former/sample_area").exists() and not (tmp_path / "tests/stories/core/former/sample_area").exists()


def test_a_loose_file_takes_its_unit_test_and_story_file(tmp_path):
    write(tmp_path, LOOSE_FILE, "class Deadline:\n    pass\n")
    write(tmp_path, "tests/unit/core/former/test_sample_deadline.py", "from core.former.sample_deadline import Deadline\n")
    write(tmp_path, "tests/stories/core/former/sample_deadline.py")
    script.move_path(tmp_path, tmp_path / LOOSE_FILE, tmp_path / LOOSE_TARGET)
    assert (tmp_path / "tests/unit/engine/time/test_sample_deadline.py").read_text() == "from engine.time.sample_deadline import Deadline\n"
    assert (tmp_path / "tests/stories/engine/time/sample_deadline.py").is_file() and (tmp_path / "tests/unit/engine/time/__init__.py").is_file()
    assert not (tmp_path / "tests/unit/core/former/test_sample_deadline.py").exists()


def test_a_test_folder_without_a_source_folder_refuses_the_move(tmp_path):
    area_project(tmp_path)
    write(tmp_path, "tests/unit/core/former/sample_area/absent/test_reach.py")
    with pytest.raises(script.MoveError, match="tests/unit/engine/sample_area/absent"):
        moved_area(tmp_path)
    assert (tmp_path / AREA / "reach.py").is_file()


def test_the_dry_run_prints_the_test_folders_and_changes_nothing(tmp_path):
    area_project(tmp_path)
    write(tmp_path, "tests/unit/core/former/sample_area/__init__.py")
    report = moved_area(tmp_path, dry_run=True)
    assert "move folder src/core/former/sample_area to src/engine/sample_area" in report
    assert "move folder tests/unit/core/former/sample_area to tests/unit/engine/sample_area" in report
    assert (tmp_path / AREA / "reach.py").is_file() and not (tmp_path / AREA_TARGET).exists()


def open_branch_repository(root):
    repository = GitRepository.sample(root / "repository")
    repository.git("config", "user.name", "Story")
    repository.git("config", "user.email", "story@example.com")
    repository.git("config", "commit.gpgsign", "false")
    write(repository.folder, "src/core/former/sample_area/__init__.py")
    write(repository.folder, "src/core/former/sample_area/reach.py", "class Reach:\n    pass\n")
    write(repository.folder, "src/core/user.py", "from core.former.sample_area.reach import Reach\n\nVALUE = 1\n")
    repository.git("add", "--all")
    repository.git("commit", "-m", "The area")
    repository.git("checkout", "-b", "work")
    write(repository.folder, "src/core/user.py", "from core.former.sample_area.reach import Reach\n\nVALUE = 2\n")
    repository.git("add", "--all")
    repository.git("commit", "-m", "The work")
    repository.git("checkout", "main")
    return repository


def test_an_open_branch_gets_its_imports_rewritten_with_its_own_lines_unchanged(tmp_path):
    repository = open_branch_repository(tmp_path)
    main_tip = repository.tip("main")
    script.move_branch(repository.folder, "work", AREA, AREA_TARGET)
    repository.expect_file("work", "src/core/user.py", "from engine.sample_area.reach import Reach\n\nVALUE = 2\n")
    repository.expect_file("work", "src/engine/sample_area/reach.py", "class Reach:\n    pass\n")
    repository.expect_branch_tip("main", main_tip)
    assert repository.git("worktree", "list").stdout.count("\n") == 1


def test_a_branch_with_a_checkout_is_refused(tmp_path):
    repository = open_branch_repository(tmp_path)
    repository.checkout("work")
    tip = repository.tip("work")
    with pytest.raises(script.MoveError, match="checked out"):
        script.move_branch(repository.folder, "work", AREA, AREA_TARGET)
    repository.expect_branch_tip("work", tip)


def test_a_branch_file_at_the_target_path_refuses_the_rewrite_with_the_branch_unchanged(tmp_path):
    repository = open_branch_repository(tmp_path)
    repository.checkout("work")
    write(repository.folder, "src/engine/sample_area/reach.py", "class Other:\n    pass\n")
    repository.git("add", "--all")
    repository.git("commit", "-m", "The clashing file")
    repository.checkout("main")
    tip = repository.tip("work")
    with pytest.raises(script.MoveError, match="src/engine/sample_area/reach.py"):
        script.move_branch(repository.folder, "work", AREA, AREA_TARGET)
    repository.expect_branch_tip("work", tip)
    assert repository.git("worktree", "list").stdout.count("\n") == 1


def test_a_file_moved_with_its_area_keeps_its_exception_of_the_enum_rule_at_its_new_path_until_it_sits_in_enums(tmp_path):
    write(tmp_path, "src/core/former/sample_area/sample_state.py", "class SampleState:\n    pass\n")
    rule = write(tmp_path, ".commandments/custom/architecture_layout_enum_outside_enums.json", '{"find": {"reject": [{"file": "src/core/former/sample_area/sample_state.py"}]}}\n')
    script.move_path(tmp_path, tmp_path / "src/core/former/sample_area", tmp_path / "src/engine/sample_area")
    assert json.loads(rule.read_text())["find"]["reject"] == [{"file": "src/engine/sample_area/sample_state.py"}]
    script.move_path(tmp_path, tmp_path / "src/engine/sample_area/sample_state.py", tmp_path / "src/engine/sample_area/enums/sample_state.py")
    assert json.loads(rule.read_text())["find"]["reject"] == []
