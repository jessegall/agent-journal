import re
import subprocess
from pathlib import Path

from tests.install.support import INSTALL, TIMEOUT_SECONDS, Scratch
from tests.install.test_upgrade_script import version_four_project

ROOT = INSTALL.parent
DOCUMENTS = (ROOT / "README.md", ROOT / "docs" / "upgrade-from-version-4.md")
COMMAND_LINE = re.compile(r"^    (sh install\.sh.*|journal .*)$", re.MULTILINE)
GO_COMMANDS = {"launch", "worktree", "viewer", "server"}


def commands(document: Path) -> list[str]:
    return COMMAND_LINE.findall(document.read_text())


def known_things() -> set[str]:
    import sys

    sys.path.insert(0, str(ROOT / "src"))
    from core.modules import DEFAULT_MODULES
    from suites import DEFAULT_SUITES

    things = set(GO_COMMANDS)
    for module in (*DEFAULT_MODULES, *DEFAULT_SUITES):
        things |= {subcommand.cli_name for subcommand in module.subcommands} | {declaration.model.cli_name for declaration in module.models}
    return things


def test_every_journal_command_the_documents_name_exists():
    things = known_things()
    named = [line.split()[1] for document in DOCUMENTS for line in commands(document) if line.startswith("journal ")]
    assert named and [thing for thing in named if thing not in things] == []


def test_the_install_line_of_the_readme_runs_as_written_in_an_empty_project(tmp_path):
    scratch = Scratch(tmp_path)
    install_lines = [line for line in commands(DOCUMENTS[0]) if line == "sh install.sh"]
    assert install_lines
    run = subprocess.run(["sh", str(INSTALL)], cwd=scratch.project, env=scratch.environment(), capture_output=True, text=True, timeout=TIMEOUT_SECONDS)
    assert run.returncode == 0 and (scratch.journal / "version-5.db").is_file(), run.stdout + run.stderr


def test_the_upgrade_and_restore_lines_of_the_readme_run_as_written_on_a_version_4_project(tmp_path):
    scratch = version_four_project(tmp_path)
    lines = [line for line in commands(DOCUMENTS[0]) if line.startswith("sh install.sh ") and line != "sh install.sh"]
    assert lines == ["sh install.sh upgrade --dry-run", "sh install.sh upgrade --yes", "sh install.sh restore"]
    for line in lines:
        arguments = line.split()[2:] + (["--yes"] if line.endswith("restore") else [])
        run = subprocess.run(["sh", str(INSTALL), *arguments], cwd=scratch.project, env=scratch.environment(), capture_output=True, text=True, timeout=TIMEOUT_SECONDS)
        assert run.returncode == 0, (line, run.stdout, run.stderr)
    assert (scratch.journal / "journal.db").is_file()
