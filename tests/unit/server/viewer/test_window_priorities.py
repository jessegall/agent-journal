from engine.enums.window_priority import WindowPriority
from engine.module.module import Module
from engine.viewer.window_declaration import WindowDeclaration
from engine.viewer.window_extension import WindowExtension
from engine.viewer.window_key import WindowKey
from engine.enums.window_loading import WindowLoading
from types import SimpleNamespace
from server.viewer.window_priorities import WindowPriorities


def priorities_with(declared: dict[str, WindowPriority]) -> WindowPriorities:
    priorities = WindowPriorities.__new__(WindowPriorities)
    priorities.declared = declared
    return priorities


def test_a_declared_window_has_its_priority_and_an_unknown_one_is_normal():
    priorities = priorities_with({"messages.chat": WindowPriority.FIRST})
    assert priorities.priority("messages.chat") is WindowPriority.FIRST
    assert priorities.priority("gone.window") is WindowPriority.NORMAL


class Notes(Module):
    windows = [WindowDeclaration("notes.board", "Notes", "", WindowLoading.DOCUMENT,
                                 request_priority=WindowPriority.FIRST, keys=[WindowKey("notes", "note list")])]


class Comments(Module):
    window_extensions = [WindowExtension("notes.board", keys=[WindowKey("comments", "comment list")])]


def test_data_routes_use_the_extensions_of_installed_modules():
    priorities = WindowPriorities.__new__(WindowPriorities)
    priorities.finder = SimpleNamespace(modules=lambda: [Notes, Comments])
    window = priorities.window("notes.board")
    assert window is not None
    assert [key.name for key in window.keys] == ["notes", "comments"]
    assert priorities.priority("notes.board") is WindowPriority.FIRST
    assert len(Notes.windows[0].keys) == 1
