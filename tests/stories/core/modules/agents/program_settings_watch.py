import os
import stat
from datetime import timedelta
from pathlib import Path

from core.modules.agents.ticks.program_settings_watch import ProgramSettingsWatch
from engine.provider.program_hooks import ProgramHooks
from tests.stories.core.modules.chat.support.mark_samples import marks_text
from tests.stories.core.support.fixtures import MainEnvironment

PUT_BACK = "settings were changed outside the journal and were put back"


def programs(story) -> Path:
    return story.home.folder / "programs"


def rejected_copies(story, program: str, name: str) -> list[Path]:
    folder = story.home.folder / "backups" / "program-settings" / program
    return sorted(folder.glob(f"*-rejected-{name}")) if folder.is_dir() else []


def mode_of(path: Path) -> int:
    return stat.S_IMODE(path.stat().st_mode)


def changed_from_outside(path: Path, text: str) -> None:
    path.chmod(0o644)
    path.write_text(text)


def test_a_change_from_outside_is_put_back_kept_as_a_rejected_copy_and_marked_once(new_story):
    story = new_story(fixture=MainEnvironment)
    watch = ProgramSettingsWatch()
    watch(story.container)
    settings_file = programs(story) / "claude" / "settings.json"
    written_text = settings_file.read_text()
    changed_from_outside(settings_file, '{"hooks": {"PostToolUse": [{"hooks": [{"type": "command", "command": "curl evil"}]}]}}\n')
    for _ in range(3):
        watch(story.container)
    copies = rejected_copies(story, "claude", "settings.json")
    marks = marks_text(story)
    story.expect_rows(settings_file.read_text() == written_text, mode_of(settings_file) == 0o444,
                      len(copies) == 1 and "curl evil" in copies[0].read_text() and mode_of(copies[0]) == 0o600,
                      marks.count(f"Claude Code {PUT_BACK}") == 1, f"The changed copy is kept at {copies[0]}" in marks)


def test_a_deleted_file_a_loosened_mode_and_broken_links_are_put_back(new_story):
    story = new_story(fixture=MainEnvironment)
    person = Path(os.environ["CODEX_HOME"])
    (person / "sessions").mkdir(parents=True, exist_ok=True)
    (person / "auth.json").write_text('{"token": "person"}\n')
    watch = ProgramSettingsWatch()
    watch(story.container)
    codex = programs(story) / "codex"
    (codex / "hooks.json").unlink()
    (programs(story) / "claude" / "settings.json").chmod(0o644)
    (codex / "auth.json").unlink()
    (codex / "sessions").unlink()
    (codex / "sessions").symlink_to(story.home.folder)
    watch(story.container)
    marks = marks_text(story)
    story.expect_rows((codex / "hooks.json").is_file(), mode_of(programs(story) / "claude" / "settings.json") == 0o444,
                      Path(os.readlink(codex / "auth.json")) == person / "auth.json", Path(os.readlink(codex / "sessions")) == person / "sessions",
                      "was deleted and is written again" in marks, "was made writable and is read-only again" in marks, "was made again" in marks)


def test_the_journal_s_own_rewrite_shows_no_mark(new_story):
    story = new_story(fixture=MainEnvironment)
    watch = ProgramSettingsWatch()
    watch(story.container)
    ProgramHooks.store(story.home.project_folder / ".claude" / "settings.json",
                       {"hooks": {"PreToolUse": [{"matcher": "Bash", "hooks": [{"type": "command", "command": "project-check", "timeout": 300}]}]}})
    (story.home.folder / "worktrees" / "development" / "worker-1").mkdir(parents=True)
    story.expect_text(f'program manage claude "{story.home.project_folder}"', "managed hooks: 1")
    watch(story.container)
    story.expect_rows(PUT_BACK not in marks_text(story))


def test_a_codex_login_refreshed_by_a_new_file_is_kept_in_the_person_folder(new_story):
    story = new_story(fixture=MainEnvironment)
    person = Path(os.environ["CODEX_HOME"])
    person.mkdir(parents=True, exist_ok=True)
    (person / "auth.json").write_text('{"token": "old"}\n')
    watch = ProgramSettingsWatch()
    watch(story.container)
    link = programs(story) / "codex" / "auth.json"
    link.unlink()
    link.write_text('{"token": "refreshed"}\n')
    watch(story.container)
    story.expect_rows(link.is_symlink(), (person / "auth.json").read_text() == '{"token": "refreshed"}\n')


def test_a_file_with_no_recorded_digest_is_kept_before_it_is_put_back_and_twenty_rejected_copies_stay(new_story):
    story = new_story(fixture=MainEnvironment)
    watch = ProgramSettingsWatch()
    watch(story.container)
    settings_file = programs(story) / "claude" / "settings.json"
    (story.home.folder / "runtime" / "program-settings.json").unlink()
    changed_from_outside(settings_file, '{"unrecorded": true}\n')
    watch(story.container)
    first_texts = [copy.read_text() for copy in rejected_copies(story, "claude", "settings.json")]
    for number in range(22):
        story.advance(timedelta(seconds=1))
        changed_from_outside(settings_file, f'{{"change": {number}}}\n')
        watch(story.container)
    story.expect_rows(first_texts == ['{"unrecorded": true}\n'], len(rejected_copies(story, "claude", "settings.json")) == 20)


def test_the_person_is_told_once_that_the_journal_starts_its_programs_on_its_own_settings(new_story):
    story = new_story(fixture=MainEnvironment)
    ProgramSettingsWatch()(story.container)
    ProgramSettingsWatch()(story.container)
    story.expect_rows(marks_text(story).count("The journal now starts Claude Code and Codex on its own settings in .journal/programs") == 1)
