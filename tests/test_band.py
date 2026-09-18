import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from engine.band import ROWS, Translator  # noqa: E402
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

done()
