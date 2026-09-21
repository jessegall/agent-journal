import re

TAGS = ("discovery", "correction", "blocked", "info", "reply")
RUNS = {"reply": "message reply {n} {text}", "log": "work log {text} --n {n}", "end": "work end {n} --how {text}",
        "todo": "todo create {name} --brief {text}", "fact": "fact create {name} --brief {text}"}
PLACES = {"info": "bar"}
LEVEL = "info"
SHOWN = {"replies": ("reply",), "info": ("reply", "info", "blocked"), "corrections": ("reply", "info", "blocked", "correction"),
         "discoveries": ("reply", "info", "blocked", "correction", "discovery")}
ARGUMENT = r'(?::[^\]\s]+|="[^"]*")?'
LEADING = re.compile(r"^[ \t]*(?:>\s?)?(?:\*\*)?\[!([a-z]+)" + ARGUMENT + r"\]")
REPLIED = re.compile(r"\bjournal\s+message\s+reply\s+(\d+)")
CARRIED = re.compile(r'^[ \t]*(?:>\s?)?(?:\*\*)?\[!([a-z]+)(?::([0-9]+)|="([^"]*)")\]', re.M)


def written(names) -> list[str]:
    return [f"[!{name}]" for name in names]


def pattern(names) -> re.Pattern:
    return re.compile(r"^[ \t]*(> ?)?(?:\*\*)?\[!(?:"
                      + "|".join(re.escape(name) for name in names)
                      + r")" + ARGUMENT + r"\](?:\*\*)?(?:[ \t]+|$)", re.M)


ANY = pattern(dict.fromkeys((*TAGS, *RUNS)))


def visible(text: str) -> str:
    return ANY.sub(lambda found: found.group(1) or "", str(text or ""))


def names(settings: dict) -> list[str]:
    return [str(name).strip().lstrip("[!").rstrip("]") for name in settings.get("names", TAGS) if str(name).strip()] or list(TAGS)


def reader(settings: dict) -> re.Pattern:
    return pattern(names(settings))


def verbosity(settings: dict) -> str:
    chosen = settings.get("verbosity", LEVEL)
    return chosen if chosen in SHOWN else LEVEL


def runs(settings: dict) -> dict:
    return {**RUNS, **settings.get("runs", {})}


def places(settings: dict) -> dict:
    return {**PLACES, **settings.get("places", {})}


def place(text: str, settings: dict) -> str:
    found = LEADING.match(str(text or ""))
    return places(settings).get(found.group(1), "chat") if found else "chat"
