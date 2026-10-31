from core.base.database.database import Database
from core.base.registry.registry import Registry
from tests.stories.core.support.fixtures import UserJoined


def test_the_chat_module_declares_the_fault_mark_under_the_journal_group(new_story):
    story = new_story(fixture=UserJoined)
    marks = [mark for mark in Registry.read(story.container.get(Database)).marks if mark.module == "journal.core.chat"]
    assert [(mark.type, mark.family, mark.group, mark.shipped) for mark in marks] == [("chat.fault", "chat.faults", "journal", True)]
