from collections.abc import Callable

NEVER_GIVEN = -1


class DecisionBatch:
    """The decisions of one step. It reads once what each agent had at the start and keeps the order of the
    tasks given in the step, so a later decision counts them before any assignment is written."""

    def __init__(self) -> None:
        self.open_tasks_at_start: dict[int, int] = {}
        self.newest_assignment_at_start: dict[int, str] = {}
        self.given_actor_ids: list[int] = []

    def open_task_count(self, actor_id: int, open_task_reader: Callable[[], int]) -> int:
        if actor_id not in self.open_tasks_at_start:
            self.open_tasks_at_start[actor_id] = open_task_reader()
        return self.open_tasks_at_start[actor_id] + self.given_actor_ids.count(actor_id)

    def last_place(self, actor_id: int) -> int:
        places = [place for place, given_id in enumerate(self.given_actor_ids) if given_id == actor_id]
        return places[-1] if places else NEVER_GIVEN

    def newest_assignment(self, actor_id: int, assignment_reader: Callable[[], str]) -> str:
        if actor_id not in self.newest_assignment_at_start:
            self.newest_assignment_at_start[actor_id] = assignment_reader()
        return self.newest_assignment_at_start[actor_id]

    def give(self, actor_id: int) -> None:
        self.given_actor_ids.append(actor_id)
