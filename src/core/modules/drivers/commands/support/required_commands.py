from collections.abc import Sequence

from core.base.command.context import Context
from core.base.driver.nudge import Nudge
from core.base.query.queries import Queries
from core.base.query.conditions.is_null import IsNull
from core.base.repository.repository import Repository
from core.modules.drivers.models.required_command import RequiredCommand


class RequiredCommands:
    """Opens a required_command for each line said that declares the command paying it, once while it stays
    open."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def open(self, agent_id: int, nudges: Sequence[Nudge], call_id: int, context: Context) -> None:
        for nudge in nudges:
            if nudge.required_command and not self.queries.query(RequiredCommand).filter(agent_id=agent_id, required_command=nudge.required_command).matching(IsNull("closed_at")).exists():
                self.repository.save(RequiredCommand(agent_id=agent_id, creator_id=context.actor.id, key=nudge.key, line=nudge.text, required_command=nudge.required_command, opened_call_id=call_id), context)
