from engine.module.model_declaration import ModelDeclaration
from core.modules.templates.models.template import Template
from core.modules.templates.queries.template_query import TemplateQuery


class TemplateModelDeclaration(ModelDeclaration):
    """How the module declares Template."""

    model = Template
    query = TemplateQuery
    excluded_subcommands = ["make", "show", "list"]
