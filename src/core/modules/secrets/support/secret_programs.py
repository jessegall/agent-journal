import re

WRAPPER_PROGRAMS = re.compile(r"^(?:a?sh|bash|zsh|fish|dash|ksh|t?csh|env|xargs|sudo|su|doas|nohup|nice|time|timeout|watch|script|eval|exec|"
                              r"python[\d.]*|pypy[\d.]*|node|deno|bun|ruby|perl[\d.]*|php[\d.]*|lua[\d.]*|osascript|"
                              r"make|npm|npx|yarn|pnpm|pip[\d.]*|uv|uvx|cargo|go|java|dotnet|gradle|mvn|composer|"
                              r"cat|tee|dd|base64|xxd|od|hexdump|sed|awk|jq|openssl|git|ssh|scp|find|docker|cp|mv|printf|echo)$")


class SecretPrograms:
    """Which programs a secret may never go to: a path, a shell, an interpreter, a build tool or a program
    that prints or copies what it is given."""

    @staticmethod
    def is_skipped(program: str) -> bool:
        return "/" in program or WRAPPER_PROGRAMS.match(program) is not None
