from pathlib import Path

from engine.map.folder_budget import WIDTH_LIMIT_ENTRIES, FolderBudget

SOURCE = Path(__file__).resolve().parents[4] / "src"


def sample_area(root: Path, files: int) -> Path:
    folder = root / "src" / "engine" / "ledger"
    folder.mkdir(parents=True)
    for number in range(files):
        (folder / f"entry_{number}.py").write_text("")
    return folder


def test_448_a_folder_with_a_thirteenth_entry_is_refused_unless_it_is_on_the_allow_list(tmp_path):
    folder = sample_area(tmp_path, WIDTH_LIMIT_ENTRIES + 1)
    line = "src/engine/ledger holds more than 12 entries"
    refused = FolderBudget(tmp_path / "src", []).failures()
    allowed = FolderBudget(tmp_path / "src", [line]).failures()
    assert refused == [line], str(refused)
    assert allowed == [], str(refused)
    assert len(list(folder.glob('*.py'))) == 13, str(refused)


def test_449_a_class_file_deeper_than_the_budget_is_refused_with_its_path(tmp_path):
    deep = sample_area(tmp_path, 1) / "books" / "old"
    deep.mkdir(parents=True)
    (deep / "page.py").write_text("class Page:\n    pass\n")
    refused = FolderBudget(tmp_path / "src", []).failures()
    assert refused == ['src/engine/ledger/books/old/page.py sits more than 3 levels below its layer'], str(refused)
    assert FolderBudget(SOURCE, FolderBudget.allowed_lines()).failures() == [], 'the source breaks the budget'
