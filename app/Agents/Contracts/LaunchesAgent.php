<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

/**
 * A command that launches an agent, naming the agent it launches.
 */
interface LaunchesAgent
{
    public function launchedAgentId(): string;
}
