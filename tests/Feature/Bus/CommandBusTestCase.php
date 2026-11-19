<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use Illuminate\Database\ConnectionInterface;
use Tests\Support\InstallsCommandModules;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * A test of the command bus on the Cards and Notes test modules: its commands commit for real, so no test transaction
 * wraps them, and the fixture table is emptied after each test.
 */
abstract class CommandBusTestCase extends TestCase
{
    use InstallsCommandModules;
    use InstallsCommandModules;
    use RefreshHookDatabase;
    use RefreshHookDatabase;
    use StartsAgentRequests;
    use StartsAgentRequests;

    protected function tearDown(): void
    {
        $this->app->make(ConnectionInterface::class)->table('module_command_rows')->delete();

        parent::tearDown();
    }

    /**
     * @return list<string>
     */
    protected function connectionsToTransact(): array
    {
        return [];
    }

    protected function rowText(int $id): string
    {
        return (string) $this->app->make(
            ConnectionInterface::class,
        )->table('module_command_rows')->where('id', $id)->value('text');
    }

    protected function rowCount(): int
    {
        return $this->app->make(
            ConnectionInterface::class,
        )->table('module_command_rows')->whereNot('text', 'like', 'audit %')->count();
    }
}
