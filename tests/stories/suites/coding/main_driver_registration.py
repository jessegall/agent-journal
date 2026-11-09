from suites.coding.drivers.main.rules.main_file_write_rule import MainFileWriteRule
from suites.coding.modules.workers.rules.approved_plan_stop_rule import ApprovedPlanStopRule
from suites.coding.modules.workers.rules.delivered_work_stop_rule import DeliveredWorkStopRule
from suites.coding.modules.workers.rules.dispatch_allowance_rule import DispatchAllowanceRule
from suites.coding.modules.workers.rules.helper_allowance_rule import HelperAllowanceRule
from suites.coding.modules.workers.rules.inactive_worker_stop_rule import InactiveWorkerStopRule
from suites.coding.modules.workers.rules.merge_checkout_rule import MergeCheckoutRule
from suites.coding.modules.workers.rules.orphan_worktree_rule import OrphanWorktreeRule
from suites.coding.modules.workers.rules.small_batch_rule import SmallBatchRule
from suites.coding.modules.workers.rules.stopped_worker_run_rule import StoppedWorkerRunRule
from suites.coding.modules.workers.rules.unmerged_worker_rule import UnmergedWorkerRule
from suites.coding.modules.workers.rules.unstarted_worker_rule import UnstartedWorkerRule
from suites.coding.modules.workers.rules.worker_file_rule import WorkerFileRule
from suites.coding.modules.workers.rules.workers_out_rule import WorkersOutRule
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder, UserBuilder
from tests.stories.suites.coding.assigner_plans import StartedPlanTasks
from tests.stories.support.story_checks import expect_absent_value

ELEVEN_RULES = [SmallBatchRule, UnstartedWorkerRule, StoppedWorkerRunRule, ApprovedPlanStopRule, DeliveredWorkStopRule, WorkerFileRule, MergeCheckoutRule,
                OrphanWorktreeRule, WorkersOutRule, UnmergedWorkerRule, InactiveWorkerStopRule]
OTHER_MAIN_RULES = [DispatchAllowanceRule, HelperAllowanceRule, MainFileWriteRule]


def test_main_driver_keeps_all_eleven_rules():
    expect_absent_value([rule.name for rule in [*ELEVEN_RULES, *OTHER_MAIN_RULES]
                         if list(rule.drivers) != ["coding.main"]])


def test_s46_the_main_driver_is_registered_and_a_person_chooses_it(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success("driver choose coding.main --environment main", actor=story.user)
    story.expect_text("suite current main", "main: coding.main", actor=story.user)


def test_auto_delivery_after_close_cancel_block_release_under_the_main_driver(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    story.expect_success("driver choose coding.main --environment main")
    story.run('task make "Second" --environment main', actor=story.agent)
    story.expect_success('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    story.expect_text("task show 2", "state: started", f"holder_id: {story.agent.id}", actor=story.agent)


def test_plan_delivery_uses_current_main_policy(new_story):
    story = new_story(fixture=StartedPlanTasks)
    story.expect_success("driver choose coding.main --environment main")
    story.expect_success('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    story.expect_text("task show 2", "state: started", actor=story.agent)
    story.expect_text("task show 3", "state: open", actor=story.agent)


def test_plan_delivery_stops_when_auto_is_turned_off_under_the_main_driver(new_story):
    story = new_story(fixture=StartedPlanTasks)
    story.expect_success("setting set journal.suites.coding.auto-mode off --environment main")
    story.expect_success("driver choose coding.main --environment main")
    story.expect_success('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    story.expect_text("task show 2", "state: open", actor=story.agent)


def test_auto_off_delivers_nothing_to_the_main_agent_under_the_main_driver(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    story.expect_success("driver choose coding.main --environment main")
    story.expect_success("setting set journal.suites.coding.auto-mode off --environment main")
    story.run('task make "Second" --environment main', actor=story.agent)
    story.expect_success('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    story.expect_text("task show 2", "state: open", actor=story.agent)
