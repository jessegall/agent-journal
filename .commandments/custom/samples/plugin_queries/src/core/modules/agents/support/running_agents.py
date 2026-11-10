from engine.query.conditions.is_null import IsNull
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.task import Task


def read_running_agents(queries):
    # @sin architecture_agents_running_agents_by_hand
    return queries.query(Agent).matching(IsNull("ended_at")).all_rows()


def read_running_helpers(queries):
    # @sin architecture_agents_running_agents_by_hand
    return queries.query(Agent).filter(role="helper").matching(IsNull("ended_at")).all_rows()


def read_open_tasks(queries):
    # @righteous architecture_agents_running_agents_by_hand
    return queries.query(Task).matching(IsNull("ended_at")).all_rows()


def read_running(agents):
    # @righteous architecture_agents_running_agents_by_hand
    return agents.running().all_rows()
