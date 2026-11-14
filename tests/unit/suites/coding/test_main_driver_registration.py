from suites.coding.modules.workers.rules.checkout_write_code_rule import CheckoutWriteCodeRule
from suites.coding.modules.workers.rules.delivered_work_stop_rule import DeliveredWorkStopRule
from suites.coding.modules.workers.rules.dispatch_allowance_rule import DispatchAllowanceRule
from suites.coding.modules.workers.rules.inactive_worker_stop_rule import InactiveWorkerStopRule
from suites.coding.modules.workers.rules.merge_checkout_rule import MergeCheckoutRule
from suites.coding.modules.workers.rules.orphan_worktree_rule import OrphanWorktreeRule
from suites.coding.modules.workers.rules.readonly_helper_allowance_rule import ReadonlyHelperAllowanceRule
from suites.coding.modules.workers.rules.small_batch_rule import SmallBatchRule
from suites.coding.modules.workers.rules.unmerged_worker_rule import UnmergedWorkerRule
from suites.coding.modules.workers.rules.unstarted_worker_rule import UnstartedWorkerRule
from suites.coding.modules.workers.rules.worker_file_rule import WorkerFileRule
from suites.coding.modules.workers.rules.workers_out_rule import WorkersOutRule
from tests.stories.support.story_checks import expect_absent_value

TICK_AND_STOP_RULES = [SmallBatchRule, UnstartedWorkerRule, DeliveredWorkStopRule, WorkerFileRule, MergeCheckoutRule,
                OrphanWorktreeRule, WorkersOutRule, UnmergedWorkerRule, InactiveWorkerStopRule]
SECOND_MAIN_RULES = [DispatchAllowanceRule, ReadonlyHelperAllowanceRule, CheckoutWriteCodeRule]


def test_main_driver_keeps_all_its_rules():
    expect_absent_value([rule.name for rule in [*TICK_AND_STOP_RULES, *SECOND_MAIN_RULES]
                         if list(rule.drivers) != ["coding.main"]])
