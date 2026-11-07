from core.base.viewer.model_searcher import ModelSearcher
from core.modules.templates.models.template import Template
from core.modules.templates.queries.template_query import TemplateQuery


class TemplateSearcher(ModelSearcher):
    """Finds the templates whose title, brief or purpose holds the words."""

    model = Template

    def __init__(self, templates: TemplateQuery) -> None:
        self.templates = templates

    def query(self) -> TemplateQuery:
        return self.templates.active()
