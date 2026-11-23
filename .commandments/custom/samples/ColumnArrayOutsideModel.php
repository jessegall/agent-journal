<?php

declare(strict_types=1);

namespace App\Samples;

use App\Agents\Enums\AgentRole;
use App\Models\Agents\Agent;

/**
 * Samples for the column-array-outside-model commandment.
 */
final class ColumnArrayOutsideModelSamples
{
    public function sinful(): void
    {
        // @sin ColumnArrayOutsideModelDetector
        Agent::query()->create(['name' => 'Planner', 'role' => 'hooks.main_ready']);
        // @sin ColumnArrayOutsideModelDetector
        Agent::create(['name' => 'Planner', 'role' => 'hooks.main_ready']);
    }

    public function righteous(): void
    {
        // @righteous ColumnArrayOutsideModelDetector
        Agent::named('Planner', AgentRole::MainAgent);
    }
}
