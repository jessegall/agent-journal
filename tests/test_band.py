import json
import re
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from controllers.types import Works  # noqa: E402
from engine.band import ROWS, Band, Translator  # noqa: E402
from engine.record import Record  # noqa: E402
from engine.viewer import ensure, remember  # noqa: E402
from resources.base import AGENT  # noqa: E402
from tests.kit import check, done  # noqa: E402

t = Translator(56)
check("a cursor address moves down by the band", t.feed(b"\x1b[5;10H"), b"\x1b[%d;10H" % (5 + ROWS))
check("home is the first row under the band", t.feed(b"\x1b[H"), b"\x1b[%d;1H" % (ROWS + 1))
check("a scroll region moves down too", t.feed(b"\x1b[2;53r"), b"\x1b[%d;%dr" % (2 + ROWS, 53 + ROWS))
check("a reset region is the whole screen under the band", t.feed(b"\x1b[r"), b"\x1b[%d;56r" % (ROWS + 1))
check("a vertical position moves down", t.feed(b"\x1b[12d"), b"\x1b[%dd" % (12 + ROWS))
check("a sequence split across reads is held and joined", (t.feed(b"abc\x1b[3"), t.feed(b";4Hdef")), (b"abc", b"\x1b[%d;4Hdef" % (3 + ROWS)))
check("other sequences pass untouched", t.feed(b"\x1b[K\x1b[?25l\x1b[38;2;1;2;3m"), b"\x1b[K\x1b[?25l\x1b[38;2;1;2;3m")
check("plain text passes", t.feed(b"hello"), b"hello")
check("a window-title update split across reads is held whole, so no drawing lands inside it and no bare bell rings",
      (t.feed(b"text\x1b]0;\xe2\x97\x90 3 unread"), t.feed(b" comment\x07more")), (b"text", b"\x1b]0;\xe2\x97\x90 3 unread comment\x07more"))
check("a title ended by ESC backslash split at the ESC is held too", (t.feed(b"\x1b]0;title\x1b"), t.feed(b"\\after")), (b"", b"\x1b]0;title\x1b\\after"))
check("a private mode split across reads is held", (t.feed(b"x\x1b[?20"), t.feed(b"26h")), (b"x", b"\x1b[?2026h"))

root = Path(tempfile.mkdtemp()) / ".journal"
record = Record(root, "main")
work = Works(record, actor=AGENT).create("keep the band current")
url = remember(root, 8420)
(root / "runtime" / "seat-s-1.json").write_text(json.dumps({"env": "main", "state": "working", "report": {"title": "real-session", "provider": "codex", "model": "gpt-5", "context": 37.6, "started": 1}}))
band = Band(root, "old", "s-1", "journal")
band.url = url
plain = lambda line: re.sub(r"\x1b\[[0-9;]*m", "", line)
lines = [plain(line) for line in band.lines(180)]
check("the gradient bar keeps the centered brand and puts project left with context right",
      (lines[0].index("JOURNAL"), "journal · main" in lines[0], "context 38%" in lines[0], bool(re.search(r"\d\d:\d\d:\d\d  $", lines[0]))),
      ((180 - len("JOURNAL")) // 2, True, True, True))
check("the URL gets its own centered line without repeating the model",
      (url in lines[1], "viewer" in lines[1], "gpt-5" in lines[1], lines[1].strip().startswith("viewer")), (True, True, False, True))
check("status is concise and a blank row follows the divider",
      (lines[2].startswith("  ◐ Working on"), work.title in lines[2], f"work {work.n}" in lines[2], set(lines[3].strip()), lines[4].strip(), len(lines)),
      (True, True, False, {"─"}, "", ROWS))
(root / "runtime" / "seat-s-1.json").write_text(json.dumps({"env": "other", "state": "idle", "report": {"title": "real-session", "provider": "claude", "model": "sonnet", "context": 52, "running": {"what": "npm run build", "at": 1}, "started": 1}}))
updated = [plain(line) for line in band.lines(180)]
check("a redraw reads fresh seat data", ("other" in updated[0], "sonnet" in updated[0], "context 52%" in updated[0], "npm run build" in updated[2]), (True, False, True, True))

opened = []
from engine import viewer  # noqa: E402
original = viewer.running
viewer.running = lambda _: url
check("a launcher opens the running viewer when no tab can be focused", (ensure(root, root.parent, opened.append, lambda _: False), opened), (url, [url]))
viewer.running = original

import engine.band as band_module  # noqa: E402
late = Band(root, "main", "s-1", "journal")
asked = []
band_module.running = lambda _: (asked.append("scan"), "")[1]
band_module.marked = lambda _: (asked.append("marker"), url if len(asked) > 2 else "")[1]
check("with no viewer yet the band scans once, then asks the marker every second, and shows the URL the moment it answers",
      (late.viewer(), late.viewer(), (setattr(late, "asked_at", 0) or late.viewer()), asked), ("viewer unavailable", "viewer unavailable", url, ["scan", "marker", "marker"]))
band_module.running, band_module.marked = original, viewer.marked

done()
