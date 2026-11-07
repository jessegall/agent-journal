import re
from pathlib import Path

from core.modules.library.models.enums.copy_progress import CopyProgress

ROOT = Path(__file__).resolve().parents[5]
PERSON_PAGE = ROOT / "docs" / "team-library.md"
ADMIN_PAGE = ROOT / "docs" / "team-library-admin.md"
SHARED_SOURCE = "\n".join(path.read_text() for path in sorted((ROOT / "tools" / "journal-shared").glob("*.go")) if not path.name.endswith("_test.go"))
SHARED_USAGE = re.search(r'const usage = "([^"]+)"', SHARED_SOURCE).group(1)


def code_lines(page: Path, program: str) -> list[str]:
    return [line.strip() for line in page.read_text().splitlines() if line.startswith("    ") and line.strip().startswith(program + " ")]


def test_the_person_page_names_each_status_the_journal_can_show():
    text = PERSON_PAGE.read_text()
    assert [progress.label for progress in CopyProgress if f"| {progress.label} |" not in text] == []


def test_every_server_command_of_the_admin_page_names_a_command_and_flags_the_program_has():
    lines = code_lines(ADMIN_PAGE, "journal-shared")
    assert lines
    for line in lines:
        parts = line.split()
        assert parts[1] in SHARED_USAGE, line
        for flag in (part for part in parts if part.startswith("--") and part != "--version"):
            assert f'"{flag.removeprefix("--")}"' in SHARED_SOURCE, line


def test_the_setup_steps_of_the_admin_page_are_the_steps_of_the_first_two_stories():
    text = ADMIN_PAGE.read_text()
    assert "journal-shared user add Ada --role admin --data /var/lib/journal-shared" in text
    assert "journal-shared serve --data /var/lib/journal-shared --listen 0.0.0.0:8740 --tls-cert cert.pem --tls-key key.pem" in text
    assert "journal-shared user add Grace --role edit --data /var/lib/journal-shared" in text


def test_the_connect_steps_of_the_person_page_say_what_the_journal_says():
    text = PERSON_PAGE.read_text()
    handler = (ROOT / "src" / "core" / "modules" / "library" / "commands" / "pair_library" / "pair_library_handler.py").read_text()
    for message in ("The server did not accept this token.", "The server could not be reached at"):
        assert message in text and message in handler
    assert "journal library connect library.example.com --token <token>" in text
    assert "Connected: Acme library" in text


def test_the_readme_points_to_both_pages():
    readme = (ROOT / "README.md").read_text()
    assert "docs/team-library-admin.md" in readme and "docs/team-library.md" in readme
