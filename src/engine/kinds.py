class ByKind:
    """A registry of things that each have a kind, asked for the ones of one kind."""

    each: list

    def of(self, kind: str) -> list:
        return [one for one in self.each if one.kind == kind]
