class ModelError(Exception):
    """Raised when a model is changed in a way it never allows, such as setting its state directly."""
