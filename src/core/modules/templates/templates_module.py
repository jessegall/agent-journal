from engine.skill.skill_declaration import SkillDeclaration
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from engine.template.template_declaration import TemplateDeclaration
from engine.viewer.window_search import WindowSearch
from engine.viewer.window_extension import WindowExtension
from core.modules.templates.support.template_searcher import TemplateSearcher
from engine.viewer.window_declaration import WindowDeclaration
from engine.viewer.window_key import WindowKey
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.templates.commands.make_template.make_template_handler import MakeTemplateHandler
from core.modules.templates.commands.make_template.make_template_subcommand import MakeTemplateSubcommand
from core.modules.templates.commands.template_list.template_list_subcommand import TemplateListSubcommand
from core.modules.templates.commands.template_show.template_show_subcommand import TemplateShowSubcommand
from core.modules.templates.commands.save_standard_templates.save_standard_templates_handler import SaveStandardTemplatesHandler
from core.modules.templates.guards.standard_template_guard import StandardTemplateGuard
from core.modules.templates.listeners.standard_templates_listener import StandardTemplatesListener
from core.modules.templates.migrations.m001_templates import TemplatesTableMigration
from core.modules.templates.migrations.m002_template_module import TemplateModuleColumnMigration
from core.modules.templates.models.template import Template
from core.modules.templates.queries.template_query import TemplateQuery
from core.modules.templates.commands.send_template.send_template_handler import SendTemplateHandler
from core.modules.templates.commands.send_template.send_template_subcommand import SendTemplateSubcommand
from core.modules.templates.seeders.templates_seeder import TemplatesSeeder
from core.modules.templates.upgrade.templates_move import TemplatesMove
from core.modules.templates.support.skeletons import TEMPLATES_TEMPLATES_SKELETON


class TemplatesModule(Module):
    """Adds templates: reusable shapes for tasks, plans and critiques, and the testing template a plan runs
    at each phase end."""

    name = "journal.core.templates"
    templates = [TemplateDeclaration(title="General critique", targets=tuple(["plan"]), purpose="critique",
                                     brief="Read it as a whole and say what you would change, and why.")]
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.drivers", "journal.core.messages", "journal.core.documents", "journal.core.plans", "journal.core.agents", "journal.core.skills"]
    skills = [SkillDeclaration("journal-templates", "Find and use a template for a task, a plan or a review; read it before the first template command of a session", keywords=("template", "templates"), commands=["template"])]
    models = [ModelDeclaration(Template, query=TemplateQuery, excluded_subcommands=["make", "edit", "show", "list"])]
    migrations = [TemplatesTableMigration, TemplateModuleColumnMigration]
    moves = [TemplatesMove]
    handlers = [MakeTemplateHandler, SaveStandardTemplatesHandler, SendTemplateHandler]
    subcommands = [MakeTemplateSubcommand, TemplateShowSubcommand, TemplateListSubcommand, SendTemplateSubcommand]
    listeners = [StandardTemplatesListener]
    guards = [StandardTemplateGuard]
    seeders = [TemplatesSeeder]
    window_extensions = [WindowExtension("messages.chat", reads=["template list"])]
    windows = [WindowDeclaration("templates.templates", "Templates", "templates.js", WindowLoading.COMPONENT, skeleton=TEMPLATES_TEMPLATES_SKELETON, search=WindowSearch(TemplateSearcher, "Search the templates"), group="project", place=WindowPlace.PAGE, icon=WindowIcon.FILED,
                                 reads=["template list", "template show"], events=["template.*"], keys=[WindowKey("templates", "template list", events=["template.*"])])]
