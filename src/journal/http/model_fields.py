from dataclasses import fields

from journal.models.model import Model


class ModelFields:
    """A model as its own fields by name: what the API answers for a row, with a resource's few named additions laid beside them."""

    @staticmethod
    def of(model: Model) -> dict:
        return {field.name: getattr(model, field.name) for field in fields(model)}
