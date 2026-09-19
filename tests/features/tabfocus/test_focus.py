import sys
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
from features.tabfocus.focus import SCRIPT, existing_tab
from tests.kit import check, done

calls = []


def run(command, **options):
    calls.append((command, options))
    return SimpleNamespace(returncode=0)


url = "http://127.0.0.1:8422/"
check("macOS asks its running browsers for the viewer tab", existing_tab(url, "darwin", run), True)
check("the focus script receives the viewer URL", (calls[0][0][:5], calls[0][0][-2:], calls[0][1]),
      (["osascript", "-l", "JavaScript", "-e", SCRIPT], ["--", url], {"capture_output": True, "timeout": 2}))
calls.clear()
check("other systems leave opening to the normal browser path", (existing_tab(url, "linux", run), calls), (False, []))
check("a missing macOS tab leaves opening to the normal browser path",
      existing_tab(url, "darwin", lambda *args, **options: SimpleNamespace(returncode=1)), False)

done()
