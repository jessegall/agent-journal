import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Plugins  # noqa: E402
from features.format import formatted  # noqa: E402
from features.plugins.manifest import chat  # noqa: E402
from resources.base import Refused, SYSTEM  # noqa: E402
from tests.kit import check, done, fresh, refused  # noqa: E402

features.unload()
features.load()

# A CHAT RULE is read from the manifest and refused when it is not one
check("a rule finds a pattern and says what it becomes",
      chat("works", [{"find": r"WF-(\d+)", "as": r"[workflow \1](#/wf/\1)"}]), [{"find": r"WF-(\d+)", "as": r"[workflow \1](#/wf/\1)"}])
check("a rule that is not a pattern is refused", "is not a pattern" in refused(lambda: chat("works", [{"find": "(", "as": "x"}])), True)
check("a rule with anything else in it is refused", "each chat rule is" in refused(lambda: chat("works", [{"find": "a", "as": "b", "then": "c"}])), True)

# AN INSTALLED PLUGIN's rules shape the text the chat is given
record = fresh()
plugins = Plugins(record, actor=SYSTEM)
row = plugins.create("Workflows", manifest={"name": "works", "chat": [{"find": r"WF-(\d+)", "as": r"[workflow \1](#/wf/\1)"}]}, enabled=True)
check("the plugin's rule is applied to what the chat is given",
      formatted("see WF-42 for the run", record), "see [workflow 42](#/wf/42) for the run")
plugins.update(row.n, enabled=False)
check("a plugin that is off shapes nothing", formatted("see WF-42 for the run", record), "see WF-42 for the run")
check("with no record, nothing is shaped", formatted("see WF-42", None), "see WF-42")

done()
