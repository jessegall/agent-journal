from pathlib import Path

from engine.map.folder_budget import WIDTH_LIMIT, FolderBudget

SOURCE = Path(__file__).resolve().parents[4] / "src"
WIDE_LINE = "src/engine/clock holds more than 12 entries"
DEEP_LINE = "src/engine/clock/parts/small/spring.py sits more than 3 levels below its layer"


def tree(root: Path, files_in_clock: int) -> Path:
    folder = root / "src" / "engine" / "clock"
    folder.mkdir(parents=True)
    for number in range(files_in_clock):
        (folder / f"part_{number}.py").write_text("")
    return root / "src"


def test_a_folder_at_the_limit_passes_and_one_entry_more_fails(tmp_path):
    source = tree(tmp_path, WIDTH_LIMIT)
    assert FolderBudget(source, []).failures() == []
    (source / "engine" / "clock" / "part_extra.py").write_text("")
    assert FolderBudget(source, []).failures() == [WIDE_LINE]


def test_a_list_of_equals_may_hold_any_number_of_entries(tmp_path):
    source = tree(tmp_path, 1)
    (source / "engine" / "clock" / "errors").mkdir()
    for number in range(WIDTH_LIMIT + 5):
        (source / "engine" / "clock" / "errors" / f"clock_{number}_error.py").write_text("")
    assert FolderBudget(source, []).failures() == []


def test_a_file_deeper_than_the_limit_fails_with_its_path(tmp_path):
    source = tree(tmp_path, 1)
    (source / "engine" / "clock" / "parts" / "small").mkdir(parents=True)
    (source / "engine" / "clock" / "parts" / "wheel.py").write_text("")
    (source / "engine" / "clock" / "parts" / "small" / "spring.py").write_text("")
    assert FolderBudget(source, []).failures() == [DEEP_LINE]


def test_a_line_on_the_allow_list_passes_and_fails_once_it_holds_no_more(tmp_path):
    source = tree(tmp_path, WIDTH_LIMIT + 1)
    assert FolderBudget(source, [WIDE_LINE]).failures() == []
    (source / "engine" / "clock" / "part_0.py").unlink()
    assert FolderBudget(source, [WIDE_LINE]).failures() == [f"{WIDE_LINE}: is on the allow-list but no longer happens"]


def test_the_source_keeps_the_budget_with_the_allow_list_of_today():
    assert FolderBudget(SOURCE, FolderBudget.allowed_lines()).failures() == []
