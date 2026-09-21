import features

from controllers.types import Messages
from engine.queries import start_block
from features.skill_loading.catalogue import SKILL, always, catalogue, handed, skills
from features.skill_loading.required import load_now
from resources.base import USER
from tests.conftest import fresh
from tests.kit import nudges, report


def test_the_catalogue_reads_skills_from_the_library_and_agent_homes_and_tracks_what_is_loaded():
    record = fresh()
    project = record.root.parent
    folder = project / ".agents" / "skills" / "journal-work-tracking"
    folder.mkdir(parents=True)
    (folder / "SKILL.md").write_text('---\nname: journal-work-tracking\ndescription: "Auto mode"\n---\n\n# Auto\n')
    obsolete = project / ".claude" / "skills" / "journal-obsolete"
    obsolete.mkdir(parents=True)
    (obsolete / "SKILL.md").write_text('---\nname: journal-obsolete\ndescription: "Old skill"\n---\n\n# Old\n')
    rows = catalogue(project)
    auto = next(row for row in rows if row[SKILL.name] == "journal-work-tracking")
    assert (auto[SKILL.description], auto[SKILL.path]) == ("Auto mode", ".agents/skills/journal-work-tracking/SKILL.md"), \
        "the catalogue reads every SKILL.md under the library and the agent homes, with its frontmatter"
    listed = skills(record)
    auto = next(row for row in listed if row[SKILL.name] == "journal-work-tracking")
    assert (auto[SKILL.loaded], auto[SKILL.stale], auto[SKILL.always]) == (0, False, False), \
        "with no agent nothing is loaded or stale; a feature's skill is not loaded at every start by default"
    assert ("Skill: journal-work-tracking" in start_block(record), "journal-obsolete" in start_block(record)) == (False, False), \
        "the start block names only the skills chosen for every start"
    record.skills = ["journal-work-tracking", "journal-obsolete"]
    assert handed(record) == "SKILLS to load now, at every start, before the first write: Skill: journal-work-tracking", \
        "stale persisted choices are filtered from the start block"
    always(record, "journal-work-tracking", False)
    assert (record.skills, handed(record)) == ([], ""), "always off takes it out, and the choice is now the setting"
    always(record, "journal-work-tracking", True)
    assert record.skills == ["journal-work-tracking"], "always on puts it back"
    from controllers.types import Agents
    from features.skill_loading.required import outstanding
    report(record, "working", "PreToolUse", skills=[])
    load_now(record, "journal-work-tracking")
    assert [m.title for m in Messages(record, actor=USER).unread("agent")] == ["Please load the journal-work-tracking skill now"], \
        "load now leaves the agent a message asking for the skill"
    assert outstanding(record, Agents(record, actor="system").primary()) == ["journal-work-tracking"], "and every tool call waits until it is loaded"


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


def test_skill_homes_that_are_one_folder_keep_real_skill_files(tmp_path):
    from skills import publish
    (tmp_path / "skills").mkdir()
    for home in (".claude", ".agents", ".codex"):
        (tmp_path / home).mkdir()
        (tmp_path / home / "skills").symlink_to("../skills")
    (tmp_path / "skills" / "journal").symlink_to("../../.agents/skills/journal")
    for _ in range(2):
        publish(tmp_path, ("claude", "codex"))
    assert ((tmp_path / "skills" / "journal").is_symlink(), (tmp_path / "skills" / "journal" / "SKILL.md").is_file()) == (False, True), \
        "a self-pointing link is replaced by the real folder, and linking onto the same folder is skipped"


def test_every_tool_call_waits_until_a_required_skill_is_loaded(tmp_path):
    import json
    from datetime import datetime, timezone
    from engine.hooks import handle
    from providers import PROVIDERS
    record = fresh()
    record.set_setting("features", {"work_tracking": False})
    (record.root.parent / ".agents" / "skills" / "journal-plans").mkdir(parents=True, exist_ok=True)
    (record.root.parent / ".agents" / "skills" / "journal-plans" / "SKILL.md").write_text("---\nname: journal-plans\n---\n")
    transcript = tmp_path / "s.jsonl"
    transcript.write_text(json.dumps({"type": "user", "message": {"content": "go"}}) + "\n")
    report(record, "working", "PreToolUse", provider="claude", transcript=str(transcript))

    def call(tool, **given):
        text = handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": tool, "tool_input": given})
        return str((text or {}).get("reason") or "")

    assert "load journal-plans before anything else" in call("Bash", command="journal plan phase 1 build --when done"), \
        "a command whose skill is not loaded does not run"
    assert "Skill: journal-plans" in call("Read", file_path="x.py"), "and every other tool call waits too"
    assert call("Skill", skill="journal-plans") == "", "loading a skill is never refused"
    record.set_setting("skill_loading", {"most_refusals": 3})
    assert [bool(call("Read", file_path="x.py")) for _ in range(3)] == [True, False, False], "after the limit in a row the call goes through, so nothing is stuck"
    now = datetime.now(timezone.utc).isoformat()
    loaded = {"type": "assistant", "timestamp": now, "message": {"content": [{"type": "tool_use", "name": "Skill", "input": {"skill": "journal-plans"}}]}}
    transcript.write_text(transcript.read_text() + json.dumps(loaded) + "\n")
    assert call("Bash", command="journal plan phase 1 build --when done") == "", "once it is loaded, work goes on"


def test_a_session_start_holds_every_tool_call_until_the_always_on_skills_are_loaded():
    from engine.hooks import handle
    from providers import PROVIDERS
    features.load()
    record = fresh()
    folder = record.root.parent / ".agents" / "skills" / "journal-work-tracking"
    folder.mkdir(parents=True)
    (folder / "SKILL.md").write_text('---\nname: journal-work-tracking\ndescription: "Auto mode"\n---\n\n# Auto\n')
    record.skills = ["journal-work-tracking"]
    codex, hook = PROVIDERS["codex"](), {"session_id": "codex-1"}
    handle(codex, record.root, record.env, {**hook, "hook_event_name": "SessionStart"})
    refused = handle(codex, record.root, record.env, {**hook, "hook_event_name": "PreToolUse", "tool_name": "exec", "tool_input": {"input": "ls"}})
    assert "read .agents/skills/journal-work-tracking/SKILL.md" in str(refused), "Codex is told to read the skill's SKILL.md"
    read = {"input": "sed -n '1,200p' .agents/skills/journal-work-tracking/SKILL.md"}
    assert handle(codex, record.root, record.env, {**hook, "hook_event_name": "PreToolUse", "tool_name": "exec", "tool_input": read}) in ({}, None), \
        "reading it is never refused"
