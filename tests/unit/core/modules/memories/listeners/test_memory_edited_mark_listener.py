from types import SimpleNamespace

from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.memories.listeners.memory_edited_mark_listener import MemoryEditedMarkListener
from core.modules.memories.listeners.memory_weighed_mark_listener import MemoryWeighedMarkListener
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant

MEMORY_ID = 12


def marks_shown(listener_class: type, data: dict[str, tuple[object, object]]) -> list[ShowMark]:
    commands: list[ShowMark] = []
    bus = SimpleNamespace(scopes=SimpleNamespace(environment_id=1), run=lambda command, actor, cause_id: commands.append(command))
    listener = listener_class(bus, SimpleNamespace(actor=lambda module: SimpleNamespace()), SimpleNamespace(), SimpleNamespace())
    listener.handle(SimpleNamespace(), SimpleNamespace(id=90, row_id=MEMORY_ID, command="memory edit", data=data))
    return commands


def test_an_edit_of_the_text_shows_one_edited_mark_with_the_new_text():
    commands = marks_shown(MemoryEditedMarkListener, {"text": ("old words", "new words")})
    assert [(command.variant, command.text, command.detail, command.row_id) for command in commands] == [(MemoryMarkVariant.EDITED, f"Memory {MEMORY_ID}: edited", "new words", MEMORY_ID)]


def test_an_edit_that_also_sets_a_weight_names_the_weight_in_the_same_mark():
    commands = marks_shown(MemoryEditedMarkListener, {"text": ("old words", "new words"), "weight": (3, 8)})
    assert [command.text for command in commands] == [f"Memory {MEMORY_ID}: edited, weight set to 8"]


def test_a_change_that_leaves_the_text_alone_shows_no_edited_mark():
    assert marks_shown(MemoryEditedMarkListener, {"weight": (3, 8)}) == []


def test_the_weighed_listener_leaves_an_edit_of_the_text_to_the_edited_mark():
    assert marks_shown(MemoryWeighedMarkListener, {"text": ("old words", "new words"), "weight": (3, 8)}) == []
    assert [command.text for command in marks_shown(MemoryWeighedMarkListener, {"weight": (3, 8)})] == [f"Memory {MEMORY_ID}: weight set to 8"]
