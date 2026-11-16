from core.modules.drivers.support.block_conditions.agent_resumed import AgentResumed
from core.modules.drivers.support.block_conditions.all_conditions import AllConditions
from core.modules.drivers.support.block_conditions.any_condition import AnyCondition
from core.modules.drivers.support.block_conditions.tool_uses import ToolUses
from engine.driver.conditions.ran_command import RanCommand
from engine.driver.conditions.read_file import ReadFile
from engine.driver.conditions.time_reached import TimeReached

DRIVERS_BLOCK_CONDITIONS = [RanCommand, ReadFile, TimeReached, AnyCondition, AllConditions, ToolUses, AgentResumed]
