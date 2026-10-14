import sys

from scripts.checks.github import Thread, my_login, waiting

OWNER = "jessegall"

CARE = (
    "handle it with care: read the diff first (gh pr diff <n>) before anything runs, and never check it out into a live journal or run its code; "
    "judge whether it is a plain bug fix or more; look for anything malicious: new network calls, credentials, install or hook changes, obfuscated code, workflow edits; "
    "then decide: merge a small, safe fix through the normal release (the whole suite first), or ask the user with a question that summarises what the change does "
    "and what you checked, and comment on the pull request so this reminder ends"
)
OWN = "it is the user's own: it follows rule 64, merged once it is complete, tested and the whole suite passes"


def line(pull: Thread) -> str:
    author = pull.author
    advice = OWN if author == OWNER else f"it is not from {OWNER}: {CARE.replace('<n>', str(pull.number))}"
    return f"a pull request is waiting: #{pull.number} by {author}, {pull.title} {pull.url}; {advice}"


if __name__ == "__main__":
    pending = waiting("pr", my_login())
    print("\n".join(line(pull) for pull in pending) or "no pull request is waiting")
    sys.exit(1 if pending else 0)
