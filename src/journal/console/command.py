from argparse import ArgumentParser, Namespace

from journal.models.actor import Actor


class Command:
    """One noun; each verb is a method named after it. The actor is who ran it: the agent whose session the environment names, else the local user."""

    noun: str

    def arguments(self, parser: ArgumentParser) -> None: ...

    def run(self, args: Namespace, by: Actor) -> int: ...
