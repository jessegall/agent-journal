from core.base.module.module import Module
from core.base.template.template_declaration import TemplateDeclaration


class FolderNotesModule(Module):
    name = "folder.notes"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.templates", "journal.core.plans"]
    templates = [TemplateDeclaration(title="Folder review", targets=tuple(["plan"]), purpose="critique", brief="Read the plan and name its risks.")]
