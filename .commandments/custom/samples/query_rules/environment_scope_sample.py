from core.base.model.model import Model


# @sin architecture_scopes_model_without_environment_scope
class RequiredEnvironmentSample(Model):
    """Always belongs to an environment, and does not say so to its queries."""

    environment_id: int


# @righteous architecture_scopes_model_without_environment_scope
class OptionalEnvironmentSample(Model):
    """May belong to no environment, so a scope on it would hide the rows that belong to none."""

    environment_id: int | None = None
