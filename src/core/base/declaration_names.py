from core.base.viewer.window_icon import WindowIcon


class DeclarationNames:
    """The checks every declaration a module makes shares, for windows, marks, docks and buttons alike: its name
    starts with the module's short name, and an icon it shows is one of the shell's icon set."""

    @staticmethod
    def short_name(module_name: str) -> str:
        return module_name.rsplit(".", 1)[-1]

    @staticmethod
    def prefix_problems(owner: str, name: str, module_name: str) -> list[str]:
        short_name = DeclarationNames.short_name(module_name)
        return [] if name.startswith(f"{short_name}.") else [f"{owner} does not start with its module's name, {short_name}"]

    @staticmethod
    def icon_problems(owner: str, *icons: str) -> list[str]:
        return [f"{owner} shows the icon {icon}, which is not in the shell's icon set" for icon in icons if icon not in tuple(WindowIcon)]
