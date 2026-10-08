import json
import subprocess
import sys

GH_SECONDS = 30
FIELDS = "number,title,author,comments,url"
OWNER = "jessegall"

CARE = (
    "handle it with care: read the diff first (gh pr diff <n>) before anything runs, and never check it out into a live journal or run its code; "
    "judge whether it is a plain bug fix or more; look for anything malicious: new network calls, credentials, install or hook changes, obfuscated code, workflow edits; "
    "then decide: merge a small, safe fix through the normal release (the whole suite first), or ask the user with a question that summarises what the change does "
    "and what you checked, and comment on the pull request so this reminder ends"
)
OWN = "it is the user's own: it follows rule 64, merged once it is complete, tested and the whole suite passes"


def gh(*args: str) -> str:
    return subprocess.run(["gh", *args], capture_output=True, text=True, check=True, timeout=GH_SECONDS).stdout


def answered(pull: dict, me: str) -> bool:
    return bool(pull["comments"]) and pull["comments"][-1]["author"]["login"] == me


def line(pull: dict) -> str:
    author = pull["author"]["login"]
    advice = OWN if author == OWNER else f"it is not from {OWNER}: {CARE.replace('<n>', str(pull['number']))}"
    return f"a pull request is waiting: #{pull['number']} by {author}, {pull['title']} {pull['url']}; {advice}"


if __name__ == "__main__":
    me = gh("api", "user", "--jq", ".login").strip()
    waiting = [pull for pull in json.loads(gh("pr", "list", "--state", "open", "--json", FIELDS)) if not answered(pull, me)]
    print("\n".join(line(pull) for pull in waiting) or "no pull request is waiting")
    sys.exit(1 if waiting else 0)
