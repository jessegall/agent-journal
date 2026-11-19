<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Bus\Contracts\CommandBus;

/**
 * Runs a command on the bus as the test's launched agent; the test keeps that agent in its $launch field.
 */
trait RunsCommandsAsLaunch
{
    private function runAsAgent(object $command): mixed
    {
        $this->launch->startRequest($this->app);

        return $this->app->make(CommandBus::class)->run($command);
    }
}
