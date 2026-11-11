from core.modules.tasks.models.task_block_review import TaskBlockReview


class BlockReviewScope:
    """The blocked tasks the review of the main agent covers: every one, unless a module narrows them."""

    def covered(self, agent_id: int, tasks: tuple[TaskBlockReview, ...]) -> tuple[TaskBlockReview, ...]:
        return tasks
