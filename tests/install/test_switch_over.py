import json
import shutil
import subprocess

from tests.install.support import INSTALL, TIMEOUT_SECONDS, Scratch
from tests.install.test_release_archive import release_with_archive
from tests.install.test_upgrade_script import content, upgrade, version_four_project

VERSION_FOUR_HOOK = "test -f {root}/.journal/src/journal/hooks/hook.sh && exec sh {root}/.journal/src/journal/hooks/hook.sh claude {root}; exit 0"
HOOK_EVENTS = ("SessionStart", "UserPromptSubmit", "PreToolUse", "PostToolUse", "Stop")
SETTINGS = ".claude/settings.local.json"
KEPT_SETTING = {"permissions": {"allow": ["Bash(ls:*)"]}}


def hooked_version_four_project(tmp_path) -> Scratch:
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
    scratch = hooked_version_four_project(tmp_path)
    run = upgrade(scratch, "--yes")
    assert run.returncode == 0, run.stdout + run.stderr
    commands = hook_commands(scratch)
    assert commands and not any("src/journal/hooks/hook.sh" in command for command in commands), commands
    assert all(".journal/bin/journal-hook" in command or ".journal/hooks/hook.sh" in command for command in commands), commands
    assert json.loads((scratch.project / SETTINGS).read_text())["permissions"] == KEPT_SETTING["permissions"]


def test_the_restore_puts_version_4_and_its_hooks_back_and_sets_version_5_aside(tmp_path):
    scratch = hooked_version_four_project(tmp_path)
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
