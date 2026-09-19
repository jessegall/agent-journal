import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from install import fetch  # noqa: E402
from tests.kit import check, done  # noqa: E402


def git(*args, cwd):
    return subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", *args], cwd=cwd, capture_output=True, text=True, timeout=30, check=True).stdout.strip()


origin = Path(tempfile.mkdtemp()) / "origin"
origin.mkdir()
git("init", "-q", "-b", "main", cwd=origin)
(origin / "VERSION").write_text("1\n")
git("add", "-A", cwd=origin)
git("commit", "-q", "-m", "one", cwd=origin)
first = git("rev-parse", "HEAD", cwd=origin)
git("tag", "v1", cwd=origin)
(origin / "VERSION").write_text("2\n")
git("commit", "-q", "-am", "two", cwd=origin)
second = git("rev-parse", "HEAD", cwd=origin)
git("checkout", "-q", "-b", "side", cwd=origin)
(origin / "VERSION").write_text("side\n")
git("commit", "-q", "-am", "side", cwd=origin)
side = git("rev-parse", "HEAD", cwd=origin)
git("checkout", "-q", "main", cwd=origin)
url = origin.as_uri()


def fetched(ref=""):
    into = Path(tempfile.mkdtemp()) / "package"
    commit, failed = fetch(into, url, ref)
    return commit, failed, (into / "VERSION").read_text().strip() if not failed else ""


# ONE FUNNEL fetches the default branch, a branch, a tag or a commit, and says which commit it got
check("no ref: the default branch", fetched(), (second, "", "2"))
check("a branch", fetched("side"), (side, "", "side"))
check("a tag", fetched("v1"), (first, "", "1"))
check("a bare commit", fetched(first), (first, "", "1"))
commit, failed, _ = fetched("nope")
check("a ref that does not exist fails with git's words and no commit", (commit, bool(failed)), ("", True))

done()
