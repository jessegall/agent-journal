import json
import subprocess

from core.modules.agents.ticks.program_settings_watch import ProgramSettingsWatch
from engine.provider.program_hooks import ProgramHooks

OLD_CLAUDE_ENTRY = {"matcher": "", "hooks": [{"type": "command", "command": '"/p/.journal/bin/journal-hook" claude "/p"', "timeout": 90}]}
OLD_CODEX_ENTRY = {"matcher": "", "hooks": [{"type": "command", "command": '"/p/.journal/bin/journal-hook" codex "/p"', "additionalContextLimit": 0}]}
FOREIGN_PROMPT = {"matcher": "Bash", "hooks": [{"type": "prompt", "prompt": "Review this"}]}
FOREIGN_COMMAND = {"matcher": "Bash", "hooks": [{"type": "command", "command": "project-check", "timeout": 60}]}


def git(folder, *arguments) -> None:
    subprocess.run(["git", "-C", str(folder), *arguments], capture_output=True, check=True)


def journal_entries(settings: dict[str, object]) -> list[object]:
    return [block for blocks in ProgramHooks.partitioned(settings.get("hooks")).journal.values() for block in blocks]


def test_the_first_start_backs_up_the_project_files_and_takes_the_old_journal_entries_out(journal):
    root = journal.home.project_folder
    local, codex = root / ".claude" / "settings.local.json", root / ".codex" / "hooks.json"
    ProgramHooks.store(local, {"hooks": {"PreToolUse": [OLD_CLAUDE_ENTRY, FOREIGN_PROMPT]}})
    ProgramHooks.store(codex, {"hooks": {"PreToolUse": [OLD_CODEX_ENTRY, FOREIGN_PROMPT]}})
    originals = {"claude": local.read_bytes(), "codex": codex.read_bytes()}
    ProgramSettingsWatch()(journal.container)
    backups = journal.home.folder / "backups" / "program-settings"
    copies = {program: [copy.read_bytes() for copy in (backups / program).glob(f"*-project-{name}")] for program, name in (("claude", "settings.local.json"), ("codex", "hooks.json"))}
    journal_codex = json.loads((journal.home.folder / "programs" / "codex" / "hooks.json").read_text())
    pre_tool_entries = [entry for settings in (journal_codex, ProgramHooks.read(codex)) for block in settings.get("hooks", {}).get("PreToolUse", [])
                        for entry in block["hooks"] if ProgramHooks.is_journals(entry)]
    assert copies == {program: [data] for program, data in originals.items()}
    assert ProgramHooks.read(local) == {'hooks': {'PreToolUse': [FOREIGN_PROMPT]}}
    assert ProgramHooks.read(codex) == {'hooks': {'PreToolUse': [FOREIGN_PROMPT]}}
    assert len(pre_tool_entries) == 1
