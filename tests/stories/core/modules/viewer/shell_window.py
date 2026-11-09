from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data


def test_the_shell_reads_visible_keys_and_requests_activity_and_fitness_separately(new_story):
    story = new_story(fixture=UserBuilder)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        query = "environment=main&suite-presets.environment=main&suite-presets.page=home&person-presets.page=home"
        status, answer = window_data(server, cookie, window="viewer.shell", query=query)
        story.expect_rows(status == 200,
                          set(answer["keys"]) == {"environments", "active-environments", "usage", "phones", "bars", "update", "suite-presets", "person-presets", "branch"},
                          answer["keys"]["usage"]["code"] == 0,
                          answer["keys"]["suite-presets"]["code"] == 0,
                          answer["keys"]["person-presets"]["code"] == 0,
                          answer["declared"]["usage"]["reload_seconds"] == 10,
                          answer["declared"]["branch"]["reload_seconds"] == 30,
                          answer["declared"]["activity"]["tab"] == "activity")
        status, activity = window_data(server, cookie, keys="activity", window="viewer.shell", query=query + "&tab=activity")
        story.expect_rows(status == 200, set(activity["keys"]) == {"activity"}, activity["keys"]["activity"]["code"] == 0,
                          len(activity["keys"]["activity"]["value"]["rows"]) <= 30)
        status, fitness = window_data(server, cookie, keys="fitness", window="viewer.shell", query=query + f"&fitness.agent={story.agent.id}")
        story.expect_rows(status == 200, set(fitness["keys"]) == {"fitness"}, fitness["keys"]["fitness"]["code"] == 0)
        status, controls = window_data(server, cookie, keys="controls,skills,programs", window="viewer.shell",
                                       query=query + f"&controls.agent={story.agent.id}&skills.agent={story.agent.id}")
        story.expect_rows(status == 200, set(controls["keys"]) == {"controls", "skills", "programs"},
                          all(key["code"] == 0 for key in controls["keys"].values()))
