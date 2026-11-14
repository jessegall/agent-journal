from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.commands.claim_agent_line.claim_agent_line import ClaimAgentLine
from core.modules.drivers.commands.deliver_agent_line.deliver_agent_line import DeliverAgentLine
from core.modules.drivers.commands.drop_agent_line.remove_agent_line import RemoveAgentLine
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.commands.release_agent_line.release_agent_line import ReleaseAgentLine
from core.modules.drivers.models.agent_line import AgentLine


class AgentLineModelDeclaration(ModelDeclaration):
    """How the module declares AgentLine."""

    model = AgentLine
    commands = [DeliverAgentLine, ClaimAgentLine, ReleaseAgentLine, EnterAgentLine, RemoveAgentLine]
