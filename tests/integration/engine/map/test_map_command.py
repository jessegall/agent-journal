from pathlib import Path

from engine.file.file_access import FileAccess
from engine.map.code_map import TOP_FOLDERS, CodeMap
from engine.map.errors.missing_summary_error import MissingSummaryError
from tests.stories.support.story_checks import expect_value
import pytest

ROOT = Path(__file__).resolve().parents[4]
SOURCE = ROOT / "src"
PINNED_MAP = ROOT / "tests" / "snapshots" / "map.txt"
PIN_HINT = "the pinned map differs from the code: run journal map --write and commit tests/snapshots/map.txt"
MARKER = "class {name}Area(EngineArea):\n    summary = \"{summary}\"\n    use = AreaUse.CONTRACT\n"


def map_lines() -> list[str]:
    return CodeMap(SOURCE, FileAccess()).lines()


def top_folder_lines(top: str) -> list[str]:
    lines = map_lines()
    start = next(index for index, line in enumerate(lines) if line.startswith(f"{top}  "))
    following = lines[start + 1:]
    end = next((index for index, line in enumerate(following) if not line.startswith(" ")), len(following))
    return following[:end]


def small_tree(root: Path) -> Path:
    marker = root / "src" / "engine" / "clock" / "clock_area.py"
    marker.parent.mkdir(parents=True)
    marker.write_text(MARKER.format(name="Clock", summary="Tells the time."))
    return root / "src"


def test_444_the_engine_areas_show_contract_areas_first_and_internal_ones_after_with_one_line_for_every_area():
    lines = top_folder_lines("engine")
    areas = sorted(folder.name for folder in (SOURCE / "engine").iterdir() if folder.is_dir() and folder.name not in ("__pycache__", "errors", "enums") and not CodeMap.has_cache_files_alone(folder))
    shown = [line.split("  ")[2] for line in lines if line.startswith("    ")]
    assert lines.index('  contract') < lines.index('  internal'), str(sorted(set(areas) ^ set(shown)))
    assert sorted(shown) == areas, str(sorted(set(areas) ^ set(shown)))
    assert all((len(line.strip().split('  ', 1)) == 2 for line in lines if line.startswith('    '))), 'an area line has no summary'


def test_445_every_core_module_shows_its_purpose_and_the_modules_it_states():
    lines = top_folder_lines("core")
    modules = sorted(folder.name for folder in (SOURCE / "core" / "modules").iterdir() if folder.is_dir() and folder.name != "__pycache__")
    tasks_line = next(line for line in lines if line.startswith("  tasks  "))
    assert [line.split('  ')[1] for line in lines] == modules, tasks_line
    assert 'Needs: ' in tasks_line, tasks_line
    assert 'Adds tasks' in tasks_line, tasks_line


def test_446_a_folder_with_no_summary_is_refused_with_the_folder_and_the_instruction(tmp_path):
    source = small_tree(tmp_path)
    (source / "engine" / "ledger").mkdir()
    with pytest.raises(MissingSummaryError) as raised:
        CodeMap(source, FileAccess()).text()
    assert raised.value.folder == 'src/engine/ledger', str(raised.value)
    assert 'write src/engine/ledger/ledger_area.py' in raised.value.instruction, str(raised.value)


def test_447_a_new_folder_shows_as_a_new_line_and_the_pinned_map_is_the_map_of_the_code(tmp_path):
    source = small_tree(tmp_path)
    first = CodeMap(source, FileAccess()).lines()
    marker = source / "engine" / "ledger" / "ledger_area.py"
    marker.parent.mkdir()
    marker.write_text(MARKER.format(name="Ledger", summary="Counts what was spent."))
    second = CodeMap(source, FileAccess()).lines()
    assert sorted(set(second) - set(first)) == ['    ledger  Counts what was spent.'], str(second)
    assert '\n'.join(map_lines()) + '\n' == PINNED_MAP.read_text(), PIN_HINT


def test_450_the_core_modules_are_one_line_for_every_module_and_no_tree_of_their_folders():
    lines = top_folder_lines("core")
    assert all((line.startswith('  ') and (not line.startswith('   ')) for line in lines)), 'a line below a module'
    assert not any(('commands' == line.strip().split('  ')[0] for line in lines)), 'a folder of a module is shown'


def test_451_a_marker_that_cannot_be_read_fails_with_the_folder_and_writes_no_half_map(tmp_path):
    source = small_tree(tmp_path)
    broken = source / "engine" / "ledger" / "ledger_area.py"
    broken.parent.mkdir()
    broken.write_text("class LedgerArea(:\n")
    pinned = tmp_path / "map.txt"
    with pytest.raises(MissingSummaryError) as raised:
        pinned.write_text(CodeMap(source, FileAccess()).text())
    assert raised.value.folder == 'src/engine/ledger', str(raised.value)
    assert not pinned.exists(), str(raised.value)


def test_452_a_pinned_map_edited_by_hand_differs_from_the_map_of_the_code():
    generated = "\n".join(map_lines()) + "\n"
    edited = PINNED_MAP.read_text().replace("engine  ", "engine  By hand: ", 1)
    assert edited != generated, PIN_HINT
    assert PINNED_MAP.read_text() == generated, PIN_HINT


def test_a_folder_left_with_only_its_cache_after_a_move_is_no_line_of_the_map(tmp_path):
    source = small_tree(tmp_path)
    (source / "engine" / "ledger" / "__pycache__").mkdir(parents=True)
    expect_value(CodeMap(source, FileAccess()).lines(), ["engine  " + TOP_FOLDERS["engine"], "  contract", "    clock  Tells the time."])
