import importlib.util
import subprocess
from pathlib import Path

import pytest

SCRIPTS = Path(__file__).resolve().parents[3] / "scripts"
SOURCE = "src/core/base/sample_error.py"
TARGET = "src/engine/errors/sample_error.py"
SAMPLE_CLASS = "class SampleError(Exception):\n    pass\n"
IMPORTER = "src/core/user.py"
IMPORT_LINE = "from core.base.sample_error import SampleError\n"
MOVED_IMPORT_LINE = "from engine.errors.sample_error import SampleError\n"
GIT_CONFIG = ("-c", "user.name=Story", "-c", "user.email=story@example.com", "-c", "commit.gpgsign=false")
GIT_TIMEOUT_SECONDS = 30


def loaded_script(name):
    specification = importlib.util.spec_from_file_location(f"{name}_stories", SCRIPTS / f"{name}.py")
    assert specification is not None and specification.loader is not None
    script = importlib.util.module_from_spec(specification)
    specification.loader.exec_module(script)
    return script


move_tool = loaded_script("move_class_file")
move_check = loaded_script("move_check")


def write(root, relative, text=""):
    path = root / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)
    return path


def moved(root):
    return move_tool.move_path(root, root / SOURCE, root / TARGET)


class SampleRepository:
    """A git repository of a made-up project in a test's own folder, with main checked out."""

    def __init__(self, folder):
        self.folder = folder

    def git(self, *arguments):
        return subprocess.run(["git", *GIT_CONFIG, "-C", str(self.folder), *arguments], capture_output=True, text=True, timeout=GIT_TIMEOUT_SECONDS, check=False)


def sample_repository(root, importer_text):
    repository = SampleRepository(root / "repository")
    repository.folder.mkdir()
    repository.git("init", "--initial-branch", "main")
    write(repository.folder, SOURCE, SAMPLE_CLASS)
    write(repository.folder, IMPORTER, importer_text)
    commit(repository, "A class and its importer")
    return repository


def imported_files(folder):
    import_lines = [line for line in (folder / IMPORTER).read_text().splitlines() if line.startswith("from ")]
    return [folder / "src" / f"{line.split()[1].replace('.', '/')}.py" for line in import_lines]


def commit(repository, message):
    repository.git("add", "--all")
    repository.git("commit", "-m", message)


def test_341_a_multi_line_from_import_and_an_import_under_a_new_name_are_both_rewritten(tmp_path):
    write(tmp_path, SOURCE, SAMPLE_CLASS)
    importer = write(tmp_path, IMPORTER, "from core.base.sample_error import (\n    SampleError,\n)\nimport core.base.sample_error as sample\n\nERRORS = (SampleError, sample.SampleError)\n")
    moved(tmp_path)
    assert importer.read_text() == "from engine.errors.sample_error import (\n    SampleError,\n)\nimport engine.errors.sample_error as sample\n\nERRORS = (SampleError, sample.SampleError)\n"


def test_342_a_path_written_as_text_is_rewritten_in_a_snapshot_and_a_rule_and_one_the_tool_cannot_place_stops_the_move(tmp_path):
    write(tmp_path, SOURCE, SAMPLE_CLASS)
    registry_file = write(tmp_path, "tests/snapshots/registry.json", '{"error": "core.base.sample_error:SampleError"}\n')
    rule = write(tmp_path, ".commandments/custom/rule.json", '{"module": "core.base.sample_error", "file": "src/core/base/sample_error.py"}\n')
    moved(tmp_path)
    assert registry_file.read_text() == '{"error": "engine.errors.sample_error:SampleError"}\n'
    assert rule.read_text() == '{"module": "engine.errors.sample_error", "file": "src/engine/errors/sample_error.py"}\n'
    unplaced = write(tmp_path, ".commandments/custom/glob.json", '{"fileMatches": "engine/errors/sample_error"}\n')
    with pytest.raises(move_tool.MoveError, match=".commandments/custom/glob.json"):
        move_tool.move_path(tmp_path, tmp_path / TARGET, tmp_path / "src/engine/sample_error.py")
    assert (tmp_path / TARGET).is_file() and unplaced.read_text() == '{"fileMatches": "engine/errors/sample_error"}\n'


def test_343_a_move_onto_a_file_that_exists_and_a_move_that_leaves_an_alias_are_both_refused_and_change_nothing(tmp_path):
    write(tmp_path, SOURCE, SAMPLE_CLASS)
    importer = write(tmp_path, IMPORTER, IMPORT_LINE)
    with pytest.raises(move_tool.MoveError, match="no alias"):
        move_tool.move_path(tmp_path, tmp_path / SOURCE, tmp_path / TARGET, leave_alias=True)
    occupied = write(tmp_path, TARGET, "OCCUPIED = True\n")
    with pytest.raises(move_tool.MoveError, match="exists"):
        moved(tmp_path)
    assert (tmp_path / SOURCE).read_text() == SAMPLE_CLASS and importer.read_text() == IMPORT_LINE and occupied.read_text() == "OCCUPIED = True\n"


def test_344_a_move_is_one_commit_of_renames_and_import_lines_and_the_importer_names_a_file_that_exists(tmp_path):
    repository = sample_repository(tmp_path, IMPORT_LINE + "\nNAME = SampleError.__name__\n")
    folder = repository.folder
    files_at_start = imported_files(folder)
    starting_commit_count = int(repository.git("rev-list", "--count", "HEAD").stdout)
    moved(folder)
    commit(repository, "Move the class")
    shown = repository.git("show", "-M", "--format=", "HEAD").stdout
    assert int(repository.git("rev-list", "--count", "HEAD").stdout) == starting_commit_count + 1
    assert "rename from src/core/base/sample_error.py" in shown and move_check.non_move_lines(shown, ["sample_error"]) == []
    assert files_at_start == [folder / SOURCE] and imported_files(folder) == [folder / TARGET]
    assert all(path.is_file() for path in imported_files(folder)) and not (folder / SOURCE).exists()


def test_441_a_move_that_would_change_a_line_of_a_class_body_is_refused_and_names_the_file(tmp_path):
    body = "import core.base.sample_error\n\n\nclass SampleError(Exception):\n    parent = core.base.sample_error.OTHER\n"
    write(tmp_path, SOURCE, body)
    with pytest.raises(move_tool.MoveError, match="not an import") as refused:
        moved(tmp_path)
    assert "sample_error.py" in str(refused.value)
    assert (tmp_path / SOURCE).read_text() == body and not (tmp_path / TARGET).exists()


def test_586_an_open_branch_rewritten_by_the_tool_merges_after_the_move_without_a_conflict(tmp_path):
    repository = sample_repository(tmp_path, IMPORT_LINE + "\nVALUE = 1\n")
    repository.git("checkout", "-b", "work")
    write(repository.folder, IMPORTER, IMPORT_LINE + "\nVALUE = 2\n")
    commit(repository, "The work of a worker")
    repository.git("checkout", "main")
    move_tool.move_branch(repository.folder, "work", SOURCE, TARGET)
    moved(repository.folder)
    commit(repository, "Move the class")
    merge = repository.git("merge", "work")
    assert merge.returncode == 0, merge.stdout + merge.stderr
    assert (repository.folder / IMPORTER).read_text() == MOVED_IMPORT_LINE + "\nVALUE = 2\n"
    assert not (repository.folder / SOURCE).exists()


def test_587_a_move_wave_waits_while_a_checkout_is_in_the_middle_of_a_merge_and_names_that_checkout(tmp_path):
    repository = sample_repository(tmp_path, IMPORT_LINE + "\nVALUE = 1\n")
    repository.git("checkout", "-b", "work")
    write(repository.folder, IMPORTER, IMPORT_LINE + "\nVALUE = 2\n")
    commit(repository, "The work of a worker")
    repository.git("checkout", "main")
    write(repository.folder, IMPORTER, IMPORT_LINE + "\nVALUE = 3\n")
    commit(repository, "Other work on main")
    idle = [repository.folder]
    assert move_check.folders_merging(idle, lambda folder: folder / ".git" / "MERGE_HEAD") == []
    merge = repository.git("merge", "work")
    merging = move_check.folders_merging(idle, lambda folder: folder / ".git" / "MERGE_HEAD")
    assert merge.returncode != 0 and merging == [repository.folder]
    assert [f"a merge is under way in {folder}" for folder in merging] == [f"a merge is under way in {repository.folder}"]
