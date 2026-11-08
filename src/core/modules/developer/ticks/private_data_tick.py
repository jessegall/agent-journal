from core.base.command.bus import Bus
from core.base.container import Container
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.chat.models.enums.chat_mark_type import ChatMarkType
from core.modules.chat.models.enums.private_data_mark_variant import PrivateDataMarkVariant
from core.modules.developer.support.developer_settings import PRIVATE_DATA_SETTING, TOOLS_SETTING
from core.modules.developer.support.private_data_pass import PrivateDataPass
from core.modules.environments.models.environment import Environment
from core.modules.settings.bindings.support.setting_values import SettingValues


class PrivateDataTick:
    """With the developer tools and the private data scan on, each pass looks at one slice of the project's new or changed files
    and shows one card in the chat for each finding, naming the file, the line number and the kind, never the text."""

    def __call__(self, container: Container) -> None:
        settings = container.get(SettingValues).project
        if not (settings.flag(TOOLS_SETTING) and settings.flag(PRIVATE_DATA_SETTING)):
            return
        findings = container.get(PrivateDataPass).run()
        actor = container.get(ModuleActors).actor("journal.core.developer")
        for environment in container.get(Queries).query(Environment).all_rows():
            for finding in findings:
                container.get(Bus).run(ShowMark(ChatMarkType.PRIVATE_DATA, PrivateDataMarkVariant.FOUND, finding.key, finding.text), actor, environment_id=environment.id)
