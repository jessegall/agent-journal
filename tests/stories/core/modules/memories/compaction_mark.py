import json

from core.base.command.bus import Bus
from core.base.module.module_actors import ModuleActors
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.memories.listeners.memory_mark_listener import MEMORIES_MODULE
from core.modules.memories.models.enums.memory_mark_type import MemoryMarkType
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant
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


def test_the_newest_page_of_chat_marks_leaves_an_older_compaction_mark_for_a_page_behind_it(new_story):
    story = new_story(fixture=CompactedMainAgent)
    for number in range(55):
        story.container.get(Bus).run(ShowMark(MemoryMarkType.MEMORY, MemoryMarkVariant.GIVEN, f"given:{number}", f"Fact {number}", agent_id=story.agent.id), story.container.get(ModuleActors).actor(MEMORIES_MODULE), environment_id=1)
    first = json.loads(story.run("chat-mark main --environment main --limit 50 --json", actor=story.user).output_text)["rows"]
    story.expect_rows(len(first) == 50, "memories.compaction" not in {row["type"] for row in first}, detail=str(len(first)))
    older = story.run(f"chat-mark main --environment main --before-id {min(row['id'] for row in first)} --json", actor=story.user)
    behind = json.loads(older.output_text).get("rows", [])
    story.expect_rows("memories.compaction" in {row["type"] for row in behind}, detail=older.output_text[:300])
