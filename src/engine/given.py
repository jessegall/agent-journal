def given(**fields) -> dict:
    return {key: value for key, value in fields.items() if value is not None and value != ""}
