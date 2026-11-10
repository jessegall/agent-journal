from engine.model.model_error import ModelError


class UnknownStateError(ModelError):
    """A row was given a state, or took a move, that no installed module registers for its model."""
