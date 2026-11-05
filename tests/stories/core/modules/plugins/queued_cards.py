import json

from core.modules.plugins.ticks.plugin_card_reading import PluginCardReading
from tests.stories.core.modules.plugins.hooks import LISTING_SAMPLE, installed_story
from tests.stories.support.story_checks import expect_value

CARD = {"kind": "state", "key": "queued", "label": "Queue was judged"}


def queued_card(story, name: str, fields: dict[str, object]) -> None:
    queue = story.home.folder / "plugin-data" / "sample" / "queue"
    queue.mkdir(parents=True, exist_ok=True)
    (queue / name).write_text(json.dumps({"v": 1, "env": "main", "agent": story.agent.id, "cards": [CARD], "judged_ms": 1234, **fields}))


def test_a_queued_card_shows_on_the_tick_with_its_duration_before_any_hook(new_story):
    story = installed_story(new_story)
    story.hook("s-1", LISTING_SAMPLE)
    queued_card(story, "1.json", {})
    PluginCardReading()(story.container)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1 --columns figure,text", "sample: Queue was judged  1.2 s", actor=story.user)


def test_a_queued_line_still_reaches_the_agent_at_its_next_hook_after_the_card_showed(new_story):
    story = installed_story(new_story)
    story.hook("s-1", LISTING_SAMPLE)
    queued_card(story, "1.json", {"tell": "one sin in b.py"})
    PluginCardReading()(story.container)
    story.run_listeners()
    story.expect_hook_allowed("s-1", LISTING_SAMPLE, "[plugin sample] one sin in b.py")


def test_a_card_read_on_the_tick_is_not_kept_a_second_time_by_the_next_hook(new_story):
    story = installed_story(new_story)
    story.hook("s-1", LISTING_SAMPLE)
    queued_card(story, "1.json", {"tell": "one sin in b.py"})
    PluginCardReading()(story.container)
    story.hook("s-1", LISTING_SAMPLE)
    story.run_listeners()
    outcome = story.run("plugin record sample", actor=story.user)
    expect_value(outcome.output_text.count("Queue was judged"), 1)


def test_a_queued_file_with_no_agent_waits_for_a_hook(new_story):
    story = installed_story(new_story)
    story.hook("s-1", LISTING_SAMPLE)
    queue = story.home.folder / "plugin-data" / "sample" / "queue"
    queue.mkdir(parents=True, exist_ok=True)
    (queue / "1.json").write_text(json.dumps({"v": 1, "env": "main", "cards": [CARD]}))
    PluginCardReading()(story.container)
    story.expect_no_text("chat-mark list --environment 1 --columns figure,text", "Queue was judged", actor=story.user)
    story.hook("s-1", LISTING_SAMPLE)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1 --columns figure,text", "sample: Queue was judged", actor=story.user)
