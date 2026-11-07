from core.base.user_approval import UserApproval
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.command.move_row import MoveRow
from core.base.model.model import Model
from core.base.model.state_book import StateBook
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.documents.commands.comment_text.comment_text import CommentText
from core.modules.drivers.support.active_modules import ActiveModules
from core.modules.messages.models.message import Message
from core.modules.templates.commands.send_template.send_template import SendTemplate
from core.modules.templates.models.template import Template
from core.modules.templates.support.template_purposes import PURPOSES, PLAIN_PURPOSE
from core.modules.templates.support.template_targets import TemplateTargets


class SendTemplateHandler(Handler[SendTemplate, Message]):
    """Checks a person's template request and sends it as a comment linked to the target row."""

    command = SendTemplate

    def __init__(self, queries: Queries, active: ActiveModules, targets: TemplateTargets, bus: Bus, book: StateBook) -> None:
        self.queries, self.active, self.targets, self.bus, self.book = queries, active, targets, bus, book

    def handle(self, command: SendTemplate, context: Context) -> Message:
        if context.actor.type is not ActorType.USER:
            raise UserApproval(f"Send template {command.template_id}?")
        template = self.queries.query(Template).find(command.template_id)
        if not self.active.is_active(template.module):
            raise Refusal(f"template {template.id} is not offered here", "journal template list shows those that are")
        target = self.targets.row(command.target, template, context.environment_id)
        purpose = PURPOSES.get(template.purpose, PLAIN_PURPOSE)
        is_chat_visible = not (template.purpose == "critique" and target.model.model_name == "plan")
        commenting = CommentText(target.model, target.id, purpose.text(template, target, command.values), is_chat_visible=is_chat_visible)
        message = self.bus.dispatch(commenting, context.nested(commenting))
        if purpose.move and self.has_move(target.model, purpose.move):
            moving = MoveRow(target.model.model_name, target.id, purpose.move)
            self.bus.dispatch(moving, context.nested(moving))
        return message

    def has_move(self, model: type[Model], name: str) -> bool:
        lifecycle = self.book.lifecycle(model)
        return lifecycle is not None and lifecycle.has_move(name)
