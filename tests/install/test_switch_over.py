import json
import shutil
import sqlite3
import subprocess

from tests.install.support import INSTALL, TIMEOUT_SECONDS, Scratch
from tests.install.test_release_archive import release_with_archive
from tests.install.test_upgrade_script import content, upgrade, version_four_project
from tests.stories.fixtures.version_four import version_four_fixture

VERSION_FOUR_HOOK = "test -f {root}/.journal/src/journal/hooks/hook.sh && exec sh {root}/.journal/src/journal/hooks/hook.sh claude {root}; exit 0"
HOOK_EVENTS = ("SessionStart", "UserPromptSubmit", "PreToolUse", "PostToolUse", "Stop")
SETTINGS = ".claude/settings.local.json"
KEPT_SETTING = {"permissions": {"allow": ["Bash(ls:*)"]}}


def version_four_project_with_hooks(tmp_path) -> Scratch:
    scratch = version_four_project(tmp_path)
    command = VERSION_FOUR_HOOK.format(root=scratch.project)
    settings = {**KEPT_SETTING, "hooks": {event: [{"hooks": [{"type": "command", "command": command}]}] for event in HOOK_EVENTS}}
    (scratch.project / ".claude").mkdir()
    (scratch.project / SETTINGS).write_text(json.dumps(settings, indent=2))
    return scratch


def hook_commands(scratch: Scratch) -> set[str]:
    settings = json.loads((scratch.project / SETTINGS).read_text())
    return {hook["command"] for groups in settings["hooks"].values() for group in groups for hook in group["hooks"]}


def test_install_in_an_empty_project_starts_nothing_and_leaves_version_4_names_out(tmp_path):
    scratch = Scratch(tmp_path)
    run = scratch.install()
    assert run.returncode == 0, run.stderr
    assert (scratch.journal / "version-5.db").is_file() and not (scratch.journal / "version-4").exists()


def test_install_over_a_version_4_project_changes_nothing_and_answers_with_the_upgrade(tmp_path):
    scratch = version_four_project(tmp_path)
    starting_files = scratch.file_contents()
    run = scratch.install()
    assert run.returncode == 1 and "this project holds a version 4 journal: run journal upgrade" in run.stderr
    assert scratch.file_contents() == starting_files


def test_the_upgrade_of_a_copy_of_a_version_4_journal_moves_its_rows_and_keeps_the_backup_equal(tmp_path):
    scratch = version_four_project(tmp_path)
    original = content(scratch.journal / "journal.db")
    run = upgrade(scratch, "--yes")
    assert run.returncode == 0, run.stdout + run.stderr
    assert content(next((scratch.journal / "version-4").rglob("journal.db"))) == original


def test_the_upgrade_switches_the_hooks_to_version_5_and_keeps_the_rest_of_the_settings(tmp_path):
    scratch = version_four_project_with_hooks(tmp_path)
    run = upgrade(scratch, "--yes")
    assert run.returncode == 0, run.stdout + run.stderr
    commands = hook_commands(scratch)
    assert commands and not any("src/journal/hooks/hook.sh" in command for command in commands), commands
    assert all(".journal/bin/journal-hook" in command or ".journal/hooks/hook.sh" in command for command in commands), commands
    assert json.loads((scratch.project / SETTINGS).read_text())["permissions"] == KEPT_SETTING["permissions"]


def test_the_restore_puts_version_4_and_its_hooks_back_and_sets_version_5_aside(tmp_path):
    scratch = version_four_project_with_hooks(tmp_path)
    original, hooks = content(scratch.journal / "journal.db"), hook_commands(scratch)
    assert upgrade(scratch, "--yes").returncode == 0
    run = upgrade(scratch, "--restore")
    assert run.returncode == 0, run.stdout + run.stderr
    assert content(scratch.journal / "journal.db") == original and not (scratch.journal / "version-5.db").exists()
    assert hook_commands(scratch) == hooks


def test_the_upgrade_runs_from_the_release_package_with_no_code_beside_the_script(tmp_path):
    scratch = version_four_project(tmp_path)
    release_with_archive(scratch)
    folder = scratch.project.parent / "download"
    folder.mkdir()
    shutil.copy(INSTALL, folder / "install.sh")
    run = subprocess.run(["sh", str(folder / "install.sh"), "upgrade", "--yes"], cwd=scratch.project, env=scratch.environment(), capture_output=True, text=True,
                         timeout=TIMEOUT_SECONDS)
    assert run.returncode == 0, run.stdout + run.stderr
    assert (scratch.journal / "version-5.db").is_file() and (scratch.journal / "src" / "core" / "journal.py").is_file()


def run_hook(command: str, scratch: Scratch) -> subprocess.CompletedProcess[str]:
    return subprocess.run(["sh", "-c", command], cwd=scratch.project, env={**scratch.environment(), "AGENT_JOURNAL_ACTIVE": "1"}, input="{}", capture_output=True,
                          text=True, timeout=TIMEOUT_SECONDS)


def test_a_hook_of_a_session_that_started_before_the_switch_and_one_after_it_both_end_quietly_with_no_server(tmp_path):
    scratch = version_four_project_with_hooks(tmp_path)
    old_commands = hook_commands(scratch)
    assert upgrade(scratch, "--yes").returncode == 0
    for command in (*old_commands, *hook_commands(scratch)):
        finished = run_hook(command, scratch)
        assert finished.returncode == 0 and finished.stdout == "" and finished.stderr == "", (command, finished.stdout, finished.stderr)
    assert not (scratch.journal / "server.pid").exists()


def test_the_messages_version_4_had_queued_are_in_version_5_after_the_switch(tmp_path):
    scratch = version_four_project_with_hooks(tmp_path)
    assert upgrade(scratch, "--yes").returncode == 0
    connection = sqlite3.connect(f"{(scratch.journal / 'version-5.db').as_uri()}?mode=ro", uri=True)
    try:
        moved = connection.execute("SELECT count(*) FROM messages WHERE text IN ('Ship the cart today', 'Shipping it')").fetchone()[0]
    finally:
        connection.close()
    assert moved == 2


def test_a_version_4_journal_that_appears_again_after_the_upgrade_is_refused_plainly_and_the_backup_is_kept(tmp_path):
    scratch = version_four_project(tmp_path)
    assert upgrade(scratch, "--yes").returncode == 0
    backup = next((scratch.journal / "version-4").rglob("journal.db"))
    backup_content = content(backup)
    version_four_fixture(scratch.journal / "journal.db", with_rows=False)
    run = upgrade(scratch, "--yes")
    assert run.returncode == 1 and "a version 4 journal.db is in" in run.stdout and "again after the upgrade finished" in run.stdout and "Nothing was changed" in run.stdout
    assert content(backup) == backup_content and (scratch.journal / "journal.db").is_file()
