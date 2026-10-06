import json
import subprocess
import sys

GH_SECONDS = 30
FIELDS = "number,title,author,comments,url"


def gh(*args: str) -> str:
    return subprocess.run(["gh", *args], capture_output=True, text=True, check=True, timeout=GH_SECONDS).stdout


def last_word(issue: dict) -> str:
    return (issue["comments"] or [issue])[-1]["author"]["login"]


if __name__ == "__main__":
    me = gh("api", "user", "--jq", ".login").strip()
    waiting = [issue for issue in json.loads(gh("issue", "list", "--state", "open", "--json", FIELDS)) if last_word(issue) != me]
    print("\n".join(f"issue {issue['number']} waits for an answer: {issue['title']} {issue['url']}" for issue in waiting) or "every open issue has an answer")
    sys.exit(1 if waiting else 0)
