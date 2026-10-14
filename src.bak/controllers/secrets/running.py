import contextlib
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from resources.base import Refused
from resources.masking import Masker

CHUNK = 4096
NEVER_GIVEN = re.compile(r"^(?:a?sh|bash|zsh|fish|dash|ksh|t?csh|env|xargs|sudo|su|doas|nohup|nice|time|timeout|watch|script|eval|exec|"
                         r"python[\d.]*|pypy[\d.]*|node|deno|bun|ruby|perl[\d.]*|php[\d.]*|lua[\d.]*|osascript|"
                         r"make|npm|npx|yarn|pnpm|pip[\d.]*|uv|uvx|cargo|go|java|dotnet|gradle|mvn|composer)$")
STATED_COMMAND = re.compile(r"(?:^|`|\$ |-- )[ \t]*([a-z][\w.-]*)[ \t]+(?=-|@|https?:)", re.MULTILINE)
THROWAWAY = ("HOME", "XDG_CONFIG_HOME", "XDG_CACHE_HOME", "XDG_DATA_HOME", "XDG_STATE_HOME", "GH_CONFIG_DIR", "DOCKER_CONFIG")


def programs_named(instructions: str) -> list[str]:
    """The programs a secret's instructions show a command for, such as curl in `curl -H @- https://api`; only installed ones a secret may go to."""
    named = dict.fromkeys(found[1] for found in STATED_COMMAND.finditer(instructions))
    return [name for name in named if not NEVER_GIVEN.match(name) and shutil.which(name)]


def checked_program(command: tuple[str, ...], allowed: list[str], n: int) -> str:
    if not command:
        raise Refused("name the command after --, such as journal secret run github -- gh api user")
    program = Path(command[0]).name
    if NEVER_GIVEN.match(program):
        raise Refused(f"a secret is never given to {program}: name the program that uses it directly, such as curl or gh")
    if not allowed:
        raise Refused(f"secret {n} has No allowed programs. Add {program} under Settings > Secrets > secret {n}, or propose it with journal secret propose_programs {n} {program}.")
    if program not in allowed:
        raise Refused(f"{program} is not in secret {n}'s Allowed programs ({', '.join(allowed)}). Add it under Settings > Secrets > secret {n}, or propose it with journal secret propose_programs {n} {program}.")
    if shutil.which(command[0]) is None:
        raise Refused(f"no program {command[0]} here")
    return program


def run_masked(command: tuple[str, ...], values: dict[str, str], masks: dict[str, str], given: bytes | None) -> int:
    home = tempfile.mkdtemp(prefix="journal-secret-")
    environment = {**os.environ, **dict.fromkeys(THROWAWAY, home), **values}
    masker = Masker(masks)
    try:
        child = subprocess.Popen(command, stdin=subprocess.PIPE if given is not None else subprocess.DEVNULL,
                                 stdout=subprocess.PIPE, stderr=subprocess.STDOUT, env=environment)
        if given is not None:
            with contextlib.suppress(BrokenPipeError), child.stdin as stdin:  # a program that never reads its input may exit first
                stdin.write(given)
        out = sys.stdout.buffer
        for chunk in iter(lambda: child.stdout.read1(CHUNK), b""):
            out.write(masker.feed(chunk))
            out.flush()
        out.write(masker.flush())
        out.flush()
        return child.wait()
    finally:
        shutil.rmtree(home, ignore_errors=True)
