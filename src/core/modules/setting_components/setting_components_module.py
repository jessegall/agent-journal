from engine.module.module import Module


class SettingComponentsModule(Module):
    """Adds the setting components: the pieces a settings screen is drawn from, one for each value of the
    setting component enum, which a window imports as @journal/setting-components."""

    name = "journal.core.setting_components"
    requires_core = ">=5,<6"
