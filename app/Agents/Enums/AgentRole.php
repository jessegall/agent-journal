<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * The role an agent was registered with, stored as the key of the ready state it starts in.
 */
enum AgentRole: string
{
    case MainAgent = 'hooks.main_ready';
    case ReadOnlyHelper = 'hooks.read_only_helper_ready';
    case WritingHelper = 'hooks.writing_helper_ready';

    /**
     * Where a launch of this role runs unless configured otherwise: a main agent on the protected host, a helper in a
     * required container, which a writing helper can never leave.
     */
    public function defaultExecutionMode(): ExecutionModeType
    {
        return $this === self::MainAgent ? ExecutionModeType::ProtectedHost : ExecutionModeType::RequiredContainer;
    }
}
