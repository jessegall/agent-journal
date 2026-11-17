<?php

declare(strict_types=1);

namespace App\Core\Agents\Enums;

/**
 * The role an agent was registered with, stored as the key of the ready state it starts in.
 */
enum AgentRole: string
{
    case MainAgent = 'hooks.main_ready';
    case ReadOnlyHelper = 'hooks.read_only_helper_ready';
}
