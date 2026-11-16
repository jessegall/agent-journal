from core.modules.secrets.commands.allow_program.allow_program_subcommand import AllowProgramSubcommand
from core.modules.secrets.commands.delete_secret.delete_secret_subcommand import DeleteSecretSubcommand
from core.modules.secrets.commands.edit_secret.edit_secret_subcommand import EditSecretSubcommand
from core.modules.secrets.commands.fill_secret.fill_secret_subcommand import FillSecretSubcommand
from core.modules.secrets.commands.make_secret.make_secret_subcommand import MakeSecretSubcommand
from core.modules.secrets.commands.propose_program.propose_program_subcommand import ProposeProgramSubcommand
from core.modules.secrets.commands.request_secret.request_secret_subcommand import RequestSecretSubcommand
from core.modules.secrets.commands.secret_list.secret_list_subcommand import SecretListSubcommand
from core.modules.secrets.commands.secret_run.secret_run_subcommand import SecretRunSubcommand
from core.modules.secrets.commands.secret_show.secret_show_subcommand import SecretShowSubcommand
from core.modules.secrets.commands.store_secret.store_secret_subcommand import StoreSecretSubcommand

SECRETS_SUBCOMMANDS = [MakeSecretSubcommand, RequestSecretSubcommand, EditSecretSubcommand, FillSecretSubcommand, StoreSecretSubcommand, SecretListSubcommand,
                   SecretShowSubcommand, SecretRunSubcommand, ProposeProgramSubcommand, AllowProgramSubcommand, DeleteSecretSubcommand]
