from dataclasses import dataclass


@dataclass(frozen=True)
class SettingsSection:
    """A section a suite adds to the Settings page, or fills out when the page has one of its key: its group,
    the window that draws it with that window's tabs, the section it stands in front of (none: the group's
    end), and the modules whose settings that window draws, so no other section lists them."""

    key: str
    label: str
    icon: str
    window: str
    tabs: tuple[str, ...] = ()
    group: str = "agents"
    next_section: str = ""
    draws_modules: tuple[str, ...] = ()
