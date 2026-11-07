from suites.coding.drivers.main.rules.main_file_write_rule import MainFileWriteRule
from suites.coding.modules.workers.rules.approved_plan_stop_rule import ApprovedPlanStopRule
from suites.coding.modules.workers.rules.delivered_work_stop_rule import DeliveredWorkStopRule
from suites.coding.modules.workers.rules.dispatch_allowance_rule import DispatchAllowanceRule
from suites.coding.modules.workers.rules.helper_allowance_rule import HelperAllowanceRule
from suites.coding.modules.workers.rules.idle_worker_stop_rule import IdleWorkerStopRule
from suites.coding.modules.workers.rules.merge_checkout_rule import MergeCheckoutRule
from suites.coding.modules.workers.rules.orphan_worktree_rule import OrphanWorktreeRule
from suites.coding.modules.workers.rules.small_batch_rule import SmallBatchRule
from suites.coding.modules.workers.rules.stopped_worker_run_rule import StoppedWorkerRunRule
from suites.coding.modules.workers.rules.unmerged_worker_rule import UnmergedWorkerRule
from suites.coding.modules.workers.rules.unstarted_worker_rule import UnstartedWorkerRule
from suites.coding.modules.workers.rules.worker_file_rule import WorkerFileRule
from suites.coding.modules.workers.rules.workers_out_rule import WorkersOutRule
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.support.story_checks import expect_absent_value

ELEVEN_RULES = [SmallBatchRule, UnstartedWorkerRule, StoppedWorkerRunRule, ApprovedPlanStopRule, DeliveredWorkStopRule, WorkerFileRule, MergeCheckoutRule,
                OrphanWorktreeRule, WorkersOutRule, UnmergedWorkerRule, IdleWorkerStopRule]
OTHER_MAIN_RULES = [DispatchAllowanceRule, HelperAllowanceRule, MainFileWriteRule]


def test_main_driver_keeps_all_eleven_rules():
    expect_absent_value([rule.name for rule in [*ELEVEN_RULES, *OTHER_MAIN_RULES]
                         if not {"coding.builder", "coding.orchestrator", "coding.main"} <= set(rule.drivers)])


def test_s46_the_main_driver_is_registered_and_a_person_chooses_it(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success("driver choose coding.main --environment main", actor=story.user)
    story.expect_text("suite current --environment main", "main: coding.main", actor=story.user)
