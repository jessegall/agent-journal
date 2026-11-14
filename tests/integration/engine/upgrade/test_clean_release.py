import pytest

from tests.stories.engine.upgrade.support.released_journal import prepare_release

pytestmark = pytest.mark.install_job


def test_a_clean_release_upgrade_runs_installed_commands_without_manual_module_sync(journal_with):
    release = prepare_release(journal_with())
    release.expect_upgrade()
    release.expect_command("environment list", "main")
    release.expect_command("task list --environment main", "Fix the cart")
    release.expect_command("message list --environment main", "Ship the cart today")
