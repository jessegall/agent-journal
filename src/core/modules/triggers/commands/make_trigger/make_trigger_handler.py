from dataclasses import asdict
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.triggers.models.enums.trigger_action import TriggerAction

from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.triggers.commands.make_trigger.make_trigger import MakeTrigger
from core.modules.triggers.models.trigger import Trigger
from core.modules.triggers.support.trigger_approval import TriggerApproval


class MakeTriggerHandler(Handler[MakeTrigger, Trigger]):
    """Saves a new phrase trigger."""

    command = MakeTrigger

    def __init__(self, repository: Repository, approval: TriggerApproval, catalogue: SkillCatalogue) -> None:
        self.repository, self.approval, self.catalogue = repository, approval, catalogue

    def handle(self, command: MakeTrigger, context: Context) -> Trigger:
        if not command.phrases:
            raise Refusal("a trigger needs a phrase", "give them as 'deploy, release'")
        if command.action is TriggerAction.SKILL and not any(skill.folder == command.details.skill for skill in self.catalogue.skills()):
            raise Refusal(f"skill {command.details.skill} is not available", "choose a skill from journal skill list")
        text = f"Read {command.details.skill}" if command.action is TriggerAction.SKILL else command.text
        return self.repository.save(Trigger(creator_id=context.actor.id, phrases=tuple(command.phrases), action=command.action, text=text, needs_enabling=self.approval.needs_user(context.actor), **asdict(command.details)), context)
