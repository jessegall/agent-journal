from core.modules.helpers.policies.start_names_model_policy import StartNamesModelPolicy


class DispatchNamesModelPolicy(StartNamesModelPolicy):
    """A worker dispatch names its model, an exact one or default for the profile's own (message 117983)."""

    key = "workers.dispatch-names-model"
    rank = "workers.policies"
    starts = tuple(["worker dispatch"])
