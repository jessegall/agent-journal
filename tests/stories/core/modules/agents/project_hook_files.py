import json
import subprocess

from core.modules.agents.ticks.program_settings_watch import ProgramSettingsWatch
from engine.provider.program_hooks import ProgramHooks
from tests.stories.core.support.fixtures import MainEnvironment

OLD_CLAUDE_ENTRY = {"matcher": "", "hooks": [{"type": "command", "command": '"/p/.journal/bin/journal-hook" claude "/p"', "timeout": 90}]}
OLD_CODEX_ENTRY = {"matcher": "", "hooks": [{"type": "command", "command": '"/p/.journal/bin/journal-hook" codex "/p"', "additionalContextLimit": 0}]}
FOREIGN_PROMPT = {"matcher": "Bash", "hooks": [{"type": "prompt", "prompt": "Review this"}]}
FOREIGN_COMMAND = {"matcher": "Bash", "hooks": [{"type": "command", "command": "project-check", "timeout": 60}]}


def git(folder, *arguments) -> None:
    subprocess.run(["git", "-C", str(folder), *arguments], capture_output=True, check=True)


def journal_entries(settings: dict[str, object]) -> list[object]:
    return [block for blocks in ProgramHooks.partitioned(settings.get("hooks")).journal.values() for block in blocks]


def test_the_first_start_backs_up_the_project_files_and_takes_the_old_journal_entries_out(new_story):
    story = new_story(fixture=MainEnvironment)
    root = story.home.project_folder
    local, codex = root / ".claude" / "settings.local.json", root / ".codex" / "hooks.json"
    ProgramHooks.store(local, {"hooks": {"PreToolUse": [OLD_CLAUDE_ENTRY, FOREIGN_PROMPT]}})
    ProgramHooks.store(codex, {"hooks": {"PreToolUse": [OLD_CODEX_ENTRY, FOREIGN_PROMPT]}})
    originals = {"claude": local.read_bytes(), "codex": codex.read_bytes()}
    ProgramSettingsWatch()(story.container)
    backups = story.home.folder / "backups" / "program-settings"
    copies = {program: [copy.read_bytes() for copy in (backups / program).glob(f"*-project-{name}")] for program, name in (("claude", "settings.local.json"), ("codex", "hooks.json"))}
    journal_codex = json.loads((story.home.folder / "programs" / "codex" / "hooks.json").read_text())
    pre_tool_entries = [entry for settings in (journal_codex, ProgramHooks.read(codex)) for block in settings.get("hooks", {}).get("PreToolUse", [])
                        for entry in block["hooks"] if ProgramHooks.is_journals(entry)]
    story.expect_rows(copies == {program: [data] for program, data in originals.items()},
                      ProgramHooks.read(local) == {"hooks": {"PreToolUse": [FOREIGN_PROMPT]}}, ProgramHooks.read(codex) == {"hooks": {"PreToolUse": [FOREIGN_PROMPT]}},
                      len(pre_tool_entries) == 1)


def test_program_manage_moves_foreign_hooks_into_the_store_once_the_index_is_free_and_writes_no_journal_entry_into_the_project(new_story):
    story = new_story(fixture=MainEnvironment)
    root = story.home.project_folder
    settings = root / ".claude" / "settings.json"
    git(root, "init", "-q")
    ProgramHooks.store(settings, {"hooks": {"PreToolUse": [FOREIGN_COMMAND]}})
    git(root, "add", ".claude/settings.json")
    lock = root / ".git" / "index.lock"
    lock.touch()
    story.expect_text(f'program manage claude "{root}"', "managed hooks: 0")
    full_copy = ProgramHooks.read(settings) == {"hooks": {"PreToolUse": [FOREIGN_COMMAND]}}
    lock.unlink()
    story.expect_text(f'program manage codex "{root}"', "managed hooks:")
    story.expect_text(f'program manage claude "{root}"', "managed hooks: 1")
    journal_claude = json.loads((story.home.folder / "programs" / "claude" / "settings.json").read_text())
    project_files = [settings, root / ".claude" / "settings.local.json", root / ".codex" / "hooks.json"]
    listed = subprocess.run(["git", "-C", str(root), "ls-files", "-v", ".claude/settings.json"], capture_output=True, text=True, check=True).stdout
    story.expect_rows(full_copy, listed.startswith("S "), all(journal_entries(ProgramHooks.read(path)) == [] for path in project_files),
                      ProgramHooks.partitioned(ProgramHooks.read(settings).get("hooks")).commands == [],
                      journal_claude["hooks"]["PreToolUse"][0]["hooks"][0]["timeout"] == 150, detail=listed)
