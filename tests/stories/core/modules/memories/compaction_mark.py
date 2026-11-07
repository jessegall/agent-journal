from core.testing.hook_samples import HookSamples
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.server_client import server_story


class CompactedMainAgent(StoryFixture):
    """The main agent of environment main, with a person beside it, compacted its context."""

    parent = BuilderWithUser

    def steps(self, story):
        story.hook("s-1", HookSamples.sample("compact"))
        story.run_listeners()


def test_a_compacting_main_agent_gets_a_compaction_mark_across_the_chat(new_story):
    story = new_story(fixture=CompactedMainAgent)
    story.expect_text("chat-mark list", "Conversation compacted", "compaction")


def test_the_viewer_reads_the_compaction_mark_and_its_declaration(new_story):
    story = new_story(fixture=CompactedMainAgent)
    with server_story(story, listener_thread_started=False) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        server.expect_viewer_status("/api/marks", 200, cookie, text='"full_width": true')
        marks = server.viewer_line_value(cookie, {"window": "messages.chat", "line": ["chat-mark", "main"], "environment": "main"})
        story.expect_rows([row["type"] for row in marks["rows"]] == ["memories.compaction"], detail=str(marks)[:600])
        server.expect_viewer_status("/api/marks", 200, cookie, text='"type": "memories.compaction"')
