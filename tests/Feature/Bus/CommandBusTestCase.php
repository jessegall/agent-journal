<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use Tests\Support\Bus\RunsModuleCommands;
use Tests\TestCase;

/**
 * The base of the bus tests that have not moved to a middleware test yet: the commands of the Cards and Notes test
 * modules commit for real.
 */
abstract class CommandBusTestCase extends TestCase
{
    use RunsModuleCommands;

    /**
     * None at the start: the test modules' table is made as a test sets up, and what a test writes to it is emptied
     * when it ends.
     */
    protected const array TABLES = [];
}
