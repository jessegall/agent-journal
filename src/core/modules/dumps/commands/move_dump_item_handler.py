import re
from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.dumps.commands.move_dump_item import MoveDumpItem
from core.modules.dumps.commands.support.dump_line import DumpLine
from core.modules.dumps.models.dump import Dump
from core.modules.dumps.models.dump_item import DumpItem
from core.modules.dumps.models.enums.item_state import ItemState

NOTE, FILED, FAILED = "note", "filed", "failed"
STATES = {NOTE: ItemState.READ, FILED: ItemState.FILED, FAILED: ItemState.FAILED}
REF = re.compile(r"^[a-z_-]+:\d+$")
ENDED = (ItemState.FILED, ItemState.FAILED)


class MoveDumpItemHandler(Handler[MoveDumpItem, DumpLine]):
    """Notes, files or fails one item of an open dump, and closes the dump with its outcome once no item is left."""

    command = MoveDumpItem

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: MoveDumpItem, context: Context) -> DumpLine:
        dump = self.queries.query(Dump).find(command.dump_id)
        if dump.closed_at is not None:
            raise Refusal(f"dump {dump.id} is closed", "a closed dump takes no more")
        items = list(self.queries.query(DumpItem).filter(dump_id=dump.id).oldest().all_rows())
        matching = [item for item in items if str(item.position) == command.item]
        if not matching:
            raise Refusal(f"dump {dump.id} has no item '{command.item}'", "its items are " + ", ".join(str(item.position) for item in items))
        if not command.text.strip():
            raise Refusal("say what was done with it" if command.action != NOTE else "say what you noted of it", "give it in words after the item")
        bad_refs = [ref for ref in command.refs if not REF.match(ref)]
        if bad_refs:
            raise Refusal(f"a ref is a table and a number, not '{bad_refs[0]}'", "such as tasks:1")
        updated = self.repository.save(self.updated(matching[0], command), context)
        items = [updated if item.id == updated.id else item for item in items]
        if all(item.state in ENDED for item in items):
            return DumpLine(self.close(dump, items, context))
        return DumpLine(f"dump {dump.id}: {self.count(items, ItemState.FILED)} filed")

    def updated(self, item: DumpItem, command: MoveDumpItem) -> DumpItem:
        if command.action == NOTE:
            return replace(item, state=ItemState.READ, note=command.text)
        return replace(item, state=STATES[command.action], summary=command.text, refs=command.refs)

    def close(self, dump: Dump, items: list[DumpItem], context: Context) -> str:
        outcome = f"{self.count(items, ItemState.FILED)} filed, {self.count(items, ItemState.FAILED)} failed"
        self.repository.save(replace(dump, closed_at=context.timestamp, outcome=outcome), context)
        return f"dump {dump.id} closed: {outcome}"

    def count(self, items: list[DumpItem], state: ItemState) -> int:
        return len([item for item in items if item.state is state])
