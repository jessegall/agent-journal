<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * What an actor may do with the journal's agents: run a key script on an agent's terminal, or retire another agent.
 */
enum AgentAbility: string
{
    case RunKeyScript = 'run-key-script';
    case RetireOthers = 'retire-others';
}
