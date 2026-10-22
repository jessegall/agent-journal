from pathlib import Path

from journal.config import Config
from journal.features.workers.support.worker_branch import WorkerBranch
from journal.models.agent_role import AgentRole
from journal.models.author import Author
from journal.models.message import Message
from journal.models.subagent import Subagent
from journal.providers.providers import Providers
from journal.repositories.agents import Agents
from journal.repositories.messages import Messages
from journal.repositories.subagents import Subagents
from journal.repositories.workers import Workers
from journal.support.actor import Actor


class SubagentChat:
    """A subagent's own chat: its prompt, each message sent to it, and each block of text it writes, read from its own transcript from where the last read stopped, as messages of its agent id in a subagent's chat."""

    def __init__(self, config: Config, messages: Messages, subagents: Subagents, agents: Agents, workers: Workers, providers: Providers, branch: WorkerBranch) -> None:
        self.config, self.messages, self.subagents, self.agents, self.workers, self.providers, self.branch = config, messages, subagents, agents, workers, providers, branch

    def instruction(self, subagent: Subagent, text: str, actor: Actor) -> Message:
        return self.messages.save(Message(environment_id=subagent.environment_id, author=Author.USER, text=text, session=subagent.session, agent_role=AgentRole.SUBAGENT), actor)

    def read(self, subagent: Subagent) -> Subagent:
        if not subagent.session:
            return subagent
        provider = self.providers.lookup(self.agents.session_agent(subagent.dispatcher).provider)
        blocks = provider.path_texts(provider.subagent_transcript(self.place(subagent), subagent.dispatcher, subagent.session), subagent.transcript_bytes)
        if blocks.time == subagent.transcript_bytes:
            return subagent
        if not subagent.transcript_bytes:
            self.instruction(subagent, subagent.brief.strip(), Actor.agent(subagent.dispatcher))
        for i, text in enumerate(blocks.texts):
            self.turn(subagent, text, f"transcript:{subagent.session}:{subagent.transcript_bytes}:{i}")
        return self.subagents.save(subagent.with_(transcript_bytes=blocks.time), Actor.agent(subagent.dispatcher))

    def turn(self, subagent: Subagent, text: str, key: str) -> None:
        if self.messages.sent_with(key):
            return
        self.messages.save(Message(environment_id=subagent.environment_id, author=Author.AGENT, text=text, session=subagent.session, agent_role=AgentRole.SUBAGENT, idempotency=key), Actor.agent(subagent.dispatcher))

    def place(self, subagent: Subagent) -> Path:
        workers = self.workers.session_worker(subagent.dispatcher)
        return self.branch.place(workers[0]) if workers else self.config.root
