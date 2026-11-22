<?php

declare(strict_types=1);

namespace App\Contracts\Authorization;

use App\Exceptions\AssignmentDenied;

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
