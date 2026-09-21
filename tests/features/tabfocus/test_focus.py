from types import SimpleNamespace

from features.tabfocus.focus import SCRIPT, existing_tab

URL = "http://127.0.0.1:8422/"


def test_macos_asks_its_running_browsers_for_the_viewer_tab():
    calls = []

    def run(command, **options):
        calls.append((command, options))
        return SimpleNamespace(returncode=0)

    assert existing_tab(URL, "darwin", run) is True, "macOS asks its running browsers for the viewer tab"
    assert (calls[0][0][:5], calls[0][0][-2:], calls[0][1]) == \
        (["osascript", "-l", "JavaScript", "-e", SCRIPT], ["--", URL], {"capture_output": True, "timeout": 2}), \
        "the focus script receives the viewer URL"


def test_other_systems_and_a_missing_tab_leave_opening_to_the_normal_path():
    calls = []

    def run(command, **options):
        calls.append((command, options))
        return SimpleNamespace(returncode=0)

    assert (existing_tab(URL, "linux", run), calls) == (False, []), "other systems leave opening to the normal browser path"
    assert existing_tab(URL, "darwin", lambda *args, **options: SimpleNamespace(returncode=1)) is False, \
        "a missing macOS tab leaves opening to the normal browser path"
