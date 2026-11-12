from core.modules.helpers.rules.start_names_model_rule import StartNamesModelRule


class DispatchNamesModelRule(StartNamesModelRule):
    """A worker dispatch names its model, an exact one or default for the profile's own (message 117983)."""

    name = "workers.dispatch-names-model"
    starts = ("worker dispatch",)
