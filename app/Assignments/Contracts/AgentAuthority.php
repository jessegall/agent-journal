<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Exceptions\AssignmentDenied;

/**
 * Whether an agent may give out work now, read from its row under its shared lifecycle lock, never from what a
 * request claims. Assignments owns it and asks it; Agents fills it.
 */
interface AgentAuthority
{
    /**
     * @throws AssignmentDenied
     */
    public function requireDispatcher(string $agentId): void;
}
