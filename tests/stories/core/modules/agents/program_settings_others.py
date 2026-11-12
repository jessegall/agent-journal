import json
import os
from pathlib import Path

from core.modules.agents.ticks.program_settings_watch import ProgramSettingsWatch
from engine.journal.journal_home import JournalHome
from engine.provider.program_hooks import ProgramHooks
from engine.provider.program_settings_writer import ProgramSettingsWriter
from engine.provider.providers import Providers
from tests.stories.core.support.fixtures import MainEnvironment

REPOSITORY_IGNORE = Path(__file__).resolve().parents[5] / ".gitignore"


def person_files() -> list[Path]:
    claude, codex = Path(os.environ["CLAUDE_CONFIG_DIR"]), Path(os.environ["CODEX_HOME"])
    ProgramHooks.store(claude / "settings.json", {"env": {"A": "1"}})
    codex.mkdir(parents=True, exist_ok=True)
    (codex / "config.toml").write_text('model = "gpt-6.1-sol"\n')
    ProgramHooks.store(codex / "hooks.json", {"hooks": {}})
    return [claude / "settings.json", codex / "config.toml", codex / "hooks.json"]


def test_a_clone_and_plain_claude_or_codex_outside_the_journal_see_nothing_of_the_journal_s_settings(new_story):
    story = new_story(fixture=MainEnvironment)
    root = story.home.project_folder
    files = person_files()
    before = [path.read_bytes() for path in files]
    ProgramSettingsWatch()(story.container)
    project_files = [root / ".claude" / "settings.local.json", root / ".claude" / "settings.json", root / ".codex" / "hooks.json"]
    story.expect_rows("/.journal" in REPOSITORY_IGNORE.read_text().splitlines(), [path.read_bytes() for path in files] == before,
                      all(not ProgramHooks.partitioned(ProgramHooks.read(path).get("hooks")).journal for path in project_files))


def test_two_projects_each_have_their_own_journal_settings(new_story, tmp_path):
    story = new_story(fixture=MainEnvironment)
    provider = story.container.get(Providers).provider("claude")
    other_home = JournalHome(tmp_path / "project-b" / ".journal")
    homes = [story.home, other_home]
    for home in homes:
        ProgramSettingsWriter(home).write(provider.journal_settings(home, f'"{home.hook_runner}"', (), [home.project_folder]))
    commands = [{blocks[0]["hooks"][0]["command"] for blocks in json.loads(home.program_settings_file("claude").read_text())["hooks"].values()} for home in homes]
    story.expect_rows(commands[0] == {f'"{story.home.hook_runner}" claude "{story.home.project_folder}"'},
                      commands[1] == {f'"{other_home.hook_runner}" claude "{other_home.project_folder}"'})
