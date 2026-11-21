from dataclasses import asdict
from datetime import datetime, timezone

from journal.config import Config
from journal.features.hydration.support.transcript_chat import TranscriptChat
from journal.models.agent import Agent
from journal.support.agent_role import AgentRole
from journal.models.environment import Environment
from journal.models.message import Message
from journal.providers.providers import Providers
from journal.repositories.agents import Agents
from journal.repositories.environments import Environments
from journal.repositories.messages import Messages
from journal.repositories.scope import Scope
from journal.support.actor import Actor
from journal.support.rejection import Rejection


class SessionHydration:
    """Fills a new environment's chat from a conversation an agent program stored for this project, each message at its own time and none of them reported to the agent as new, and keeps the session as the environment's ended agent, so its first launch carries the conversation on; a line at the end says where the chat arrived from, until the first agent there has been asked to read it; the project's stored conversations are listed here for the viewer's form and the boot menu, and how far each environment being filled has come."""

    def __init__(self, config: Config, providers: Providers, messages: Messages, agents: Agents, scope: Scope, environments: Environments) -> None:
        self.config, self.providers, self.messages, self.agents, self.scope, self.environments = config, providers, messages, agents, scope, environments
        self.filling: dict[str, int] = {}

    def filled_percent(self, name: str) -> int:
        return self.filling.get(name, 0)

    def past_sessions(self) -> list[dict]:
        names = {environment.row_id: environment.name for environment in self.environments.all()}
        session_environments = {agent.session: names.get(agent.environment_id, "") for agent in self.agents.all_agents()}
        rows = [{**asdict(conversation), "title": provider.title, "environment": session_environments.get(conversation.session, "")} for provider in self.providers.all() for conversation in provider.past_sessions(self.config.root)]
        return sorted(rows, key=lambda row: row["updated_at"], reverse=True)

    def created(self, name: str, provider: str, session: str, actor: Actor) -> Environment:
        if self.environments.matching(name=name):
            raise Rejection(f"environment {name} exists already: a session fills only a new environment's chat")
        environment = self.environments.lookup(name)
        self.hydrate(environment, provider, session, actor)
        return environment

    def hydrate(self, environment: Environment, provider: str, session: str, actor: Actor) -> int:
        program = self.providers.lookup(provider)
        path = program.transcript(self.config.root, session)
        if path is None:
            raise Rejection(f"no {provider} session {session} is stored for this project on this machine")
        self.filling[environment.name] = 0
        rows = TranscriptChat(session).read(program.turns(path))
        last = rows[-1].time if rows else path.stat().st_mtime
        with self.scope.environment(environment.row_id):
            for index, row in enumerate(rows):
                self.messages.imported(row.message.with_(environment_id=environment.row_id), self.moment(row.time), actor)
                self.filling[environment.name] = (index + 1) * 100 // len(rows)
            self.agents.imported(Agent(environment_id=environment.row_id, session=session, provider=provider, state="ended", role=AgentRole.MAIN), self.moment(last), actor)
            self.messages.imported(Message.hydration(provider, session, f"This chat was filled from {program.title} session {session[:8]}: {len(rows)} messages.").with_(environment_id=environment.row_id), self.moment(last), actor)
        self.filling.pop(environment.name, None)
        return len(rows)

    @staticmethod
    def moment(time: float) -> datetime:
        return datetime.fromtimestamp(time, timezone.utc)
