from core.base.module.module import Module
from core.base.viewer.button_declaration import ButtonDeclaration, ButtonMenuItem, Choice, ChoiceField, TextField

PATH = "tests.stories.core.modules.viewer.support.acme_buttons_module:AcmeButtonsModule"
FIELDS = (ChoiceField("priority", "Priority", (Choice("normal", "Normal"), Choice("high", "High"))), TextField("message", "Message"))
RUNS = "task edit {row_id} --priority={priority} --brief={message}"


class AcmeButtonsModule(Module):
    name = "acme.review"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.tasks", "journal.core.viewer"]
    buttons = [ButtonDeclaration("review.edit", tuple(["row.task"]), "Review", RUNS, fields=FIELDS,
                                 menu=tuple([ButtonMenuItem("Message", "task edit {row_id} --brief={message}", fields=tuple([FIELDS[1]]))]))]
