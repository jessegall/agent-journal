from dataclasses import dataclass

from core.base.model.view_model import ViewModel
from core.modules.drivers.models.support.views import ENVIRONMENT_MENU_ROWS_SELECT


@dataclass(frozen=True, kw_only=True)
class EnvironmentMenuRow(ViewModel):
    """An environment as the boot menu offers it: its suite setting and whether a main agent runs in it."""

    cli_name = "environment-menu-row"
    view = "environment_menu_rows"
    key = "id"
    select = ENVIRONMENT_MENU_ROWS_SELECT

    id: int
    name: str
    folder: str
    branch: str
    suite_setting: str
    main_running: bool
