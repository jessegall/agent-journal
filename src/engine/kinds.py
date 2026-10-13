import threading


class ByKind:
    """A registry of things that each have a kind and a key, asked for the ones of one kind. Keeping one again under its key replaces it and moves it last, as registering anew does; a reader gets a whole list, built once after each change rather than on each keep, so wiring a thousand registrations is not a million comparisons."""

    def __init__(self):
        self.held: dict = {}
        self.listed: list | None = []
        self.changing = threading.Lock()

    @property
    def each(self) -> list:
        listed = self.listed
        if listed is None:
            with self.changing:
                listed = self.listed = list(self.held.values())
        return listed

    def keep(self, key, one) -> None:
        with self.changing:
            self.held.pop(key, None)
            self.held[key] = one
            self.listed = None

    def drop(self, key) -> None:
        with self.changing:
            self.held.pop(key, None)
            self.listed = None

    def sort(self, key) -> None:
        with self.changing:
            self.held = dict(sorted(self.held.items(), key=lambda item: key(item[1])))
            self.listed = None

    def clear(self) -> None:
        with self.changing:
            self.held = {}
            self.listed = []

    def of(self, kind: str) -> list:
        return [one for one in self.each if one.kind == kind]
