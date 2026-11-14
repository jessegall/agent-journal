from core.modules.templates.windows.templates_windows import TEMPLATES_WINDOWS
from core.modules.templates.models.declarations.template_model_declaration import TemplateModelDeclaration
from core.modules.templates.templates.templates_templates import TEMPLATES_TEMPLATES
from core.modules.templates.skills.declarations.templates_skills import TEMPLATES_SKILLS
from engine.module.module import Module
from engine.viewer.window_extension import WindowExtension
from core.modules.templates.commands.make_template.make_template_handler import MakeTemplateHandler
from core.modules.templates.commands.make_template.make_template_subcommand import MakeTemplateSubcommand
from core.modules.templates.commands.template_list.template_list_subcommand import TemplateListSubcommand
from core.modules.templates.commands.template_show.template_show_subcommand import TemplateShowSubcommand
from core.modules.templates.commands.save_standard_templates.save_standard_templates_handler import SaveStandardTemplatesHandler
from core.modules.templates.guards.standard_template_guard import StandardTemplateGuard
from core.modules.templates.listeners.standard_templates_listener import StandardTemplatesListener
from core.modules.templates.migrations.m001_templates import TemplatesTableMigration
from core.modules.templates.migrations.m002_template_module import TemplateModuleColumnMigration
from core.modules.templates.commands.send_template.send_template_handler import SendTemplateHandler
from core.modules.templates.commands.send_template.send_template_subcommand import SendTemplateSubcommand
from core.modules.templates.seeders.templates_seeder import TemplatesSeeder
from core.modules.templates.upgrade.templates_move import TemplatesMove


class TemplatesModule(Module):
    """Adds templates: reusable shapes for tasks, plans and critiques, and the testing template a plan runs
    at each phase end."""

    name = "journal.core.templates"
    templates = TEMPLATES_TEMPLATES
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.drivers", "journal.core.messages", "journal.core.documents", "journal.core.plans", "journal.core.agents", "journal.core.skills"]
    skills = TEMPLATES_SKILLS
    models = [TemplateModelDeclaration]
    migrations = [TemplatesTableMigration, TemplateModuleColumnMigration]
    moves = [TemplatesMove]
    handlers = [MakeTemplateHandler, SaveStandardTemplatesHandler, SendTemplateHandler]
    subcommands = [MakeTemplateSubcommand, TemplateShowSubcommand, TemplateListSubcommand, SendTemplateSubcommand]
    listeners = [StandardTemplatesListener]
    guards = [StandardTemplateGuard]
    seeders = [TemplatesSeeder]
    window_extensions = [WindowExtension("messages.chat", reads=["template list"])]
    windows = TEMPLATES_WINDOWS
