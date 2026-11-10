from pathlib import Path

from engine.map.folder_budget import WIDTH_LIMIT_ENTRIES, FolderBudget

SOURCE = Path(__file__).resolve().parents[4] / "src"


def ledger_folder(root: Path, files: int) -> Path:
    folder = root / "src" / "engine" / "ledger"
    folder.mkdir(parents=True)
    for number in range(files):
        (folder / f"entry_{number}.py").write_text("")
    return folder


def test_448_a_folder_with_a_thirteenth_entry_is_refused_unless_it_is_on_the_allow_list(new_story, tmp_path):
    story = new_story()
    folder = ledger_folder(tmp_path, WIDTH_LIMIT_ENTRIES + 1)
    line = "src/engine/ledger holds more than 12 entries"
    refused = FolderBudget(tmp_path / "src", []).failures()
    allowed = FolderBudget(tmp_path / "src", [line]).failures()
    story.expect_rows(refused == [line], allowed == [], len(list(folder.glob("*.py"))) == 13, detail=str(refused))


def test_449_a_class_file_deeper_than_the_budget_is_refused_with_its_path(new_story, tmp_path):
    story = new_story()
    deep = ledger_folder(tmp_path, 1) / "books" / "old"
    deep.mkdir(parents=True)
    (deep / "page.py").write_text("class Page:\n    pass\n")
    refused = FolderBudget(tmp_path / "src", []).failures()
    story.expect_rows(refused == ["src/engine/ledger/books/old/page.py sits more than 3 levels below its layer"], detail=str(refused))
    story.expect_rows(FolderBudget(SOURCE, FolderBudget.allowed_lines()).failures() == [], detail="the source breaks the budget")
