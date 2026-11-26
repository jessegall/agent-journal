<?php

declare(strict_types=1);

namespace App\Policies;

use App\Access\Contracts\Policy;
use App\Models\Agents\Agent;

/**
 * Ordinary work on agents, navigation included, and retiring another agent; that nobody retires itself is the
 * retirement's own invariant.
 */
final readonly class AgentPolicy implements Policy
{
    public static function model(): string
    {
        return Agent::class;
    }
}
