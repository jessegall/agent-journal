import os
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from features import FEATURES  # noqa: E402
from tests.features.kit import idle  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()
house = FEATURES["housekeeping"]

record = fresh()
runtime = record.root / "runtime"
runtime.mkdir(exist_ok=True)
week_ago = time.time() - 8 * 86400

big = runtime / "printed-codex-1"
big.write_bytes(b"old" * 100_000 + b"THE END")
small = runtime / "printed-claude-2"
small.write_bytes(b"short")
log = runtime / "commands.log"
log.write_bytes(b"x" * (2 * 1024 * 1024) + b"last line\n")
stale = {name: runtime / name for name in ("trigger-gone-work.json", "gate-main-gone.json", "seat-gone.json", "session-gone.json", "printed-gone")}
for f in stale.values():
    f.write_text("{}")
    os.utime(f, (week_ago, week_ago))
fresh_session = runtime / "session-here.json"
fresh_session.write_text("{}")
kept = runtime / "env"
kept.write_text("main")
os.utime(kept, (week_ago, week_ago))

said = house.tidy(record)

# A CAPTURE OVER 64 KB keeps its tail; the engine reads only the end
check("a large capture is cut to its last 64 KB, ending as it did", (big.stat().st_size, big.read_bytes().endswith(b"THE END")), (64 * 1024, True))
check("a small capture is left alone", small.read_bytes(), b"short")
check("a log keeps its last megabyte", (log.stat().st_size, log.read_bytes().endswith(b"last line\n")), (1024 * 1024, True))

# FILES OF SESSIONS QUIET FOR A WEEK are removed; a live session and the record's own files stay
check("every per-session file quiet past the days is removed", [f.exists() for f in stale.values()], [False] * 5)
check("a session touched recently stays", fresh_session.exists(), True)
check("files that are not per-session stay, however old", kept.read_text(), "main")
check("it says what it did", said, {"removed": 5, "trimmed": 2})

# APPENDING AFTER A TRIM lands at the end, as the supervisor writes with O_APPEND
with big.open("ab") as out:
    out.write(b"+more")
check("an append after the trim continues the tail", big.read_bytes().endswith(b"THE END+more"), True)

# THE DAYS ARE A SETTING
record = fresh()
(record.root / "runtime").mkdir(exist_ok=True)
old = record.root / "runtime" / "seat-a.json"
old.write_text("{}")
two_days = time.time() - 2 * 86400
os.utime(old, (two_days, two_days))
record.set_setting("housekeeping", {"days": 1})
house.tidy(record)
check("housekeeping.days shortens the wait", old.exists(), False)

# IT RUNS ON ITS OWN, on the agent's activity, once the hour has passed
record = fresh()
(record.root / "runtime").mkdir(exist_ok=True)
capture = record.root / "runtime" / "printed-x"
capture.write_bytes(b"y" * 200_000)
idle(record)
check("the first activity sweeps", capture.stat().st_size, 64 * 1024)

done()
