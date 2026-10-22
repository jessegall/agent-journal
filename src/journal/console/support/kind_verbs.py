import argparse

from journal.support.caller_kind import CallerKind


class KindVerbs:
    """A noun's verbs as one kind of caller sees them: every verb parses, so a refusal can name what the kind may run, and help and usage show only the verbs it may run, since a verb added with no help is left out of the listing."""

    def __init__(self, verbs, command, kind: CallerKind) -> None:
        self.verbs, self.command, self.kind = verbs, command, kind
        self.shown: list[str] = []

    def add_parser(self, name: str, **settings) -> argparse.ArgumentParser:
        if self.command.admits(name, self.kind):
            self.shown.append(name)
            self.verbs.metavar = "{" + ",".join(self.shown) + "}"
            return self.verbs.add_parser(name, **settings)
        return self.verbs.add_parser(name, **{key: value for key, value in settings.items() if key != "help"})
