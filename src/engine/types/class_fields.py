from dataclasses import MISSING, fields


# a declaration written as a class sets its fields as class attributes; a field whose default is made fresh for each
# declaration has no class attribute unless the class sets it
def class_fields(declared: type, data_class: type) -> dict[str, object]:
    return {field.name: getattr(declared, field.name) if hasattr(declared, field.name) or field.default_factory is MISSING else field.default_factory()
            for field in fields(data_class)}
