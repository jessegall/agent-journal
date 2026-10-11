import json
import subprocess
from dataclasses import dataclass

GH_SECONDS = 30
FIELDS = "number,title,author,comments,url"


def gh(*args: str) -> str:
    return subprocess.run(["gh", *args], capture_output=True, text=True, check=True, timeout=GH_SECONDS).stdout


@dataclass(frozen=True)
class Thread:
    number: int
    title: str
    url: str
    author: str
    last_commenter: str | None

    @classmethod
    def from_payload(cls, payload: dict) -> "Thread":
        comments = payload["comments"]
        return cls(
            payload["number"],
            payload["title"],
            payload["url"],
            payload["author"]["login"],
            comments[-1]["author"]["login"] if comments else None,
        )


def my_login() -> str:
    return gh("api", "user", "--jq", ".login").strip()


def waiting(kind: str, me: str) -> list[Thread]:
    threads = (Thread.from_payload(payload) for payload in json.loads(gh(kind, "list", "--state", "open", "--json", FIELDS)))
    return [thread for thread in threads if thread.last_commenter != me]
