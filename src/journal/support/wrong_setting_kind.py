class WrongSettingKind(ValueError):
    """A setting holds a value of another kind than its option reads."""

    def __init__(self, key: str, value: object) -> None:
        super().__init__(f"the setting {key} holds {value!r}, a value of another kind than it is read as")
        self.key, self.value = key, value
