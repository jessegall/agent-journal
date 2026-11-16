from core.modules.agents.bindings.agent_caller_resolver import AgentCallerResolver
from core.modules.agents.bindings.agent_project_checkouts import AgentProjectCheckouts
from core.modules.agents.bindings.agent_row_numbers import AgentRowNumbers
from core.modules.agents.support.agent_program_sessions import AgentProgramSessions
from core.modules.agents.support.agent_role_rows import AgentRoleRows
from core.modules.agents.support.local_launcher_transport import LocalLauncherTransport
from core.modules.agents.support.program_transport import ProgramTransport
from engine.agent.agent_checkouts import AgentCheckouts
from engine.agent.agent_role_reader import AgentRoleReader
from engine.agent.program_sessions import ProgramSessions
from engine.caller.caller_resolver import CallerResolver
from engine.cli.row_numbers import RowNumbers

AGENTS_BINDINGS = {ProgramSessions: AgentProgramSessions, ProgramTransport: LocalLauncherTransport, CallerResolver: AgentCallerResolver, AgentCheckouts: AgentProjectCheckouts, AgentRoleReader: AgentRoleRows, RowNumbers: AgentRowNumbers}
