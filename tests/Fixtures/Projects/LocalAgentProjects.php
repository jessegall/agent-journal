<?php

declare(strict_types=1);

namespace Tests\Fixtures\Projects;

use App\Contracts\Projects\AgentProjects;
use Tests\Support\TestProjects;

/**
 * Agent projects for a test whose agents are ids with no agent row: every agent works in the local project.
 */
final class LocalAgentProjects implements AgentProjects
{
    public function projectIdOf(string $agentId): string
    {
        return TestProjects::local()->id;
    }
}
