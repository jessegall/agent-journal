from pathlib import Path
import json
import os

from core.modules.agents.ticks.program_settings_watch import ProgramSettingsWatch
from engine.journal.journal_home import JournalHome
from engine.provider.program_hooks import ProgramHooks
from engine.provider.program_settings_writer import ProgramSettingsWriter
from engine.provider.providers import Providers

REPOSITORY_IGNORE = Path(__file__).resolve().parents[5] / ".gitignore"


def person_files() -> list[Path]:
    claude, codex = Path(os.environ["CLAUDE_CONFIG_DIR"]), Path(os.environ["CODEX_HOME"])
    ProgramHooks.store(claude / "settings.json", {"env": {"A": "1"}})
    codex.mkdir(parents=True, exist_ok=True)
    (codex / "config.toml").write_text('model = "gpt-6.1-sol"\n')
    ProgramHooks.store(codex / "hooks.json", {"hooks": {}})
    return [claude / "settings.json", codex / "config.toml", codex / "hooks.json"]


def test_a_clone_and_plain_claude_or_codex_outside_the_journal_see_nothing_of_the_journal_s_settings(journal):
    root = journal.home.project_folder
    files = person_files()
    previous = [path.read_bytes() for path in files]
    ProgramSettingsWatch()(journal.container)
    project_files = [root / ".claude" / "settings.local.json", root / ".claude" / "settings.json", root / ".codex" / "hooks.json"]
    assert '/.journal' in REPOSITORY_IGNORE.read_text().splitlines()
    assert [path.read_bytes() for path in files] == previous
    assert all((not ProgramHooks.partitioned(ProgramHooks.read(path).get('hooks')).journal for path in project_files))


def test_two_projects_each_have_their_own_journal_settings(journal, tmp_path):
    provider = journal.container.get(Providers).provider("claude")
    different_home = JournalHome(tmp_path / "project-b" / ".journal")
    journal_folders = [journal.home, different_home]
    for home in journal_folders:
        ProgramSettingsWriter(home).write(provider.journal_settings(home, f'"{home.hook_runner}"', (), [home.project_folder]))
    commands = [{blocks[0]["hooks"][0]["command"] for blocks in json.loads(home.program_settings_file("claude").read_text())["hooks"].values()} for home in journal_folders]
    assert commands[0] == {f'"{journal.home.hook_runner}" claude "{journal.home.project_folder}"'}
    assert commands[1] == {f'"{different_home.hook_runner}" claude "{different_home.project_folder}"'}
