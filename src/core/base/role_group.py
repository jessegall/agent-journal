from enum import StrEnum

from core.base.agent_policy import AgentPolicy


class RoleGroup(StrEnum):
    """A group of agent roles whose members a suite declares."""

    ANY = "any"
    TASK = "task"
    PROMPT = "prompt"
    PLUGIN = "plugin"
    DISPATCH = "dispatch"

    def roles(self, policy: AgentPolicy) -> tuple[str, ...]:
        match self:
            case RoleGroup.TASK:
                return policy.task_roles
            case RoleGroup.PROMPT:
                return policy.prompt_roles
            case RoleGroup.PLUGIN:
                return policy.plugin_roles
            case RoleGroup.DISPATCH:
                return policy.dispatch_roles
            case RoleGroup.ANY:
                return ()

    def has_role(self, role: str, policy: AgentPolicy) -> bool:
        return self is RoleGroup.ANY or role in self.roles(policy)
