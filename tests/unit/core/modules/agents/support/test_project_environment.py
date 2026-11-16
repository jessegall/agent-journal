from core.modules.agents.models.agent import Agent
from core.modules.agents.support.project_environment import ProjectEnvironment
from core.modules.environments.models.environment import Environment

MAIN = Environment(id=2, creator_id=0, name="main", folder="/project", branch="main")
DEVELOPMENT = Environment(id=5, creator_id=0, name="development", folder="/project", branch="version-5")


def main_agent(agent_id: int, environment_id: int, is_running: bool) -> Agent:
    return Agent(id=agent_id, actor_id=agent_id, environment_id=environment_id, creator_id=0, session=f"s-{agent_id}", program="claude", role="main",
                 ended_at=None if is_running else MAIN.creation_timestamp())


def test_agent_ones_environment_is_the_project_environment_once_agent_one_exists():
    assert ProjectEnvironment.first([MAIN, DEVELOPMENT], {1: main_agent(1, 5, False), 7: main_agent(7, 2, True)}) == DEVELOPMENT


def test_before_agent_one_the_environment_whose_main_agent_runs_is_chosen_else_the_lowest():
    assert ProjectEnvironment.first([MAIN, DEVELOPMENT], {78: main_agent(78, 5, True)}) == DEVELOPMENT
    assert ProjectEnvironment.first([MAIN, DEVELOPMENT], {78: main_agent(78, 5, False)}) == MAIN
    assert ProjectEnvironment.first([], {}) is None
