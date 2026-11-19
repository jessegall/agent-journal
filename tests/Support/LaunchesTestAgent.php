<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Bus\Contracts\CommandBus;
use Tests\Fixtures\Agents\TestLaunch;

/**
 * Launches a test agent before each test, and runs commands on a request of that agent.
 */
trait LaunchesTestAgent
{
    private TestLaunch $launch;

    protected function setUpLaunchesTestAgent(): void
    {
        $this->launch = TestLaunch::start();
    }

    private function runAsAgent(object $command): mixed
    {
        $this->launch->startRequest($this->app);

        return $this->app->make(CommandBus::class)->run($command);
    }
}
