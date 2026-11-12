import subprocess
from pathlib import Path

import pytest

PROJECT_FOLDER = Path(__file__).resolve().parents[2]
SHARED_BRANCH = "version-5"
MIGRATION_FILES = ":(glob)src/**/migrations/m[0-9]*.py"
KEPT_STATUSES = ("M", "D", "R", "T")


def git(*arguments: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(["git", *arguments], cwd=PROJECT_FOLDER, capture_output=True, text=True, timeout=60)


def test_a_migration_that_is_already_on_the_shared_branch_is_not_changed_renamed_or_removed():
    """A database that ran a migration records it by module and number and never runs it again, so a change to
    a shipped migration reaches no database that ran it; a change is a new migration with the next number."""
    base = git("merge-base", "HEAD", SHARED_BRANCH)
    if base.returncode != 0:
        pytest.skip(f"this checkout has no branch {SHARED_BRANCH} to compare with")
    changes = git("diff", "--name-status", "--no-renames", base.stdout.strip(), "HEAD", "--", MIGRATION_FILES).stdout.splitlines()
    changed = [change for change in changes if change.startswith(KEPT_STATUSES)]
    assert changed == [], f"these migrations are on {SHARED_BRANCH} already, so write a new one instead: {changed}"
