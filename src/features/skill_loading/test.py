import features

from controllers.types import Agents, Messages
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
    import re
    described = [line for f in (tmp_path / "skills").glob("journal*/SKILL.md") for line in f.read_text().splitlines() if line.startswith("description:")]
    assert described and not [line for line in described if re.search(r"[<>]", line)], "no skill description carries angle brackets"


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
    used = {"type": "assistant", "message": {"content": [], "usage": {"input_tokens": 1000}}}
    transcript.write_text(json.dumps({"type": "user", "message": {"content": "go"}}) + "\n" + json.dumps(used) + "\n")
    report(record, "working", "PreToolUse", provider="claude", transcript=str(transcript))

    def call(tool, **given):
        text = handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": tool, "tool_input": given,
                                                                        "transcript_path": str(transcript)})
        return text["reason"] if isinstance(text, dict) and "reason" in text else ""

    assert "load journal-plans before anything else" in call("Bash", command="journal plan phase 1 build --when done"), \
        "a command whose skill is not loaded does not run"
    assert "Skill: journal-plans" in call("Read", file_path="x.py"), "and every other tool call waits too"
    assert call("Skill", skill="journal-plans") == "", "loading a skill is never refused"
    record.set_setting("skill_loading", {"most_refusals": 3})
    assert [bool(call("Read", file_path="x.py")) for _ in range(12)] == [True, *[False] * 10, True], \
        "after the limit in a row the gate steps aside for ten tool uses, then refuses again"
    record.set_setting("skill_loading", {"most_refusals": 2, "steps_aside": 2})
    assert [bool(call("Read", file_path="x.py")) for _ in range(4)] == [True, False, False, True], \
        "both the limit and how long the gate steps aside are settings"
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
    from features.skill_loading.required import require, required
    require(record, "codex-1", {"journal-obsolete": 1.0})
    handle(codex, record.root, record.env, {**hook, "hook_event_name": "SessionStart"})
    assert list(required(record, "codex-1").get("required")) == ["journal-work-tracking"], \
        "a new window owes exactly the every-start skills; one switched off is no longer owed"
    refused = handle(codex, record.root, record.env, {**hook, "hook_event_name": "PreToolUse", "tool_name": "exec", "tool_input": {"input": "ls"}})
    assert "read .agents/skills/journal-work-tracking/SKILL.md" in str(refused), "Codex is told to read the skill's SKILL.md"
    read = {"input": "sed -n '1,200p' .agents/skills/journal-work-tracking/SKILL.md"}
    assert handle(codex, record.root, record.env, {**hook, "hook_event_name": "PreToolUse", "tool_name": "exec", "tool_input": read}) in ({}, None), \
        "reading it is never refused"
    handle(codex, record.root, record.env, {**hook, "hook_event_name": "PostToolUse", "tool_name": "exec", "tool_input": read})
    from controllers.types import Agents
    assert [load["skill"] for load in Agents(record, actor="system").by_session("codex-1").data["skill_loads"]] == ["journal-work-tracking"], \
        "the load is kept on the agent, for the chat to show"


def test_a_skills_keyword_makes_the_agent_load_it():
    from features.skill_loading.catalogue import keywords, set_keywords
    from features.skill_loading.interceptors import require_named
    from features.skill_loading.required import outstanding
    record = fresh()
    report(record, "working", "PreToolUse")
    agent = Agents(record, actor="system").by_session("claude-1")
    from skills import render
    assert "keywords: dumps, dump" in render()["journal-dumps/SKILL.md"], "a shipped skill carries its own keywords"
    set_keywords(record, "journal-plans", ["roadmap"])
    assert keywords(record)["journal-plans"] == ["roadmap"], "words set on the Skills page are kept"
    require_named(record, agent, "here is the roadmap")
    assert "journal-plans" in outstanding(record, agent), "and the skill is owed before the next tool call"
    require_named(record, agent, "nothing to see")
    assert outstanding(record, agent) == ["journal-plans"], "a text without a keyword asks for nothing"


def test_the_todos_skill_is_loaded_at_every_start_and_cannot_be_switched_off():
    from features import load
    from features.skill_loading.catalogue import primary
    load()
    assert "journal-todos" in primary(), "marked primary in its own front matter, like a feature's skill"


def test_housekeeping_that_asks_nothing_of_the_agent_ships_no_skill():
    import skills
    rendered = skills.render()
    assert "journal-runtime-cleanup/SKILL.md" not in rendered and "journal-open-viewer/SKILL.md" not in rendered, "housekeeping gets no skill"
    assert "journal-work-tracking/SKILL.md" in rendered, "a feature that asks something of the agent keeps its skill"
