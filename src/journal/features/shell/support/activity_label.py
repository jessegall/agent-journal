import re

from journal.support.command_shape import RUNNERS, TOKEN_PATTERN

VERBS: dict[str, str | dict[str, str]] = {"git": {"commit": "committing", "push": "pushing", "pull": "pulling", "add": "staging", "checkout": "switching branch", "merge": "merging", "rebase": "rebasing", "status": "checking git", "diff": "reading a diff", "log": "reading history"},
         "pytest": "testing", "npm": {"test": "testing", "run": "running a script", "install": "installing", "ci": "installing"}, "pip": "installing", "pip3": "installing", "make": "building",
         "cargo": {"build": "building", "test": "testing", "run": "running"}, "docker": "running docker", "gh": "on github", "journal": "journalling", "cd": "moving", "ls": "listing", "cat": "reading", "sed": "reading", "grep": "searching", "rg": "searching", "find": "searching", "curl": "fetching"}


class ActivityLabel:
    """What one command is doing, in a word or two, as the bar and the chat say it: git commit is committing, pytest is testing."""

    @classmethod
    def build(cls, part: str) -> str:
        text = [w for w in TOKEN_PATTERN.findall(part.split("<<", 1)[0]) if not w.startswith("-") and "=" not in w]
        text = text[1:] if text and text[0] in RUNNERS and len(text) > 1 else text
        if not text:
            return "running"
        verb = VERBS.get(text[0].rsplit("/", 1)[-1])
        if isinstance(verb, dict):
            return verb.get(text[1] if len(text) > 1 else "", f"running {text[0]}")
        return verb or f"running {text[0]}"
