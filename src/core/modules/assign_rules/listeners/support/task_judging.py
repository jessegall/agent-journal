from engine.actor.actor import Actor
from engine.command.bus import Bus
from core.modules.assign_rules.commands.judge_task.judge_task import JudgeTask
from core.modules.assign_rules.commands.judge_task.record_failed_decision import RecordFailedDecision


class TaskJudging:
    """Judges one task after the write that made or changed it is committed; a judging that fails is undone on
    its own and recorded as FAILED with its reason, so the task stays as it was made."""

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def judge(self, task_id: int, environment_id: int, cause_id: int) -> None:
        try:
            self.bus.run(JudgeTask(task_id), Actor.core(), environment_id=environment_id, cause_id=cause_id)
        except Exception as failure:
            self.bus.run(RecordFailedDecision(task_id, str(failure) or type(failure).__name__), Actor.core(), environment_id=environment_id, cause_id=cause_id)
            raise
