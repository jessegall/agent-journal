from dataclasses import dataclass


@dataclass(frozen=True)
class ActionBody:
    """What the viewer sends with a create or an act, in version 3's words, read once where it arrives."""

    title: str = ""
    brief: str = ""
    text: str = ""
    body: str = ""
    about: str = ""
    idempotency: str = ""
    options: tuple[str, ...] = ()
    agent: str = "claude"
    key: str = ""
    value: str = ""
    values: tuple[str, ...] = ()
    """The value when the viewer sent a list, such as the buttons pressed on a card."""
    steps: tuple[str, ...] = ()
    words: tuple[str, ...] = ()
    does: str = ""
    how: str = ""
    face: str = ""
    ref: str = ""
    kind: str = ""
    field: str = ""
    secret_fields: tuple[str, ...] = ()
    programs: tuple[str, ...] = ()
    proposed: tuple[str, ...] = ()
    helpers: bool = False
    expires: str = "7d"
    password: str = ""
    endpoint: str = ""
    username: str = ""
    master_password: str = ""
    host: str = ""
    domain: str = ""
    comments: bool = False
    pick: int = -1
    """The number of an offered step."""
    sent: frozenset[str] = frozenset()
    """The names the viewer sent, so an update changes only those and keeps the rest."""

    @classmethod
    def from_payload(cls, payload: dict) -> "ActionBody":
        texts = {name: str(payload[name]) for name in ("title", "brief", "text", "body", "about", "idempotency", "key", "value", "does", "how", "face", "ref", "kind", "field", "agent", "expires", "password", "endpoint", "username", "master_password", "host", "domain") if payload.get(name) is not None}
        lists = {name: tuple(payload[name]) for name in ("secret_fields", "programs", "proposed") if payload.get(name) is not None}
        words = payload.get("words") or ()
        picks = {"pick": int(payload["pick"])} if str(payload.get("pick", "")).lstrip("-").isdigit() else {}
        return cls(**texts, **lists, **picks,
                   options=tuple(cls.titled(option) for option in payload.get("options") or ()),
                   steps=tuple(title for title in (cls.titled(step) for step in payload.get("steps") or ()) if title),
                   words=tuple(w.strip() for w in (words.split(",") if isinstance(words, str) else words) if w.strip()),
                   values=tuple(str(v) for v in payload["value"]) if isinstance(payload.get("value"), list) else (),
                   helpers=bool(payload.get("helpers")),
                   comments=bool(payload.get("comments")),
                   sent=frozenset(payload))

    @staticmethod
    def titled(item) -> str:
        """An option or a step as the viewer sends it, a bare title or a card with one."""
        return str(item.get("title", "")) if isinstance(item, dict) else str(item)

    def has(self, name: str) -> bool:
        return name in self.sent

    def changes(self, **fields) -> dict:
        """Of the row's fields named here, each with the name it has in this body, those the viewer sent."""
        return {row_field: getattr(self, name) for row_field, name in fields.items() if self.has(name)}
