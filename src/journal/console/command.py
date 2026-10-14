from argparse import ArgumentParser, Namespace


class Command:
    """One noun; each verb is a method named after it."""

    noun: str

    def arguments(self, parser: ArgumentParser) -> None: ...

    def run(self, args: Namespace) -> int: ...
