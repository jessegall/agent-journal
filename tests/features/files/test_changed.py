import subprocess
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import CONTROLLERS  # noqa: E402
from resources.base import AGENT  # noqa: E402
from tests.features.kit import report  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
project = record.root.parent
subprocess.run(["git", "init", "-q"], cwd=project, check=True)
subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "start"], cwd=project, check=True)
(project / "kept.txt").write_text("one\ntwo\n")
subprocess.run(["git", "add", "kept.txt"], cwd=project, check=True)
subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "-m", "kept"], cwd=project, check=True)
works = CONTROLLERS["work"](record, actor=AGENT)
time.sleep(1.1)
work = works.create("change some files")

# A WRITE THE HOOK REPORTED: the changed files are read from git and kept on the open work
(project / "kept.txt").write_text("one\nthree\nfour\n")
(project / "fresh.txt").write_text("a\nb\nc\n")
report(record, "working", "PostToolUse", tool="Edit", file=str(project / "kept.txt"), wrote=True)
files = {f["path"]: f for f in works.load(work.n).data["changed"]}
check("an edit reported with its path records that file with its line counts", (files["kept.txt"]["added"], files["kept.txt"]["removed"], files["kept.txt"]["created"]), (2, 1, False))
check("only the reported file, not the rest of the tree", list(files), ["kept.txt"])

# A SHELL WRITE names no file: the whole tree is read, and a new file counts as created
report(record, "working", "PostToolUse", tool="Bash", file="", wrote=True)
files = {f["path"]: f for f in works.load(work.n).data["changed"]}
check("a script's writes count too: the new file is created, with its lines", (files["fresh.txt"]["created"], files["fresh.txt"]["added"]), (True, 3))

# A COMMIT DURING THE WORK is recorded on it
subprocess.run(["git", "add", "-A"], cwd=project, check=True)
subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "-m", "the change"], cwd=project, check=True)
report(record, "working", "PostToolUse", tool="Bash", file="", wrote=True)
check("the commits made since the work started are on it", [c["subject"] for c in works.load(work.n).data["commits"]], ["the change"])

# A READ records nothing
before = works.load(work.n).updated
report(record, "working", "PostToolUse", tool="Read", file=str(project / "kept.txt"), wrote=False)
check("a read changes nothing on the work", works.load(work.n).updated, before)

done()
