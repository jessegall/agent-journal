from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import V3Row, viewer_ref
from journal.models.dump import Dump
from journal.models.ref import Ref
from journal.repositories.dumps import Dumps


class DumpsShaper(Shaper):
    """A dump as the dump pages read it: the pasted text as the brief, the dropped files by name, and each item's standing in its data."""

    type = "dump"

    def __init__(self, dumps: Dumps) -> None:
        self.dumps = dumps

    def rows(self) -> list[V3Row]:
        filed = self.dumps.every_linked()
        return [self.row(d, filed.get(d.id, [])) for d in self.dumps.in_()]

    @staticmethod
    def row(dump: Dump, filed: list[Ref]) -> V3Row:
        data = {"files": {name: "" for name in dump.files}, "parts": list(dump.parts), "items": dump.items, "log": list(dump.log), "question": dump.question, "answers": list(dump.answers),
                "options": list(dump.options), "chosen": dump.chosen, "taken": dump.taken, "declined": list(dump.declined), "said": list(dump.said), "summary": dump.summary,
                "queued_at": dump.queued_at, "stopped": dump.stopped, "dismissed": dump.dismissed, "removed": dump.removed_at, "removed_refs": list(dump.removed_refs)}
        return V3Row.of("dump", dump, title=dump.title, brief=dump.brief, outcome=dump.outcome, completed=dump.completed_at, refs=[viewer_ref(ref) for ref in dict.fromkeys(filed)], data=data)
