<?php

declare(strict_types=1);

namespace App\Enums\Hosts;

/**
 * What a process on a host is for: an agent's terminal, an agent's headless turn, the owner of an account, or a probe.
 */
enum HostProcessPurpose: string
{
    case AgentTerminal = 'agent_terminal';
    case AgentTurn = 'agent_turn';
    case AccountOwner = 'account_owner';
    case Probe = 'probe';
}
