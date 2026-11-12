import os
import re
import stat
from datetime import timedelta
from pathlib import Path

import pytest

from core.modules.agents.ticks.program_settings_watch import ProgramSettingsWatch
from tests.stories.core.support.fixtures import MainEnvironment

COPY_NAME = re.compile(r"^\d{8}T\d{6}Z(-\d+)?-(?P<name>.+)$")
REWRITES = 30


def person_files() -> dict[str, list[Path]]:
    codex = Path(os.environ["CODEX_HOME"])
    return {"claude": [Path(os.environ["CLAUDE_CONFIG_DIR"]) / "settings.json"], "codex": [codex / "config.toml", codex / "hooks.json"]}


def written_person_files() -> list[Path]:
    files = [path for paths in person_files().values() for path in paths]
    for number, path in enumerate(files):
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(f'{{"person": {number}}}\n' if path.suffix == ".json" else f'model = "person-{number}"\n')
    return files


def copies(story, program: str, name: str) -> list[Path]:
    folder = story.home.folder / "backups" / "program-settings" / program
    named = [copy for copy in folder.iterdir() if (match := COPY_NAME.match(copy.name)) and match["name"] == name] if folder.is_dir() else []
    return sorted(named)


def manage_claude(story) -> None:
    story.expect_text(f'program manage claude "{story.home.project_folder}"', "managed hooks:")


def launch_claude(story) -> None:
    story.expect_text(f'program command claude "{story.home.project_folder}" --launch launch-1', "claude")


def log_text(story) -> str:
    log = story.home.folder / "runtime" / "server.log"
    return log.read_text() if log.is_file() else ""


def test_the_first_start_backs_up_each_person_file_privately_and_leaves_it_as_it_was(new_story):
    story = new_story(fixture=MainEnvironment)
    files = written_person_files()
    before = [(path.read_bytes(), path.stat().st_mtime_ns) for path in files]
    ProgramSettingsWatch()(story.container)
    made = [(program, path) for program, paths in person_files().items() for path in paths]
    story.expect_rows(all(len(copies(story, program, path.name)) == 1 for program, path in made),
                      all(copies(story, program, path.name)[0].read_bytes() == path.read_bytes() for program, path in made),
                      all(stat.S_IMODE(copies(story, program, path.name)[0].stat().st_mode) == 0o600 for program, path in made),
                      [(path.read_bytes(), path.stat().st_mtime_ns) for path in files] == before)


def test_an_unchanged_file_is_not_copied_again(new_story):
    story = new_story(fixture=MainEnvironment)
    written_person_files()
    ProgramSettingsWatch()(story.container)
    story.advance(timedelta(minutes=1))
    launch_claude(story)
    story.expect_rows(len(copies(story, "claude", "settings.json")) == 1)


def test_a_changed_file_gets_a_new_copy_and_the_older_stays(new_story):
    story = new_story(fixture=MainEnvironment)
    settings = written_person_files()[0]
    manage_claude(story)
    settings.write_text('{"person": "changed"}\n')
    story.advance(timedelta(minutes=1))
    manage_claude(story)
    story.expect_rows([copy.read_text() for copy in copies(story, "claude", "settings.json")] == ['{"person": 0}\n', '{"person": "changed"}\n'])


@pytest.mark.parametrize("rewrites", [21, REWRITES])
def test_the_first_copy_stays_beside_the_newest_twenty(new_story, rewrites):
    story = new_story(fixture=MainEnvironment)
    settings = written_person_files()[0]
    for number in range(rewrites):
        settings.write_text(f'{{"person": "rewrite {number}"}}\n')
        launch_claude(story)
        story.advance(timedelta(minutes=1))
    kept = [copy.read_text() for copy in copies(story, "claude", "settings.json")]
    story.expect_rows(len(kept) == 21, kept[0] == '{"person": "rewrite 0"}\n',
                      kept[1:] == [f'{{"person": "rewrite {number}"}}\n' for number in range(rewrites - 20, rewrites)])


def test_a_missing_codex_hooks_file_gives_no_copy_and_no_failure_line(new_story):
    story = new_story(fixture=MainEnvironment)
    written_person_files()
    person_files()["codex"][1].unlink()
    ProgramSettingsWatch()(story.container)
    story.expect_rows(copies(story, "codex", "hooks.json") == [], len(copies(story, "codex", "config.toml")) == 1, "failed" not in log_text(story))


@pytest.mark.skipif(os.geteuid() == 0, reason="root reads a file with mode 000")
def test_an_unreadable_person_file_is_logged_and_the_journal_still_writes_its_own(new_story):
    story = new_story(fixture=MainEnvironment)
    settings = written_person_files()[0]
    os.chmod(settings, 0)
    try:
        ProgramSettingsWatch()(story.container)
    finally:
        os.chmod(settings, 0o600)
    story.expect_rows(f"the backup of {settings} failed: Permission denied" in log_text(story),
                      (story.home.folder / "programs" / "claude" / "settings.json").is_file(), copies(story, "claude", "settings.json") == [])
