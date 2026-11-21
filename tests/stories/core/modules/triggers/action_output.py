from engine.query.queries import Queries
from core.modules.processes.models.process import Process
from core.modules.triggers.models.trigger_action_run import TriggerActionRun
from tests.stories.core.modules.processes.support.process_samples import end_run, ended_run, install_runner
from tests.stories.core.modules.triggers.trigger_details import AgentsEnableTriggers
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.expectations.expect_row import expect_row
from core.modules.processes.models.enums.process_setting import ProcessSetting

TEST_ROWS_REASON = "the test reads every row it checks"


def test_saved_words_can_start_with_dashes(new_story):
    story = new_story(fixture=AgentsEnableTriggers)
    story.expect_success('trigger make cart "Mind the cart"', actor=story.agent)
    story.expect_success('trigger edit 1 --phrases=--force --phrases=--hard --phrases=cart', actor=story.agent)
    story.expect_text('trigger list --json', '"phrases": ["--force", "--hard", "cart"]', actor=story.agent)
