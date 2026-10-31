from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.templates.commands.make_template_handler import MakeTemplateHandler
from core.modules.templates.commands.make_template_subcommand import MakeTemplateSubcommand
from core.modules.templates.commands.template_list_subcommand import TemplateListSubcommand
from core.modules.templates.commands.template_show_subcommand import TemplateShowSubcommand
from core.modules.templates.migrations.m001_templates import TemplatesTableMigration
from core.modules.templates.models.template import Template


class TemplatesModule(Module):
    """Adds templates: reusable shapes for tasks, plans and critiques, and the testing template a plan runs
    at each phase end."""

    name = "journal.core.templates"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors"]
    models = [ModelDeclaration(Template, excluded_subcommands=["make", "edit", "show", "list"])]
    migrations = [TemplatesTableMigration]
    handlers = [MakeTemplateHandler]
    subcommands = (MakeTemplateSubcommand, TemplateShowSubcommand, TemplateListSubcommand)
