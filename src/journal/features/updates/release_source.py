import json
from urllib.request import Request, urlopen

TAGS = "https://api.github.com/repos/jessegall/agent-journal/git/matching-refs/tags/{prefix}"
READ_SECONDS = 10


class ReleaseSource:
    """The journal's tags on GitHub, read over HTTP."""

    def tags(self, prefix: str) -> list[str]:
        request = Request(TAGS.format(prefix=prefix), headers={"Accept": "application/vnd.github+json", "User-Agent": "agent-journal"})
        with urlopen(request, timeout=READ_SECONDS) as answer:
            return [found["ref"].removeprefix("refs/tags/") for found in json.load(answer)]
