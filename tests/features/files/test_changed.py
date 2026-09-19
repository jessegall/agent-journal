import subprocess
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Agents, Works  # noqa: E402
from features.files.feature import baseline_file  # noqa: E402
from resources.base import AGENT, SYSTEM  # noqa: E402
from tests.features.kit import report  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
project = record.root.parent
subprocess.run(["git", "init", "-q"], cwd=project, check=True)
subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "start"], cwd=project, check=True)
(project / "kept.txt").write_text("one\ntwo\n")
(project / "same.txt").write_text("clean\n")
subprocess.run(["git", "add", "kept.txt", "same.txt"], cwd=project, check=True)
subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "-m", "kept"], cwd=project, check=True)
(project / "same.txt").write_text("before\n")
(project / "prior.txt").write_text("not this work\n")
(project / "remove.txt").write_text("gone\nsoon\n")
works = Works(record, actor=AGENT)
time.sleep(1.1)
work = works.create("change some files")

# A WRITE THE HOOK REPORTED: the changed files are read from git and kept on the open work
(project / "kept.txt").write_text("one\nthree\nfour\n")
(project / "fresh.txt").write_text("a\nb\nc\n")
report(record, "working", "PostToolUse", tool="Edit", file=str(project / "kept.txt"), wrote=True)
files = {f["path"]: f for f in works.load(work.n).data["changed"]}
check("an edit reported with its path records that file with its line counts", (files["kept.txt"]["added"], files["kept.txt"]["removed"], files["kept.txt"]["created"]), (2, 1, False))
check("only the reported file, not the rest of the tree", list(files), ["kept.txt"])
agent = Agents(record, actor=SYSTEM).by_session("claude-1")
Agents(record, actor=SYSTEM).update(agent.n, running={"what": "first", "at": time.time()})

(project / "same.txt").write_text("during\n")
report(record, "working", "PostToolUse", tool="Edit", file=str(project / "same.txt"), wrote=True)
files = {f["path"]: f for f in works.load(work.n).data["changed"]}
check("a dirty file edited with unchanged numstat is still attributed by content", "same.txt" in files, True)
first = Agents(record, actor=SYSTEM).by_session("claude-1").running["changed"]

# A SHELL WRITE names no file: the whole tree is read, and a new file counts as created
(project / "remove.txt").unlink()
report(record, "working", "PostToolUse", tool="Bash", file="", wrote=True)
files = {f["path"]: f for f in works.load(work.n).data["changed"]}
check("a script's writes count too: the new file is created, with its lines", (files["fresh.txt"]["created"], files["fresh.txt"]["added"]), (True, 3))
check("pre-existing dirt stays off the work while a deletion stays on it", ("prior.txt" in files, files["remove.txt"]["removed"]), (False, 2))
check("the journal's own runtime writes are never attributed to the work", any(path.startswith(".journal/") for path in files), False)
from features.files.feature import internal, journals_own  # noqa: E402
linked = fresh("linked")
elsewhere = linked.root.parent
(elsewhere / "worktree").mkdir()
(elsewhere / "worktree" / ".journal").symlink_to(elsewhere / ".journal")
from engine.record import Record  # noqa: E402
marks = internal(Record(elsewhere / "worktree" / ".journal", "linked"), elsewhere / "worktree")
check("a journal reached through a symlink is still the journal's own, and so are the skills it generates",
      (journals_own(".journal/environments/main/todo/001.json", marks), journals_own(".agents/skills/journal-auto/SKILL.md", marks), journals_own(".claude/skills/style-imports/SKILL.md", marks), journals_own("src/app.js", marks), journals_own(".claude/skills/mine/SKILL.md", marks)),
      (True, True, True, False, False))
second = Agents(record, actor=SYSTEM).by_session("claude-1").running["changed"]
check("one active turn accumulates changes across its writes", (second["edited"], second["created"] > first["created"], second["deleted"]), (first["edited"], True, 1))

# A COMMIT DURING THE WORK is recorded on it
subprocess.run(["git", "add", "-A"], cwd=project, check=True)
subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "-m", "the change"], cwd=project, check=True)
report(record, "working", "PostToolUse", tool="Bash", file="", wrote=True)
check("the commits made since the work started are on it", [c["subject"] for c in works.load(work.n).data["commits"]], ["the change"])

# A READ records nothing
before = works.load(work.n).updated
report(record, "working", "PostToolUse", tool="Read", file=str(project / "kept.txt"), wrote=False)
check("a read changes nothing on the work", works.load(work.n).updated, before)

baseline = baseline_file(record, work.n)
works.complete(work.n, how="done")
check("the feature baseline lives only as long as the work", (baseline.exists(), works.load(work.n).completed > 0), (False, True))

done()
