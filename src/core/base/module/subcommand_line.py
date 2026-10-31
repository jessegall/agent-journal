from core.base.module.module import SubcommandClass


def subcommand_line(subcommand: SubcommandClass) -> str:
    return f"{subcommand.cli_name} {subcommand.name}"
