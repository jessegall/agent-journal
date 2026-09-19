import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from commands.http import dispatch  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

record = fresh("main")
for text in ("reading gist.js", "making edits 12s", ""):
    dispatch("POST", "/api/displayed", record.root, {}, {"text": text})
lines = (record.root / "runtime" / "statusbar.log").read_text().splitlines()
check("each text the status bar showed is one timestamped line, in order", [line.split("\t")[1] for line in lines], ["reading gist.js", "making edits 12s", "(empty)"])
check("the time has milliseconds, to follow fast changes", len(lines[0].split("\t")[0]), len("20:51:03.123"))

done()
