from engine.enums.mark_click import MarkClick
from engine.chat.mark_declaration import MarkDeclaration
from engine.chat.mark_family import MarkFamily
from engine.enums.mark_group import MarkGroup
from core.modules.agents.models.enums.agent_mark_type import AgentMarkType
from core.modules.agents.models.enums.agent_mark_variant import AgentMarkVariant

HELPERS_FAMILY = MarkFamily("agents.helpers", "Helpers", "subagent", MarkGroup.AGENT)
MENUS_FAMILY = MarkFamily("agents.menus", "Terminal menus", "terminal", MarkGroup.JOURNAL)
LAUNCHERS_FAMILY = MarkFamily("agents.launchers", "Launchers", "terminal", MarkGroup.JOURNAL)

AGENT_MARKS = [MarkDeclaration(AgentMarkType.SUBAGENT, AgentMarkVariant, HELPERS_FAMILY, "Helper updates", "subagent", click=MarkClick.OPEN_ROW,
                               group_label="{count} helper updates"),
               MarkDeclaration(AgentMarkType.MENU, AgentMarkVariant, MENUS_FAMILY, "A menu in the agent's terminal was answered", "terminal"),
               MarkDeclaration(AgentMarkType.LAUNCHER, AgentMarkVariant, LAUNCHERS_FAMILY, "A second launcher was stopped", "terminal")]
