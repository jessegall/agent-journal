import re
from dataclasses import dataclass

ANSI = re.compile(r"\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|[\x00-\x08\x0b-\x1f\x7f]")
OPTION = re.compile(r"^[ \t]*(?P<cursor>[❯›>])?[ \t]*(?P<number>\d{1,2})[.)][ \t]+(?P<label>\S.*?)[ \t]*$", re.M)
FOOTER = re.compile(r"Enter to (?:select|confirm|continue)|Esc to (?:cancel|exit|go back)|↑/↓|to navigate|press enter", re.I)
QUESTION = re.compile(r"\?\s*$")
TRUSTED = re.compile(r"\btrust\b", re.I)
OWN = re.compile(r"do you want to (?:proceed|make|create)|would you like to run|allow command|approve", re.I)
PAST = re.compile(r"\(current\)|rewind|restore|resume|checkpoint", re.I)
ACCEPT = re.compile(r"^(?:yes|trust|i am using|continue|ok)\b", re.I)
DECLINE = re.compile(r"^(?:no\b|don't|do not|decline|deny|skip|not now|later|cancel|never|reject|disable)", re.I)
QUESTION_LINES = 6
UP, DOWN, ENTER, ESCAPE = "\x1b[A", "\x1b[B", "\r", "\x1b"


@dataclass(frozen=True)
class Option:
    number: int
    label: str
    cursor: bool


@dataclass(frozen=True)
class Menu:
    """A menu in an agent's terminal, recognised by its shape: option lines numbered in a row from one, ending the screen or followed by the selection footer."""

    question: str
    options: tuple[Option, ...]

    @staticmethod
    def plain(raw: str) -> str:
        """The terminal's bytes as text: escape codes and control bytes gone, carriage returns kept as line ends."""
        return ANSI.sub("", raw.replace("\r\n", "\n").replace("\r", "\n"))

    @classmethod
    def on(cls, screen: str) -> "Menu | None":
        """The last menu on the screen's text, or none: its options must be the last thing shown, or have the footer after them."""
        text = cls.plain(screen)
        footers = list(FOOTER.finditer(text))
        above = text[:footers[-1].start()] if footers else text
        found = list(OPTION.finditer(above))
        if not found or (not footers and above[found[-1].end():].strip()):
            return None
        block = []
        for match in reversed(found):
            if block and int(match["number"]) != int(block[0]["number"]) - 1:
                break
            block.insert(0, match)
        if len(block) < 2 or int(block[0]["number"]) != 1:
            return None
        asked = " ".join([line.strip() for line in above[:block[0].start()].splitlines() if line.strip()][-QUESTION_LINES:])
        return cls(asked, tuple(Option(int(m["number"]), m["label"], bool(m["cursor"])) for m in block))

    def foreign(self) -> bool:
        """Whether the menu is the program's own: not a permission question the agent's tool asks, nor a list of past messages, sessions or checkpoints a person opened."""
        return not (OWN.search(self.question) or PAST.search(" ".join((self.question, *(o.label for o in self.options)))))

    def signature(self) -> tuple:
        return (self.question[-200:], *(o.label for o in self.options))

    def accepting(self) -> Option | None:
        """The option that says yes, or the one under the cursor."""
        return next((o for o in self.options if ACCEPT.search(o.label)), None) or next((o for o in self.options if o.cursor), self.options[0])

    def declining(self) -> Option | None:
        return next((o for o in self.options if DECLINE.search(o.label)), None)

    def trusting(self) -> bool:
        """A question whether to trust the folder the journal launched the agent in."""
        return bool(TRUSTED.search(self.question))

    def keys_for(self, taken: Option) -> str:
        """The arrow keys from the option under the cursor to the one taken, by where the labels stand, then Enter."""
        at = next((i for i, o in enumerate(self.options) if o.cursor), 0)
        to = list(self.options).index(taken)
        return (DOWN if to >= at else UP) * abs(to - at) + ENTER
