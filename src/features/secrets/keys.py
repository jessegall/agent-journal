from controllers.features import SETTING_KEYS


def integration_key_variables(record) -> set[str]:
    """The variables of the secrets picked as the key of a feature, such as an integration, which only the journal's own process uses."""
    return {record.setting(name, {}).get(setting.name) for name, settings in SETTING_KEYS.keyed().items() for setting in settings if setting.secret} - {None, ""}
