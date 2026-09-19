import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features
from controllers.types import Agents, Messages, Nudges
from commands.cli import search_text
from commands.http import dispatch
from resources.base import SYSTEM, USER
from tests.kit import check, done, fresh, refused

features.unload()
features.load()

record = fresh()
Agents(record, actor=SYSTEM).create("session", status="working")
messages = Messages(record, actor=USER)
message = messages.create("look at this")
folder = Path(tempfile.mkdtemp())
image = folder / "dashboard.png"
image.write_bytes(b"png")
messages.attach(message.n, str(image))

nudges = Nudges(record, actor=SYSTEM).all()
check("an uploaded image asks the agent for tags", (len(nudges), nudges[0].title), (1, "message 1 file dashboard.png needs tags"))
tagged = subprocess.run(
    [sys.executable, str(Path(__file__).resolve().parents[3] / "journal.py"), "--root", str(record.root), "--env", record.env,
     "message", "tag", str(message.n), image.name, "deployment graph with three regions"],
    capture_output=True,
    text=True,
    timeout=20,
)
check("the feature's instructed CLI command tags the attachment", tagged.returncode, 0)
check("tags live on the file entry", messages.load(message.n).files[image.name], "deployment graph with three regions")
check("resource search finds a file by its tags", [r.n for r in messages.search("three regions")], [message.n])
check("resource search finds a file by its name", [r.n for r in messages.search("dashboard.png")], [message.n])
check("journal search includes matching file tags", "message:1  dashboard.png — deployment graph with three regions" in search_text(record, "session", "deployment graph", 0), True)
reply = dispatch("GET", "/api/t/search", record.root, {"q": "three regions"}, {})
check("viewer search identifies the matching attachment", reply.body[0]["matches"], [{"name": "dashboard.png", "tags": "deployment graph with three regions", "url": "/api/t/message/1/files/dashboard.png"}])
check("unknown files cannot be tagged", refused(lambda: messages.tag(message.n, "missing.png", "nothing")), "message 1 has no file missing.png")

text = folder / "notes.txt"
text.write_text("notes")
messages.attach(message.n, str(text))
check("non-media attachments do not ask for visual tags", len(Nudges(record, actor=SYSTEM).all()), 1)

later = fresh("later")
later_messages = Messages(later, actor=USER)
later_message = later_messages.create("before the agent starts")
later_messages.attach(later_message.n, str(image))
later_row = later_messages.load(later_message.n)
later_row.files["walkthrough.mp4"] = "video; 4 frames every 0.5 seconds"
later_messages.save(later_row, "updated")
later_agent = Agents(later, actor=SYSTEM).create("new session", status="working")
Agents(later, actor=SYSTEM).update(later_agent.n, event="SessionStart")
check("a starting agent hears about media attached while none was live", len(Nudges(later, actor=SYSTEM).all()), 2)

done()
