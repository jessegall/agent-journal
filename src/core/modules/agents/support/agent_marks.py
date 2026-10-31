from core.base.chat.mark_click import MarkClick
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.modules.agents.models.enums.agent_mark_type import AgentMarkType
from core.modules.agents.models.enums.agent_mark_variant import AgentMarkVariant

SUBAGENTS_FAMILY = MarkFamily("agents.subagents", "Subagents", "subagent", MarkGroup.AGENT)

AGENT_MARKS = [MarkDeclaration(AgentMarkType.SUBAGENT, AgentMarkVariant, SUBAGENTS_FAMILY, "Subagent updates", "subagent", click=MarkClick.OPEN_ROW,
                               group_label="{count} subagent updates")]
