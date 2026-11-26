<?php

declare(strict_types=1);

namespace Tests\Fixtures\Projects;

use App\Projects\Contracts\AgentProjects;

/**
 * The agent projects of the journal, keeping the id of each agent whose project the selection was pinned to.
 */
final class AskedAgentProjects implements AgentProjects
{
    /**
     * @var list<string>
     */
    public array $askedAgentIds = [];

    public function __construct(private readonly AgentProjects $agents) {}

    public function projectIdOf(string $agentId): string
    {
        $this->askedAgentIds[] = $agentId;

        return $this->agents->projectIdOf($agentId);
    }
}
