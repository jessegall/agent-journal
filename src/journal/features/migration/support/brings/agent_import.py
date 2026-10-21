from pathlib import Path

from journal.features.migration.support.environment_kind import EnvironmentKind
from journal.features.migration.support.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.agent import Agent
from journal.models.environment import Environment
from journal.repositories.agents import Agents
from journal.repositories.environments import Environments
from journal.repositories.migrated_rows import MigratedRows


class AgentImport(EnvironmentKind):
    """A version 3 agent is history here: an ended agent of its provider, under the session its transcript names; no process is started."""

    kind = "agent"
    title = "agents"

    def __init__(self, environments: Environments, tally: MigratedRows, agents: Agents) -> None:
        super().__init__(environments, tally)
        self.agents = agents

    def created(self, row: Version3Row, target: Environment, attached: Path, actor: Actor) -> Agent:
        transcript = row.data.get("transcript", "")
        session = Path(transcript).stem if transcript else f"version-3-agent-{row.n}"
        return self.agents.imported(Agent(environment_id=target.id, session=session, provider=row.data.get("provider", "claude"), state="ended"), row.created_at(), actor)
