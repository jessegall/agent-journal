from core.base.viewer.model_searcher import ModelSearcher
from core.modules.templates.models.template import Template


class TemplateSearcher(ModelSearcher):
    """Finds the templates whose title, brief or purpose holds the words."""

    model = Template
