<?php

declare(strict_types=1);

namespace App\Contracts\Projects;

use App\Exceptions\ModelMissing;

/**
 * The project each agent belongs to, read from its own row.
 */
interface AgentProjects
{
    /**
     * The id of the project the agent belongs to.
     *
     * @throws ModelMissing when there is no such agent
     */
    public function projectIdOf(string $agentId): string;
}
