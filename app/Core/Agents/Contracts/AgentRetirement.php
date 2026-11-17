<?php

declare(strict_types=1);

namespace App\Core\Agents\Contracts;

use App\Core\Agents\Exceptions\AgentNotAvailable;
use App\Core\Agents\Exceptions\AgentRetirementDenied;
use App\Core\Assignments\Support\AssignmentResult;

/**
 * Retires an agent for good: it can never launch or hold work again, its usable sessions and credentials end, and
 * every record it held is released. The admitted owner may retire any agent; a main agent only an agent that is not a
 * main agent.
 */
interface AgentRetirement
{
    /**
     * @throws AgentRetirementDenied
     * @throws AgentNotAvailable
     */
    public function retire(int $agentId): AssignmentResult;
}
