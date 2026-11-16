from engine.module.module import Module
from engine.viewer.button_declaration import ButtonDeclaration, ButtonMenuItem, Choice, ChoiceField, TextField

PATH = "tests.stories.core.modules.viewer.support.acme_buttons_module:AcmeButtonsModule"
FIELDS = (ChoiceField("priority", "Priority", (Choice("normal", "Normal"), Choice("high", "High"))), TextField("message", "Message"))
RUNS = "task edit {row_id} --priority={priority} --brief={message}"


class AcmeButtonsModule(Module):
    name = "acme.review"
    requires_engine = ">=6,<7"
    dependencies = ["journal.core.tasks", "journal.core.viewer"]
    buttons = [ButtonDeclaration("review.edit", ("row.task",), "Review", RUNS, fields=FIELDS,
                                 menu=(ButtonMenuItem("Message", "task edit {row_id} --brief={message}", fields=(FIELDS[1],)),))]
