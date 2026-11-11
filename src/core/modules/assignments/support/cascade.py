from collections import Counter
from dataclasses import dataclass, replace

from core.modules.assignments.models.enums.kept_reason import KeptReason
from core.modules.assignments.support.kept_row import KeptRow


@dataclass(frozen=True)
class Cascade:
    """What one assign command did: the model name of each row it assigned, the parent and its children, and
    the child rows it left as they were with the reason for each."""

    assigned_models: tuple[str, ...] = ()
    kept_rows: tuple[KeptRow, ...] = ()

    def with_assigned(self, model_name: str) -> "Cascade":
        return replace(self, assigned_models=(*self.assigned_models, model_name))

    def with_kept(self, model_name: str, row_id: int, reason: KeptReason) -> "Cascade":
        return replace(self, kept_rows=(*self.kept_rows, KeptRow(model_name, row_id, reason)))

    def counts(self) -> dict[str, int]:
        return dict(Counter(self.assigned_models))

    @property
    def text(self) -> str:
        assigned = ", ".join(self.counted(count, model_name) for model_name, count in self.counts().items())
        kept = Counter((row.model_name, row.reason) for row in self.kept_rows)
        kept_text = ", ".join(f"{self.counted(count, model_name)} ({reason.value})" for (model_name, reason), count in kept.items())
        return f"assigned {assigned or 'nothing new'}" + (f"; kept {kept_text}" if kept_text else "")

    @staticmethod
    def counted(count: int, model_name: str) -> str:
        return f"{count} {model_name}" if count == 1 else f"{count} {model_name}s"
