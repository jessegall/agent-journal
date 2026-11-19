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
     * The type of profile an agent of the role launches with.
     */
    public static function forRole(AgentRole $role): self
    {
        return match ($role) {
            AgentRole::MainAgent => self::MainAgent,
            AgentRole::ReadOnlyHelper => self::ReadOnlyHelper,
            AgentRole::WritingHelper => self::WritingHelper,
        };
    }

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

    /**
     * Whether profiles of this kind may do what only the main agent may.
     */
    public function isMainAgent(): bool
    {
        return $this === self::MainAgent;
    }
}
