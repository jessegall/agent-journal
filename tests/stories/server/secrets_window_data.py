from tests.stories.core.modules.secrets.support.secret_fixtures import SecretMade
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data


def test_secrets_window_reads_the_secrets_and_none_that_was_deleted(new_story):
    story = new_story(fixture=SecretMade)
    story.expect_success('secret make "Old key"', actor=story.agent)
    story.expect_success("secret delete 2", actor=story.user)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        status, answer = window_data(server, cookie, window="secrets.secrets")
        secrets = answer["keys"]["secrets"]
        story.expect_rows(status == 200, secrets["code"] == 0, [row["title"] for row in secrets["value"]["rows"]] == ["Github"])
