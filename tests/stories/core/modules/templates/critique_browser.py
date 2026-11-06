from tests.stories.core.modules.templates.support.sending_templates import SendingTemplates
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_critique_appears_in_plan_comments_not_chat(new_story, tmp_path):
    story = new_story(fixture=SendingTemplates)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        server.viewer_line_value(cookie, {"window": "messages.chat", "environment": "main", "line": ["template", "send", "1", "--on=plan:1", "--set=agents=2 agents", "--set=size=a normal read"]})
        expect_browser(server, "critiqueComment.browser.mjs", [str(tmp_path / "critique-comment.png")])
