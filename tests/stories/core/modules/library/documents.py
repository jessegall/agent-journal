import re
from pathlib import Path

from tests.stories.core.support.coding_fixtures import BuilderWithUser

ROOT = Path(__file__).resolve().parents[5]
PAGES = (ROOT / "docs" / "team-library.md", ROOT / "docs" / "team-library-admin.md", ROOT / "src" / "core" / "modules" / "library" / "skills" / "journal-library" / "SKILL.md")
JOURNAL_GROUPS = r"journal (library|library-user|doc|sequence|check|search)\b"


def commands_of(page: Path) -> list[str]:
    indented = [line.strip() for line in page.read_text().splitlines() if line.startswith("    ") and line.strip().startswith("journal ")]
    inline = [text for text in re.findall(r"`(journal [a-z-]+ [^`]*)`", page.read_text()) if not text.startswith("journal-shared")]
    return [line for line in [*indented, *inline] if re.match(JOURNAL_GROUPS, line)]


def test_every_journal_command_the_pages_and_the_skill_write_runs_with_its_help_and_names_only_flags_the_help_lists(new_story):
    story = new_story(fixture=BuilderWithUser)
    for line in sorted({line for page in PAGES for line in commands_of(page)}):
        parts = line.replace("[", " ").replace("]", " ").replace("|", " ").split()
        help_answer = story.run(f"{parts[1]} {parts[2]} --help", story.agent)
        flags = [part.split("=")[0] for part in parts if part.startswith("--")]
        story.expect_rows(help_answer.code == 0, all(flag in help_answer.output_text for flag in flags))
