from tests.stories.engine.upgrade.support.fixture_upgrade import upgraded_story
from tests.stories.fixtures.worker_recovery import prepare_worker_recovery
from tests.stories.suites.coding.modules.workers.support.recovery_report import expect_recovery_report


def test_the_upgrade_names_unfinished_work_to_send_again_and_keeps_all_history_in_the_backup(new_story):
    story = upgraded_story(new_story, prepare=prepare_worker_recovery)
    expect_recovery_report(story)
