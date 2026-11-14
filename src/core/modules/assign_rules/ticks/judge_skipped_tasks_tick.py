from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from core.modules.assign_rules.commands.record_assign_decision.judge_skipped_tasks import JudgeSkippedTasks


class JudgeSkippedTasksTick:
    """Every minute, the tasks a rule was skipped for and the free tasks with no decision are judged again."""

    def __call__(self, container: Container) -> bool:
        return container.get(Bus).run(JudgeSkippedTasks(), Actor.core()) > 0
