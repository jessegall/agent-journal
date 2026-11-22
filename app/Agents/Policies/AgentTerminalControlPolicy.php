<?php

declare(strict_types=1);

namespace App\Agents\Policies;

use App\Actors\Contracts\OwnerPolicy;
use App\Agents\Models\Agent;

/**
 * Who may type into an agent's terminal from the browser: only its owner, beside the inspect that watching needs. An
 * actor who may inspect but not control watches only.
 */
final readonly class AgentTerminalControlPolicy implements OwnerPolicy
{
    public static function model(): string
    {
        return Agent::class;
    }
}
