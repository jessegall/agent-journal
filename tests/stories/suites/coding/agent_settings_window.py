from tests.stories.server.window_data_route import window_data
from tests.stories.suites.coding.support.main_controls_fixture import MainControlsActors, agent_actors, person_viewer
from tests.stories.support.story_checks import expect_value

AUTO_MODE = "journal.suites.coding.auto-mode"


def test_s49_fixture_person_changes_a_control_through_the_viewer_line_route_and_reads_it_back(new_story):
    story = new_story(fixture=MainControlsActors)
    with person_viewer(story) as viewer:
        viewer.set_setting(AUTO_MODE, "false")
        status, auto = window_data(viewer.server, viewer.cookie, keys="auto", window="coding.work-mode")
        expect_value((status, auto["keys"]["auto"]["value"]["value"]), (200, False))


def test_s45_fixture_a_refused_agent_write_leaves_the_value_the_person_sees(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_refusal(f"setting set {AUTO_MODE} off --environment main", "only a person changes", actor=story.agent)
    with person_viewer(story) as viewer:
        status, auto = window_data(viewer.server, viewer.cookie, keys="auto", window="coding.work-mode")
        expect_value((status, auto["keys"]["auto"]["value"]["value"]), (200, True))


def test_s01_fixture_a_person_change_in_one_story_is_not_seen_by_the_next(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_success(f"setting set {AUTO_MODE} off --environment main", actor=story.user)


def test_s01_fixture_a_story_starts_from_the_declared_default_of_auto_mode(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_success(f"setting show {AUTO_MODE} --environment main", "value: True", actor=story.user)


def limit_rows(viewer):
    status, answer = window_data(viewer.server, viewer.cookie, keys="limits", window="agents.agents")
    expect_value((status, answer["keys"]["limits"]["code"]), (200, 0))
    return answer["keys"]["limits"]["value"]["rows"]


def test_s49_counts_groups_and_retirement(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_success("agent limits --environment main", actor=story.agent)
    with person_viewer(story) as viewer:
        helper = next(row for row in limit_rows(viewer) if row["key"] == "helper")
        names = [row["profile"] for row in helper["profiles"]]
        expect_value((names.count("journal-merger"), names.count("journal-designer"), sum(row["kept"] for row in helper["profiles"]) <= helper["kept"]), (1, 1, True))
        worker = agent_actors(story)["worker"]
        story.expect_refusal(f'agent retire {worker.id} --reason "not needed"', "", actor=story.user)


def test_s51_agent_details_are_paged(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_success("agent cards --show all --kept --environment main", actor=story.agent)
    with person_viewer(story) as viewer:
        status, answer = window_data(viewer.server, viewer.cookie, keys="count-agents", window="agents.agents",
                                     query="environment=main&count-agents.role=helper&count-agents.page=1")
        cards = answer["keys"]["count-agents"]
        expect_value((status, cards["code"], cards["value"]["total"] >= 3, len(cards["value"]["rows"]) <= 25), (200, 0, True, True))
