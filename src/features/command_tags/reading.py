import re

REPLY = "reply"
RUNS = {REPLY: "message reply {n} {text}", "log": "work log {text} --n {n}", "end": "work end {n} --how {text}",
        "todo": "todo create {name} --brief {text}", "fact": "fact create {name} --brief {text}",
        "rule": "rule create {name} --brief {text}"}
RETIRED = ("discovery", "correction", "blocked", "info")
VALUE = r'(?:"[^"]*"|\([^)]*\)|[^,\]\s]+)'
EXTRA = r'\s*,\s*[a-z_]+=' + VALUE
ARGUMENT = r'(?::[0-9]+|="[^"]*")?(?:' + EXTRA + r')*'
REPLIED = re.compile(r"\bjournal\s+message\s+reply\s+(\d+)")
CARRIED = re.compile(r'^[ \t]*(?:>\s?)?(?:\*\*)?\[!([a-z]+)(?::([0-9]+)|="([^"]*)")((?:' + EXTRA + r')*)\]', re.M)
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


def replies(text: str) -> bool:
    return any(name == REPLY and (n or argument) for name, n, argument, _ in CARRIED.findall(text))


def named(extras: str) -> dict[str, str]:
    return {key: ",".join(re.findall(r'"([^"]*)"', value)) if value.startswith("(") else value.strip('"')
            for key, value in NAMED.findall(extras)}


def tag_spelling(text: str) -> str:
    return SETTING.sub(r"\1=", text)


def answered(numbers: list, **_) -> str:
    return f"answer by opening your turn with [!reply:{numbers[0]}]" if len(numbers) == 1 else "answer each by opening a turn with [!reply:<n>]"
