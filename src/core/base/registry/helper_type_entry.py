from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any

from engine.enums.access import Access
from engine.helper_type.helper_type import HelperType
from core.base.dotted_path.dotted_path import DottedPath


@dataclass(frozen=True)
class HelperTypeEntry:
    """A helper type and the module that registered it, with its roster stored by class path."""

    module: str
    key: str
    label: str
    access: Access
    separate_folder: bool
    extends: str = ""
    default_profile: str = ""
    start_line: str = ""
    roster: DottedPath | None = None
    run_limit_key: str = ""
    kept_limit_key: str = ""
    profile_limits_key: str = ""
    job_command: tuple[str, ...] = ()
    job_task_flag: str = ""

    @classmethod
    def declared(cls, module: str, declaration: HelperType) -> "HelperTypeEntry":
        roster = DottedPath.class_path(declaration.roster) if declaration.roster is not None else None
        return cls(module, declaration.key, declaration.label, declaration.access, declaration.separate_folder, declaration.extends, declaration.default_profile,
                   declaration.start_line, roster, declaration.run_limit_key, declaration.kept_limit_key, declaration.profile_limits_key,
                   declaration.job_command, declaration.job_task_flag)

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "HelperTypeEntry":
        roster = DottedPath(stored["roster"]["text"]) if stored["roster"] is not None else None
        return cls(stored["module"], stored["key"], stored["label"], Access(stored["access"]), stored["separate_folder"], stored["extends"], stored["default_profile"],
                   stored["start_line"], roster, stored.get("run_limit_key", ""), stored.get("kept_limit_key", ""), stored.get("profile_limits_key", ""),
                   tuple(stored.get("job_command", ())), stored.get("job_task_flag", ""))
