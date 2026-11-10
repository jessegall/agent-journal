from pathlib import Path

import pytest

from engine.file.file_access import FileAccess
from engine.map.code_map import CodeMap
from engine.map.errors.missing_summary_error import MissingSummaryError

MARKER = "class {name}Area(EngineArea):\n    summary = \"{summary}\"\n    use = AreaUse.{use}\n"
MODULE = "class {name}Module(Module):\n    \"\"\"{purpose}\"\"\"\n\n    dependencies = {needed}\n"
SMALL_TREE_MAP = """engine  The building blocks every module stands on; it imports no module.
  contract
    clock  Tells the time.
  internal
    wiring  Joins the parts.
core  The modules that come with every journal.
  notes  Adds notes. Needs: people.
  people  Adds people.
server  The server process: requests, the routes of the viewer, the handover of code and timed work.
"""


def write(root: Path, relative: str, text: str = "") -> Path:
    path = root / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)
    return path


def small_tree(root: Path) -> Path:
    write(root, "src/engine/clock/clock_area.py", MARKER.format(name="Clock", summary="Tells the time.", use="CONTRACT"))
    write(root, "src/engine/wiring/wiring_area.py", MARKER.format(name="Wiring", summary="Joins the parts.", use="INTERNAL"))
    write(root, "src/engine/errors/sample_error.py")
    write(root, "src/core/modules/notes/notes_module.py", MODULE.format(name="Notes", purpose="Adds notes.", needed='["people"]'))
    write(root, "src/core/modules/people/people_module.py", MODULE.format(name="People", purpose="Adds people.", needed="[]"))
    write(root, "src/server/server.py")
    return root / "src"


def code_map(source: Path) -> CodeMap:
    return CodeMap(source, FileAccess.shared())


def test_the_map_of_a_fixed_small_tree_is_the_same_text_on_every_run(tmp_path):
    source = small_tree(tmp_path)
    assert code_map(source).text() == SMALL_TREE_MAP and code_map(source).text() == SMALL_TREE_MAP


def test_an_engine_folder_without_its_marker_fails_with_the_folder_and_the_instruction(tmp_path):
    source = small_tree(tmp_path)
    write(tmp_path, "src/engine/ledger/ledger.py")
    with pytest.raises(MissingSummaryError) as raised:
        code_map(source).text()
    assert raised.value.folder == "src/engine/ledger" and "ledger_area.py" in raised.value.instruction


def test_a_marker_that_sets_no_summary_fails_with_its_folder(tmp_path):
    source = small_tree(tmp_path)
    write(tmp_path, "src/engine/clock/clock_area.py", "class ClockArea(EngineArea):\n    use = AreaUse.CONTRACT\n")
    with pytest.raises(MissingSummaryError, match="src/engine/clock has no summary"):
        code_map(source).text()


def test_a_marker_that_is_not_python_fails_with_its_folder(tmp_path):
    source = small_tree(tmp_path)
    write(tmp_path, "src/engine/clock/clock_area.py", "class ClockArea(:\n")
    with pytest.raises(MissingSummaryError, match="src/engine/clock"):
        code_map(source).text()


def test_a_top_folder_without_a_line_fails_with_its_name(tmp_path):
    source = small_tree(tmp_path)
    write(tmp_path, "src/attic/attic.py")
    with pytest.raises(MissingSummaryError, match="src/attic has no summary: add its line to TOP_FOLDERS"):
        code_map(source).text()


def test_a_module_whose_class_has_no_docstring_fails_with_its_folder(tmp_path):
    source = small_tree(tmp_path)
    write(tmp_path, "src/core/modules/people/people_module.py", "class PeopleModule(Module):\n    dependencies = []\n")
    with pytest.raises(MissingSummaryError, match="src/core/modules/people has no summary"):
        code_map(source).text()
