<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use Domain\Rules\RulesDomain;
use Illuminate\Database\ConnectionInterface;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\InstallsCommandModules;
use Tests\TestCase;

/**
 * A test of the command bus on the Cards and Notes test modules: its commands commit for real, so no test transaction
 * wraps them, and the fixture table is emptied after each test.
 */
abstract class CommandBusTestCase extends TestCase
{
    use CommitsHookRows;
    use InstallsCommandModules;
    use InstallsCommandModules;

    /**
     * None at the start: the test modules' table is made as a test sets up, and what a test writes to it is emptied
     * when it ends.
     */
    protected const array TABLES = [];

    /**
     * Rules, which the Notes test module requires.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class);
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
