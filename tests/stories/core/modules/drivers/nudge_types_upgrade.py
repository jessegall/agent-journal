import re

from core.base.database.database import Database
from core.base.registry.registry import Registry
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value

OLD_NAMES = (("info", "instruction"), ("steering", "nudge"))


def old_registry(story) -> None:
    connection = story.container.get(Database).connection
    entries = connection.execute("SELECT entries FROM registry WHERE id = 1").fetchone()["entries"]
    for new, old in OLD_NAMES:
        entries = re.sub(rf'("type":\s*"){new}"', rf'\g<1>{old}"', entries)
    connection.execute("UPDATE registry SET entries = ?, fingerprint = 'old' WHERE id = 1", [entries])


def registered_types(story) -> set[str]:
    return {nudge.type for nudge in Registry.read(story.container.get(Database)).nudges}


def test_a_database_that_holds_the_old_type_names_holds_the_new_ones_after_a_sync(new_story):
    story = new_story(fixture=UserJoined)
    old_registry(story)
    expect_registered_types(story, {"instruction", "nudge", "refusal", "safety_refusal"})
    code, _ = story.synced()
    expect_value(code, 0)
    expect_registered_types(story, {"info", "steering", "refusal", "safety_refusal"})


def test_the_nudge_list_names_the_new_types_after_the_sync(new_story):
    story = new_story(fixture=UserJoined)
    old_registry(story)
    story.synced()
    story.expect_absent("nudge list --json", '"type": "instruction"', actor=story.user)
    story.expect_text("nudge list --json", '"type": "steering"', '"type": "info"', actor=story.user)


def expect_registered_types(story, expected) -> None:
    actual = registered_types(story)
    assert actual == expected, actual
