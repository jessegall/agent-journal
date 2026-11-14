from collections.abc import Callable, Sequence

from core.modules.agents.models.agent import Agent

UNPLACED = -1
MAIN_AGENT_KEY = "main"
AGENTS_KEY = "agents"


class DecisionBatch:
    """The decisions of one step. It reads once what each agent had at the start and keeps the order of the
    tasks given in the step, so a later decision counts them before any assignment is written."""

    def __init__(self) -> None:
        self.start_open_tasks: dict[int, int] = {}
        self.start_newest_assignments: dict[int, str] = {}
        self.given_actor_ids: list[int] = []
        self.start_main_agents: dict[str, Agent | None] = {}
        self.start_agents: dict[str, Sequence[Agent]] = {}

    def restarted(self) -> "DecisionBatch":
        batch = DecisionBatch()
        batch.start_open_tasks, batch.start_newest_assignments = dict(self.start_open_tasks), dict(self.start_newest_assignments)
        batch.start_main_agents, batch.start_agents = dict(self.start_main_agents), dict(self.start_agents)
        return batch

    def main_agent(self, main_agent_reader: Callable[[], Agent | None]) -> Agent | None:
        if MAIN_AGENT_KEY not in self.start_main_agents:
            self.start_main_agents[MAIN_AGENT_KEY] = main_agent_reader()
        return self.start_main_agents[MAIN_AGENT_KEY]

    def agents(self, agents_reader: Callable[[], Sequence[Agent]]) -> Sequence[Agent]:
        if AGENTS_KEY not in self.start_agents:
            self.start_agents[AGENTS_KEY] = agents_reader()
        return self.start_agents[AGENTS_KEY]

    def open_task_count(self, actor_id: int, open_task_reader: Callable[[], int]) -> int:
        if actor_id not in self.start_open_tasks:
            self.start_open_tasks[actor_id] = open_task_reader()
        return self.start_open_tasks[actor_id] + self.given_actor_ids.count(actor_id)

    def last_place(self, actor_id: int) -> int:
        places = [place for place, given_id in enumerate(self.given_actor_ids) if given_id == actor_id]
        return places[-1] if places else UNPLACED

    def newest_assignment(self, actor_id: int, assignment_reader: Callable[[], str]) -> str:
        if actor_id not in self.start_newest_assignments:
            self.start_newest_assignments[actor_id] = assignment_reader()
        return self.start_newest_assignments[actor_id]

    def give(self, actor_id: int) -> None:
        self.given_actor_ids.append(actor_id)
