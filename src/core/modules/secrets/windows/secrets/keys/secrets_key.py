from engine.viewer.window_key import WindowKey


class SecretsKey(WindowKey):
    """The secrets data of the secrets.secrets window."""

    name = "secrets"
    read = "secret list"
    events = ["secret.*"]
