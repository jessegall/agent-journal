import re
from pathlib import Path

from engine.process.outside_starts import OUTSIDE_STARTS

SOURCE = Path(__file__).resolve().parents[4] / "src"
START = re.compile(r"subprocess\.(run|Popen|check_output|call)\(")


def test_every_listed_start_exists_and_says_why():
    assert [start.path for start in OUTSIDE_STARTS if not (SOURCE.parent / start.path).is_file() or not start.reason.strip()] == []


def test_every_file_that_starts_a_program_goes_through_the_door_or_is_listed_with_its_reason():
    listed = {start.path for start in OUTSIDE_STARTS}
    starting = {str(path.relative_to(SOURCE.parent)) for path in SOURCE.rglob("*.py") if START.search(path.read_text(errors="replace"))}
    assert sorted(starting - listed) == []
