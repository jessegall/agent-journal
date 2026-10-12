import re
from dataclasses import dataclass

from resources.memo import Memo


REPLY_WITH = "reply_with"
REPLY = "reply"
AWAIT = "await"
LOG = "log"


@dataclass(frozen=True)
class Tag:
    name: str
    runs: str
    hint: str
    options: tuple[str, ...] = ()
    said_in_chat: bool = True
    """Whether the turn's words reach the chat as well as the row the tag writes. A reply IS the chat, and a wait and a work log are already shown where they belong, so those three say nothing twice."""

    @property
    def command(self) -> re.Pattern:
        return re.compile(r"\bjournal\s+" + r"\s+".join(self.runs.split("{")[0].split()) + r"\b")


TAGS = (
    Tag(REPLY, "message reply {n} {text}",
        '[!reply:N] makes the turn itself the reply; [!reply:N, todos=(7, 8)] or [!reply:N, about=("doc:80")] links what it is about',
        ("about", "todos"), said_in_chat=False),
    Tag(LOG, "work log {text} --n {n}", "[!log:N] makes the turn itself the log entry", said_in_chat=False),
    Tag("end", "work end {n} --how {text}", "[!end:N] makes the turn itself what landed"),
    Tag("todo", "todo create {name} --brief {text}", '[!todo="the title"] files it with the turn as its brief'),
    Tag("fact", "fact create {name} --brief {text}", '[!fact="the claim", keywords=(...)] files it with the turn as its brief'),
    Tag("rule", "rule create {name} --brief {text}", '[!rule="the ruling", keywords=(...)] files it with the turn as its brief'),
    Tag(AWAIT, "work await {text}", "[!await] makes the rest of the turn what you wait for; [!await on=(\"<id>\", \"helper:<n>\")] waits on those", ("on",), said_in_chat=False),
)
RUNS = {tag.name: tag.runs for tag in TAGS}
OPTIONS = {tag.name: tag.options for tag in TAGS}
RETIRED = ("discovery", "correction", "blocked", "info", "internal")
VALUE = r'(?:"[^"]*"|\([^)]*\)|[^,\]\s]+)'
EXTRA = r'(?:\s*,\s*|\s+)[a-z_]+=' + VALUE
ARGUMENT = r'(?::[0-9]+(?:,[0-9]+)*|="[^"]*")?(?:' + EXTRA + r')*'
CARRIED = re.compile(r'^[ \t]*(?:>\s?)?(?:\*\*)?\[!([a-z]+)(?::([0-9]+(?:,[0-9]+)*)|="([^"]*)")?((?:' + EXTRA + r')*)\]', re.M)
NAMED = re.compile(r'([a-z_]+)=(' + VALUE + r')')
SETTING = re.compile(r"--set ([a-z_]+)=")
READERS = Memo()


def pattern(names) -> re.Pattern:
    return re.compile(r"^[ \t]*(> ?)?(?:\*\*)?\[!(?:"
                      + "|".join(re.escape(name) for name in names)
                      + r")" + ARGUMENT + r"\](?:\*\*)?(?:[ \t]+|$)", re.M)


ANY = pattern(dict.fromkeys((*RETIRED, *RUNS)))


def visible(text: str, tags: re.Pattern = ANY) -> str:
    return tags.sub(lambda found: found.expand(r"\1"), text)


def removed(text: str, tags: re.Pattern) -> str:
    return CARRIED.sub("", tags.sub("", text))


def runs(settings) -> dict:
    return {**RUNS, **settings.runs}


def reader(settings: dict) -> re.Pattern:
    return READERS.get("runs", settings.runs, lambda: pattern(dict.fromkeys((*RETIRED, *runs(settings)))))


def carries(text: str, tag: str) -> bool:
    """Whether a line of the text opens with that tag, which is how a tag asks for the command it stands for to run."""
    return any(name == tag for name, *_ in CARRIED.findall(text))


def replies(text: str) -> bool:
    return any(name == REPLY and (n or argument) for name, n, argument, _ in CARRIED.findall(text))


QUIET = {tag.name for tag in TAGS if not tag.said_in_chat} - {REPLY}


def shown(text: str, settings) -> str:
    """The turn's words as they reach the chat, its tags taken out."""
    return visible(text, reader(settings)).strip()


def kept_out_of_the_chat(text: str) -> bool:
    """Whether the turn's words belong only to the row its tag writes, which each tag says of itself; a reply says it only when it names the message it answers."""
    return replies(text) or any(carries(text, tag) for tag in QUIET)


def named(extras: str) -> dict[str, str]:
    return {key: listed(value) if value.startswith("(") else value.strip('"') for key, value in NAMED.findall(extras)}


def listed(value: str) -> str:
    """The items of a list a tag carries, quoted or bare: a tag naming to-dos writes (7, 8) as readily as ("7", "8"), and reading only the quoted ones answered nothing at all."""
    return ",".join(one.strip().strip('"') for one in value.strip("()").split(",") if one.strip().strip('"'))


def tag_spelling(text: str) -> str:
    return SETTING.sub(r"\1=", text)


def tag_for(command: str) -> Tag | None:
    return next((tag for tag in TAGS if tag.command.search(command)), None)
