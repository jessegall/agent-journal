import re
from dataclasses import dataclass

from journal.providers.support.option import Option

ANSI = re.compile(r"\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|[\x00-\x08\x0b-\x1f\x7f]")
OPTION = re.compile(r"^[ \t]*(?P<cursor>[❯›>])?[ \t]*(?P<number>\d{1,2})[.)][ \t]+(?P<label>\S.*?)[ \t]*$", re.M)
FOOTER = re.compile(r"Enter to (?:select|confirm|continue)|Esc to (?:cancel|exit|go back)|↑/↓|to navigate|press enter", re.I)
QUESTION = re.compile(r"\?\s*$")
TRUSTED = re.compile(r"\btrust\b", re.I)
SWITCHING_MODEL = re.compile(r"\bswitch model\b", re.I)
PERMISSION = re.compile(r"do you want to (?:proceed|make this edit|create|run|allow|read)|allow .* to\b", re.I)
PERMISSION_PATTERN = re.compile(r"do you want to (?:proceed|make|create)|would you like to run|allow command|approve", re.I)
HISTORY_PATTERN = re.compile(r"\(current\)|rewind|restore|resume|checkpoint", re.I)
ACCEPT = re.compile(r"^(?:yes|trust|i am using|continue|ok)\b", re.I)
DECLINE = re.compile(r"^(?:no\b|don't|do not|decline|deny|skip|not now|later|cancel|never|reject|disable)", re.I)
QUESTION_LINES = 6
RULE = re.compile(r"^[─━═\-_]{5,}$")
UPWARD, DOWN, ENTER, ESCAPE = "\x1b[A", "\x1b[B", "\r", "\x1b"


@dataclass(frozen=True)
class Menu:
    """A menu in an agent's terminal, recognised by its shape: option lines numbered in a row from one, ending the screen, followed by the selection footer, or with the cursor on one of them though more is drawn below."""

    question: str
    options: tuple[Option, ...]

    @staticmethod
    def plain(raw: str) -> str:
        return ANSI.sub("", raw.replace("\r\n", "\n").replace("\r", "\n"))

    @classmethod
    def parsed(cls, screen: str) -> "Menu | None":
        text = cls.plain(screen)
        footers = list(FOOTER.finditer(text))
        above = text[:footers[-1].start()] if footers else text
        rows = list(OPTION.finditer(above))
        if not rows:
            return None
        block = []
        for match in reversed(rows):
            if block and int(match["number"]) != int(block[0]["number"]) - 1:
                break
            block.insert(0, match)
        if len(block) < 2 or int(block[0]["number"]) != 1:
            return None
        if not footers and above[rows[-1].end():].strip() and not any(m["cursor"] for m in block):
            return None
        asked = " ".join(cls.question_lines(above[:block[0].start()]))
        return cls(asked, tuple(Option(int(m["number"]), m["label"], bool(m["cursor"])) for m in block))

    @staticmethod
    def question_lines(above: str) -> list[str]:
        lines = [line.strip() for line in above.splitlines() if line.strip()]
        ruled = [i for i, line in enumerate(lines) if RULE.match(line)]
        return lines[ruled[-1] + 1:][-QUESTION_LINES:] if ruled else lines[-QUESTION_LINES:]

    def foreign(self) -> bool:
        return not (PERMISSION_PATTERN.search(self.question) or HISTORY_PATTERN.search(" ".join((self.question, *(o.label for o in self.options)))))

    def signature(self) -> tuple:
        return (self.question[-200:], *(o.label for o in self.options))

    def accepting(self) -> Option | None:
        return next((o for o in self.options if ACCEPT.search(o.label)), None) or next((o for o in self.options if o.cursor), self.options[0])

    def confirming(self) -> bool:
        return any(ACCEPT.search(o.label) for o in self.options) and self.declining() is not None

    def declining(self) -> Option | None:
        return next((o for o in self.options if DECLINE.search(o.label)), None)

    def trusting(self) -> bool:
        return bool(TRUSTED.search(self.question))

    def asking_permission(self) -> bool:
        return bool(PERMISSION.search(self.question))

    def switching_model(self) -> bool:
        return bool(SWITCHING_MODEL.search(self.question))

    def keys(self, taken: Option) -> str:
        time = next((i for i, o in enumerate(self.options) if o.cursor), 0)
        to = list(self.options).index(taken)
        return (DOWN if to >= time else UPWARD) * abs(to - time) + ENTER
