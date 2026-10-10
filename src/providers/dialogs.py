import json
import re
import subprocess
import threading
from dataclasses import dataclass

OPTION = re.compile(r"^[ \t]*(?P<cursor>[❯›>])?[ \t]*(?P<number>\d{1,2})[.)][ \t]+(?P<label>\S.*?)[ \t]*$", re.M)
FOOTER = re.compile(r"Enter to (?:select|confirm|continue)|Esc to (?:cancel|exit|go back)|↑/↓|to navigate|press enter", re.I)
TRUSTED = re.compile(r"\btrust\b|development channels", re.I)
CONSENT = re.compile(r"consent|data.?shar|privacy|telemetry|analytics|improve (?:the|our)|collect|terms", re.I)
OWN = re.compile(r"do you want to (?:proceed|make|create)|would you like to run|allow command|approve", re.I)
PAST = re.compile(r"\(current\)|rewind|restore|resume|checkpoint", re.I)
ACCEPT = re.compile(r"^(?:yes|trust|i am using|continue|ok)\b", re.I)
DECLINE = re.compile(r"^(?:no\b|don't|do not|decline|deny|skip|not now|later|cancel|never|reject|disable)", re.I)
UP, DOWN, ENTER = b"\x1b[A", b"\x1b[B", b"\r"
ESCAPE = b"\x1b"
QUESTION_LINES = 6
ASK_TIMEOUT = 120
CHOICES = "menu_choices"


@dataclass(frozen=True)
class Option:
    number: int
    label: str
    cursor: bool


@dataclass(frozen=True)
class Choice:
    """What to press for a menu the agent's screen shows, and the plain words for what was chosen."""

    keys: bytes
    said: str


@dataclass(frozen=True)
class Menu:
    """A menu in an agent's terminal, recognised by its shape: option lines numbered in a row, with the provider's selection footer after them."""

    question: str
    options: tuple[Option, ...]

    @classmethod
    def on(cls, screen: str) -> "Menu | None":
        """The last menu on the screen text, or none when the screen shows no options followed by a footer."""
        screen = screen.replace("\r", "")
        footers = list(FOOTER.finditer(screen))
        if not footers:
            return None
        above = screen[:footers[-1].start()]
        found = list(OPTION.finditer(above))
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
        """Whether the menu is the program's own: not a question the agent asks, a permission the journal's asks already carry, or a list of past messages, sessions or checkpoints that you opened to read."""
        return not (OWN.search(self.question) or PAST.search(" ".join((self.question, *(option.label for option in self.options)))))

    def signature(self) -> tuple:
        return tuple(option.label for option in self.options)

    def wanted(self) -> Option | None:
        """The option to take, by its words: a folder or channel the journal launched the agent into is trusted; consent and data sharing are declined; anything else takes its safe way out, a decline, or none."""
        if TRUSTED.search(self.question):
            return next((option for option in self.options if ACCEPT.search(option.label)), None)
        return next((option for option in self.options if DECLINE.search(option.label)), None)

    def key(self) -> str:
        return json.dumps(self.signature())

    def numbered(self, reply: str) -> Option | None:
        """The option whose number opens the reply of an agent asked which to take, or none when the reply names no option."""
        found = re.search(r"\d+", reply)
        return next((option for option in self.options if found and option.number == int(found[0])), None)

    def asking(self) -> str:
        options = "\n".join(f"{option.number}. {option.label}" for option in self.options)
        return f"""A coding agent's terminal shows this menu and waits for an answer.

Question: {self.question}

Options:
{options}

Which option lets the agent carry on its work? Reply with the option number only."""

    def remembered(self, record) -> Option | None:
        label = record.setting(CHOICES, {}).get(self.key())
        return next((option for option in self.options if option.label == label), None)

    def remember(self, record, taken: Option) -> None:
        record.set_setting(CHOICES, {**record.setting(CHOICES, {}), self.key(): taken.label})

    def choice(self, taken: Option | None = None) -> Choice:
        taken = taken or self.wanted()
        if taken is None:
            return Choice(ESCAPE, "closed it without choosing")
        return Choice(self.moved_to(taken) + ENTER, f'chose "{taken.label}"')

    def moved_to(self, taken: Option) -> bytes:
        """The arrow keys from the option the cursor is on to the labelled one, by where the labels stand and not by the numbers they carry."""
        labels = [option.label for option in self.options]
        at = next((i for i, option in enumerate(self.options) if option.cursor), 0)
        to = labels.index(taken.label)
        return (DOWN if to >= at else UP) * abs(to - at)


class Asking:
    """One standalone agent per unknown menu, asked off the thread that answers the terminal; its answer waits here until the menu is looked at again."""

    def __init__(self, driver):
        self.driver = driver
        self.answers: dict[str, Option | None] = {}
        self.running: set[str] = set()

    def start(self, menu: Menu) -> None:
        if menu.key() in self.running:
            return
        argv = self.driver.ask_argv(menu.asking())
        if not argv:
            return
        self.running.add(menu.key())
        threading.Thread(target=self.ask, args=(menu, argv), daemon=True).start()

    def ask(self, menu: Menu, argv) -> None:
        try:
            done = subprocess.run(argv, capture_output=True, text=True, timeout=ASK_TIMEOUT, stdin=subprocess.DEVNULL)
            self.answers[menu.key()] = menu.numbered(done.stdout)
        except (OSError, subprocess.SubprocessError):
            self.answers[menu.key()] = None

    def pending(self, menu: Menu) -> bool:
        return menu.key() in self.running and menu.key() not in self.answers

    def answer(self, menu: Menu) -> Option | None:
        return self.answers.get(menu.key())
