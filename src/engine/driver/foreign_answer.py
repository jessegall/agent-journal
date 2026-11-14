from collections.abc import Mapping
from dataclasses import dataclass, field

from engine.driver.foreign_run import ForeignRun
from engine.driver.hook_fields import mapping, text, texts


@dataclass(frozen=True)
class ForeignAnswer:
    name: str
    refusal: str = ""
    lines: tuple[str, ...] = ()
    updated_input: Mapping[str, object] = field(default_factory=dict[str, object])
    terminal: str = ""

    @classmethod
    def read(cls, run: ForeignRun) -> "ForeignAnswer":
        answer = run.answer
        return cls(run.id, text(answer, "refusal"), texts(answer, "lines"),
                   {str(key): value for key, value in mapping(answer.get("updated_input", {}), "updated input").items()}, text(answer, "terminal"))

    def reason(self) -> str:
        return f"{self.name}: {self.refusal}" if self.refusal else ""
