import json
import re
from pathlib import Path

from engine.process.door.outside_starts import OUTSIDE_STARTS

SOURCE = Path(__file__).resolve().parents[5] / "src"
DOOR_LISTS = SOURCE.parent / ".commandments" / "custom" / "lists.json"
# Every way Python starts a program: the subprocess calls, the os calls that replace or fork the process, the
# asyncio ones, and a subprocess name imported bare, whose call then reads as a plain name.
START = re.compile(r"\bsubprocess\.(run|Popen|call|check_call|check_output|getoutput|getstatusoutput)\("
                   r"|\bos\.(system|popen|exec\w*|spawn\w*|posix_spawn\w*|fork\w*)\("
                   r"|\basyncio\.create_subprocess_\w+\("
                   r"|^\s*from subprocess import ", re.MULTILINE)


def test_every_listed_start_exists_and_says_why():
    assert [start.path for start in OUTSIDE_STARTS if not (SOURCE.parent / start.path).is_file() or not start.reason.strip()] == []


def test_every_file_that_starts_a_program_goes_through_the_door_or_is_listed_with_its_reason():
    listed = {start.path for start in OUTSIDE_STARTS}
    starting = {str(path.relative_to(SOURCE.parent)) for path in SOURCE.rglob("*.py") if START.search(path.read_text(errors="replace"))}
    assert sorted(starting - listed) == []


def test_the_door_detector_leaves_out_exactly_the_listed_starts():
    listed = json.loads(DOOR_LISTS.read_text())["outside_starts"]
    assert listed == [start.path.removeprefix("src/") for start in OUTSIDE_STARTS]
