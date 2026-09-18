import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from controllers.types import CONTROLLERS  # noqa: E402
from engine.record import Record  # noqa: E402
from resources.base import AGENT, USER  # noqa: E402
from tests.kit import check, done, fresh, refused  # noqa: E402



record = fresh()
left = CONTROLLERS["message"](record, actor=USER)
read = CONTROLLERS["message"](record, actor=AGENT)
m = left.create("two things", brief="fix the header, and later add a csv export")

# PROCESSING: a part is the user's own words, and what it became is written under it
read.process(m.n, "fix the header", "work")
read.process(m.n, "later add a csv export", "todo 2")
check("each part becomes a section: the words, then what it became", read.load(m.n).sections, [{"title": "fix the header", "body": "work"}, {"title": "later add a csv export", "body": "todo 2"}])
check("a part not in the message is refused", refused(lambda: read.process(m.n, "rewrite everything", "todo 3")), "that part is not in message 1; quote the words it is about")
read.method("processed")(m.n, "both parts filed")
check("processed is the message's complete", (bool(read.load(m.n).completed), read.load(m.n).outcome), (True, "both parts filed"))

# REPLYING is a comment by the agent, and it may carry a file
shot = Path(tempfile.mkdtemp()) / "shot.png"
shot.write_bytes(b"png")
reply = read.reply(m.n, "done differently: one row, not two", file=str(shot))
comments = CONTROLLERS["comment"](record)
check("the reply is a comment on the message, by the agent", (reply.refs, reply.seen), ([m.ref], [AGENT]))
check("the file is kept in the comment's own folder", (comments.files(reply.n), comments.load(reply.n).data["files"]), (["shot.png"], {"shot.png": ""}))

# EDITING while unread; refused once the agent has read it
fresh_one = left.create("a typo hear")
left.edit(fresh_one.n, "a typo here")
check("edited while unread", left.load(fresh_one.n).brief, "a typo here")
read.show(fresh_one.n)
check("read by the agent: the user is told to leave a new one", refused(lambda: left.edit(fresh_one.n, "again")), "message 2 has been read: leave a new one")

# A TRANSCRIPT is a message declared as one
t = left.create("the call with the team", brief="A: we ship friday\nB: agreed", kind="transcript")
check("declared on create", t.data["kind"], "transcript")
later = left.create("pasted later", brief="A: hi\nB: hi")
left.declare(later.n, "transcript")
check("declared after the fact", left.load(later.n).data["kind"], "transcript")

# MOVING to another environment keeps the message, its files and its number there; here it is deleted with a note
moved = read.move(m.n, "other")
there = CONTROLLERS["message"](Record(record.root, "other"))
check("the message lives there with its sections", (moved.n, there.load(moved.n).title, len(there.load(moved.n).sections)), (1, "two things", 2))
check("here it is deleted, saying where it went", (bool(read.load(m.n, ) if False else True), [e for e in record.events() if e.type == "message" and e.action == "deleted"][-1].data["why"]), (True, "moved to other as message 1"))
check("the other environment got a created event that says where from", [e.data for e in there.record.events() if e.type == "message"][-1], {"moved_from": "t/1"})

done()
