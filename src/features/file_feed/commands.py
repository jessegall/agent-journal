from dataclasses import asdict

from features.file_feed.feed import NoSuchEdit, PAGE, Side, edited_file, edited_image, edits_before, edits_since, notes
from features.parts import Command, Context
from resources.base import Missing, Refused


class ShowChanges(Command):
    name = "changes"

    def run(self, context: Context, agents):
        return {"changes": [asdict(note) for note in reversed(notes(agents.record))]}


class ShowEdits(Command):
    name = "edits"

    def run(self, context: Context, agents, n: int, since: float = 0.0, last: int = PAGE):
        return asdict(edits_since(agents.record, n, since, last))


class ShowOlderEdits(Command):
    name = "older_edits"

    def run(self, context: Context, agents, n: int, before: float, last: int = PAGE):
        return asdict(edits_before(agents.record, n, before, last))


class ShowEditedFile(Command):
    name = "edited_file"

    def run(self, context: Context, agents, n: int, id: str, side: str = Side.AFTER):
        if side not in Side:
            raise Refused(f"side is {Side.BEFORE} or {Side.AFTER}")
        try:
            return asdict(edited_file(agents.record, n, id, Side(side)))
        except NoSuchEdit as error:
            raise Missing(str(error)) from error


class ShowEditedImage(Command):
    name = "edited_image"

    def run(self, context: Context, agents, n: int, id: str):
        try:
            return edited_image(agents.record, n, id)
        except NoSuchEdit as error:
            raise Missing(str(error)) from error
