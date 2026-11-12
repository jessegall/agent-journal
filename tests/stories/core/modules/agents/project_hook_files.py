import json

from core.modules.agents.ticks.program_settings_tick import ProgramSettingsTick
from engine.provider.program_hooks import ProgramHooks
from tests.stories.core.support.fixtures import MainEnvironment

OLD_CLAUDE_ENTRY = {"matcher": "", "hooks": [{"type": "command", "command": '"/p/.journal/bin/journal-hook" claude "/p"', "timeout": 90}]}
OLD_CODEX_ENTRY = {"matcher": "", "hooks": [{"type": "command", "command": '"/p/.journal/bin/journal-hook" codex "/p"', "additionalContextLimit": 0}]}
FOREIGN_PROMPT = {"matcher": "Bash", "hooks": [{"type": "prompt", "prompt": "Review this"}]}
FOREIGN_COMMAND = {"matcher": "Bash", "hooks": [{"type": "command", "command": "project-check", "timeout": 60}]}


def journal_entries(settings: dict[str, object]) -> list[object]:
    return [block for blocks in ProgramHooks.partitioned(settings.get("hooks")).journal.values() for block in blocks]


def test_the_first_start_backs_up_the_project_files_and_takes_the_old_journal_entries_out(new_story):
    story = new_story(fixture=MainEnvironment)
    root = story.home.project_folder
    local, codex = root / ".claude" / "settings.local.json", root / ".codex" / "hooks.json"
    ProgramHooks.store(local, {"hooks": {"PreToolUse": [OLD_CLAUDE_ENTRY, FOREIGN_PROMPT]}})
    ProgramHooks.store(codex, {"hooks": {"PreToolUse": [OLD_CODEX_ENTRY, FOREIGN_PROMPT]}})
    originals = {"claude": local.read_bytes(), "codex": codex.read_bytes()}
    ProgramSettingsTick()(story.container)
    backups = story.home.folder / "backups" / "program-settings"
    copies = {program: [copy.read_bytes() for copy in (backups / program).glob(f"*-project-{name}")] for program, name in (("claude", "settings.local.json"), ("codex", "hooks.json"))}
    journal_codex = json.loads((story.home.folder / "programs" / "codex" / "hooks.json").read_text())
    pre_tool_entries = [entry for settings in (journal_codex, ProgramHooks.read(codex)) for block in settings.get("hooks", {}).get("PreToolUse", [])
                        for entry in block["hooks"] if ProgramHooks.is_journals(entry)]
    story.expect_rows(copies == {program: [data] for program, data in originals.items()},
                      ProgramHooks.read(local) == {"hooks": {"PreToolUse": [FOREIGN_PROMPT]}}, ProgramHooks.read(codex) == {"hooks": {"PreToolUse": [FOREIGN_PROMPT]}},
                      len(pre_tool_entries) == 1)


def test_program_manage_moves_foreign_hooks_into_the_store_and_writes_no_journal_entry_into_the_project(new_story):
    story = new_story(fixture=MainEnvironment)
    root = story.home.project_folder
    ProgramHooks.store(root / ".claude" / "settings.json", {"hooks": {"PreToolUse": [FOREIGN_COMMAND]}})
    story.expect_text(f'program manage codex "{root}"', "managed hooks:")
    story.expect_text(f'program manage claude "{root}"', "managed hooks: 1")
    journal_claude = json.loads((story.home.folder / "programs" / "claude" / "settings.json").read_text())
    project_files = [root / ".claude" / "settings.json", root / ".claude" / "settings.local.json", root / ".codex" / "hooks.json"]
    story.expect_rows(all(journal_entries(ProgramHooks.read(path)) == [] for path in project_files),
                      ProgramHooks.partitioned(ProgramHooks.read(root / ".claude" / "settings.json").get("hooks")).commands == [],
                      journal_claude["hooks"]["PreToolUse"][0]["hooks"][0]["timeout"] == 150)
