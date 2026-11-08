from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.settings.support.setting_revision import SettingRevision
from suites.coding.modules.workers.commands.record_followup_step.record_followup_step import RecordFollowupStep
from suites.coding.modules.workers.commands.record_merge_followup.record_merge_followup import RecordMergeFollowup
from suites.coding.modules.workers.commands.support.worktree_commands import WorktreeCommands
from suites.coding.modules.workers.models.merge_followup import DONE_STEP, UNCERTAIN_STEP, MergeFollowup
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_settings import MERGE_COMMANDS, MERGE_COMMANDS_NAME


class MergeFollowups:
    """The required commands after a merge as a durable plan: saved as they stand when git merges, run one
    step at a time with each result saved at once, resumed from the saved plan and never from the setting,
    and a merge into the same checkout waits until the plan is finished. A step that ran out of time is
    uncertain: it is not run again unless the main agent says what it checked."""

    def __init__(self, queries: Queries, bus: Bus, commands: WorktreeCommands, settings: SettingValues, revision: SettingRevision) -> None:
        self.queries, self.bus, self.commands, self.settings, self.revision = queries, bus, commands, settings, revision

    def planned(self, worktree_id: int) -> MergeFollowup | None:
        return self.queries.query(MergeFollowup).filter(worktree_id=worktree_id).newest().first()

    def waiting_elsewhere(self, worktree: Worktree) -> MergeFollowup | None:
        pending = (followup for followup in self.queries.query(MergeFollowup).all_rows()
                   if followup.worktree_id != worktree.id and not followup.finished)
        return next(pending, None)

    def snapshot(self, worktree: Worktree, folder: str, commit_before: str, commit_after: str, context: Context) -> MergeFollowup | None:
        commands = tuple(self.settings.texts(MERGE_COMMANDS))
        if not commands:
            return None
        return self.bus.run_with_context(RecordMergeFollowup(worktree.id, folder, commit_before, commit_after, self.revision.current(MERGE_COMMANDS), commands), context)

    def run(self, followup: MergeFollowup, reconciled: str, context: Context) -> MergeFollowup:
        for index, line in enumerate(followup.commands):
            result = followup.results[index]
            if result == DONE_STEP:
                continue
            if result == UNCERTAIN_STEP and not reconciled:
                raise Refusal(f"step {index + 1} of the required commands, {line!r}, ended uncertain and may have done part of its work",
                              "check what it did, then merge again with --reconcile '<what you checked>'")
            if result == UNCERTAIN_STEP:
                followup = self.bus.run_with_context(RecordFollowupStep(followup.id, index, DONE_STEP), context)
                continue
            outcome = self.commands.step(followup.folder, followup.target_branch, line, (), MERGE_COMMANDS_NAME)
            followup = self.bus.run_with_context(RecordFollowupStep(followup.id, index, outcome.state), context)
            if outcome.state != DONE_STEP:
                raise Refusal(outcome.reason, outcome.suggestion)
        return followup
