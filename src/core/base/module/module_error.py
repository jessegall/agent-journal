class ModuleError(Exception):
    """Raised when the modules cannot be loaded as declared: a failed version requirement, a loop, a missing
    module, or a conflict between two of them."""
