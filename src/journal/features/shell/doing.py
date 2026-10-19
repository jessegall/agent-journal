import re

VERBS = {"git": {"commit": "committing", "push": "pushing", "pull": "pulling", "add": "staging", "checkout": "switching branch", "merge": "merging", "rebase": "rebasing", "status": "checking git", "diff": "reading a diff", "log": "reading history"},
         "pytest": "testing", "npm": {"test": "testing", "run": "running a script", "install": "installing", "ci": "installing"}, "pip": "installing", "pip3": "installing", "make": "building",
         "cargo": {"build": "building", "test": "testing", "run": "running"}, "docker": "running docker", "gh": "on github", "journal": "journalling", "cd": "moving", "ls": "listing", "cat": "reading", "sed": "reading", "grep": "searching", "rg": "searching", "find": "searching", "curl": "fetching"}
RUNNERS = {"python", "python3", "node", "bash", "sh", "zsh", "env", "time", "nohup"}
WORDS = re.compile(r"[^\s|<>&;]+")


class Doing:
    """What one command is doing, in a word or two, as the bar and the chat say it: git commit is committing, pytest is testing."""

    @classmethod
    def of(cls, part: str) -> str:
        words = [w for w in WORDS.findall(part.split("<<", 1)[0]) if not w.startswith("-") and "=" not in w]
        words = words[1:] if words and words[0] in RUNNERS and len(words) > 1 else words
        if not words:
            return "running"
        verb = VERBS.get(words[0].rsplit("/", 1)[-1])
        if isinstance(verb, dict):
            return verb.get(words[1] if len(words) > 1 else "", f"running {words[0]}")
        return verb or f"running {words[0]}"
