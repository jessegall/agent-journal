from dataclasses import replace

from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from core.base.module.module_actors import ModuleActors
from engine.errors.refusal import Refusal
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.chat.models.chat_mark import ChatMark
from core.modules.updates.commands.show_update_step.show_update_step import ShowUpdateStep
from core.modules.updates.models.enums.update_mark_type import UpdateMarkType
from core.modules.updates.models.enums.update_step import UpdateStep

MODULE_NAME = "journal.core.updates"


class ShowUpdateStepHandler(Handler[ShowUpdateStep, ChatMark]):
    """Shows the mark of a server update in the environment's chat, as the updates module, and brings it to
    its step in place by the key server-update:<run>."""

    command = ShowUpdateStep

    def __init__(self, bus: Bus, actors: ModuleActors) -> None:
        self.bus, self.actors = bus, actors

    def handle(self, command: ShowUpdateStep, context: Context) -> ChatMark:
        if context.environment_id is None:
            raise Refusal("a server update shows its mark in an environment's chat", "name one with --environment")
        step = command.step
        reason = command.detail if step is UpdateStep.FAILED else ""
        key = f"server-update:{command.run}"
        mark = ShowMark(UpdateMarkType.SERVER_UPDATE, step, key, step.text(command.detail), detail=reason,
                        outcome=step.outcome, figure=step.figure, fraction=step.fraction, ended=step.is_ended)
        return self.bus.dispatch(mark, replace(context, actor=self.actors.actor(MODULE_NAME)))
