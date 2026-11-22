<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Models\Agent;

/**
 * A read-only helper agent named Researcher, made before each test.
 */
trait HasResearcherAgent
{
    private Agent $agent;

    protected function setUpHasResearcherAgent(): void
    {
        $this->agent = Agent::create('Researcher', 'read-only-helper');
    }
}
