from core.modules.agents.support.main_place import MainPlace
from core.modules.agents.support.project_environment import ProjectEnvironment

MAIN = 2
DEVELOPMENT = 5


def main_agent(agent_id: int, environment_id: int, is_running: bool) -> MainPlace:
    return MainPlace(agent_id, environment_id, is_running)


def test_agent_ones_environment_is_the_project_environment_once_agent_one_exists():
    assert ProjectEnvironment.first([MAIN, DEVELOPMENT], [main_agent(1, 5, False), main_agent(7, 2, True)]) == DEVELOPMENT


def test_before_agent_one_the_environment_whose_main_agent_runs_is_chosen_else_the_lowest():
    assert ProjectEnvironment.first([MAIN, DEVELOPMENT], [main_agent(78, 5, True)]) == DEVELOPMENT
    assert ProjectEnvironment.first([MAIN, DEVELOPMENT], [main_agent(78, 5, False)]) == MAIN
    assert ProjectEnvironment.first([], []) is None
