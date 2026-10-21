import re
import shutil

NEVER_GIVEN = re.compile(r"^(?:a?sh|bash|zsh|fish|dash|ksh|t?csh|env|xargs|sudo|su|doas|nohup|nice|time|timeout|watch|script|eval|exec|"
                         r"python[\d.]*|pypy[\d.]*|node|deno|bun|ruby|perl[\d.]*|php[\d.]*|lua[\d.]*|osascript|"
                         r"make|npm|npx|yarn|pnpm|pip[\d.]*|uv|uvx|cargo|go|java|dotnet|gradle|mvn|composer|"
                         r"cat|tee|dd|base64|xxd|od|hexdump|sed|awk|jq|openssl|git|ssh|scp|find|docker|cp|mv|printf|echo)$")
STATED_COMMAND = re.compile(r"(?:^|`|\$ |-- )[ \t]*([a-z][\w.-]*)[ \t]+(?=-|@|https?:)", re.MULTILINE)


class Programs:
    """Which programs a secret may go to."""

    @staticmethod
    def never_given(program: str) -> bool:
        return bool(NEVER_GIVEN.match(program))

    @classmethod
    def named_in(cls, instructions: str) -> tuple[str, ...]:
        named = dict.fromkeys(rows[1] for rows in STATED_COMMAND.finditer(instructions))
        return tuple(name for name in named if not cls.never_given(name) and shutil.which(name))
