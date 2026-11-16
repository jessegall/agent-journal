from engine.module.module import Module
from engine.template.template_declaration import TemplateDeclaration
from engine.viewer.button_declaration import ButtonDeclaration


class FolderNotesModule(Module):
    name = "folder.notes"
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.templates", "journal.core.plans", "journal.core.viewer"]
    templates = [TemplateDeclaration(title="Folder review", targets=("plan",), purpose="critique", brief="Read the plan and name its risks.")]
    buttons = [ButtonDeclaration("notes.review", ("row.plan",), "Review", "plan edit {row_id} --brief=Reviewed")]
