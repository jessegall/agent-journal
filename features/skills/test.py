
from controllers.types import Messages
from engine.queries import start_block
from features.skills.catalogue import SKILL, always, catalogue, handed, load_now, skills
from resources.base import USER
from tests.conftest import fresh
from tests.kit import nudges, report


def test_the_catalogue_reads_skills_from_the_library_and_agent_homes_and_tracks_what_is_loaded():
    record = fresh()
    project = record.root.parent
    folder = project / ".agents" / "skills" / "journal-work"
    folder.mkdir(parents=True)
    (folder / "SKILL.md").write_text('---\nname: journal-work\ndescription: "Auto mode"\n---\n\n# Auto\n')
    obsolete = project / ".claude" / "skills" / "journal-obsolete"
    obsolete.mkdir(parents=True)
    (obsolete / "SKILL.md").write_text('---\nname: journal-obsolete\ndescription: "Old skill"\n---\n\n# Old\n')
    rows = catalogue(project)
    auto = next(row for row in rows if row[SKILL.name] == "journal-work")
    assert (auto[SKILL.description], auto[SKILL.path]) == ("Auto mode", ".agents/skills/journal-work/SKILL.md"), \
        "the catalogue reads every SKILL.md under the library and the agent homes, with its frontmatter"
    listed = skills(record)
    auto = next(row for row in listed if row[SKILL.name] == "journal-work")
    assert (auto[SKILL.loaded], auto[SKILL.stale], auto[SKILL.always]) == (0, False, True), \
        "with no agent nothing is loaded or stale; a current journal skill is always by default"
    assert ("Skill: journal-work" in start_block(record), "journal-obsolete" in start_block(record)) == (True, False), \
        "the start block names current skills in the library, not obsolete provider-only ones"
    record.skills = ["journal-work", "journal-obsolete"]
    assert handed(record) == "SKILLS to load now, at every start, before the first write: Skill: journal-work", \
        "stale persisted choices are filtered from the start block"
    always(record, "journal-work", False)
    assert (record.skills, handed(record)) == ([], ""), "always off takes it out, and the choice is now the setting"
    always(record, "journal-work", True)
    assert record.skills == ["journal-work"], "always on puts it back"
    load_now(record, "journal-work")
    assert [m.title for m in Messages(record, actor=USER).unread("agent")] == ["Please load the journal-work skill now"], \
        "load now leaves the agent a message asking for the skill"


def test_no_journal_skill_loaded_in_a_window_is_told_once_privately_per_window():
    record = fresh()
    for i in range(26):
        report(record, "working", "PreToolUse", skills=[])
    assert [n for n in nudges(record) if "journal skill" in n] == ["no journal skill is loaded in this window"], \
        "twenty-five tool uses with no journal skill in the window: told once, privately"
    for i in range(26):
        report(record, "working", "PreToolUse", skills=[])
    assert len([n for n in nudges(record) if "journal skill" in n]) == 1, "the unloaded window is not nurtured again"

    report(record, "compacting", "PreCompact", skills=[])
    for i in range(25):
        report(record, "working", "PreToolUse", skills=[])
    assert len([n for n in nudges(record) if "journal skill" in n]) == 2, "a compaction opens one fresh window"

    for i in range(25):
        report(record, "working", "PreToolUse", skills=["journal"])
    for i in range(25):
        report(record, "working", "PreToolUse", skills=[])
    assert len([n for n in nudges(record) if "journal skill" in n]) == 2, "loading later does not re-arm the same window"

    report(record, "idle", "SessionStart", skills=[])
    for i in range(25):
        report(record, "working", "PreToolUse", skills=[])
    assert len([n for n in nudges(record) if "journal skill" in n]) == 3, "a new session window permits one reminder"

    loaded = fresh()
    for i in range(30):
        report(loaded, "working", "PreToolUse", skills=["journal", "journal-todos"])
    assert nudges(loaded) == [], "with the skill loaded nothing is said"
    for i in range(30):
        report(loaded, "working", "PreToolUse", skills=[])
    assert nudges(loaded) == [], "an existing fired window upgrades without a fresh nudge"
