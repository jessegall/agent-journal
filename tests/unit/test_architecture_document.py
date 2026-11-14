import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DOCUMENT = ROOT / "ARCHITECTURE.md"
PATH_START = re.compile(r"(src|tests|scripts|\.commandments)(/|$)")
DETECTOR_START = re.compile(r"(architecture_|core_names|module_registration|FileReads|FileWrites|test_test_)")


def quoted_names() -> list[str]:
    lines = [line for line in DOCUMENT.read_text().splitlines() if "(planned)" not in line]
    return [name for line in lines for name in re.findall(r"`([^`]+)`", line)]


def test_every_path_the_architecture_document_names_exists_unless_its_line_is_marked_planned():
    paths = [name for name in quoted_names() if PATH_START.match(name) and "<" not in name]
    assert paths and [name for name in paths if not (ROOT / name).exists()] == []


def test_every_detector_the_architecture_document_names_is_a_detector_file():
    detectors = [name for name in quoted_names() if DETECTOR_START.match(name)]
    assert detectors and [name for name in detectors if not (ROOT / ".commandments" / "custom" / f"{name}.json").is_file()] == []


def test_the_local_instructions_point_to_the_architecture_document_and_the_shipped_ones_do_not():
    assert "ARCHITECTURE.md" in (ROOT / "CLAUDE.md").read_text()
    assert "ARCHITECTURE.md" not in (ROOT / "AGENTS.md").read_text() and "ARCHITECTURE.md" not in (ROOT / "JOURNAL.md").read_text()
