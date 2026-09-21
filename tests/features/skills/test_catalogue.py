import pytest

import features
from controllers.types import Messages
from engine.queries import start_block
from features.skills.catalogue import SKILL, always, catalogue, handed, load_now, skills
from resources.base import USER
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_the_catalogue_reads_skills_from_the_library_and_agent_homes_and_tracks_what_is_loaded():
    record = fresh()
    project = record.root.parent
    folder = project / ".agents" / "skills" / "journal-auto"
    folder.mkdir(parents=True)
    (folder / "SKILL.md").write_text('---\nname: journal-auto\ndescription: "Auto mode"\n---\n\n# Auto\n')
    obsolete = project / ".claude" / "skills" / "journal-obsolete"
    obsolete.mkdir(parents=True)
    (obsolete / "SKILL.md").write_text('---\nname: journal-obsolete\ndescription: "Old skill"\n---\n\n# Old\n')
    rows = catalogue(project)
    auto = next(row for row in rows if row[SKILL.name] == "journal-auto")
    assert (auto[SKILL.description], auto[SKILL.path]) == ("Auto mode", ".agents/skills/journal-auto/SKILL.md"), \
        "the catalogue reads every SKILL.md under the library and the agent homes, with its frontmatter"
    listed = skills(record)
    auto = next(row for row in listed if row[SKILL.name] == "journal-auto")
    assert (auto[SKILL.loaded], auto[SKILL.stale], auto[SKILL.always]) == (0, False, True), \
        "with no agent nothing is loaded or stale; a current journal skill is always by default"
    assert ("Skill: journal-auto" in start_block(record), "journal-obsolete" in start_block(record)) == (True, False), \
        "the start block names current skills in the library, not obsolete provider-only ones"
    record.skills = ["journal-auto", "journal-obsolete"]
    assert handed(record) == "SKILLS to load now, at every start, before the first write: Skill: journal-auto", \
        "stale persisted choices are filtered from the start block"
    always(record, "journal-auto", False)
    assert (record.skills, handed(record)) == ([], ""), "always off takes it out, and the choice is now the setting"
    always(record, "journal-auto", True)
    assert record.skills == ["journal-auto"], "always on puts it back"
    load_now(record, "journal-auto")
    assert [m.title for m in Messages(record, actor=USER).unread("agent")] == ["Please load the journal-auto skill now"], \
        "load now leaves the agent a message asking for the skill"
