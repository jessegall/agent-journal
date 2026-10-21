from dataclasses import fields

from journal.models.model import Model


class ModelFields:
    """A model as the API answers it: the table it is a row of, then its own fields by name, with a resource's few named additions laid beside them."""

    @staticmethod
    def build(model: Model) -> dict:
        return {"table": model.table(), **{field.name: getattr(model, field.name) for field in fields(model)}}
