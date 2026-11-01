from dataclasses import replace

from core.base.command.context import Context
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.nudge import Nudge
from core.base.driver.rule_answers import RuleAnswers
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.timestamp import Timestamp
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.models.nudge_record import NudgeRecord


class NudgeLog:
    """Which lines of a hook are held back: one already said in this turn, one said again too soon, and a repeat within the hook; and what was said, kept per agent. A refusal is never held back."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def held_lines(self, agent_id: int, answers: RuleAnswers, timestamp: Timestamp) -> frozenset[tuple[str, str]]:
        lines = answers.line_nudges
        if not lines:
            return frozenset()
        turn_began_at = self.turn_began_at(agent_id)
        return frozenset((nudge.key, nudge.text) for nudge in lines if self.is_held(agent_id, nudge, turn_began_at, timestamp))

    def is_held(self, agent_id: int, nudge: Nudge, turn_began_at: Timestamp | None, timestamp: Timestamp) -> bool:
        said_at = self.record(agent_id, nudge).last_said_at
        if said_at is None:
            return False
        if nudge.repeat_seconds and said_at.elapsed_seconds(timestamp) < nudge.repeat_seconds:
            return True
        return nudge.once_per_turn and (turn_began_at is None or said_at.text >= turn_began_at.text)

    def turn_began_at(self, agent_id: int) -> Timestamp | None:
        prompts = self.queries.query(HookCall).filter(agent_id=agent_id, hook=HookEventName.PROMPT).newest().page(1, 1).rows
        return prompts[0].created_at if prompts else None

    def record(self, agent_id: int, nudge: Nudge) -> NudgeRecord:
        kept = self.queries.query(NudgeRecord).filter(agent_id=agent_id, key=nudge.key, text=nudge.text).page(1, 1).rows
        return kept[0] if kept else NudgeRecord(agent_id=agent_id, creator_id=0, key=nudge.key, text=nudge.text)

    def write(self, agent_id: int, answers: RuleAnswers, context: Context) -> None:
        for nudge in answers.said_nudges:
            current = self.record(agent_id, nudge)
            self.repository.save(replace(current, creator_id=context.actor.id, said_count=current.said_count + 1, last_said_at=context.timestamp), context)
