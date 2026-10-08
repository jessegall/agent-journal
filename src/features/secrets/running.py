import base64
import contextlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.parse
from pathlib import Path

from resources.base import Refused

CHUNK = 4096
NEVER_GIVEN = re.compile(r"^(?:a?sh|bash|zsh|fish|dash|ksh|t?csh|env|xargs|sudo|su|doas|nohup|nice|time|timeout|watch|script|eval|exec|"
                         r"python[\d.]*|pypy[\d.]*|node|deno|bun|ruby|perl[\d.]*|php[\d.]*|lua[\d.]*|osascript|"
                         r"make|npm|npx|yarn|pnpm|pip[\d.]*|uv|uvx|cargo|go|java|dotnet|gradle|mvn|composer)$")
THROWAWAY = ("HOME", "XDG_CONFIG_HOME", "XDG_CACHE_HOME", "XDG_DATA_HOME", "XDG_STATE_HOME", "GH_CONFIG_DIR", "DOCKER_CONFIG")


def forms(value: str) -> list[bytes]:
    raw = value.encode()
    found = {raw, base64.b64encode(raw), base64.urlsafe_b64encode(raw), urllib.parse.quote(value, safe="").encode(),
             json.dumps(value)[1:-1].encode(), raw.hex().encode()}
    return sorted((form.rstrip(b"=") for form in found if form), key=len, reverse=True)


class Masker:
    def __init__(self, masks: dict[str, str]):
        self.masks = [(form, f"[secret {name}]".encode()) for value, name in masks.items() for form in forms(value)]
        self.carried = max((len(form) for form, _ in self.masks), default=1) - 1
        self.held = b""

    def feed(self, chunk: bytes) -> bytes:
        self.held = self.masked(self.held + chunk)
        cut = max(len(self.held) - self.carried, 0)
        ready, self.held = self.held[:cut], self.held[cut:]
        return ready

    def flush(self) -> bytes:
        ready, self.held = self.masked(self.held), b""
        return ready

    def masked(self, text: bytes) -> bytes:
        for form, mask in self.masks:
            text = text.replace(form, mask)
        return text


NO_PROGRAMS = "this secret lists no programs, so it is given to none: the user names the programs it may go to on the Secrets page"


def checked_program(command: tuple[str, ...], allowed: list[str]) -> str:
    if not command:
        raise Refused("name the command after --, such as journal secret run github -- gh api user")
    program = Path(command[0]).name
    if NEVER_GIVEN.match(program):
        raise Refused(f"a secret is never given to {program}: name the program that uses it directly, such as curl or gh")
    if not allowed:
        raise Refused(NO_PROGRAMS)
    if program not in allowed:
        raise Refused(f"this secret may be given only to {', '.join(allowed)}, not {program}")
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
