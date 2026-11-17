from collections.abc import Mapping
from dataclasses import dataclass, replace
from typing import Any

from engine.enums.access import Access
from engine.helper_type.command_allow_list import CommandAllowList
from engine.helper_type.helper_behaviours import HelperBehaviours
from engine.helper_type.helper_type import HelperType
from engine.dotted_path.dotted_path import DottedPath


@dataclass(frozen=True)
class HelperTypeEntry:
    """A helper type and the module that registered it, with its behaviours, the commands it may run, its roster
    stored by class path and the keys of the helper types its class extends."""

    module: str
    key: str
    label: str
    access: Access
    separate_folder: bool
    behaviours: HelperBehaviours
    bases: tuple[str, ...] = ()
    default_profile: str = ""
    start_line: str = ""
    roster: DottedPath | None = None
    run_limit_key: str = ""
    kept_limit_key: str = ""
    profile_limits_key: str = ""
    queue_limit_key: str = ""
    job_command: tuple[str, ...] = ()
    job_task_flag: str = ""
    line: str = ""
    commands: CommandAllowList = CommandAllowList()

    # a read-only type that is the helper, or extends it, also runs the journal lines other modules add for helpers
    def with_helper_lines(self, helper_key: str, lines: tuple[str, ...]) -> "HelperTypeEntry":
        if helper_key not in (self.key, *self.bases) or self.access is not Access.READ or not lines:
            return self
        return replace(self, commands=self.commands.joined(CommandAllowList(lines=lines)))

    @classmethod
    def declared(cls, module: str, declaration: type[HelperType]) -> "HelperTypeEntry":
        roster = DottedPath.class_path(declaration.roster) if declaration.roster is not None else None
        return cls(module, declaration.key, declaration.label, declaration.access, declaration.separate_folder, declaration.behaviours, declaration.bases(), declaration.default_profile,
                   declaration.start_line, roster, declaration.run_limit_key, declaration.kept_limit_key, declaration.profile_limits_key, declaration.queue_limit_key,
                   declaration.job_command, declaration.job_task_flag, declaration.line, declaration.commands)

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "HelperTypeEntry":
        roster = DottedPath(stored["roster"]["text"]) if stored["roster"] is not None else None
        return cls(stored["module"], stored["key"], stored["label"], Access(stored["access"]), stored["separate_folder"], HelperBehaviours(**stored["behaviours"]), tuple(stored.get("bases", ())), stored["default_profile"],
                   stored["start_line"], roster, stored.get("run_limit_key", ""), stored.get("kept_limit_key", ""), stored.get("profile_limits_key", ""), stored.get("queue_limit_key", ""),
                   tuple(stored.get("job_command", ())), stored.get("job_task_flag", ""), stored.get("line", ""),
                   CommandAllowList.restored(stored["commands"]))

    def matches(self, helper_type: type[HelperType]) -> bool:
        return helper_type.key in self.type_keys()

    def extends(self, base: str) -> bool:
        return base in self.type_keys()

    def type_keys(self) -> tuple[str, ...]:
        return (self.key, *self.bases)
