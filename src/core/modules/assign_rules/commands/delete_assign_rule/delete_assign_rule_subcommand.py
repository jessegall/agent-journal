from engine.cli.delete_subcommand import DeleteSubcommand
from engine.model.table import Table
from core.modules.assign_rules.commands.delete_assign_rule.delete_assign_rule import DeleteAssignRule
from core.modules.assign_rules.models.assign_rule import AssignRule


class DeleteAssignRuleSubcommand(DeleteSubcommand):
    """`journal assign-rule delete <rule>`: deletes a rule; only a person may."""

    cli_name = "assign-rule"

    def __init__(self) -> None:
        super().__init__(Table.build(AssignRule))
        self.command_class = DeleteAssignRule
