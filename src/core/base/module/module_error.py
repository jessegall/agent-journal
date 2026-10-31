class ModuleError(Exception):
    """Raised when the modules cannot be loaded as declared: a version not met, a loop, a missing module, or a
    clash between two of them."""
