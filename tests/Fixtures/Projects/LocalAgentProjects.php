<?php

declare(strict_types=1);

namespace Tests\Fixtures\Projects;

use App\Models\Agents\Agent;
use App\Projects\Contracts\AgentProjects;
use Tests\Support\TestProjects;

/**
 * Agent projects for a test whose agents are ids with no agent row: such an agent works in the local project, and an
 * agent with a row works in its own.
 */
final class LocalAgentProjects implements AgentProjects
{
    public function projectIdOf(string $agentId): string
    {
        return Agent::query()->whereKey($agentId)->value('project_id') ?? TestProjects::local()->id;
    }
}
