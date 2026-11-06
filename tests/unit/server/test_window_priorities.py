from core.base.viewer.window_priority import WindowPriority
from server.viewer.window_priorities import WindowPriorities


def priorities_with(declared: dict[str, WindowPriority]) -> WindowPriorities:
    priorities = WindowPriorities.__new__(WindowPriorities)
    priorities.declared = declared
    return priorities


def test_a_declared_window_has_its_priority_and_an_unknown_one_is_normal():
    priorities = priorities_with({"messages.chat": WindowPriority.FIRST})
    assert priorities.priority("messages.chat") is WindowPriority.FIRST
    assert priorities.priority("gone.window") is WindowPriority.NORMAL


def test_the_chat_declares_itself_first():
    from core.modules.messages.messages_module import MessagesModule

    chat = next(window for window in MessagesModule.windows if window.name == "messages.chat")
    assert chat.request_priority is WindowPriority.FIRST
