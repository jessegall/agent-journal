<?php

declare(strict_types=1);

namespace Tests\Support;

use Tests\Fixtures\Agents\TestStart;

/**
 * Starts a test agent before each test, and runs commands on a request of that agent.
 */
trait StartsTestAgent
{
    use RunsCommandsAsStart;

    private TestStart $start;

    protected function setUpStartsTestAgent(): void
    {
        $this->start = TestStart::start();
    }
}
