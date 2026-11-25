<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * An agent was given to a project it does not belong to, such as the main agent of a binding of another project.
 */
final class AgentOfAnotherProject extends LogicException
{
    public static function for(string $agentId, string $projectId): self
    {
        return new self("Agent {$agentId} does not belong to project {$projectId}.");
    }
}
