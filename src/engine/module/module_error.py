class ModuleError(Exception):
    """Raised when the modules cannot be loaded as declared: a failed version requirement, a loop, a missing
    module, or a conflict between two of them."""

    @classmethod
    def import_failed(cls, source: str, error: Exception) -> "ModuleError":
        return cls(f"cannot import module {source}: {error}")
