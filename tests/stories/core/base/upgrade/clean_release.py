import pytest

from tests.stories.core.base.upgrade.support.released_journal import prepare_release

pytestmark = pytest.mark.install_job


def test_a_clean_release_upgrade_runs_installed_commands_without_manual_module_sync(new_story):
    release = prepare_release(new_story())
    release.expect_upgrade()
    release.expect_command("environment list", "main")
    release.expect_command("task list --environment main", "Fix the cart")
    release.expect_command("message list --environment main", "Ship the cart today")
