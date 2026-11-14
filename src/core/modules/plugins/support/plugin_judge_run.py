import shlex
from collections.abc import Mapping
from dataclasses import dataclass

from engine.types.type_guards import is_list, is_mapping


@dataclass(frozen=True)
class PluginJudgeRun:
    """The run a plugin's queue answer asks the journal to queue: the kind of run its manifest declares under
    processes, and the command that judges."""

    category: str
    command: tuple[str, ...]

    @classmethod
    def parsed(cls, fields: Mapping[object, object]) -> "PluginJudgeRun | None":
        run: object = fields["run"] if "run" in fields else None
        if not is_mapping(run):
            return None
        command: object = run["command"] if "command" in run else None
        if not is_list(command) or not command:
            return None
        return cls(str(run["kind"]) if "kind" in run else "", tuple(str(part) for part in command))

    def line(self) -> str:
        return shlex.join(self.command)
