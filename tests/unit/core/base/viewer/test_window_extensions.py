from core.base.module.module import Module
from core.base.module.window_extensions import WindowExtensions
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_extension import WindowExtension
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_source import WindowSource
from core.base.viewer.window_tab import WindowTab
from core.base.viewer.window_key import WindowKey


class NotesModule(Module):
    name = "notes"
    window_extensions = [WindowExtension("agents.agents", reads=["note list"], events=["note.*"],
                                         tabs=[WindowTab("notes", "Notes", "note list", component="/modules/notes/agent-notes.js")],
                                         sources=[WindowSource("progress", "note list", ["note.*"])], links={"notes": "notes.board"},
                                         key_events={"agents": ["note.*"]},
                                         keys=[WindowKey("notes", "note list", events=["note.*"])])]


def test_an_installed_module_supplies_window_behavior_without_changing_the_owner():
    original = WindowDeclaration("agents.agents", "Agents", "agent list", WindowLoading.DOCUMENT, reads=["agent list"])
    extended = WindowExtensions([NotesModule]).extend(original)
    assert original.reads == ["agent list"]
    assert extended.reads == ("agent list", "note list")
    assert extended.events == tuple(["note.*"])
    assert extended.sources[0].listed() == {"key": "progress", "read": "note list", "events": ["note.*"]}
    assert extended.tabs[0].component == "/modules/notes/agent-notes.js"
    assert extended.links == {"notes": "notes.board"}
    assert extended.keys == tuple([WindowKey("notes", "note list", events=["note.*"])])
    assert original.keys == ()


def test_an_unextended_window_keeps_only_its_own_declarations():
    original = WindowDeclaration("notes.board", "Notes", "note list", WindowLoading.DOCUMENT)
    assert WindowExtensions([NotesModule]).extend(original) is original
    assert WindowExtensions([]).extend(original) is original


def test_a_module_adds_reload_events_to_an_existing_key_without_replacing_its_read():
    key = WindowKey("agents", "agent cards", events=["agent.*"], arguments=["show", "search"])
    original = WindowDeclaration("agents.agents", "Agents", "agent list", WindowLoading.DOCUMENT, keys=[key])
    extended = WindowExtensions([NotesModule]).extend(original)
    assert extended.keys[0].events == ("agent.*", "note.*")
    assert extended.keys[0].read == key.read
    assert extended.keys[0].arguments == key.arguments
    assert original.keys[0].events == ["agent.*"]
