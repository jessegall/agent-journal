WINDOW_SETTINGS = "viewer.window."


def window_setting_key(window: str, key: str) -> str:
    return f"{WINDOW_SETTINGS}{window}.{key}"
