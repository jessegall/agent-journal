<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Contracts\CommandBus;

/**
 * Runs a command on the bus as the test's started agent; the test keeps that agent in its $start field.
 */
trait RunsCommandsAsStart
{
    private function runAsAgent(object $command): mixed
    {
        $this->start->startRequest($this->app);

        return $this->app->make(CommandBus::class)->run($command);
    }
}
