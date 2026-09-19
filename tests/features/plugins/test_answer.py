import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Agents, Notices, Notifications, Nudges, Todos  # noqa: E402
from engine.stored import read_json  # noqa: E402
from engine.hooks import gate_file  # noqa: E402
from features.base import held  # noqa: E402
from features.plugins.answer import MOST, apply  # noqa: E402
from resources.base import PLUGIN, SYSTEM  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
Agents(record, actor=SYSTEM).by_session("claude-3")

# EACH KEY BECOMES A ROW OF ITS OWN, written as the plugin
did = apply(record, "works", "claude-3", {
    "whisper": "phpstan: 2 errors in src/Engine.php",
    "say": "the workflow finished",
    "notify": {"title": "Workflow ran", "abstract": "3 nodes", "brief": "all green"},
    "notice": {"title": "Pint failed", "tone": "warn"},
    "todo": {"title": "Add a test for NodeX", "brief": "it has none"},
})
check("every key was applied, in the order they are known", did, ["whisper", "say", "notify", "notice", "todo"])
whispered, said = sorted(Nudges(record).all(), key=lambda r: r.n)
check("a whisper is private and a say is spoken, both to the event's agent", [(n.private, n.session, n.brief) for n in (whispered, said)],
      [(True, "claude-3", "phpstan: 2 errors in src/Engine.php"), (False, "claude-3", "the workflow finished")])
check("a notification and a notice are written with what they say", ([(n.title, n.abstract) for n in Notifications(record).all()], [(n.title, n.data.get("tone")) for n in Notices(record).all()]),
      ([("Workflow ran", "3 nodes")], [("Pint failed", "warn")]))
check("a to-do is filed with its brief", [(t.title, t.brief) for t in Todos(record).all()], [("Add a test for NodeX", "it has none")])
check("every row says which plugin wrote it, and that a plugin did", ({r.data.get("plugin") for r in Todos(record).all() + Notifications(record).all()}, Todos(record).all()[0].seen), ({"works"}, [PLUGIN]))

# HOLD KEEPS THE AGENT FROM WRITING until the plugin lets go
apply(record, "works", "claude-3", {"hold": "tests are red: run composer test first"})
check("the hold is written under the plugin's own key, with its reason", read_json(gate_file(record.root, record.env, "claude-3"), {}).get("plugin:works"), "tests are red: run composer test first")
check("and the gate says it in the agent's words", "tests are red: run composer test first" in held(record, "claude-3"), True)
apply(record, "works", "claude-3", {"hold": ""})
check("an empty hold lets go", ("plugin:works" in read_json(gate_file(record.root, record.env, "claude-3"), {}), "tests are red" in held(record, "claude-3")), (False, False))

# WHAT IS NOT UNDERSTOOD is left alone, and a bad row never stops the rest
did = apply(record, "works", "claude-3", {"refuse": "too late", "nonsense": 1, "todo": {"title": ""}, "say": "still said"})
check("refuse and unknown keys are ignored, and a refused row does not stop the others", did, ["say"])
check("nothing was filed for the empty to-do", len(Todos(record).all()), 1)

# AN ANSWER CANNOT FLOOD THE RECORD
many = {key: "x" for key in ("whisper", "say")}
check("at most twenty instructions are taken from one answer", len(apply(record, "works", "claude-3", many)) <= MOST, True)

done()
