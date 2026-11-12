import json
import os
import shutil
import stat
import threading
from pathlib import Path

from core.modules.agents.ticks.program_settings_tick import ProgramSettingsTick
from engine.provider.program_hooks import ProgramHooks
from engine.provider.program_settings_sync import ProgramSettingsSync
from tests.stories.core.modules.helpers.start_helper import LauncherRuns
from tests.stories.core.support.fixtures import MainEnvironment

OLD_JOURNAL_BLOCK = {"matcher": "", "hooks": [{"type": "command", "command": "exec sh /p/.journal/src/journal/hooks/hook.sh claude /p"}]}
REWRITES = 50


def program_files(story) -> list[Path]:
    programs = story.home.folder / "programs"
    return [programs / "claude" / "settings.json", programs / "codex" / "config.toml", programs / "codex" / "hooks.json"]


def claude_file(story) -> Path:
    return story.home.folder / "programs" / "claude" / "settings.json"


def claude_person_file() -> Path:
    return Path(os.environ["CLAUDE_CONFIG_DIR"]) / "settings.json"


def mode_of(path: Path) -> int:
    return stat.S_IMODE(path.stat().st_mode)


def test_the_server_start_writes_both_programs_files_read_only(new_story):
    story = new_story(fixture=MainEnvironment)
    ProgramSettingsTick()(story.container)
    story.expect_rows(all(path.is_file() and mode_of(path) == 0o444 for path in program_files(story)),
                      all(path.read_text().endswith("\n") for path in program_files(story)))


def test_every_launch_writes_the_programs_files_first_and_replaces_an_older_read_only_one(new_story):
    story = new_story(fixture=LauncherRuns)
    claude_file(story).parent.mkdir(parents=True)
    claude_file(story).write_text('{"older": true}\n')
    os.chmod(claude_file(story), 0o444)
    older_inode = claude_file(story).stat().st_ino
    story.expect_text(f'program command claude "{story.home.project_folder}" --launch launch-1', "claude")
    replaced = claude_file(story).stat().st_ino != older_inode and mode_of(claude_file(story)) == 0o444 and "older" not in claude_file(story).read_text()
    shutil.rmtree(story.home.folder / "programs")
    story.expect_text(f'program manage codex "{story.home.project_folder}"', "managed hooks:")
    story.expect_rows(replaced, all(path.is_file() for path in program_files(story)[1:]), not claude_file(story).exists())


def test_a_rewrite_never_shows_a_half_file(new_story):
    story = new_story(fixture=MainEnvironment)
    sync = story.container.get(ProgramSettingsSync)
    texts: set[str] = set()
    seen_texts: list[str] = []
    finished = threading.Event()

    def read_while_rewritten() -> None:
        while not finished.is_set():
            if claude_file(story).is_file():
                seen_texts.append(claude_file(story).read_text())

    reader = threading.Thread(target=read_while_rewritten)
    reader.start()
    try:
        for number in range(REWRITES):
            ProgramHooks.store(claude_person_file(), {"env": {"WRITE": str(number % 2)}})
            sync.write("claude")
            texts.add(claude_file(story).read_text())
    finally:
        finished.set()
        reader.join()
    story.expect_rows(len(texts) == 2, len(seen_texts) > 0, all(text in texts for text in seen_texts))


def test_a_launch_is_refused_when_the_settings_cannot_be_written(new_story):
    story = new_story(fixture=MainEnvironment)
    ProgramHooks.store(claude_person_file(), {"env": {"A": "1"}})
    person_before = (claude_person_file().read_bytes(), claude_person_file().stat().st_mtime_ns)
    (story.home.folder / "programs").write_text("a file where the folder belongs")
    outcome = story.run(f'program manage claude "{story.home.project_folder}"')
    story.expect_rows(outcome.code == 1, "the journal could not write its Claude Code settings: " in outcome.output_text,
                      "; nothing was started" in outcome.output_text, "--settings" not in outcome.output_text,
                      (claude_person_file().read_bytes(), claude_person_file().stat().st_mtime_ns) == person_before)
    (story.home.folder / "programs").unlink()
    story.expect_text(f'program command claude "{story.home.project_folder}" --launch launch-2', "--settings")


def test_an_upgrade_from_an_older_journal_writes_the_files_at_once(new_story):
    story = new_story(fixture=MainEnvironment)
    local = story.home.project_folder / ".claude" / "settings.local.json"
    local.parent.mkdir(parents=True, exist_ok=True)
    local.write_text(json.dumps({"hooks": {"PreToolUse": [OLD_JOURNAL_BLOCK]}}))
    absent_before = not (story.home.folder / "programs").exists()
    ProgramSettingsTick()(story.container)
    story.expect_rows(absent_before, all(path.is_file() for path in program_files(story)))
