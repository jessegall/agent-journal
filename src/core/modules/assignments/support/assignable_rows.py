from engine.model.assignable import Assignable
from engine.model.children import Children
from engine.model.model import Model
from engine.query.queries import Queries
from engine.registry.registry import Registry
from core.modules.assignments.support.linked_rows import LinkedRows
from core.modules.assignments.errors.unassignable_model_refusal import UnassignableModelRefusal


class AssignableRows:
    """Finds the row a command names by the command line name of its model and its id, among the models that
    declare themselves assignable; any other model is refused with the names of those that can be assigned. It also finds the parent rows
    of a row, the rows of the models that declare the row's model among their children, and the parent and
    child that a link row joins."""

    def __init__(self, registry: Registry, queries: Queries) -> None:
        self.registry, self.queries = registry, queries

    def assignable_models(self) -> dict[str, type[Assignable]]:
        models = {cli_name: entry.model_class() for cli_name, entry in self.registry.models.items()}
        return {cli_name: model for cli_name, model in models.items() if issubclass(model, Assignable)}

    def parents(self, row: Assignable) -> tuple[Assignable, ...]:
        found: list[Assignable] = []
        for model in self.assignable_models().values():
            for children in model.assigns:
                if children.model is type(row):
                    found.extend(self.queries.query(model).find_many(self.parent_ids(row, children)))
        return tuple(found)

    def parent_ids(self, row: Assignable, children: Children) -> list[int]:
        if children.link_model is None or children.link_column is None:
            parent_id = getattr(row, children.column)
            return [parent_id] if parent_id is not None else []
        links = self.queries.query(children.link_model).filter(**{children.link_column: row.id}).all_rows()
        return [getattr(link, children.column) for link in links]

    def linked(self, link: Model) -> tuple[LinkedRows, ...]:
        declared = [(model, children) for model in self.assignable_models().values() for children in model.assigns if children.link_model is type(link) and children.link_column is not None]
        return tuple(LinkedRows(self.queries.query(model).find(getattr(link, children.column)), self.queries.query(children.model).find(getattr(link, children.link_column)))
                     for model, children in declared)

    def find(self, cli_name: str, row_id: int) -> Assignable:
        models = self.assignable_models()
        if cli_name not in models:
            raise UnassignableModelRefusal(cli_name, sorted(models))
        return self.queries.query(models[cli_name]).find(row_id)
