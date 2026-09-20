import json
import re
import tempfile
from pathlib import Path

import engine.band as band_module
from controllers.types import Works
from engine import viewer
from engine.band import ROWS, Band, Translator, unshifted
from engine.record import Record
from engine.viewer import ensure, remember
from resources.base import AGENT


def test_a_translator_shifts_escape_sequences_down_by_the_band_and_holds_ones_split_across_reads():
    t = Translator(56)
    assert t.feed(b"\x1b[5;10H") == b"\x1b[%d;10H" % (5 + ROWS), "a cursor address moves down by the band"
    assert t.feed(b"\x1b[H") == b"\x1b[%d;1H" % (ROWS + 1), "home is the first row under the band"
    assert t.feed(b"\x1b[2;53r") == b"\x1b[%d;%dr" % (2 + ROWS, 53 + ROWS), "a scroll region moves down too"
    assert t.feed(b"\x1b[r") == b"\x1b[%d;56r" % (ROWS + 1), "a reset region is the whole screen under the band"
    assert t.feed(b"\x1b[12d") == b"\x1b[%dd" % (12 + ROWS), "a vertical position moves down"
    assert (t.feed(b"abc\x1b[3"), t.feed(b";4Hdef")) == (b"abc", b"\x1b[%d;4Hdef" % (3 + ROWS)), \
        "a sequence split across reads is held and joined"
    assert t.feed(b"\x1b[K\x1b[?25l\x1b[38;2;1;2;3m") == b"\x1b[K\x1b[?25l\x1b[38;2;1;2;3m", "other sequences pass untouched"
    assert t.feed(b"hello") == b"hello", "plain text passes"
    assert (t.feed(b"text\x1b]0;\xe2\x97\x90 3 unread"), t.feed(b" comment\x07more")) == \
        (b"text", b"\x1b]0;\xe2\x97\x90 3 unread comment\x07more"), \
        "a window-title update split across reads is held whole, so no drawing lands inside it and no bare bell rings"
    assert (t.feed(b"\x1b]0;title\x1b"), t.feed(b"\\after")) == (b"", b"\x1b]0;title\x1b\\after"), \
        "a title ended by ESC backslash split at the ESC is held too"
    assert (t.feed(b"x\x1b[?20"), t.feed(b"26h")) == (b"x", b"\x1b[?2026h"), "a private mode split across reads is held"


def test_the_band_draws_a_bar_and_url_reads_fresh_seat_data_and_a_launcher_opens_the_running_viewer():
    root = Path(tempfile.mkdtemp()) / ".journal"
    record = Record(root, "main")
    Works(record, actor=AGENT).create("keep the band current")
    url = remember(root, 8420)
    (root / "runtime" / "seat-s-1.json").write_text(json.dumps({"env": "main", "state": "working", "report": {"title": "real-session", "provider": "codex", "model": "gpt-5", "context": 37.6, "started": 1}}))
    band = Band(root, "old", "s-1", "journal")
    band.url = url
    plain = lambda line: re.sub(r"\x1b\[[0-9;]*m", "", line)
    lines = [plain(line) for line in band.lines(180)]
    assert (lines[0].index("JOURNAL"), "journal · main" in lines[0], "context 38%" in lines[0], bool(re.search(r"\d\d:\d\d:\d\d  $", lines[0]))) == \
        ((180 - len("JOURNAL")) // 2, True, True, True), \
        "the gradient bar keeps the centered brand and puts project left with context right"
    assert (lines[1].strip(), "gpt-5" in lines[1], lines[1].index(url) + len(url) // 2 - (lines[0].index("JOURNAL") + len("JOURNAL") // 2) in (-1, 0, 1)) == \
        (url, False, True), \
        "the bare URL sits centred under the brand, without a label or the model"
    assert (set(lines[2].strip()), len(lines)) == ({"─"}, ROWS), "the border sits straight under the URL, with no blank line between"

    (root / "runtime" / "seat-s-1.json").write_text(json.dumps({"env": "other", "state": "idle", "report": {"title": "real-session", "provider": "claude", "model": "sonnet", "context": 52, "running": {"what": "npm run build", "at": 1}, "started": 1}}))
    updated = [plain(line) for line in band.lines(180)]
    assert ("other" in updated[0], "sonnet" in updated[0], "context 52%" in updated[0]) == (True, False, True), \
        "a redraw reads fresh seat data"

    opened = []
    original = viewer.running
    viewer.running = lambda _: url
    assert (ensure(root, root.parent, opened.append, lambda _: False), opened) == (url, [url]), \
        "a launcher opens the running viewer when no tab can be focused"
    viewer.running = original

    late = Band(root, "main", "s-1", "journal")
    asked = []
    band_module.running = lambda _: (asked.append("scan"), "")[1]
    band_module.marked = lambda _: (asked.append("marker"), url if len(asked) > 2 else "")[1]
    assert (late.viewer(), late.viewer(), (setattr(late, "asked_at", 0) or late.viewer()), asked) == \
        ("viewer unavailable", "viewer unavailable", url, ["scan", "marker", "marker"]), \
        "with no viewer yet the band scans once, then asks the marker every second, and shows the URL the moment it answers"
    band_module.running, band_module.marked = original, viewer.marked


def test_a_click_is_moved_up_by_the_band():
    assert unshifted(b"\x1b[<0;12;9M") == b"\x1b[<0;12;%dM" % (9 - ROWS)


def test_a_release_is_moved_too():
    assert unshifted(b"\x1b[<0;12;9m") == b"\x1b[<0;12;%dm" % (9 - ROWS)


def test_a_click_on_the_band_itself_lands_on_the_agents_first_row():
    assert unshifted(b"\x1b[<0;12;2M") == b"\x1b[<0;12;1M"


def test_the_older_encoding_is_moved_by_the_same_rows():
    assert unshifted(b"\x1b[M" + bytes([32, 44, 32 + 9])) == b"\x1b[M" + bytes([32, 44, 32 + 9 - ROWS])


def test_ordinary_keys_pass_through_untouched():
    assert (unshifted(b"hello\r"), unshifted(b"\x1b")) == (b"hello\r", b"\x1b")
