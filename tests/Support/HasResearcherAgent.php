<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Agents\Models\Agent;

/**
 * A read-only helper agent named Researcher, made before each test.
 */
trait HasResearcherAgent
{
    private Agent $agent;

    protected function setUpHasResearcherAgent(): void
    {
        $this->agent = Agent::named('Researcher', 'read-only-helper');
    }
}
