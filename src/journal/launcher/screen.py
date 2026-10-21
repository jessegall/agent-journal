import os
import shutil
import sys
import termios
import tty

from journal.launcher.support.keys import Keys
from journal.launcher.support.option import Option

BOLD, DIM, ACCENT, GOOD, BADGE, RESET = "\x1b[1m", "\x1b[2m", "\x1b[38;5;111m", "\x1b[38;5;114m", "\x1b[38;5;176m", "\x1b[0m"
STORE_CURSOR, RESTORE_CURSOR, HIDE_CURSOR, VISIBLE_CURSOR = "\x1b7", "\x1b8\x1b[J", "\x1b[?25l", "\x1b[?25h"
HINT = "↑ ↓ to move · Enter to pick · a number to jump · Esc to leave"
ACTION_HINTS = {"x": "x to delete"}


class Screen:
    """The terminal the boot menu draws on: a banner once, then one question at a time in the space under it, each moved through with the arrow keys. Without a terminal to draw on, the same questions are numbered lines answered by typing."""

    def __init__(self, output=sys.stdout, keys: Keys | None = None) -> None:
        self.out = output
        self.interactive = output.isatty() and sys.stdin.isatty()
        self.colour = self.interactive and os.environ.get("TERM", "dumb") != "dumb" and not os.environ.get("NO_COLOR")
        self.keys = keys or Keys(sys.stdin.fileno() if self.interactive else 0)

    def paint(self, code: str, text: str) -> str:
        return f"{code}{text}{RESET}" if self.colour else text

    def banner(self, agent: str, project: str) -> None:
        width = max(40, shutil.get_terminal_size().columns - 4) if self.interactive else 60
        lines = [f"agent-journal", "", f"You're about to start {agent.capitalize()} under the journal,", f"in {project}.", "", "Move with ↑ ↓ and pick with Enter."]
        rule = "─" * width
        body = "\n".join(f"│ {line:<{width - 2}} │" for line in lines)
        clear = "\x1b[2J\x1b[H" if self.interactive else ""
        self.out.write(f"{clear}{self.paint(ACCENT, '┌' + rule + '┐')}\n{body}\n{self.paint(ACCENT, '└' + rule + '┘')}\n{STORE_CURSOR if self.interactive else ''}")
        self.out.flush()

    def pick(self, heading: str, notes: list[str], options: list[Option], default: int) -> int:
        return self.choice(heading, notes, options, default, ())[0]

    def choice(self, heading: str, notes: list[str], options: list[Option], default: int, actions: tuple[str, ...]) -> tuple[int, str]:
        self._clear_screen()
        if self.interactive:
            return self._pick_with_keys(heading, notes, options, default, actions)
        return self._number_choice(heading, notes, options, default, actions)

    def ask(self, prompt: str) -> str:
        self.out.write(f"\n  {self.paint(ACCENT, '›')} {prompt} ")
        self.out.flush()
        try:
            return input().strip()
        except EOFError:
            return ""

    def summary(self, rows: list[tuple[str, str]]) -> None:
        self._clear_screen()
        self.out.write(f"  {self.paint(ACCENT, '?')} {self.paint(BOLD, 'Starting')}\n\n")
        for name, value in rows:
            self.out.write(f"    {self.paint(GOOD, '✓')} {name:<13} {value}\n")
        self.out.write("\n")
        self.out.flush()

    def _clear_screen(self) -> None:
        self.out.write(RESTORE_CURSOR if self.interactive else "\n")

    def _lines(self, heading: str, notes: list[str], options: list[Option], time: int, actions: tuple[str, ...]) -> list[str]:
        width = max(len(option.label) for option in options)
        lines = [f"  {self.paint(ACCENT, '?')} {self.paint(BOLD, heading)}", ""]
        lines += [f"    {self.paint(DIM, note)}" for note in notes] + ([""] if notes else [])
        for i, option in enumerate(options):
            badges = "".join(f"  {self.paint(BADGE, '[' + badge + ']')}" for badge in option.badges)
            label = f"{option.label:<{width}}"
            lines += [""] if option.apart and i else []
            lines.append(f"  {self.paint(ACCENT, '❯')} {self.paint(BOLD, label)}{badges}" if i == time else f"    {label}{badges}")
        hint = " · ".join([HINT, *(ACTION_HINTS[key] for key in actions)])
        return [*lines, "", f"  {self.paint(DIM, hint)}"]

    def _pick_with_keys(self, heading: str, notes: list[str], options: list[Option], time: int, actions: tuple[str, ...]) -> tuple[int, str]:
        fd = sys.stdin.fileno()
        saved = termios.tcgetattr(fd)
        rendered = 0
        try:
            tty.setcbreak(fd)
            self.out.write(HIDE_CURSOR)
            while True:
                lines = self._lines(heading, notes, options, time, actions)
                self.out.write((f"\x1b[{rendered}F\x1b[J" if rendered else "") + "\n".join(lines) + "\n")
                self.out.flush()
                rendered = len(lines)
                for key in self.keys.read():
                    if key in Keys.ENTER:
                        return time, ""
                    if key in actions:
                        return time, key
                    if key == Keys.ESCAPE:
                        raise SystemExit("journal: left without starting")
                    time = self._moved(time, key, len(options))
        finally:
            termios.tcsetattr(fd, termios.TCSADRAIN, saved)
            self.out.write(VISIBLE_CURSOR)
            self.out.flush()

    @staticmethod
    def _moved(time: int, key: str, count: int) -> int:
        if key in Keys.UPWARD:
            return (time - 1) % count
        if key in Keys.DOWN:
            return (time + 1) % count
        if key.isdigit() and 1 <= int(key) <= count:
            return int(key) - 1
        return time

    def _number_choice(self, heading: str, notes: list[str], options: list[Option], default: int, actions: tuple[str, ...]) -> tuple[int, str]:
        self.out.write(f"\n  {heading}\n  {'─' * len(heading)}\n")
        for note in notes:
            self.out.write(f"    {note}\n")
        self.out.write("\n")
        for i, option in enumerate(options, 1):
            badges = "".join(f"  [{badge}]" for badge in option.badges)
            self.out.write(("\n" if option.apart and i > 1 else "") + f"    {i}  {option.label}{badges}{'   ← Enter' if i - 1 == default else ''}\n")
        while True:
            answer = self.ask(">") or str(default + 1)
            action, number = (answer[0], answer[1:].strip()) if answer[:1] in actions else ("", answer)
            if number.isdigit() and 1 <= int(number) <= len(options):
                return int(number) - 1, action
            self.out.write(f"    A number from 1 to {len(options)}.\n")
