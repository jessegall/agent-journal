import os
import re
import select
import sys
import termios
import tty
from dataclasses import dataclass

UP, DOWN = ("\x1b[A", "k", "\x1bOA"), ("\x1b[B", "j", "\x1bOB")
ENTER, ESCAPE = ("\r", "\n"), "\x1b"
ACCENT, DIM, BADGE, BOLD, RESET = "\x1b[36m", "\x1b[2m", "\x1b[35m", "\x1b[1m", "\x1b[0m"
KEYS = re.compile(r"\x1b[\[O][A-Za-z]|\x1b|[^\x1b]")
MORE_KEYS_WITHIN = 0.05
HINT = "↑ ↓ to move · Enter to pick · a number to jump · Esc to leave"


@dataclass(frozen=True)
class Choice:
    label: str
    badges: tuple = ()


def choices_of(given: list) -> list[Choice]:
    return [one if isinstance(one, Choice) else Choice(str(one)) for one in given]


def lines(heading: str, notes: list[str], choices: list[Choice], at: int) -> list[str]:
    width = max(len(choice.label) for choice in choices)
    shown = [f"  {ACCENT}?{RESET} {BOLD}{heading}{RESET}", ""]
    shown += [f"    {DIM}{note}{RESET}" for note in notes] + ([""] if notes else [])
    for i, choice in enumerate(choices):
        badges = "".join(f"  {BADGE}[{badge}]{RESET}" for badge in choice.badges)
        label = f"{choice.label:<{width}}"
        shown.append(f"  {ACCENT}❯ {BOLD}{label}{RESET}{badges}" if i == at else f"    {label}{badges}")
    return [*shown, "", f"  {DIM}{HINT}{RESET}"]


def read_keys(fd: int) -> list[str]:
    try:
        raw = os.read(fd, 64)
    except OSError:
        raw = b""
    if not raw:
        raise SystemExit("journal: the input ended before a choice was made")
    while raw.endswith((b"\x1b", b"\x1b[", b"\x1bO")) and select.select([fd], [], [], MORE_KEYS_WITHIN)[0]:
        raw += os.read(fd, 64)
    return KEYS.findall(raw.decode(errors="ignore"))


def pick(heading: str, notes: list[str], given: list, default: int) -> int:
    choices = choices_of(given)
    at, drawn = default, 0
    fd = sys.stdin.fileno()
    saved = termios.tcgetattr(fd)
    try:
        tty.setcbreak(fd)
        sys.stdout.write("\x1b[?25l")
        while True:
            shown = lines(heading, notes, choices, at)
            sys.stdout.write((f"\x1b[{drawn}F\x1b[J" if drawn else "") + "\n".join(shown) + "\n")
            sys.stdout.flush()
            drawn = len(shown)
            for key in read_keys(fd):
                if key in ENTER:
                    return at
                if key == ESCAPE:
                    raise SystemExit("journal: left without starting")
                if key in UP:
                    at = (at - 1) % len(choices)
                elif key in DOWN:
                    at = (at + 1) % len(choices)
                elif key.isdigit() and 1 <= int(key) <= len(choices):
                    at = int(key) - 1
    finally:
        termios.tcsetattr(fd, termios.TCSADRAIN, saved)
        sys.stdout.write("\x1b[?25h")
        sys.stdout.flush()
