from engine.caller.caller import Caller
from engine.database.actor_table import ActorTable
from engine.driver.agent_message import AgentMessage
from engine.cli.caller_line_check import CallerLineCheck
from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal
from engine.helper_type.journal_line import JournalLine
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.type_command_check import TypeCommandCheck


class AgentLineCheck(CallerLineCheck):
    """Refuses at the server a journal line the calling agent's type does not list, so a line that never
    passed the hook is judged by the same list; a person, the main agent and a plugin's script run every
    line, and the main agent is known from the owner the round already holds, so its row is not read again."""

    def __init__(self, agents: AgentRows, commands: TypeCommandCheck, actors: ActorTable) -> None:
        self.agents, self.commands, self.actors = agents, commands, actors

    def allows(self, caller: Caller, line: JournalLine) -> bool:
        return self.refusal(caller, line) is None

    def check(self, caller: Caller, line: JournalLine) -> None:
        refusal = self.refusal(caller, line)
        if refusal is not None:
            raise Refusal(refusal.text)

    # a line from a plugin's script is the plugin's, judged by what the plugin declares, not by the agent's list
    def refusal(self, caller: Caller, line: JournalLine) -> AgentMessage | None:
        if caller.actor.type is not ActorType.AGENT or caller.plugin_script:
            return None
        owner = self.actors.row_owner(caller.actor.id)
        if owner is not None and owner.is_main:
            return None
        return self.commands.refusal(self.agents.find_unscoped(caller.actor.agent_id()), [line])
