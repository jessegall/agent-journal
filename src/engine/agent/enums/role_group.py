from enum import StrEnum

from engine.helper_type.helper_behaviours import HelperBehaviours
from engine.helper_type.helper_type_book import HelperTypeBook


class RoleGroup(StrEnum):
    """A group of agent roles whose members the registered helper types say by one of their behaviours, or, for
    read-only helpers, by their access. A contribution of the group ANY covers every agent; one that holds
    only for read-only helpers says so with HELPERS."""

    ANY = "any"
    TASK = "task"
    PROMPT = "prompt"
    MARK = "mark"
    PLUGIN = "plugin"
    DISPATCH = "dispatch"
    HELPERS = "read-only-helpers"

    def covers(self, behaviours: HelperBehaviours) -> bool:
        match self:
            case RoleGroup.TASK:
                return behaviours.takes_tasks
            case RoleGroup.PROMPT:
                return behaviours.takes_prompts
            case RoleGroup.MARK:
                return behaviours.takes_marks
            case RoleGroup.PLUGIN:
                return behaviours.runs_plugins
            case RoleGroup.DISPATCH:
                return behaviours.dispatches
            case RoleGroup.ANY | RoleGroup.HELPERS:
                return False

    def has_role(self, role: str, helper_types: HelperTypeBook) -> bool:
        if self is RoleGroup.HELPERS:
            return role in helper_types.read_access_keys()
        return self is RoleGroup.ANY or self.covers(helper_types.behaviours(role))
