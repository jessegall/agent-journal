<?php

declare(strict_types=1);

namespace Tests\Support;

use Tests\Fixtures\Agents\TestLaunch;

/**
 * Launches a test agent before each test, and runs commands on a request of that agent.
 */
trait LaunchesTestAgent
{
    use RunsCommandsAsLaunch;

    private TestLaunch $launch;

    protected function setUpLaunchesTestAgent(): void
    {
        $this->launch = TestLaunch::start();
    }
}
