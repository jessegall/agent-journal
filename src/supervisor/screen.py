import os
import sys

BOLD, DIM, ACCENT, GOOD, WARN, RESET = "\x1b[1m", "\x1b[2m", "\x1b[38;5;111m", "\x1b[38;5;114m", "\x1b[38;5;221m", "\x1b[0m"


class Screen:
    """The terminal the boot menu draws on: it clears between questions, and colours only where the terminal can show them."""

    def __init__(self, out=sys.stdout) -> None:
        self.out = out
        self.colour = out.isatty() and os.environ.get("TERM", "dumb") != "dumb" and not os.environ.get("NO_COLOR")

    def paint(self, code: str, text: str) -> str:
        return f"{code}{text}{RESET}" if self.colour else text

    def clear(self) -> None:
        if self.colour:
            self.out.write("\x1b[2J\x1b[H")
        self.out.flush()

    def head(self, project: str, line: str) -> None:
        self.clear()
        self.out.write(f"{self.paint(ACCENT + BOLD, 'Agent journal')}  {self.paint(DIM, '·')}  {self.paint(BOLD, project)}\n")
        self.out.write(f"{self.paint(DIM, line)}\n\n")

    def say(self, text: str = "") -> None:
        self.out.write(text + "\n")

    def option(self, key: str, label: str, note: str = "", chosen: bool = False) -> None:
        mark = self.paint(GOOD, "●") if chosen else self.paint(DIM, "○")
        self.out.write(f"  {mark} {self.paint(BOLD, key):<14} {label}{('  ' + self.paint(DIM, note)) if note else ''}\n")

    def ask(self, prompt: str, default: str = "") -> str:
        self.out.write(f"\n{self.paint(ACCENT, '›')} {prompt}{(' ' + self.paint(DIM, '[' + default + ']')) if default else ''} ")
        self.out.flush()
        try:
            return input().strip()
        except EOFError:
            return ""
