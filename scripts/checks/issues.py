import json
import subprocess
import sys

GH_SECONDS = 30
FIELDS = "number,title,author,comments,url"


def gh(*args: str) -> str:
    return subprocess.run(["gh", *args], capture_output=True, text=True, check=True, timeout=GH_SECONDS).stdout


def answered(issue: dict, me: str) -> bool:
    return bool(issue["comments"]) and issue["comments"][-1]["author"]["login"] == me


if __name__ == "__main__":
    me = gh("api", "user", "--jq", ".login").strip()
    waiting = [issue for issue in json.loads(gh("issue", "list", "--state", "open", "--json", FIELDS)) if not answered(issue, me)]
    print("\n".join(f"issue {issue['number']} waits for an answer: {issue['title']} {issue['url']}" for issue in waiting) or "every open issue has an answer")
    sys.exit(1 if waiting else 0)
