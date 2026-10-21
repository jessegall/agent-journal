from journal.features.migration.support.builtin_kind import BuiltinKind
from journal.features.migration.support.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.trigger import Trigger
from journal.models.trigger_action import TriggerAction
from journal.repositories.migrated_rows import MigratedRows
from journal.repositories.triggers import Triggers

ACTIONS = {"nudge": TriggerAction.NUDGE, "instruct": TriggerAction.INSTRUCT, "deny": TriggerAction.DENY, "start": TriggerAction.SEQUENCE}


class TriggerImport(BuiltinKind):
    """A trigger of the project's keeps its words, what it does and its text, where version 4 can do the same."""

    kind = "trigger"
    title = "triggers"

    def __init__(self, ledger: MigratedRows, triggers: Triggers) -> None:
        super().__init__(ledger)
        self.triggers = triggers

    def skipped(self, row: Version3Row) -> str:
        return super().skipped(row) or ("" if row.data.get("does") in ACTIONS else f"version 4 has no trigger that does {row.data.get('does')}")

    def created(self, row: Version3Row, actor: Actor) -> Trigger:
        return self.triggers.imported(Trigger(phrases=tuple(row.listed("words")), action=ACTIONS[row.data["does"]], text=row.data.get("text", "")), row.creation_time(), actor)
