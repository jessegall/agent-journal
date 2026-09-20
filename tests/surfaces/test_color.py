import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
import features  # noqa: E402
from commands.http import dispatch  # noqa: E402
from surfaces.color import default, identity, set_color  # noqa: E402
from tests.kit import check, done, fresh, refused  # noqa: E402

features.unload()
features.load()

record = fresh()
check("the project name always chooses the same palette color", (default("agent-journal"), default("agent-journal")), ("#0090ff", "#0090ff"))
check("identity starts with its hashed project color", identity(record.root), {
    "project": record.root.parent.name,
    "color": default(record.root.parent.name),
    "default_color": default(record.root.parent.name),
    "custom_color": "",
})

set_color(record.root, "#A1B2C3")
check("a custom color is project-scoped and normalized", identity(record.root)["color"], "#a1b2c3")
check("the project setting stays outside every environment", (record.root / "settings.json").is_file(), True)
check("an invalid color is refused", refused(lambda: set_color(record.root, "red")), "color must be a six-digit hex color")

reply = dispatch("POST", "/api/identity", record.root, {}, {"color": "#123456"})
check("the identity endpoint saves and returns the project color", (reply.code, reply.body["color"], json.loads((record.root / "settings.json").read_text())["color"]), (200, "#123456", "#123456"))
reply = dispatch("POST", "/api/identity", record.root, {}, {"color": None})
check("reset restores the hashed color", (reply.body["color"], reply.body["custom_color"]), (default(record.root.parent.name), ""))
reply = dispatch("POST", "/api/identity", record.root, {}, {"color": "wrong"})
check("the endpoint refuses an invalid color", (reply.code, reply.body["error"]), (400, "color must be a six-digit hex color"))

done()
