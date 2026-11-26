<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Enums;

/**
 * The features of codex-cli 0.165.0 that start or coordinate another agent; every start keeps all of them off.
 */
enum CodexAgentFeature: string
{
    case MultiAgent = 'multi_agent';
    case MultiAgentMode = 'multi_agent_mode';
    case MultiAgentV2 = 'multi_agent_v2';
    case MultiAgentV2DynamicTools = 'multi_agent_v2_dynamic_tools';
    case AgentMessageBoard = 'agent_message_board';
    case RuntimeAgentInstances = 'runtime_agent_instances';
}
