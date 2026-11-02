from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.base.provider.peer_note import PeerNote
from core.base.provider.providers import Providers
from core.base.query.queries import Queries
from core.modules.messages.commands.record_peer_message.record_peer_message import RecordPeerMessage
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message


class PeerMessageRule(DriverRule):
    """A message another agent session sent to the main agent shows in the chat once it reaches the agent's
    transcript, also while the agent waits."""

    name = "messages.peer"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    overlay_proof = True

    def __init__(self, queries: Queries, providers: Providers) -> None:
        self.queries, self.providers = queries, providers

    def answer(self, hook: AgentHook) -> RuleAnswer:
        provider = self.providers.provider(hook.event.program)
        path = provider.transcript_path(hook.event)
        notes = [note for note in provider.peer_notes(path) if self.is_new(hook.agent_id, note)] if path is not None else []
        return RuleAnswer.allowed().running(*(RecordPeerMessage(hook.environment_id, hook.agent_id, note.sender, note.text, note.key) for note in notes))

    def is_new(self, agent_id: int, note: PeerNote) -> bool:
        return not self.queries.query(Message).filter(agent_id=agent_id, type=MessageType.PEER, peer_key=note.key).exists()
