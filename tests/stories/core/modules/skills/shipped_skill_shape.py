import re
from itertools import combinations
from pathlib import Path

from engine.database.database import Database
from core.base.registry.registry import Registry
from engine.skill.skill_shape import DESCRIPTION_CHARACTER_LIMIT, IMPERATIVE_VERBS, READ_IT_PHRASES
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_absent_value

SOURCE = Path(__file__).parents[5] / "src"
HUB = SOURCE / "core/modules/skills/skills/journal/SKILL.md"
DESCRIPTION = re.compile(r"^description:\s*(.*)$", re.MULTILINE)
FRONT_MATTER = re.compile(r"\A---\n.*?\n---\n", re.DOTALL)
CODE = re.compile(r"```.*?```|`[^`\n]*`", re.DOTALL)
WORD = re.compile(r"[\w'-]+")
POINTER = re.compile(r"references/([\w.-]+\.md)")
AUDIENCES = ("main agent", "worker", "all")
SHARED_WORDS = 12
LONG_REFERENCE_LINES = 300


def shipped_skill_files() -> list[Path]:
    return sorted(path for path in SOURCE.rglob("skills/*/SKILL.md") if "node_modules" not in path.parts)


def front_matter_description(path: Path) -> str:
    return DESCRIPTION.search(path.read_text()).group(1).strip()


def description_faults(path: Path) -> list[str]:
    description, name = front_matter_description(path), path.parent.name
    faults = []
    if description.split()[0] not in IMPERATIVE_VERBS:
        faults.append(f"{name}: starts with {description.split()[0]}, not an imperative verb")
    if not any(phrase in description.rsplit(";", 1)[-1] for phrase in READ_IT_PHRASES):
        faults.append(f"{name}: does not end on a read-it half")
    if re.search(r"[.!?]\s", description) or description.endswith("."):
        faults.append(f"{name}: is not one sentence without a full stop")
    if len(description) > DESCRIPTION_CHARACTER_LIMIT:
        faults.append(f"{name}: is {len(description)} characters long")
    return faults


def hub_row_fault(folder: str, rows: list[list[str]]) -> str | None:
    named = [row for row in rows if any(re.search(rf"(?<![\w-]){re.escape(folder)}(?![\w-])", cell) for cell in row)]
    if not named:
        return f"{folder}: the hub has no row for it"
    if not any(sum(cell.strip().lower() in AUDIENCES for cell in row) == 1 for row in named):
        return f"{folder}: its hub row has no audience tag"
    return None


def word_runs(path: Path) -> set[tuple[str, ...]]:
    text = CODE.sub(" ", FRONT_MATTER.sub("", path.read_text()))
    words = WORD.findall(text.lower())
    return {tuple(words[start:start + SHARED_WORDS]) for start in range(len(words) - SHARED_WORDS + 1)}


def reference_faults(path: Path) -> list[str]:
    name, text, folder = path.parent.name, path.read_text(), path.parent / "references"
    named = set(POINTER.findall(text))
    faults = [f"{name}: points at references/{file}, which is not there" for file in sorted(named) if not (folder / file).is_file()]
    if not folder.is_dir():
        return faults
    for entry in sorted(folder.iterdir()):
        if entry.is_dir():
            faults.append(f"{name}: references/{entry.name} is a nested folder")
            continue
        if entry.name not in named:
            faults.append(f"{name}: never names references/{entry.name}")
        lines = entry.read_text().splitlines()
        if len(lines) > LONG_REFERENCE_LINES and "contents" not in "\n".join(lines[:5]).lower():
            faults.append(f"{name}: references/{entry.name} is long and opens without a table of contents")
    return faults


def test_every_shipped_description_is_one_imperative_sentence_with_a_read_it_half():
    expect_absent_value([fault for path in shipped_skill_files() for fault in description_faults(path)])


def test_the_declared_description_is_the_front_matter_description(new_story):
    story = new_story(fixture=BuilderStarted)
    declared = {skill.folder: skill.description for skill in Registry.read(story.container.get(Database)).skills}
    written = {path.parent.name: front_matter_description(path) for path in shipped_skill_files()}
    expect_absent_value(sorted(f"{folder}: declared as {declared[folder]!r}" for folder in declared.keys() & written.keys() if declared[folder] != written[folder]))


def test_the_hub_names_every_shipped_skill():
    rows = [line.strip("|").split("|") for line in HUB.read_text().splitlines() if line.startswith("|")]
    faults = [hub_row_fault(path.parent.name, rows) for path in shipped_skill_files()]
    expect_absent_value([fault for fault in faults if fault is not None])


def test_no_two_shipped_skills_share_twelve_words():
    runs = {path.parent.name: word_runs(path) for path in shipped_skill_files()}
    shared = ((first, second, runs[first] & runs[second]) for first, second in combinations(sorted(runs), 2))
    expect_absent_value([f"{first} and {second}: {' '.join(min(common))}" for first, second, common in shared if common])


def test_every_pointer_names_a_file_that_exists_and_every_reference_is_named():
    expect_absent_value([fault for path in shipped_skill_files() for fault in reference_faults(path)])
