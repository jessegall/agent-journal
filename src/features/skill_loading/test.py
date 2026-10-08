import subprocess
import pytest
import features

from controllers.types import Agents, Messages
from features.session_briefing.start import start_block
from features.skill_loading.catalogue import SKILL, always, catalogue, chosen, handed, skills
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
    from features.skill_loading import catalogue as held
    held.CATALOGUED[str(project)] = held.replace(held.CATALOGUED[str(project)], at=0.0)
    assert catalogue(project) is held.CATALOGUED[str(project)].skills and held.CATALOGUED[str(project)].at > 0, \
        "a catalogue that is old but whose folders did not change is kept and counted fresh again"
    (obsolete / "SKILL.md").unlink()
    held.CATALOGUED[str(project)] = held.replace(held.CATALOGUED[str(project)], files=[*held.CATALOGUED[str(project)].files], at=0.0, marks=())
    assert "journal-obsolete" not in [row[SKILL.name] for row in catalogue(project)], "a skill whose file vanished while the folders were read is left out"
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
    plugins = project / ".agents" / "skills" / "commandments-python-flow"
    plugins.mkdir(parents=True)
    (plugins / "SKILL.md").write_text('---\nname: commandments-python-flow\ndescription: "Flow"\n---\n\n# Flow\n')
    always(record, "commandments-python-flow", True)
    assert "commandments-python-flow" in chosen(record), "a skill a plugin ships can be loaded at every start too, not only the journal's own"
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
    from providers.skill_homes import RETIRED
    old_copy = tmp_path / "retired" / RETIRED[0] / "journal-todos"
    old_copy.mkdir(parents=True)
    publish(tmp_path / "retired", ("claude", "codex"))
    assert not old_copy.exists(), "a journal skill copied into a home the provider no longer reads is taken away"
    project = tmp_path / "project"
    (project / ".claude" / "skills" / "journal").mkdir(parents=True)
    (project / ".claude" / "skills" / "journal" / "SKILL.md").write_text("committed\n")
    for command in (["init", "-q"], ["add", "."], ["-c", "user.email=a@b", "-c", "user.name=a", "commit", "-qm", "skills"]):
        subprocess.run(["git", *command], cwd=project, check=True, timeout=30)
    for leftover in ("journal-memory", "journal-retired"):
        (project / ".claude" / "skills" / leftover).mkdir()
        (project / ".claude" / "skills" / leftover / "SKILL.md").write_text("an old copy\n")
    publish(project, ("claude",))
    assert ((project / ".claude" / "skills" / "journal-memory").is_symlink(), (project / ".claude" / "skills" / "journal-retired").exists()) == (True, False), \
        "a folder where a skill is linked is replaced by the link, and a journal skill that no longer exists is taken away"
    kept = project / ".claude" / "skills" / "journal"
    assert (kept.is_symlink(), "committed" in (kept / "SKILL.md").read_text(), (project / ".claude" / "skills" / "journal-todos").is_symlink()) == \
        (False, False, True), "a skill folder git tracks keeps real files, brought up to date; an untracked one is linked"
    import re
    described = [line for f in (tmp_path / "skills").glob("journal*/SKILL.md") for line in f.read_text().splitlines() if line.startswith("description:")]
    assert described and not [line for line in described if re.search(r"[<>]", line)], "no skill description carries angle brackets"


def test_every_tool_call_waits_until_a_required_skill_is_loaded(tmp_path):
    import json
    from datetime import datetime, timezone
    from tests.kit import appended, handle
    from providers import PROVIDERS
    record = fresh()
    record.set_setting("features", {"work_tracking": False})
    (record.root.parent / ".agents" / "skills" / "journal-plans").mkdir(parents=True, exist_ok=True)
    (record.root.parent / ".agents" / "skills" / "journal-plans" / "SKILL.md").write_text("---\nname: journal-plans\n---\n")
    transcript = tmp_path / "s.jsonl"
    used = {"type": "assistant", "message": {"content": [], "usage": {"input_tokens": 1000}}}
    transcript.write_text("")
    appended(transcript, {"type": "user", "message": {"content": "go"}}, used)
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
    appended(transcript, loaded)
    assert call("Bash", command="journal plan phase 1 build --when done") == "", "once it is loaded, work goes on"
    from features.skill_loading.required import require
    from providers.transcript_cache import CACHE
    require(record, transcript.stem, {"journal-plans": datetime.now(timezone.utc).timestamp()})
    assert "Skill: journal-plans" in call("Read", file_path="x.py"), "a skill required again after its last load is asked for again"
    again = {**loaded, "timestamp": datetime.now(timezone.utc).isoformat()}
    with CACHE.lock(CACHE.fold_key(transcript, PROVIDERS["claude"]().skill_loads, dict)):
        appended(transcript, again)
        assert call("Read", file_path="x.py") == "", \
            "while a load sits in lines the fold has not read yet, the guard lets the call through rather than refuse on what it has not read"
    assert call("Read", file_path="x.py") == "", "and once those lines are folded the load counts"
    import time
    from providers import transcript_cache
    from providers.transcript_cache import TranscriptCache, code_mark
    folds, lines = TranscriptCache(tmp_path / "folds"), tmp_path / "lines.jsonl"

    def counted(state: int, row: dict) -> int:
        return state + 1
    lines.write_text('{"a": 1}\n')
    assert folds.folded(lines, counted, int, dict) == 1, "a transcript is folded line by line"
    lines.write_text('{"a": 1}\n{"a": 2}\n')
    with folds.lock((str(lines), "counted", code_mark())):
        began = time.monotonic()
        assert (folds.folded(lines, counted, int, dict), time.monotonic() - began < 1) == (1, True), \
            "a fold another thread is busy with is not waited on: the last finished state comes back at once"
    assert folds.folded(lines, counted, int, dict) == 2, "and the next call folds what was added"
    from providers import jsonl
    kept = transcript_cache.FOLD_IN_PLACE_BYTES, jsonl.FRESH_BYTES
    transcript_cache.FOLD_IN_PLACE_BYTES = 0
    try:
        lines.write_text('{"a": 1}\n{"a": 2}\n{"a": 3}\n')
        assert folds.folded(lines, counted, int, dict) == 2, "a long stretch to catch up on is folded behind, never while the caller waits"
        waited = time.monotonic() + 2
        while folds.folds[(str(lines), "counted", code_mark())][1] != 3 and time.monotonic() < waited:
            time.sleep(0.01)
        assert folds.folds[(str(lines), "counted", code_mark())][1] == 3, "and is there for the next call once done"
        transcript_cache.FOLD_IN_PLACE_BYTES, jsonl.FRESH_BYTES = 1_000_000, 20
        tail = tmp_path / "tail.jsonl"
        tail.write_text("".join(f'{{"a": {n}}}\n' for n in range(10)))
        assert folds.folded(tail, counted, int, dict) == 2, "a transcript folded for the first time is read from its tail, never from its first byte"
    finally:
        transcript_cache.FOLD_IN_PLACE_BYTES, jsonl.FRESH_BYTES = kept


def test_a_session_start_holds_every_tool_call_until_the_always_on_skills_are_loaded():
    from tests.kit import handle
    from providers import PROVIDERS
    features.load()
    record = fresh()
    folder = record.root.parent / ".agents" / "skills" / "journal-work-tracking"
    folder.mkdir(parents=True)
    (folder / "SKILL.md").write_text('---\nname: journal-work-tracking\ndescription: "Auto mode"\n---\n\n# Auto\n')
    from commands.http import dispatch
    switched = dispatch("POST", f"/api/{record.env}/skills/journal-work-tracking/always", record.root, {}, {"on": True})
    assert (switched.code, switched.body["skills"]) == (200, ["journal-work-tracking"]), "the Skills page switches a skill to load at every start"
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
    from providers.codex_rows import Row
    looped = Row.from_payload({"timestamp": "2026-10-01T10:00:00Z", "type": "response_item", "payload": {"type": "custom_tool_call", "call_id": "c9", "name": "exec",
                               "input": 'const r=await tools.exec_command({cmd:"for s in journal journal-todos notes; do cat .agents/skills/$s/SKILL.md; done"});'}})
    assert [use.skill for use in codex.tool_uses(looped) if use.name == "Skill"] == ["journal", "journal-todos"], \
        "skills read in a loop over their names are each a load, and only the journal's own"
    later = ("journal-plans", "journal-docs", "journal-facts", "journal-rules", "journal-tickets")
    for name in (*later, "journal-early"):
        (record.root.parent / ".agents" / "skills" / name).mkdir(parents=True)
        (record.root.parent / ".agents" / "skills" / name / "SKILL.md").write_text(f'---\nname: {name}\ndescription: "{name}"\n---\n')
    import json
    from datetime import datetime, timezone
    transcript = record.root.parent / "claude-1.jsonl"
    stamp = datetime.now(timezone.utc).isoformat()
    loads = (("journal-early", 10_000), *((name, 20_000 + 1000 * i) for i, name in enumerate(later)), ("journal-gone", 95_000))
    transcript.write_text("".join(json.dumps({"type": "assistant", "timestamp": stamp, "message": {"usage": {"input_tokens": used}, "content": [
        {"type": "tool_use", "name": "Skill", "input": {"skill": name}}]}}) + "\n" for name, used in loads)
        + json.dumps({"type": "user", "timestamp": stamp, "isCompactSummary": True, "message": {"content": "summary"}}) + "\n")
    report(record, "working", "PreToolUse", provider="claude", transcript=str(transcript))
    handle(PROVIDERS["claude"](), record.root, record.env, {"session_id": "claude-1", "hook_event_name": "SessionStart", "source": "compact",
                                                              "transcript_path": str(transcript)})
    assert sorted(required(record, "claude-1").get("required")) == sorted([*later[1:], "journal-work-tracking"]), \
        "after a compaction the every-start skills and the last five loaded before it are owed again, and earlier ones are not"


def test_a_skills_keyword_makes_the_agent_load_it():
    from features.skill_loading.catalogue import keywords
    from features.skill_loading.required import require_named
    from features.skill_loading.required import outstanding
    record = fresh()
    report(record, "working", "PreToolUse")
    agent = Agents(record, actor="system").by_session("claude-1")
    from skills import render
    assert "keywords: dumps, dump" in render()["journal-dumps/SKILL.md"], "a shipped skill carries its own keywords"
    from commands.http import dispatch
    typed = lambda words: dispatch("POST", f"/api/{record.env}/skills/journal-plans/keywords", record.root, {}, {"keywords": words}).body["keywords"]
    assert typed(" roadmap, ,") == typed(["roadmap", " "]) == ["roadmap"], "words typed on the Skills page are kept, from a comma list or a list"
    assert keywords(record)["journal-plans"] == ["roadmap"], "and read back as the skill's keywords"
    assert dispatch("GET", f"/api/{record.env}/skills/no-such-skill", record.root, {}, {}).code == 404, "an unknown skill is not found"
    from controllers.invoke import invoked
    from resources.base import AGENT, Refused
    for word, named in (("load_skill", {"skill": "journal-plans"}), ("keywords", {"skill": "journal-plans", "keywords": ["other"]})):
        with pytest.raises(Refused, match="only the user"):
            invoked(Agents(record, actor=AGENT), word, named=named)
    assert keywords(record)["journal-plans"] == ["roadmap"], "an agent cannot ask for a skill or change its keywords in the user's name"
    require_named(record, agent, "here is the roadmap")
    assert "journal-plans" in outstanding(record, agent), "and the skill is owed before the next tool call"
    require_named(record, agent, "nothing to see")
    assert outstanding(record, agent) == ["journal-plans"], "a text without a keyword asks for nothing"
    folder = record.root.parent / ".agents" / "skills" / "journal-demo"
    folder.mkdir(parents=True)
    (folder / "SKILL.md").write_text('---\nname: journal-demo\ndescription: "A demo"\n---\n\n# Demo\n')
    page = dispatch("GET", f"/api/{record.env}/skills/journal-demo", record.root, {}, {}).body
    assert (page["description"], "# Demo" in page["text"]) == ("A demo", True), "a skill's own page carries its description and its text"
    assert "journal-demo" in [row[SKILL.name] for row in dispatch("GET", f"/api/{record.env}/skills", record.root, {}, {}).body], "the Skills page lists it"
    assert "its tool calls wait until the skill is loaded" in dispatch("POST", f"/api/{record.env}/skills/journal-demo/load", record.root, {}, {}).body["notice"], \
        "its Load button asks the agent to load it and holds its tool calls until it has"


def test_the_todos_skill_is_loaded_at_every_start_and_cannot_be_switched_off():
    from features import load
    from features.skill_loading.catalogue import primary
    load()
    assert "journal-todos" in primary(), "marked primary in its own front matter, like a feature's skill"


def test_housekeeping_that_asks_nothing_of_the_agent_ships_no_skill():
    import skills
    rendered = skills.render()
    assert "journal-runtime-cleanup/SKILL.md" not in rendered and "journal-open-viewer/SKILL.md" not in rendered, "housekeeping gets no skill"
    assert "journal-plans/SKILL.md" in rendered, "a feature that asks something of the agent keeps its skill"
    assert ("journal-work-tracking/SKILL.md" not in rendered, "## Work tracking" in rendered["journal-todos/SKILL.md"]) == (True, True), \
        "a feature folded into another skill is taught there"


def test_a_plugin_names_the_skills_its_events_require_and_its_skills_carry_keywords(tmp_path):
    import json
    import pytest
    from tests.kit import MANIFEST, read
    from features.skill_loading.catalogue import keywords
    from features.skill_loading.required import outstanding, require_primary
    from resources.base import Refused
    record = fresh()
    report(record, "working", "PreToolUse")
    skill = record.root.parent / ".agents" / "skills" / "lint-rules"
    skill.mkdir(parents=True)
    (skill / "SKILL.md").write_text("---\nname: lint-rules\nplugin: linter\nkeywords: sinful, lint\n---\n")
    assert keywords(record)["lint-rules"] == ["sinful", "lint"], "a plugin's skill carries its own keywords, like a shipped one"

    def loading(load: dict):
        (tmp_path / MANIFEST).parent.mkdir(parents=True, exist_ok=True)
        (tmp_path / MANIFEST).write_text(json.dumps({"name": "linter", "events": {"sin-found": {"title": "A sin"}}, "load": load}))
        return read(tmp_path)

    loaded = loading({"sin-found": ["lint-rules", "not-installed"], "hook.Stop": ["lint-rules"]})
    assert loaded.skills_for(("*", "sin-found")) == ["lint-rules", "not-installed"], "an event names the skills it requires"
    require_primary(record, loaded.skills_for(("sin-found",)), 1.0)
    assert outstanding(record, Agents(record, actor="system").by_session("claude-1")) == ["lint-rules"], \
        "the agent owes the installed ones; a skill that is not installed is never owed"
    with pytest.raises(Refused):
        loading({"no-such-event": ["lint-rules"]})


def test_every_word_and_command_of_a_folded_skill_still_loads_the_skill_that_teaches_it():
    from skills import publish, skill_name, teaching
    from features.skill_loading.catalogue import keywords, teaching_command
    record = fresh()
    publish(record.root.parent, ("claude",))
    words = keywords(record)
    for f in features.FEATURES.values():
        if not teaching(f):
            continue
        skill = skill_name(teaching(f))
        assert set(f.keywords) <= set(words.get(skill, [])), f"every word that loaded {f.name}'s skill loads {skill}"
        if "_" not in f.name:
            assert teaching_command(record.root.parent, f.name.removesuffix("s")) == skill, f"journal {f.name.removesuffix('s')} loads {skill}"
    import json
    from features.renames import rename, skills_renamed
    root = record.root
    home = root / "environments" / "main"
    (root / "runtime" / "sessions" / "one").mkdir(parents=True)
    home.mkdir(parents=True)
    (home / "settings.json").write_text(json.dumps({"features": {"old.line": True}, "triggers": {"old": 1}, "old": {"size": 2, "mode.deep": 3}, "skills": ["old-skill", "other"]}))
    (root / "runtime" / "sessions" / "one" / "gate-1.json").write_text(json.dumps({"old.hold": 1, "keep": 2}))
    (root / "runtime" / "sessions" / "one" / "trigger-old.words.json").write_text("{}")
    (home / "runtime").mkdir()
    (home / "runtime" / "cursor-old").write_text("5")
    assert rename(root, {"old": "new"}) == {"settings": 1, "gates": 1, "triggers": 1, "cursors": 1}, "a renamed feature is renamed in its settings, gates, triggers and cursors"
    assert json.loads((home / "settings.json").read_text())["new"] == {"size": 2, "mode.deep": 3} and (home / "runtime" / "cursor-new").read_text() == "5", \
        "its own settings move under its new name"
    assert rename(root, {"old": "new"}) == {"settings": 0, "gates": 0, "triggers": 0, "cursors": 0}, "renaming twice changes nothing more"
    assert (skills_renamed([skill_name("old"), "other"], "old", "new"), skills_renamed(["other"], "old", "new"), skills_renamed([skill_name("old")], "old", "a.b")) == \
        (sorted([skill_name("new"), "other"]), ["other"], [skill_name("old")]), "a chosen skill follows its feature's new name, and a line of a feature has no skill of its own"
