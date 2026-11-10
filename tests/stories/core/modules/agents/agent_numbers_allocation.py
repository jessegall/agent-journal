from tests.stories.core.support.agent_labels import agent_number
from core.modules.agents.support.agent_numbers import AgentNumbers
from tests.stories.core.modules.agents.support.numbered_agents import listed, agent_numbers, started_worker
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.support.fixtures import MainEnvironment

RETIRE_REASON = '--reason "Its job is done"'


def number_of(story, agent_id: int, environment: str = "main") -> int:
    return listed(story, environment)[agent_id]["number"]


def test_the_number_of_a_retired_agent_is_never_given_again(new_story):
    story = new_story(fixture=UserBuilder)
    workers = [started_worker(story, f"s-{session}", "main", story.agent.id) for session in range(2, 8)]
    story.expect_rows([number_of(story, worker) for worker in workers] == [2, 3, 4, 5, 6, 7])
    story.expect_success(f"agent end {workers[-1]}", actor=story.user)
    story.expect_success(f"agent retire {agent_number(story, workers[-1])} {RETIRE_REASON}", actor=story.user)
    story.expect_rows(number_of(story, started_worker(story, "s-8", "main", story.agent.id)) == 8)


def test_two_starts_that_read_the_same_highest_number_get_different_numbers_and_neither_is_refused(new_story, monkeypatch):
    story = new_story(fixture=UserBuilder)
    first = started_worker(story, "s-2", "main", story.agent.id)
    read_numbers = []
    next_number = AgentNumbers.next_number

    def stale_number_first(numbers, environment_id, role):
        read_numbers.append(number_of(story, first) if not read_numbers else next_number(numbers, environment_id, role))
        return read_numbers[-1]

    monkeypatch.setattr(AgentNumbers, "next_number", stale_number_first)
    second = started_worker(story, "s-3", "main", story.agent.id)
    story.expect_rows(number_of(story, first) == 2, number_of(story, second) == 3, read_numbers == [2, 3], detail=str(read_numbers))


def test_a_helper_started_before_any_main_gets_two_and_the_first_main_session_is_agent_one(new_story):
    story = new_story(fixture=MainEnvironment)
    helper = story.new_row_id("agent start s-9 claude worker --environment main")
    main = story.new_row_id("agent start s-1 claude main --environment main")
    rows = agent_numbers(story)
    story.expect_rows(rows[helper] == 2, rows[main] == 1, detail=str(rows))
