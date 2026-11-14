from engine.query.queries import Queries
from core.modules.processes.models.process import Process
from core.modules.triggers.models.trigger_action_run import TriggerActionRun
from tests.stories.core.modules.processes.support.process_samples import end_run, ended_run, install_runner
from tests.stories.core.modules.triggers.trigger_details import AgentsEnableTriggers
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.expectations.expect_row import expect_row
from core.modules.processes.models.enums.process_setting import ProcessSetting

TEST_ROWS_REASON = "the test reads every row it checks"






def test_an_old_trigger_run_is_removed_with_its_process(played):
    story = install_runner(played(AgentsEnableTriggers))
    story.expect_success(f"setting set {ProcessSetting.PROCESSES_KEPT.key} 1 --environment main", actor=story.agent)
    story.expect_success('''trigger make cart "Mind the cart" --extra-actions '[{"type":"run","target":"pwd"}]' ''', actor=story.agent)
    story.hook("s-1", HookSamples.prompt("Fix the cart"))
    story.run_listeners()
    queries = story.container.get(Queries)
    process = next(queries.query(Process).every_row(TEST_ROWS_REASON))
    end_run(story, process, "old\n")
    ended_run(story, "make recent", "recent\n")
    story.expect_rows(not queries.query(Process).filter(id=process.id).exists(),
                      not queries.query(TriggerActionRun).filter(process_id=process.id).exists())
    story.run_listeners()
