from enum import StrEnum

from core.base.agent_policy import AgentPolicy
from core.base.helper_type_book import HelperTypeBook


class RoleGroup(StrEnum):
    """A group of agent roles whose members a suite declares, or, for read-only helpers, whose members the
    registered helper types say by their access. A rule that names AgentRole.HELPER in its roles covers
    every helper, workers too; one that holds only for read-only helpers says so with READ_ONLY_HELPERS."""

    ANY = "any"
    TASK = "task"
    PROMPT = "prompt"
    MARK = "mark"
    PLUGIN = "plugin"
    DISPATCH = "dispatch"
    HELPERS = "read-only-helpers"

    def roles(self, policy: AgentPolicy) -> tuple[str, ...]:
        match self:
            case RoleGroup.TASK:
                return policy.task_roles
            case RoleGroup.PROMPT:
                return policy.prompt_roles
            case RoleGroup.MARK:
                return policy.mark_roles
            case RoleGroup.PLUGIN:
                return policy.plugin_roles
            case RoleGroup.DISPATCH:
                return policy.dispatch_roles
            case RoleGroup.ANY | RoleGroup.HELPERS:
                return ()

    def has_role(self, role: str, policy: AgentPolicy, helper_types: HelperTypeBook) -> bool:
        if self is RoleGroup.HELPERS:
            return role in helper_types.helper_keys()
        return self is RoleGroup.ANY or role in self.roles(policy)
