<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

use App\Agents\Enums\AgentRole;

/**
 * The most workspace authority a profile's agent has: the main agent, a helper that only reads, or a helper that
 * writes. A profile's name never decides this.
 */
enum ProfileType: string
{
    case MainAgent = 'main_agent';
    case ReadOnlyHelper = 'read_only_helper';
    case WritingHelper = 'writing_helper';

    /**
     * The Core role a launch of this type runs as.
     */
    public function agentRole(): AgentRole
    {
        return match ($this) {
            self::MainAgent => AgentRole::MainAgent,
            self::ReadOnlyHelper => AgentRole::ReadOnlyHelper,
            self::WritingHelper => AgentRole::WritingHelper,
        };
    }
}
