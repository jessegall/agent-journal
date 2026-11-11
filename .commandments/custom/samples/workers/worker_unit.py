from core.modules.plans.support.plan_assignee import PlanAssignee


class SampleWorkerHelper:
    def plan_worker(self, plan):
        # @sin architecture_workers_worker_plan_read_outside_work_units
        return PlanAssignee.agent_id(plan)

    def deliver(self, worktree):
        # @sin architecture_workers_worktree_delivered_outside_commit_and_merge_request
        return worktree.moved(WorktreeLifecycle.deliver)

    def merge_request(self):
        # @sin architecture_workers_merge_request_row_built_outside_its_scope
        return MergeAsk(creator_id=1)

    def worker_run(self, checkpoints, context):
        # @sin architecture_workers_worker_run_started_outside_start_worker_runs
        return checkpoints.reach_worker(1, 2, (3,), context)

    def early(self, reach):
        # @sin architecture_plans_checkpoint_reach_flag_read
        return reach.is_early

    def line(self):
        # @sin architecture_workers_delivery_command_in_a_text
        return "fix it and deliver again"

    def source(self, reach):
        # @righteous architecture_plans_checkpoint_reach_flag_read
        return reach.source

    def plan(self, units, worker_id):
        # @righteous architecture_workers_worker_plan_read_outside_work_units
        return units.unit(worker_id).plan

    def stay(self, worktree):
        # @righteous architecture_workers_worktree_delivered_outside_commit_and_merge_request
        return worktree.moved(WorktreeLifecycle.advance)

    def checked(self, scope, worker_id):
        # @righteous architecture_workers_merge_request_row_built_outside_its_scope
        return scope.checked(worker_id, "the cart")

    def runs(self, bus, worktree, context):
        # @righteous architecture_workers_worker_run_started_outside_start_worker_runs
        return bus.dispatch(StartWorkerRuns(worktree.id, worktree.commit_short_id), context)

    def words(self):
        # @righteous architecture_workers_delivery_command_in_a_text
        return "commit, then ask for the merge with journal worker ask-merge"
