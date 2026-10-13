from dataclasses import asdict, dataclass, field, fields, replace

MARKED = {"terminal": "commands", "branch": "commits", "list": "sequences", "bolt": "triggers"}
RECALLED = {"rule": "rules", "fact": "facts", "reminder": "reminders"}
NOTES, RULES = "notes", "rules"
NOTHING_GIVEN = ("", 0, 0.0, ())


def split(kind, facts: dict) -> tuple[dict, dict]:
    """The facts a type declares and the rest, told apart. A fact nobody gave stays out of both, so the field's own default stands and no reader invents one."""
    own = {f.name for f in fields(kind)} - {"extras"}
    given = {name: value for name, value in facts.items() if value is not None}
    return ({name: value for name, value in given.items() if name in own},
            {name: value for name, value in given.items() if name not in own})


@dataclass(frozen=True)
class Card:
    """One mark in the agent's chat: what it says, how it looks, and what it belongs to. A plugin's own keys travel in extras, since a plugin declares its card's look itself."""

    label: str
    at: float = 0.0
    key: str = ""
    icon: str = ""
    tone: str = ""
    color: str = ""
    side: str = ""
    state: str = ""
    detail: str = ""
    title: str = ""
    name: str = ""
    command: str = ""
    ref: str = ""
    row: str = ""
    go: str = ""
    found: str = ""
    reads: tuple = ()
    started: float = 0.0
    ended: float = 0.0
    runs: int = 0
    kind: str = ""
    plugin: str = ""
    settle: str = ""
    settled: str = ""
    settled_at: float = 0.0
    extras: dict = field(default_factory=dict)

    @classmethod
    def named(cls, **facts) -> "Card":
        """A card from the facts a caller names, with a plugin's own keys set aside."""
        declared, extras = split(cls, facts)
        return cls(**declared, extras=extras)

    @classmethod
    def of_data(cls, data: dict) -> "Card":
        """The card an agent row holds, read back. Its chat kind is not stored, so a row written before the kind existed reads the same as one written today."""
        return cls.named(**{name: value for name, value in data.items() if name != "shows"})

    def changed(self, **facts) -> "Card":
        """This card with the facts named written over it: what a second mark on the same key does."""
        declared, extras = split(type(self), facts)
        return replace(self, extras={**self.extras, **extras}, **declared)

    def shows(self) -> str:
        """The chat kind this card belongs to: the one it names, else what its icon marks, else a notice. A plugin's own card names its kind, so a card is never a plugin note by carrying a name."""
        return self.kind or MARKED.get(self.icon, NOTES)

    def as_data(self) -> dict:
        """The card as the agent row stores it: what it was given, flat, and nothing it was not."""
        own = {name: value for name, value in asdict(self).items() if name != "extras" and value not in NOTHING_GIVEN}
        return {**own, **self.extras, "label": self.label}


@dataclass(frozen=True)
class Whisper:
    """A rule, fact or reminder said to the agent alone, kept so the chat can show what it was told."""

    ref: str
    title: str
    words: str = ""
    at: float = 0.0

    @classmethod
    def of_data(cls, data: dict) -> "Whisper":
        declared, _ = split(cls, data)
        return cls(**declared)

    def said(self) -> str:
        """What the chat shows for it: the words it carries, or its title when it carries none."""
        return self.words or self.title

    def shows(self) -> str:
        return RECALLED.get(self.ref.split(":")[0], RULES)

    def as_data(self) -> dict:
        return asdict(self)


@dataclass(frozen=True)
class Marks:
    """The cards and whispers one agent row holds: everything the chat shows for that agent."""

    cards: tuple = ()
    whispers: tuple = ()

    @classmethod
    def of_data(cls, data: dict) -> "Marks":
        return cls(tuple(Card.of_data(card) for card in data.get("cards") or []),
                   tuple(Whisper.of_data(whisper) for whisper in data.get("whispers") or []))

    def as_data(self) -> dict:
        """What the phone and the desktop read: each mark as it is stored, with the chat kind it shows under beside it, so both read one answer."""
        return {"cards": [{**card.as_data(), "shows": card.shows()} for card in self.cards],
                "whispers": [{**whisper.as_data(), "shows": whisper.shows()} for whisper in self.whispers]}
