import sys
import tempfile
import time
from pathlib import Path

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


import inbox  # noqa: E402
import news  # noqa: E402
import questions  # noqa: E402
import tracks  # noqa: E402

root = Path(tempfile.mkdtemp()) / ".journal"
root.mkdir()
news.ROOT = root
AT = "2026-09-18T10:00:00+00:00"
tracks.create(root, "default", at=AT)
since = time.time() - 48 * 3600

check("nothing waiting is nothing to say", news._waiting("default", since), [])
inbox.add(root, "look at the header", "2026-09-17T10:00:05+00:00", source="web", track="default")
got = news._waiting("default", since)
check("a waiting message is one line naming it and how to read it",
      (len(got), got[0][0], "left message 1" in got[0][1]["content"], "messages show 1" in got[0][1]["content"], got[0][1]["meta"].get("message")),
      (1, "default:1", True, True, "1"))
check("a message from before the session started is not news",
      [k for k, _ in news._waiting("default", time.time() + 60) if k == "default:1"], [])

inbox.reply(root, 1, "done, the header is fixed", AT, source="cli", track="default")
inbox.reply(root, 1, "not quite", AT, source="web", track="default")
turn = [(k, p) for k, p in news._waiting("default", time.time() + 60) if ":reply:" in k]
check("the user's answer under a message is told, keyed by its place", [k for k, _ in turn], ["default:reply:1:1"])
news._told(["default:reply:1:1"])
check("and once told it is not told again", [k for k, _ in news._waiting("default", time.time() + 60) if ":reply:" in k], [])

questions.add(root, "which colour?", AT, ["inbox 1"], track="default")
questions.answer(root, 1, "blue", "2026-09-18T10:05:00+00:00", track="default")
asked = [(k, p) for k, p in news._waiting("default", since) if "question" in p.get("meta", {})]
check("an answered question is told, and says what to read", (len(asked), "questions show 1" in asked[0][1]["content"]), (1, True))
news._told([asked[0][0]])
check("told once", [k for k, p in news._waiting("default", since) if "question" in p.get("meta", {})], [])

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
