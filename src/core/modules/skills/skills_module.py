from core.base.module.module import Module
from core.modules.skills.commands.skill_list_subcommand import SkillListSubcommand
from core.modules.skills.commands.skill_write_subcommand import SkillWriteSubcommand


class SkillsModule(Module):
    """Adds the skills the modules declare: a list of them, and a write of their texts into the skill folders of
    the agent programs."""

    name = "journal.core.skills"
    requires_core = ">=5,<6"
    subcommands = [SkillWriteSubcommand, SkillListSubcommand]
