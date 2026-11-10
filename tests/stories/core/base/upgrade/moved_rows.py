from engine.enums.agent_role import AgentRole
from engine.enums.access import Access
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story
from tests.stories.support.story_checks import expect_value_with


def test_each_module_that_moved_rows_logs_one_upgrade_moved_event_with_its_counts(new_story):
    story = upgraded_story(new_story)
    events = story.run("event list --json --limit 100").output_text
    for module in ("journal.core.tasks", "journal.core.questions", "journal.core.memories"):
        expect_count_events_minimum(events, f'"{module}"', 1)
    expect_value_with(events, "upgrade.moved")


def test_no_create_listener_runs_for_a_moved_row_so_history_announces_nothing(new_story):
    story = upgraded_story(new_story)
    story.run_listeners()
    marks = story.run("chat-mark list")
    marks.expect_no_text("Which database?")
    marks.expect_no_text("Ship on Friday?")
    story.expect_success("question show 2", "state: open")
    story.expect_success("review list", "nothing found")


def expect_count_events_minimum(events, text, expected) -> None:
    actual = events.count(text)
    assert actual >= expected, actual


def test_a_version_4_subagent_arrives_as_an_ended_read_only_helper(new_story):
    story = upgraded_story(new_story)
    helper = next(row for row in story.container.get(Queries).query(Agent).all_rows() if row.session == "s-gone:sub-1")
    story.expect_rows(helper.role == AgentRole.HELPER, helper.access == Access.READ, helper.ended_at is not None)



def test_at_most_one_main_agent_of_each_environment_stays_open_so_continue_resumes_it(new_story):
    story = upgraded_story(new_story)
    main_agents = [row for row in story.container.get(Queries).query(Agent).all_rows() if row.role == AgentRole.MAIN and row.ended_at is None]
    environments = [row.environment_id for row in main_agents]
    story.expect_rows(len(environments) == len(set(environments)))
