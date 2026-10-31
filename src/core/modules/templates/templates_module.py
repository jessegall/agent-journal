from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.modules.templates.commands.make_template_handler import MakeTemplateHandler
from core.modules.templates.commands.make_template_subcommand import MakeTemplateSubcommand
from core.modules.templates.commands.template_list_subcommand import TemplateListSubcommand
from core.modules.templates.commands.template_show_subcommand import TemplateShowSubcommand
from core.modules.templates.migrations.m001_templates import TemplatesTableMigration
from core.modules.templates.models.template import Template
from core.modules.templates.seeders.templates_seeder import TemplatesSeeder
from core.modules.templates.upgrade.templates_move import TemplatesMove


class TemplatesModule(Module):
    """Adds templates: reusable shapes for tasks, plans and critiques, and the testing template a plan runs
    at each phase end."""

    name = "journal.core.templates"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors"]
    models = [ModelDeclaration(Template, excluded_subcommands=["make", "edit", "show", "list"])]
    migrations = [TemplatesTableMigration]
    moves = [TemplatesMove]
    handlers = [MakeTemplateHandler]
    subcommands = (MakeTemplateSubcommand, TemplateShowSubcommand, TemplateListSubcommand)
    seeders = [TemplatesSeeder]
    windows = [WindowDeclaration("templates.templates", "Templates", "templates.js", WindowLoading.COMPONENT, icon=WindowIcon.FILED,
                                 reads=["template list", "template show"], events=["template.*"])]
