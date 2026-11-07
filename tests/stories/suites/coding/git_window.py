from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment


def test_the_git_window_reads_its_keys_together_then_pages_only_commits(new_story):
    story = new_story(fixture=BuilderWithUser)
    repository = repository_environment(story)
    repository.git("commit", "--allow-empty", "-m", "The next change")
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        status, answer = window_data(server, cookie, window="coding.git", query="environment=main&commits.limit=1")
        story.expect_rows(status == 200, set(answer["keys"]) == {"branches", "commits", "pulls"},
                          all(result["code"] == 0 for result in answer["keys"].values()),
                          answer["keys"]["commits"]["value"]["rows"][0]["subject"] == "The next change",
                          not answer["keys"]["commits"]["value"]["is_last_page"])
        status, older = window_data(server, cookie, keys="commits", window="coding.git", query="environment=main&commits.limit=1&commits.skip=1")
        story.expect_rows(status == 200, set(older["keys"]) == {"commits"}, older["keys"]["commits"]["value"]["is_last_page"],
                          older["keys"]["commits"]["value"]["rows"][0]["subject"] == "The first commit")
