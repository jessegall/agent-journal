import sys

from github import my_login, waiting

if __name__ == "__main__":
    pending = waiting("issue", my_login())
    print("\n".join(f"issue {issue.number} waits for an answer: {issue.title} {issue.url}" for issue in pending) or "every open issue has an answer")
    sys.exit(1 if pending else 0)
