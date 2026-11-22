<?php

declare(strict_types=1);

namespace App\Policies;

use App\Contracts\OwnerPolicy;
use App\Models\Agent;

/**
 * The owner's maintenance of agents: inspecting their sessions and runtimes, steering and recovering them, running key
 * scripts and keeping account uses.
 */
final readonly class AgentMaintenancePolicy implements OwnerPolicy
{
    public static function model(): string
    {
        return Agent::class;
    }
}
