<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

use App\Agents\Enums\AgentRole;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\OfflineReplyMode;
use App\Agents\Values\StopCondition;

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
     * Where a launch of this type runs unless its profile says otherwise: the main agent on the protected host, a
     * helper in a required container.
     */
    public function defaultExecutionMode(): ExecutionModeType
    {
        return match ($this) {
            self::MainAgent => ExecutionModeType::ProtectedHost,
            self::ReadOnlyHelper, self::WritingHelper => ExecutionModeType::RequiredContainer,
        };
    }

    /**
     * Whether launches of this type must stay in a required container whatever their profile says.
     */
    public function isContainerRequired(): bool
    {
        return $this === self::WritingHelper;
    }

    /**
     * The stop conditions a profile of this type starts from: a writing helper leaves a clean worktree.
     *
     * @return list<StopCondition>
     */
    public function defaultStopConditions(): array
    {
        return $this === self::WritingHelper ? [StopCondition::cleanWorktree()] : [];
    }

    /**
     * How a launch of this type answers while the journal is unreachable: the main agent keeps working, a helper
     * stops.
     */
    public function offlineReply(): OfflineReplyMode
    {
        return $this === self::MainAgent ? OfflineReplyMode::Neutral : OfflineReplyMode::Refuse;
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
