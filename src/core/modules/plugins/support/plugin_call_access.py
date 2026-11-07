from core.base.actor_type import ActorType
from core.base.caller.caller import Caller
from core.base.refusal import Refusal


class PluginCallAccess:
    """Who may ask the plugin calls about which agent. A file read goes to the server, which is under no sandbox, so
    this is all that stands between an agent and files past its read limit: a plugin's script or service and a
    person may name any agent, and an agent, or an alias it runs, only itself."""

    @staticmethod
    def is_limited(caller: Caller) -> bool:
        return caller.actor.type is ActorType.AGENT and not caller.plugin_script

    def agent_id(self, requested: int | None, caller: Caller) -> int:
        if requested is None:
            if caller.actor.type is not ActorType.AGENT:
                raise Refusal("only an agent has a checkout of its own", "name one with --agent <n>")
            return caller.actor.id
        if self.is_limited(caller) and requested != caller.actor.id:
            raise Refusal(f"an agent may name only itself, not agent {requested}", "leave out --agent")
        return requested
