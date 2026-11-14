from typing import Self

from engine.database.database import Database
from engine.model.tables import Tables
from engine.query.query import Query
from core.modules.drivers.support.active_modules import ActiveModules
from core.modules.templates.conditions.excluded_template_modules import ExcludedTemplateModules
from core.modules.templates.models.template import Template


class TemplateQuery(Query[Template]):
    """Reads templates with the modules active in an environment applied as a named filter."""

    def __init__(self, database: Database, tables: Tables, modules: ActiveModules) -> None:
        super().__init__(database, tables, Template)
        self.modules = modules

    def active(self) -> Self:
        return self.matching(ExcludedTemplateModules(self.modules.inactive()))
