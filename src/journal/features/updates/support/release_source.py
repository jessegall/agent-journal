import json
import subprocess
from urllib.request import Request, urlopen

TAGS = "https://api.github.com/repos/jessegall/agent-journal/git/matching-refs/tags/{prefix}"
READ_SECONDS = 10
LIST_SECONDS = 60


class ReleaseSource:
    """The journal's tags on GitHub, read over HTTP."""

    def tags(self, prefix: str) -> list[str]:
        request = Request(TAGS.format(prefix=prefix), headers={"Accept": "application/vnd.github+json", "User-Agent": "agent-journal"})
        with urlopen(request, timeout=READ_SECONDS) as answer:
            return [rows["ref"].removeprefix("refs/tags/") for rows in json.load(answer)]

    def head_commit(self, address: str, branch: str) -> str:
        listed = subprocess.run(["git", "ls-remote", "--heads", address, branch], capture_output=True, text=True, timeout=LIST_SECONDS)
        if listed.returncode != 0 or not listed.stdout.strip():
            raise OSError(f"could not read the branch {branch} of {address}: {listed.stderr.strip()[-200:] or 'no such branch'}")
        return listed.stdout.split()[0]

    def release_tags(self, address: str) -> list[str]:
        listed = subprocess.run(["git", "ls-remote", "--tags", "--refs", address], capture_output=True, text=True, timeout=LIST_SECONDS)
        if listed.returncode != 0:
            raise OSError(f"could not list the releases of {address}: {listed.stderr.strip()[-200:]}")
        return [line.split("refs/tags/", 1)[1] for line in listed.stdout.splitlines() if "refs/tags/" in line]
