import re
from dataclasses import dataclass

REPLY = "reply"
AWAIT = "await"


@dataclass(frozen=True)
class Tag:
    name: str
    runs: str
    hint: str

    @property
    def command(self) -> re.Pattern:
        return re.compile(r"\bjournal\s+" + r"\s+".join(self.runs.split("{")[0].split()) + r"\b")


TAGS = (
    Tag(REPLY, "message reply {n} {text}", "[!reply:N] makes the turn itself the reply"),
    Tag("log", "work log {text} --n {n}", "[!log:N] makes the turn itself the log entry"),
    Tag("end", "work end {n} --how {text}", "[!end:N] makes the turn itself what landed"),
    Tag("todo", "todo create {name} --brief {text}", '[!todo="the title"] files it with the turn as its brief'),
    Tag("fact", "fact create {name} --brief {text}", '[!fact="the claim", keywords=(...)] files it with the turn as its brief'),
    Tag("rule", "rule create {name} --brief {text}", '[!rule="the ruling", keywords=(...)] files it with the turn as its brief'),
    Tag(AWAIT, "work await {text}", "[!await] makes the rest of the turn what you wait for"),
)
RUNS = {tag.name: tag.runs for tag in TAGS}
RETIRED = ("discovery", "correction", "blocked", "info")
VALUE = r'(?:"[^"]*"|\([^)]*\)|[^,\]\s]+)'
EXTRA = r'\s*,\s*[a-z_]+=' + VALUE
ARGUMENT = r'(?::[0-9]+|="[^"]*")?(?:' + EXTRA + r')*'
CARRIED = re.compile(r'^[ \t]*(?:>\s?)?(?:\*\*)?\[!([a-z]+)(?::([0-9]+(?:,[0-9]+)*)|="([^"]*)")?((?:' + EXTRA + r')*)\]', re.M)
NAMED = re.compile(r'([a-z_]+)=(' + VALUE + r')')
SETTING = re.compile(r"--set ([a-z_]+)=")
INTERNAL = re.compile(r"^[ \t]*(?:\*\*)?\[!internal\]", re.M)


def pattern(names) -> re.Pattern:
    return re.compile(r"^[ \t]*(> ?)?(?:\*\*)?\[!(?:"
                      + "|".join(re.escape(name) for name in names)
                      + r")" + ARGUMENT + r"\](?:\*\*)?(?:[ \t]+|$)", re.M)


ANY = pattern(dict.fromkeys((*RETIRED, *RUNS)))


def visible(text: str) -> str:
    return ANY.sub(lambda found: found.expand(r"\1"), text)


def runs(settings) -> dict:
    return {**RUNS, **settings.runs}


def reader(settings: dict) -> re.Pattern:
    return pattern(dict.fromkeys((*RETIRED, *runs(settings))))


def stripped(text: str, settings: dict) -> str:
    return reader(settings).sub(lambda found: found.expand(r"\1"), text)


def internal(text: str) -> bool:
    return bool(INTERNAL.search(text))


def waits(text: str) -> bool:
    return any(name == AWAIT for name, *_ in CARRIED.findall(text))


def replies(text: str) -> bool:
    return any(name == REPLY and (n or argument) for name, n, argument, _ in CARRIED.findall(text))


def named(extras: str) -> dict[str, str]:
    return {key: ",".join(re.findall(r'"([^"]*)"', value)) if value.startswith("(") else value.strip('"')
            for key, value in NAMED.findall(extras)}


def tag_spelling(text: str) -> str:
    return SETTING.sub(r"\1=", text)


def answered(numbers: list, **_) -> str:
    return f"answer by opening your turn with [!reply:{numbers[0]}]" if len(numbers) == 1 else "answer each by opening a turn with [!reply:<n>]"


def tag_for(command: str) -> Tag | None:
    return next((tag for tag in TAGS if tag.command.search(command)), None)
